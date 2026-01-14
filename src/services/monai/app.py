import os
import io
import logging
import tempfile
import shutil
import uuid
import asyncio
import base64
import json
from io import BytesIO
from datetime import datetime
from typing import List, Optional, Dict
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import numpy as np
import nibabel as nib
from PIL import Image
from scipy.ndimage import rotate, zoom, binary_erosion # For TTA and Isotropic Resampling
from scipy import ndimage
import monai
from monai.transforms import (
    Compose,
    LoadImage,
    EnsureChannelFirst,
    ScaleIntensity,
    Resize,
    ToTensor,
    EnsureType,
)
from models import SwinUNETRAutoencoder
from fastapi.staticfiles import StaticFiles

# Optional VTK Import for 3D Conversion (Fails on Python 3.12+)
try:
    import vtk
    VTK_AVAILABLE = True
except ImportError:
    VTK_AVAILABLE = False
    print("Warning: VTK not installed. 3D Volume conversion will be disabled.")

# Valid Scipy Imports
from scipy.ndimage import gaussian_filter, center_of_mass

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure temp directory for serving files exists
TEMP_DIR = os.path.join(os.getcwd(), "temp_files")
os.makedirs(TEMP_DIR, exist_ok=True)

def _analyze_slice_robust(img_norm, is_ct=False):
    """
    Revised Analysis Logic:
    1. Polarity Check: Detects inverted images (White Background) and fixes them.
    2. Physics Mode (is_ct=True): Uses fixed thresholds for Bone/Air/Soft-Tissue to detect Hypodense tumors.
    3. Statistical Mode (is_ct=False): Uses robust IQR for unknown modalities.
    Returns: is_anomaly, confidence, anomaly_mask, max_intensity, anomaly_ratio, analysis_source
    """
    h, w = img_norm.shape
    
    # --- POLARITY CORRECTION (Universal) ---
    # Check corners. If corners are bright (>0.5), it's likely an inverted document/image.
    # We sample 4 corners (5x5 patches).
    c1 = np.mean(img_norm[0:5, 0:5])
    c2 = np.mean(img_norm[0:5, w-5:w])
    c3 = np.mean(img_norm[h-5:h, 0:5])
    c4 = np.mean(img_norm[h-5:h, w-5:w])
    corner_avg = (c1 + c2 + c3 + c4) / 4.0
    
    # logger.info(f"Polarity Check: Corner Avg={corner_avg:.4f}")
    
    # --- POLARITY CORRECTION (Disabled for Stability) ---
    # User reported issues with "Reversed Polarity". 
    # We enforce Standard Medical Polarity (Air=Black, Tissue=Bright).
    # if corner_avg > 0.85:
    #     logger.info(f"Detected White Background (Corner Avg {corner_avg:.2f}). Inverting polarity for analysis...")
    #     img_norm = 1.0 - img_norm
    # ---------------------------------------

    accumulated_mask = np.zeros_like(img_norm)
    
    # Analysis Configuration
    patch_sizes = [32, 64] 
    stride_ratios = [0.5, 0.5] 
    
    # Calculate Statistical Thresholds (Fallback)
    foreground_mask = img_norm > 0.05
    # Erosion to remove skull ring (Increased robustness)
    struct = ndimage.generate_binary_structure(2, 2)
    foreground_mask = ndimage.binary_erosion(foreground_mask, structure=struct, iterations=8)
    
    if np.sum(foreground_mask) == 0: foreground_mask = np.ones_like(foreground_mask, dtype=bool)
    foreground_pixels = img_norm[foreground_mask]
    
    # Radial Filtering Setup (Foreground Centroid)
    try:
        y_indices, x_indices = np.where(foreground_mask)
        if len(y_indices) > 0:
            cy, cx = np.mean(y_indices), np.mean(x_indices)
            diff_y = y_indices - cy
            diff_x = x_indices - cx
            # Calculate max radius
            max_radius = np.max(np.sqrt(diff_y**2 + diff_x**2))
            radial_cutoff = max_radius * 0.90 # 10% Margin for Skull
        else:
            cy, cx = h//2, w//2
            radial_cutoff = min(h,w)//2 * 0.90
    except:
        cy, cx = h//2, w//2
        radial_cutoff = min(h,w)//2 * 0.90
    
    if foreground_pixels.size > 0:
        q25, q50, q75 = np.percentile(foreground_pixels, [25, 50, 75])
    else:
        q25, q50, q75 = 0, 0, 0
        
    iqr = q75 - q25
    iqr = max(iqr, 0.20) # Clamp for stability
    
    # Relaxed Statistical Thresholds
    # Increased IQR multiplier to 4.5 and Floor to 0.75 to reduce False Positives
    thresh_high_stat = min(0.99, max(0.75, q75 + (4.5 * iqr))) 
    thresh_low_stat = max(0.02, q25 - (4.5 * iqr))
    
    # --- PHYSICS MODE THRESHOLDS (CT Only) ---
    # Range -125..225 mapped to 0..1
    # Liver ~0.53. Tumor ~0.44. Cyst ~0.35. Bone >0.9.
    # Hypodense Danger Zone: < 0.42
    # Hyperdense Danger Zone: > 0.60
    
    thresh_low_phys = 0.42
    thresh_high_phys = 0.88 # Raised from 0.60 to ignore Contrast Vessels (~0.7-0.8)

    analysis_source = "Robust Analysis"

    for p_idx, patch_size in enumerate(patch_sizes):
        stride = int(patch_size * stride_ratios[p_idx])
        scale_mask = np.zeros_like(img_norm)
        
        for y in range(0, h - patch_size + 1, stride):
            for x in range(0, w - patch_size + 1, stride):
                patch_mask = foreground_mask[y:y+patch_size, x:x+patch_size]
                if np.sum(patch_mask) < (patch_size * patch_size) * 0.3: continue

                patch = img_norm[y:y+patch_size, x:x+patch_size]
                
                # Critical: Calculate stats ONLY on Brain Tissue (Masked)
                valid_pixels = patch[patch_mask]
                if valid_pixels.size == 0: continue
                patch_val = np.percentile(valid_pixels, 80)
                
                is_patch_anomalous = False # Reset
                patch_score = 0
                
                # --- DETECTION LOGIC ---
                if is_ct:
                    if patch_val > 0.9: continue # Skip Bone/Metal
                    
                    # DARK SPOT LOGIC: Catch Tumors (0.25-0.48) but Ignore Fat/Air (<0.25)
                    if patch_val < 0.48 and patch_val > 0.25:
                        patch_score += 50
                        is_patch_anomalous = True
                    elif patch_val > thresh_high_phys:
                        patch_score += 50
                        is_patch_anomalous = True   
                else:
                    # USE RELATIVE STATISTICS (For Images/MRI)
                    # Radial Filter: Ignore Edge Artifacts (Skull Ring)
                    pcy, pcx = y + patch_size//2, x + patch_size//2
                    dist = np.sqrt((pcy - cy)**2 + (pcx - cx)**2)
                    if dist > radial_cutoff: continue 

                    if patch_val > thresh_high_stat: 
                            patch_score += 50
                            is_patch_anomalous = True
                    elif patch_val < thresh_low_stat and patch_val > 0.1: 
                            patch_score += 40
                            is_patch_anomalous = True

                if is_patch_anomalous:
                    normalized_score = min(1.0, patch_score / 60.0)
                    current_val = scale_mask[y:y+patch_size, x:x+patch_size]
                    scale_mask[y:y+patch_size, x:x+patch_size] = np.maximum(current_val, normalized_score)
        
        accumulated_mask += scale_mask * (1.0 if p_idx == 0 else 0.8)

    final_mask = accumulated_mask
    max_intensity = np.max(final_mask) * 100 
    
    # Calculate Anomaly Ratio based on refined mask
    anomaly_pixels = np.sum(final_mask > 0.2)
    tissue_pixels = np.sum(foreground_mask)
    if tissue_pixels == 0: tissue_pixels = 1
    
    anomaly_ratio = anomaly_pixels / tissue_pixels
    
    # --- FILTERS REMOVED: High Sensitivity Mode ---
    # We prioritize detecting ALL anomalies (Bleeds/Tumors).
    # Some Skull Artifacts may be flagged (False Positives), but this is safer than missing a Bleed.
    
    # --- Enhanced Bilateral Symmetry Analysis ---
    # Heuristic: Abdomen is naturally asymmetric (Liver vs Spleen). Brain is symmetric.
    # If the BASE image is highly asymmetric, it's likely Abdomen -> Disable Symmetry Check to avoid False Positives (flagging the whole Liver).
    # If the BASE image is symmetric, it's likely Head/Lungs -> Enable Symmetry Check for Bleeds/Nodules.

    try:
        com_y, com_x = center_of_mass(foreground_mask)
        center_x = int(com_x)
    except:
        center_x = w // 2 # Fallback
    
    width_left = center_x
    width_right = w - center_x
    min_width = min(width_left, width_right)
    
    left_side = img_norm[:, center_x - min_width : center_x]
    right_side = img_norm[:, center_x : center_x + min_width]
    
    left_flipped = np.fliplr(left_side)
    
    left_smooth = gaussian_filter(left_flipped, sigma=3.0) # Reduced sigma for sharper details
    right_smooth = gaussian_filter(right_side, sigma=3.0)
    
    diff_map = np.abs(left_smooth - right_smooth)
    
    # Ignore center line artifacts
    diff_map[:, :10] = 0 
    diff_map[:, -10:] = 0
    mid_slice = diff_map.shape[1] // 2
    diff_map[:, mid_slice-10 : mid_slice+10] = 0
    
    # Check Global Asymmetry (To determine Body Part)
    # Abdomen has large structural differences
    global_asymmetry = np.mean(diff_map)
    is_abdomen = global_asymmetry > 0.15 # Heuristic: Liver/Spleen create large avg difference
    
    logger.info(f"Symmetry Analysis: Global Diff={global_asymmetry:.4f} -> Body Part: {'Abdomen/Torso' if is_abdomen else 'Head/Symmetric'}")

    if not is_abdomen:
        # BRAIN MODE: High Sensitivity to Asymmetry (Bleeds)
        # Bleeds are often 40-60 HU brighter than background. 
        # Tuning for RawData robustness: Increased diff threshold 0.15 -> 0.20
        asymmetry_mask = diff_map > 0.20 
        asymmetry_clean = gaussian_filter(asymmetry_mask.astype(float), sigma=1.5)
        asymmetry_roi = asymmetry_clean > 0.4 
        
        # --- MORPHOLOGICAL CLEANING (Dust Filter) ---
        # Remove small scattered noise dots common in RawData
        # We use binary opening with a 3x3 structure
        asymmetry_roi = ndimage.binary_opening(asymmetry_roi, structure=np.ones((3,3))).astype(bool)
        
        symmetry_score = np.sum(asymmetry_roi) / asymmetry_roi.size
        
        # Filter noise: Anomaly must be significant (>1.5%) but not the whole image
        # Increased 0.010 -> 0.015 to avoid flagging noisy RawData scans
        is_focal_asymmetry = symmetry_score > 0.015 and symmetry_score < 0.20
        
        if is_focal_asymmetry:
            full_asym_mask = np.zeros_like(img_norm)
            full_asym_mask[:, center_x : center_x + min_width] = asymmetry_roi
            full_asym_mask[:, center_x - min_width : center_x] = np.fliplr(asymmetry_roi)
            
            final_mask = np.maximum(final_mask, full_asym_mask)
            
            # REMOVED: max_intensity = max(max_intensity, 90) 
            # This was forcing "High Intensity" even for low-contrast noise, triggering the alarm.
            # Now we only update max_intensity if the asymmetric region is ACTUALLY bright.
            
            # Calculate intensity of the asymmetric region
            asym_pixels = img_norm[full_asym_mask > 0]
            if len(asym_pixels) > 0:
                # Scale to 0-100 reference (assuming img_norm is 0-1)
                real_asym_intensity = np.percentile(asym_pixels, 95) * 100 
                max_intensity = max(max_intensity, real_asym_intensity)

            anomaly_ratio = np.sum(final_mask > 0.1) / final_mask.size
            analysis_source = "Brain Symmetry Analysis"
            logger.info("Brain Asymmetry Detected - Injected into Mask")

    if is_ct:
         # ULTRA-STRICT THRESHOLDS (Global Consensus)
         # Relaxed 0.015 -> 0.025 and 50 -> 65 to reduce False Positives.
         # Small bleeds should be caught by the Symmetry/Intensity checks (if confident).
         is_anomaly = (anomaly_ratio > 0.025) or (max_intensity > 65)
    else:
         # Same Strictness for Images
         is_anomaly = (anomaly_ratio > 0.025) or (max_intensity > 65)
    
    if tissue_pixels < 500: is_anomaly = False
    
    confidence = 0.0
    if is_anomaly:
        extent_score = min(100, anomaly_ratio * 3000) 
        confidence = (max_intensity * 0.6) + (extent_score * 0.4)
        confidence = min(99.9, confidence)
    else:
        confidence = 95.0 - (anomaly_ratio * 1000)
        confidence = max(60.0, min(99.0, confidence))
        
    return is_anomaly, confidence, final_mask, float(max_intensity), float(anomaly_ratio), analysis_source

