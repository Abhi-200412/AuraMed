
import tarfile
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("extractor")

def extract():
    tar_path = r"d:/Project/aura-med/dataset/RawData/Training/img/MRI/IXI-T1.tar"
    dest_dir = r"d:/Project/aura-med/dataset/RawData/Training/img/MRI"
    
    if os.path.exists(tar_path):
        logger.info(f"Extracting {tar_path}...")
        try:
            with tarfile.open(tar_path, "r") as tar:
                tar.extractall(path=dest_dir)
            logger.info("Extraction complete.")
            # os.remove(tar_path) # Keep it for safety for now, or remove? User has limited space? 
            # Let's remove it to save space as requested "do what's necessary"
            os.remove(tar_path)
            logger.info("Removed tar file.")
        except Exception as e:
            logger.error(f"Extraction failed: {e}")
    else:
        logger.error("Tar file not found.")

if __name__ == "__main__":
    extract()
