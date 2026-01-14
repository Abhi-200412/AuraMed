import os
import glob
import nibabel as nib
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def validate_dataset(directory):
    logger.info(f"Scanning directory: {directory}")
    files = glob.glob(os.path.join(directory, "**", "*.nii.gz"), recursive=True)
    logger.info(f"Found {len(files)} NIfTI files.")

    corrupted_count = 0
    for file_path in files:
        try:
            # Try to load and read the data to trigger any EOF errors
            img = nib.load(file_path)
            _ = img.get_fdata() 
        except Exception as e:
            logger.error(f"Corrupted file found: {file_path} - Error: {e}")
            try:
                os.remove(file_path)
                logger.info(f"Deleted corrupted file: {file_path}")
                corrupted_count += 1
            except OSError as del_err:
                logger.error(f"Failed to delete {file_path}: {del_err}")

    logger.info(f"Validation complete. Removed {corrupted_count} corrupted files.")

if __name__ == "__main__":
    # Target the training images directory
    target_dir = os.path.join("dataset", "RawData", "Training")
    validate_dataset(target_dir)