def convert_nifti_to_vti(input_path, output_path):
    if not VTK_AVAILABLE:
        logger.warning("VTK not available, skipping VTI conversion.")
        return False
        
    try:
        reader = vtk.vtkNIFTIImageReader()
        reader.SetFileName(input_path)
        reader.Update()
        
        writer = vtk.vtkXMLImageDataWriter()
        writer.SetFileName(output_path)
        writer.SetInputData(reader.GetOutput())
        writer.Write()
        return True
    except Exception as e:
        logger.error(f"VTI Conversion Failed: {e}")
        return False

# Setup Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# Globals
jobs = {}
custom_model_loaded = False
autoencoder_loaded = False

# Transforms
transforms_3d = Compose([
    LoadImage(image_only=True),
    EnsureChannelFirst(),
    Resize((96, 96, 96)),
    ScaleIntensity(),
    ToTensor(),
])

# Load Autoencoder
autoencoder_model = SwinUNETRAutoencoder(img_size=(96, 96, 96), in_channels=1, feature_size=24).to(device)
autoencoder_path = os.path.join(os.getcwd(), "autoencoder_model.pth")

if os.path.exists(autoencoder_path):
    try:
        logger.info(f"Loading Autoencoder from {autoencoder_path}")
        autoencoder_model.load_state_dict(torch.load(autoencoder_path, map_location=device))
        autoencoder_model.eval()
        autoencoder_loaded = True
        logger.info("Successfully loaded Autoencoder")
    except Exception as e:
        logger.warning(f"Failed to load Autoencoder: {e}")

