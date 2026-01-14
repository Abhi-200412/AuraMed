import os
import zipfile
import shutil
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("xray_extractor")

DATASET_ROOT = Path(__file__).parent.parent.parent.parent / "dataset" / "RawData" / "Training" / "img" / "XRay"
ZIP_FILE = DATASET_ROOT / "chest-xray-pneumonia.zip"

def extract_and_organize():
    # Zip extraction skipped as Kaggle API already handled it
    extracted_root = DATASET_ROOT / "chest_xray"
    
    if not extracted_root.exists():
        logger.error(f"Extracted directory not found at {extracted_root}")
        return

    logger.info(f"Scanning {extracted_root} for NORMAL images...")
        
    # Search for all NORMAL images recursively
    normal_images = []
    for root, dirs, files in os.walk(extracted_root):
        if "NORMAL" in os.path.basename(root):
            for file in files:
                if file.lower().endswith(('.jpeg', '.jpg', '.png')):
                    normal_images.append(os.path.join(root, file))
    
    logger.info(f"Found {len(normal_images)} NORMAL X-ray images.")
    
    # Move them to DATASET_ROOT
    for img_path in normal_images:
        file_name = os.path.basename(img_path)
        dest_path = DATASET_ROOT / file_name
        try:
            shutil.move(img_path, dest_path)
        except Exception as e:
            logger.warning(f"Failed to move {img_path}: {e}")
        
    logger.info("Moved images to XRay root folder.")
    
    # Cleanup
    logger.info("Cleaning up...")
    if extracted_root.exists():
        shutil.rmtree(extracted_root)
    
    logger.info("X-ray dataset setup complete.")

if __name__ == "__main__":
    extract_and_organize()
