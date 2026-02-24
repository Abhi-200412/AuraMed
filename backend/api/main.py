
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import uuid
import json
import logging

# Import ML Logic
from backend.detection.densenet.infer import predict_image
from backend.detection.swinunetr.infer import infer_ct
from backend.detection.fusion import fuse_results
from backend.chatbot.ollama_client import get_medical_explanation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

app = FastAPI(title="AuraMed API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
MODELS_DIR = "backend/models"

class ChatRequest(BaseModel):
    message: str
    context: str = ""

@app.get("/")
def health_check():
    return {"status": "running"}

@app.post("/api/analyze")
async def analyze_scan(file: UploadFile = File(...), patientInfo: str = None): 
    # Frontend sends 'file' and 'patientInfo' to /api/analyze
    try:
        file_id = str(uuid.uuid4())
        ext = os.path.splitext(file.filename)[1].lower()
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        logger.info(f"File uploaded: {file_path}")
        
        # Determine model type based on extension
        is_ct_mri = ext in [".nii", ".gz", ".nii.gz"]
        
        classification_prob = 0.0
        segmentation_score = 0.0
        findings = ""
        
        if is_ct_mri:
            # Run SwinUNETR
            # Note: infer_ct returns numpy array. We need mean for fusion.
            seg_map = infer_ct(file_path)
            segmentation_score = float(seg_map.mean()) 
            # Densenet might not be applicable directly to 3D NIfTI in current form unless adapted
            # For hybrid, we might assume some default or run a modified densenet
            classification_prob = 0.5 # Placeholder if model not ready for 3D
        else:
            # Run DenseNet (X-ray 2D)
            densenet_path = os.path.join(MODELS_DIR, "densenet_xray.pth")
            if os.path.exists(densenet_path):
                classification_prob = predict_image(file_path, densenet_path)
            else:
                logger.warning("DenseNet model not found, skipping classification.")
            
            # SwinUNETR not applicable for 2D X-Ray
            segmentation_score = 0.0

        # Fusion
        decision = fuse_results(classification_prob, segmentation_score if is_ct_mri else 0.0) # Simple fallback
        
        # Generate Findings with Ollama
        prompt = f"Patient has {decision['severity']} severity anomaly. Classification confidence: {decision['classification_confidence']:.2f}. Generate clinical findings."
        try:
             findings = get_medical_explanation(prompt)
        except:
             findings = "AI Explanation unavailable."

        result = {
            "jobId": file_id,
            "status": "completed",
            "progress": 100,
            "message": "Analysis Complete",
            "result": {
                "anomalyDetected": decision["anomaly"],
                "confidenceScore": int(decision["classification_confidence"] * 100),
                "severity": decision["severity"],
                "findings": findings,
                "recommendations": ["Consult radiologist", "Further screening recommended"] if decision["anomaly"] else ["Routine checkup"],
                "technicalDetails": {
                    "modelType": "SwinUNETR + DenseNet" if is_ct_mri else "DenseNet121",
                    "fileId": file_id
                }
            }
        }
        
        # To support polling frontend, we return immediately. 
        # In real-world, this should be async background job. 
        # Since frontend polls /api/analyze/status, we need to store this result.
        # For prototype simplicity, we return the result directly or handle the status endpoint.
        
        # HACK for Prototype: Save result to memory/file so status endpoint can read it?
        # OR: Just return the result in the final poll if using async.
        # Given the frontend expects an immediate job ID and then polls...
        
        # We will save result to a JSON file to simulate DB persistence
        with open(os.path.join(UPLOAD_DIR, f"{file_id}.json"), "w") as f:
            json.dump(result, f)
            
        return {"jobId": file_id}
            
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        return {"error": str(e)}

@app.get("/api/analyze/status")
def get_analysis_status(jobId: str):
    result_path = os.path.join(UPLOAD_DIR, f"{jobId}.json")
    if os.path.exists(result_path):
        with open(result_path, "r") as f:
            data = json.load(f)
        return data
    else:
        # If file created but no JSON yet, it's processing
        return {"status": "processing", "progress": 50, "message": "Analyzing..."}

@app.post("/chat")
async def chat(request: ChatRequest):
    response = get_medical_explanation(request.message)
    return {"response": response}