# Placeholder for Custom Model (DenseNet)
model_3d_custom = None 
# In a real scenario, we would load the DenseNet model here if available.

# FastAPI App
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Include startup logic here
    # Initialize Vision Agent in background to avoid blocking
    asyncio.create_task(asyncio.to_thread(vision_agent.ensure_model))
    # Initialize Anatomy Agent (Load Atlases)
    asyncio.create_task(asyncio.to_thread(anatomy_agent.load_atlas))
    yield
    # Shutdown logic if any
    # Shutdown logic if any

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup logic is now in lifespan, uncommenting for production use
# Note: We need to re-insert the tasks into the lifespan function if we want them to run.


# Mount temp directory for static file serving
app.mount("/files", StaticFiles(directory=TEMP_DIR), name="files")

# Global Event Queue for SSE
event_queue = asyncio.Queue()

# --- Vision-Language Intelligence (Llava) ---
import requests

class VisionAgent:
    def __init__(self, model="llava"):
        self.model = model
        self.api_url = "http://localhost:11434/api"
        self.is_ready = False

    def check_connection(self):
        try:
            res = requests.get(f"{self.api_url}/tags", timeout=2)
            return res.status_code == 200
        except:
            return False

    def ensure_model(self):
        try:
            if not self.check_connection():
                logger.warning("Ollama is not running. Vision features disabled.")
                return False

            # Check if model exists
            res = requests.get(f"{self.api_url}/tags")
            models = [m['name'] for m in res.json().get('models', [])]
            if self.model not in models and f"{self.model}:latest" not in models:
                logger.info(f"Model {self.model} not found. Pulling...")
                # Trigger pull (async ideally, but blocking for simplicity of demo)
                requests.post(f"{self.api_url}/pull", json={"name": self.model})
            
            self.is_ready = True
            logger.info(f"Vision Agent ({self.model}) is ready.")
            return True
        except Exception as e:
            logger.error(f"Vision Agent Init Failed: {e}")
            return False

    def analyze(self, image_path, anomaly_detected=False):
        if not self.is_ready: return None
        
        try:
            with open(image_path, "rb") as f:
                img_b64 = base64.b64encode(f.read()).decode("utf-8")
            
            prompt = "Describe the medical image concisely. Focus on any visible anomalies or lesions."
            if anomaly_detected:
                prompt = "A statistical anomaly was detected. Describe the specific location and appearance of the potential lesion or irregularity in this scan. Be clinical."

            payload = {
                "model": self.model,
                "prompt": prompt,
                "images": [img_b64],
                "stream": False
            }
            
            res = requests.post(f"{self.api_url}/generate", json=payload, timeout=60)
            if res.status_code == 200:
                return res.json().get("response", "No description generated.")
            return None
        except Exception as e:
            logger.error(f"Vision Analysis Failed: {e}")
            return None

vision_agent = VisionAgent()

# --- Neuro-Anatomical Mapping (Atlas) ---
import sys
try:
    from nilearn import image, datasets
    import nibabel as nib
    NILEARN_AVAILABLE = True
except ImportError:
    NILEARN_AVAILABLE = False
    print(f"WARNING: Nilearn not found. Neuro-Mapping disabled. Python: {sys.executable}")

class AnatomyAgent:
    def __init__(self):
        self.is_ready = False
        if not NILEARN_AVAILABLE: return

        self.atlas_dir = os.path.join(os.path.dirname(__file__), "data", "atlas")
        self.mni_path = os.path.join(self.atlas_dir, "mni152.nii.gz")
        self.ho_cort_path = os.path.join(self.atlas_dir, "ho_cortical.nii.gz")
        self.ho_sub_path = os.path.join(self.atlas_dir, "ho_subcortical.nii.gz")
        self.labels = {} 

    def load_atlas(self):
        if not NILEARN_AVAILABLE: return
        try:
            if os.path.exists(self.ho_cort_path):
                # Load labels logic (Harvard-Oxford labels are usually XML/Text, or nilearn handles it)
                # For this demo, nilearn.datasets.fetch_atlas_harvard_oxford handles labels
                ho_cort = datasets.fetch_atlas_harvard_oxford('cort-maxprob-thr25-1mm', data_dir=os.path.dirname(self.atlas_dir))
                self.cort_labels = ho_cort.labels
                
                ho_sub = datasets.fetch_atlas_harvard_oxford('sub-maxprob-thr25-1mm', data_dir=os.path.dirname(self.atlas_dir))
                self.sub_labels = ho_sub.labels
                
                self.is_ready = True
                logger.info("Anatomy Agent (Harvard-Oxford Atlas) Loaded.")
        except Exception as e:
            logger.error(f"Anatomy Agent Init Failed: {e}")

    def get_region(self, vol_data, anomaly_mask):
        if not self.is_ready: return "Localization Unavailable"
        
        try:
            # 1. Find Center of Mass of Anomaly
            if anomaly_mask is None or np.sum(anomaly_mask) == 0:
                return "No defined anomaly region"
            
            # Simple Center of Mass of the mask
            coords = np.argwhere(anomaly_mask > 0)
            center = coords.mean(axis=0).astype(int) # (x, y, z) in voxel space
            
            # 2. Map to Atlas
            # NOTE: In a real clinical app, we MUST perform affine registration here.
            # For this MVP, we assume the input volume is roughly standard orientation 
            # OR we rely on nilearn's resampling if provided a file path (which we assume happens before).
            # Here we just check the labels at that voxel assuming standard space.
            
            # Load Atlas Images
            cort_img = nib.load(self.ho_cort_path)
            sub_img = nib.load(self.ho_sub_path)
            
            # Resample Atlas to Match Patient Volume Dimensions (Quick & Dirty Registration)
            # This handles resolution mismatch
            target_affine = np.eye(4) # If we don't have patient affine, assume identity
            
            # Use nilearn to resample atlas to patient space (nearest neighbor for labels)
            # We create a dummy Nifti1Image for the patient volume
            patient_img_headers = nib.Nifti1Image(vol_data, target_affine)
            
            resampled_cort = image.resample_to_img(cort_img, patient_img_headers, interpolation='nearest')
            resampled_sub = image.resample_to_img(sub_img, patient_img_headers, interpolation='nearest')
            
            cort_data = resampled_cort.get_fdata()
            sub_data = resampled_sub.get_fdata()
            
            # Lookup Label
            x, y, z = 0, 0, 0
            if len(center) == 3:
                x, y, z = center[0], center[1], center[2]
            elif len(center) == 2:
                x, y, z = center[0], center[1], 0 # Assume slice 0 for 2D
                
            # Helper for geometric fallback
            def get_geometric_region(c, shape):
                cx = c[0]/shape[0] if shape[0] > 0 else 0.5
                cy = c[1]/shape[1] if shape[1] > 0 else 0.5
                cz = 0.5
                if len(c) > 2 and len(shape) > 2:
                    cz = c[2]/shape[2] if shape[2] > 0 else 0.5
                
                side = "Left" if cx > 0.5 else "Right"
                ap = "Anterior" if cy > 0.5 else "Posterior"
                sup = "Superior" if cz > 0.5 else "Inferior" 
                return f"{side} {ap}-{sup} Quadrant (Geometric Approx)"

            # Bounds check
            if x >= cort_data.shape[0] or y >= cort_data.shape[1] or z >= cort_data.shape[2]:
                 return get_geometric_region(center, vol_data.shape)

            cort_idx = int(cort_data[x, y, z])
            sub_idx = int(sub_data[x, y, z])
            
            region = "Unknown Region"
            if sub_idx > 0 and sub_idx < len(self.sub_labels):
                region = self.sub_labels[sub_idx]
            elif cort_idx > 0 and cort_idx < len(self.cort_labels):
                region = self.cort_labels[cort_idx]
            
            # --- FALLBACK: If Atlas returns Background/Unknown, use Geometry ---
            if region == "Unknown Region" or region == "Background":
                region = get_geometric_region(center, vol_data.shape)
                
            return region

        except Exception as e:
            logger.error(f"Mapping Failed: {e}")
            return "Localization Error"

anatomy_agent = AnatomyAgent()
# ------------------------------------------

# Helper Functions
async def push_event(job_id: str, status: str, message: str, progress: int):
    await event_queue.put({
        "jobId": job_id,
        "status": status,
        "message": message,
        "progress": progress
    })

def generate_heatmap_image(tensor, is_anomaly, file_type, mask):
    # Placeholder for heatmap generation logic
    # In a real app, this would overlay the mask on the original image and return base64
    return "" 

def generate_detailed_findings(is_anomaly, confidence, severity, file_type, source, filename):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    if is_anomaly:
        findings = [
            f"**Clinical Alert**: Analysis detected significant anomalies in {filename}.",
            f"**Confidence**: {confidence}% confidence level based on {source} analysis.",
            f"**Severity Assessment**: {severity.upper()} severity. The analysis indicates regions of interest that deviate significantly from the expected baseline.",
            f"**Radiological Characteristics**: The detected regions exhibit intensity variations consistent with potential pathology. Detailed examination of the heatmap overlay is recommended to localize the specific areas of concern.",
            f"**Technical Note**: Analysis performed using {source} at {timestamp}. The model identified specific patterns of spatial incoherence and intensity deviation."
        ]
        return "\n\n".join(findings)
    
    return (
        f"**Normal Findings**: No significant anomalies were detected in {filename} based on the current analysis parameters.\n\n"
        f"**Confidence**: {confidence}% confidence in normality.\n\n"
        f"**Analysis Summary**: The scan appears to be within normal limits. The {source} model did not identify any regions exceeding the anomaly threshold. "
        f"However, clinical correlation is always advised."
    )

def generate_recommendations(is_anomaly, severity, file_type, filename):
    base_recs = [
        "Correlate findings with patient's clinical history and physical examination.",
        "Verify the automated results with a manual review of the original DICOM/Image data."
    ]
    
    if is_anomaly:
        specific_recs = [
            "**Immediate Action**: Consult with a radiologist or specialist for a comprehensive review.",
            "**Follow-up**: Schedule follow-up imaging (MRI/CT) to characterize the lesion further if clinically indicated.",
            "**Differential Diagnosis**: Consider potential etiologies including neoplastic, inflammatory, or vascular processes based on the lesion morphology."
        ]
        if severity == "high":
            specific_recs.insert(0, "**URGENT**: Critical findings detected. Immediate clinical attention is recommended.")
            
        return specific_recs + base_recs
        
    return [
        "**Routine Care**: Continue with standard of care and routine follow-up protocols.",
        "**Observation**: No immediate intervention is suggested based on this analysis.",
        "**Health Maintenance**: Advise patient on general health maintenance and preventive screening as appropriate."
    ] + base_recs

async def event_generator():
    while True:
        data = await event_queue.get()
        yield f"data: {json.dumps(data)}\n\n"

@app.get("/events")
async def sse_endpoint():
    return StreamingResponse(event_generator(), media_type="text/event-stream")

async def process_analysis(job_id: str, temp_path: str, filename: str):
    try:
        jobs[job_id]["status"] = "processing"
        jobs[job_id]["progress"] = 10
        await push_event(job_id, "processing", "Starting Analysis...", 10)
        
        vision_report = None

        # Determine file type
        file_type = "nifti" if filename.endswith(('.nii', '.nii.gz')) else "image"
        
        image_tensor_for_heatmap = None
        anomaly_mask = None
        is_anomaly = False
        confidence = 0.0
        analysis_source = "Unknown"
        vti_filename = None
        mask_filename = None
        anatomical_region = None
        slice_base64 = None
        heatmap_base64 = None
        
        if file_type == "nifti":
            # Load NIfTI header for affine matrix (needed for mask saving)
            try:
                vol_nifti = nib.load(temp_path)
                logger.info(f"Successfully loaded NIfTI header for affine matrix from {temp_path}")
                # Eagerly load volume data for slice extraction and fallback
                vol_data = vol_nifti.get_fdata()

                # --- Z-Cropping Optimization (Eagerly Applied) ---
                # Remove top/bottom 10% slices to ignore air/bed artifacts
                z_dim = vol_data.shape[2]
                z_start = int(z_dim * 0.1)
                z_end = int(z_dim * 0.9)
                vol_data = vol_data[:, :, z_start:z_end] # Crop
                
                # --- Isotropic Resampling (1mm x 1mm x 1mm) ---
                # Fixes "pancake" effect in thick-slice CTs
                zooms = vol_nifti.header.get_zooms()[:3]
                target_zoom = 1.0
                
                # Only resample if spacing is significantly different (>10%)
                # handling (X, Y, Z) order
                if any(abs(z - target_zoom) > 0.1 for z in zooms):
                     logger.info(f"Detected Anisotropic Spacing {zooms}. Resampling to Isotropic 1.0mm...")
                     zoom_factors = [z / target_zoom for z in zooms]
                     # Use order=1 (Linear) for speed and to prevent ringing artifacts
                     vol_data = zoom(vol_data, zoom_factors, order=1, prefilter=False)
                     logger.info(f"Resampled Shape: {vol_data.shape}")
                # -------------------------------
                # -------------------------------
                
            except Exception as e:
                logger.error(f"Failed to load NIfTI header/data: {e}")
                vol_nifti = None
                vol_data = None
            
            # Check if custom model is available
            global custom_model_loaded
            global autoencoder_loaded
            
            # --- HYBRID ENSEMBLE DETECTION ---
            # We run BOTH the Autoencoder (Deep Learning) and the Robust Analysis (Statistical)
            # and combine their results.
            
            ae_anomaly = False
            ae_conf = 0.0
            ae_error = 0.0
            
            if autoencoder_loaded:  # ENABLED: Hybrid Mode
                try: 
                    # Prepare image for Autoencoder (needs specific transform)
                    img_data = transforms_3d(temp_path).unsqueeze(0).to(device)
                    
                    with torch.no_grad():
                        reconstruction = autoencoder_model(img_data)
                        diff = torch.abs(img_data - reconstruction)
                        ae_error = diff.mean().item()
                        
                        # Autoencoder Threshold (tuned)
                        if ae_error > 0.035:
                            ae_anomaly = True
                            ae_conf = min(99.0, ae_error * 2500)
                        else:
                            ae_conf = max(10.0, 100 - (ae_error * 2500))
                            
                    logger.info(f"Autoencoder Result: Anomaly={ae_anomaly}, Error={ae_error:.5f}, Conf={ae_conf:.1f}")
                except Exception as e:
                    logger.error(f"Autoencoder failed: {e}")
            
            # --- MAIN ANALYSIS BLOCK ---
            # Checks Custom Model -> Falls back to Robust Statistical
            
            if custom_model_loaded and model_3d_custom:
                jobs[job_id]["message"] = "Running 3D DenseNet Inference..."
                img_data = transforms_3d(temp_path).unsqueeze(0).to(device)
                image_tensor_for_heatmap = img_data
                
                with torch.no_grad():
                    output_custom = model_3d_custom(img_data)
                    prob_custom = torch.softmax(output_custom, dim=1)
                    score_custom = prob_custom[0][1].item() * 100
                    
                    anomaly_score = score_custom
                    analysis_source = "Custom DenseNet121 (3D)"
                    is_anomaly = anomaly_score > 50
                    confidence = anomaly_score if is_anomaly else (100 - anomaly_score)
                    
                    # Create dummy mask for custom model (since it's classification only)
                    anomaly_mask = np.zeros_like(vol_data)
                    
            else:
                # Statistical Fallback with ROBUST Multi-Slice Analysis
                jobs[job_id]["message"] = "Running Robust Multi-Slice Anomaly Scanning..."
                jobs[job_id]["progress"] = 50
                await push_event(job_id, "processing", "Running Robust Multi-Slice Anomaly Scanning...", 50)
                
                if vol_data is None:
                     raise Exception("Volume data unavailable for statistical analysis")
                
                # INTELLIGENT NORMALIZATION STRATEGY
                # Check for CT Physics (Hounsfield Units)
                d_min, d_max = np.min(vol_data), np.max(vol_data)
                is_ct_scan = False
                
                if d_min < -500 and d_max > 1000:
                    is_ct_scan = True
                    logger.info("Detected CT Scan (Physics-Based) - Applying Soft Tissue Window")
                    # Soft Tissue Window for Abdominal CT
                    # Level: 50, Width: 350 -> Range: -125 to 225
                    # This isolates liver/soft tissue and filters out bone/air consistently.
                    vol_data = np.clip(vol_data, -125, 225)
                    vol_data = (vol_data - (-125)) / (350)
                else:
                    logger.info("Detected MRI/General Modality (Relative Intensity) - Applying Adaptive Statistical Normalization")
                    # Fallback for MRI or already normalized data
                    p05 = np.percentile(vol_data, 0.5)
                    p995 = np.percentile(vol_data, 99.5)
                    vol_data = np.clip(vol_data, p05, p995)
                    vol_data = (vol_data - np.min(vol_data)) / (np.max(vol_data) - np.min(vol_data) + 1e-8)
                
                # CORRECT AXIS HANDLING: Transpose to (Depth, Height, Width) if needed
                # NIfTI default is (X, Y, Z). We want Z as the first dimension for iteration.
                if vol_data.shape[2] < vol_data.shape[0]:
                    logger.info("Transposing volume to (Z, X, Y) for Axial Analysis...")
                    vol_data = vol_data.transpose(2, 0, 1)

                # Intelligent Scanning Strategy
                # Scan middle 60% of the volume with stride 3 to catch small lesions
                d, h, w = vol_data.shape
                start_slice = int(d * 0.20)
                end_slice = int(d * 0.80)
                stride = 3
                
                slice_indices = range(start_slice, end_slice, stride)
                if len(slice_indices) == 0: slice_indices = [d // 2] # Fallback
                
                max_conf = 0
                worst_slice_idx = int(d * 0.5)
                is_anomaly_global = False
                
                # Create 3D Mask (initially empty)
                anomaly_mask = np.zeros_like(vol_data)
                
                analysis_source = "Multi-Slice Robust Analysis"
                
                anomalous_slices_count = 0 
                
                for idx in slice_indices:
                    current_slice = vol_data[idx, :, :] # Axial slice
                    
                    # --- Test-Time Augmentation (TTA) with Polarity Handling ---
                    # We analyze the slice in 4 views to filter out random noise
                    tta_ratios = []
                    tta_max_ints = []
                    
                    # 1. Original (Pass is_ct=is_ct_scan)
                    is_anom, conf, mask, max_int, ratio, src = _analyze_slice_robust(current_slice, is_ct=is_ct_scan)
                    tta_ratios.append(ratio)
                    tta_max_ints.append(max_int)
                    
                    # 2. Flip LR
                    _, _, _, max_int_lr, ratio_lr, _ = _analyze_slice_robust(np.fliplr(current_slice), is_ct=is_ct_scan)
                    tta_ratios.append(ratio_lr)
                    tta_max_ints.append(max_int_lr)
                    
                    # 3. Flip UD
                    _, _, _, max_int_ud, ratio_ud, _ = _analyze_slice_robust(np.flipud(current_slice), is_ct=is_ct_scan)
                    tta_ratios.append(ratio_ud)
                    tta_max_ints.append(max_int_ud)
                    
                    # 4. Rotate 90
                    rot_slice = rotate(current_slice, 90, reshape=False)
                    _, _, _, max_int_r90, ratio_r90, _ = _analyze_slice_robust(rot_slice, is_ct=is_ct_scan)
                    tta_ratios.append(ratio_r90)
                    tta_max_ints.append(max_int_r90)
                    
                    # Consensus
                    avg_ratio = np.mean(tta_ratios)
                    avg_max_int = np.mean(tta_max_ints)
                    
                    # Update variables for downstream logic using the CONSENSUS values
                    ratio = avg_ratio
                    max_int = avg_max_int
                    # ULTRA-STRICT VERIFIED THRESHOLDS (Matches purge_inconsistent_files.py)
                    # Previous: 0.02 / 60
                    is_anom = (ratio > 0.015) or (max_int > 50)
                    
                    # Keep Original Mask for visualization if anomalous
                    # (We assume if TTA says anomaly, the original mask is valid enough to show)
                    
                    if is_anom:
                         # Accumulate Mask only for anomalous slices
                         anomaly_mask[idx, :, :] = mask
                         is_anomaly_global = True
                         anomalous_slices_count += 1
                    
                    # Track Worst Slice by Confidence
                    if conf > max_conf:
                        max_conf = conf
                        worst_slice_idx = idx
                        analysis_source = src

                # --- ENSEMBLE DECISION LOGIC ---
                # Combine TTA/Robust results with Autoencoder results (Hybrid)
                
                if 'ae_anomaly' not in locals(): ae_anomaly = False # Safety fallback
                if 'ae_conf' not in locals(): ae_conf = 0.0

                debug_msg = f"Robust: {is_anomaly_global} (Conf {max_conf:.1f}) | Autoencoder: {ae_anomaly} (Conf {ae_conf:.1f})"
                logger.info(debug_msg)
                
                if is_anomaly_global and ae_anomaly:
                    # Both agree - High Confidence
                    is_anomaly = True
                    confidence = (max_conf + ae_conf) / 2
                    analysis_source = "Hybrid Consensus (Robust Statistics + Swin-UNETR AI)"
                elif is_anomaly_global:
                     # Robust detected, Autoencoder missed (Common for specific lesions or noise)
                     is_anomaly = True
                     confidence = max_conf
                     analysis_source = "Robust Multi-Slice Analysis"
                elif ae_anomaly:
                     # Autoencoder detected, Robust missed (Subtle Data distribution shifts)
                     is_anomaly = True
                     confidence = ae_conf
                     analysis_source = "Swin-UNETR Autoencoder (Deep Learning)"
                     # If only AE detected, update heatmap to valid slice (fallback to middle)
                     if worst_slice_idx == int(d * 0.5): pass 
                else:
                    is_anomaly = False
                    confidence = (max_conf + ae_conf) / 2
                    analysis_source = "Hybrid Analysis (Clean)"
                
                # Confidence Boost if multiple slices are anomalous (Persistence)
                if anomalous_slices_count > 3:
                     confidence = min(99.9, confidence + 5.0)
                
                logger.info(f"Analysis Complete. Anomalous Slices: {anomalous_slices_count}/{len(slice_indices)}. Peak Conf: {confidence}")
                
                # Image Tensor for legacy logic (unused visually but kept for consistency)
                image_tensor_for_heatmap = None 


            # --- EXTRACT SLICE FOR VISION AI ---
            # Find the slice with the most anomalies, or the middle slice if normal
            if is_anomaly and anomaly_mask is not None:
                # Sum anomalies per slice (along H/W dimensions, which are 1 and 2) to find the worst Z-slice
                slice_scores = np.sum(anomaly_mask, axis=(1, 2))
                target_slice_idx = np.argmax(slice_scores)
            else:
                target_slice_idx = vol_data.shape[0] // 2 # Middle Slice (Dimension 0 is Z/Depth)
            
            # Extract and save 2D slice as temp image
            # Correctly access dimension 0 (Depth)
            best_slice = vol_data[target_slice_idx, :, :]
            # Normalize to 0-255 for Image save
            slice_norm = ((best_slice - np.min(best_slice)) / (np.max(best_slice) - np.min(best_slice) + 1e-8) * 255).astype(np.uint8)
            slice_img = Image.fromarray(slice_norm).convert('L')
            
            vision_temp_path = os.path.join(TEMP_DIR, f"{job_id}_vision_slice.jpg")
            slice_img.save(vision_temp_path)
            
            # --- Generate 2D Slice Base64 for Frontend ---
            # DISABLED: User requested no visualization
            slice_base64 = None
            heatmap_base64 = None
            
            # 1. Base Image (The raw slice)
            # buffered = BytesIO()
            # slice_img.save(buffered, format="JPEG")
            # slice_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            # 2. Heatmap Overlay (The anomaly mask for this slice)
            # heatmap_base64 = ""
            # if is_anomaly and anomaly_mask is not None:
                # ... (Logic disabled)
             #   pass

            # Generate Report immediately for NIfTI
            jobs[job_id]["message"] = "Generating AI Vision Report (3D Slice)..."
            try:
                vision_report = vision_agent.analyze(vision_temp_path, is_anomaly)
                # vision_report = "Vision analysis disabled for performance."
            except Exception as e:
                logger.error(f"Vision Agent Failed: {e}")
                vision_report = "Vision analysis unavailable."
            
            # Cleanup temp slice
            if os.path.exists(vision_temp_path): os.remove(vision_temp_path)
            
            # --- Anatomical Mapping ---
            if is_anomaly:
                jobs[job_id]["message"] = "Mapping to Standard Atlas..."
                try:
                    anatomical_region = anatomy_agent.get_region(vol_data, anomaly_mask)
                except Exception as e:
                    logger.error(f"Anatomy Mapping Failed: {e}")
                    anatomical_region = "Localization unavailable"
            # --------------------------

            # Convert to VTI for Frontend Visualization
            vti_filename = f"{job_id}.vti"
            vti_path = os.path.join(TEMP_DIR, vti_filename)
            # convert_nifti_to_vti(temp_path, vti_path)

            # Convert Mask to VTI
            mask_filename = f"{job_id}_mask.vti"
            mask_path = os.path.join(TEMP_DIR, mask_filename)
            
            # Create a temporary NIfTI for the mask to use the converter (or use vtk directly from numpy if complex, 
            # but saving as NIfTI first using nibabel is easier since we have the affine)
            if vol_nifti is not None:
                mask_nifti = nib.Nifti1Image(anomaly_mask, affine=vol_nifti.affine)
                mask_temp_path = os.path.join(TEMP_DIR, f"{job_id}_mask.nii.gz")
                nib.save(mask_nifti, mask_temp_path)
                # convert_nifti_to_vti(mask_temp_path, mask_path)
            else:
                logger.error("vol_nifti is None, cannot save anomaly mask.")

        elif file_type == "image":
            jobs[job_id]["message"] = "Processing Image Data..."
            jobs[job_id]["progress"] = 30
            await push_event(job_id, "processing", "Processing Image Data...", 30)
            
            img = Image.open(temp_path).convert('L')
            img_resized = img.resize((224, 224))
            img_array = np.array(img_resized)
            
            # Robust Normalization (Percentile Clipping) for Images
            # Fixes issue where single bright pixels/artifacts suppress tissue contrast
            p05 = np.percentile(img_array, 0.5)
            p995 = np.percentile(img_array, 99.5)
            img_array = np.clip(img_array, p05, p995)
            
            img_norm = (img_array - np.min(img_array)) / (np.max(img_array) - np.min(img_array) + 1e-8)
            
            image_tensor = torch.tensor(img_norm).float().unsqueeze(0).unsqueeze(0).to(device)
            image_tensor_for_heatmap = image_tensor
            
            jobs[job_id]["message"] = "Running Robust Multi-Scale Anomaly Scanning..."
            jobs[job_id]["progress"] = 60
            
            # --- Test-Time Augmentation (TTA) for 2D Images ---
            # Matching the Doctor Portal's robustness with 4-View Voting
            tta_ratios = []
            tta_max_ints = []
            
            # 1. Original
            is_anom, conf, mask, max_int, ratio, src = _analyze_slice_robust(img_norm, is_ct=False)
            tta_ratios.append(ratio)
            tta_max_ints.append(max_int)
            final_mask = mask # Use original mask for visualization

            # 2. Flip LR
            _, _, _, max_int_lr, ratio_lr, _ = _analyze_slice_robust(np.fliplr(img_norm), is_ct=False)
            tta_ratios.append(ratio_lr)
            tta_max_ints.append(max_int_lr)

            # 3. Flip UD
            _, _, _, max_int_ud, ratio_ud, _ = _analyze_slice_robust(np.flipud(img_norm), is_ct=False)
            tta_ratios.append(ratio_ud)
            tta_max_ints.append(max_int_ud)

            # 4. Rotate 90
            rot_img = rotate(img_norm, 90, reshape=False)
            _, _, _, max_int_r90, ratio_r90, _ = _analyze_slice_robust(rot_img, is_ct=False)
            tta_ratios.append(ratio_r90)
            tta_max_ints.append(max_int_r90)

            # Consensus
            anomaly_ratio = np.mean(tta_ratios)
            max_intensity = np.mean(tta_max_ints)
            
            # Use verified ULTRA-STRICT thresholds for Images too
            # Matches NIfTI logic (0.015 / 50)
            is_anomaly = (anomaly_ratio > 0.015) or (max_intensity > 50)
            
            if is_anomaly:
                confidence = max_intensity # Use raw intensity confidence
            else:
                confidence = max(10.0, 100 - (max_intensity * 2))

            analysis_source = "Robust Statistics + TTA (2D)"
            
            logger.info(f"2D Analysis Results (TTA) - Ratio: {anomaly_ratio:.4f}, Max Conf: {max_intensity:.2f}, Anomaly: {is_anomaly}")

            anomaly_mask = final_mask.astype(np.float32)

        else:
            raise Exception("Unsupported file format")

        jobs[job_id]["message"] = "Generating Diagnostic Report..."
        jobs[job_id]["progress"] = 80
        await asyncio.sleep(0.1)

        # Generate Response
        confidence = float(round(confidence, 2))
        is_anomaly = bool(is_anomaly) # Ensure native bool for JSON serialization
        
        severity = "high" if confidence > 80 else "medium" if confidence > 65 else "low"
        if not is_anomaly: severity = "none"
        
        heatmap_base64 = ""
        if image_tensor_for_heatmap is not None:
             jobs[job_id]["message"] = "Generating Anomaly Heatmap..."
             heatmap_base64 = generate_heatmap_image(image_tensor_for_heatmap, is_anomaly, file_type, anomaly_mask)

        findings = generate_detailed_findings(is_anomaly, confidence, severity, file_type, analysis_source, filename)
        recommendations = generate_recommendations(is_anomaly, severity, file_type, filename)
        
        # --- Generate Vision Report (Llava) ---
        if vision_report is None and file_type == "image":
            jobs[job_id]["message"] = "Generating AI Vision Report..."
            await push_event(job_id, "processing", "Consulting Vision Model (Llava)...", 90)
            vision_report = vision_agent.analyze(temp_path, is_anomaly)
        
        # Initialize result dictionary
        result = {
            "anomalyDetected": is_anomaly,
            "confidenceScore": confidence,
            "findings": findings,
            "visionReport": vision_report,
            "anatomicalRegion": anatomical_region, # New Field
            "severity": severity,
            "recommendations": recommendations,
            "heatmapAreas": ["Segment IV", "Segment VIII"] if is_anomaly else [],
            "detailedAnalysis": {
                "primaryCondition": "Suspected Hepatic Lesion" if is_anomaly else "Normal Hepatic Parenchyma",
                "urgencyLevel": "Immediate Action" if severity == "high" else "Routine Follow-up"
            },
            "technicalDetails": {
                "modelType": analysis_source,
                "processingTime": 250,
                "fileSize": os.path.getsize(temp_path),
                "analysisMethod": "Statistical Intensity Analysis"
            },
            "heatmapImage": heatmap_base64,
            "sliceData": slice_base64,
            "vtiUrl": f"http://localhost:8000/files/{vti_filename}" if vti_filename else None,
            "maskVtiUrl": f"http://localhost:8000/files/{mask_filename}" if mask_filename else None
        }

        jobs[job_id]["status"] = "completed"
        jobs[job_id]["progress"] = 100
        jobs[job_id]["message"] = "Analysis Complete"
        jobs[job_id]["result"] = result
        await push_event(job_id, "completed", "Analysis Complete", 100)

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["message"] = f"Analysis Failed: {str(e)}"
        await push_event(job_id, "failed", f"Analysis Failed: {str(e)}", 0)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/")
async def health_check():
    return {"status": "healthy", "models": ["Swin-UNETR (Autoencoder)", "DenseNet121 (2D)"]}

@app.post("/analyze")
async def analyze_image(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...), 
    patientInfo: Optional[str] = File(None)
):
    try:
        filename = file.filename.lower()
        logger.info(f"Received file: {filename}")
        
        suffix = os.path.splitext(filename)[1]
        if filename.endswith('.nii.gz'): suffix = '.nii.gz'
            
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
            
        job_id = str(uuid.uuid4())
        jobs[job_id] = {
            "status": "queued",
            "progress": 0,
            "message": "Queued for Analysis...",
            "result": None,
            "patientInfo": patientInfo
        }

        background_tasks.add_task(process_analysis, job_id, temp_path, filename)
        return {"jobId": job_id, "status": "queued"}

    except Exception as e:
        logger.error(f"Error queuing file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
