
import numpy as np
import PIL.Image as Image
import nibabel as nib
import pydicom

def load_image(path: str):
    """
    Load image from path. Supports PNG, JPG, NII.GZ, DCM.
    Returns numpy array.
    """
    if path.endswith((".png", ".jpg", ".jpeg")):
        return np.array(Image.open(path).convert("L")) # Grayscale
    elif path.endswith(".nii.gz"):
        img = nib.load(path)
        return img.get_fdata()
    elif path.endswith(".dcm"):
        return pydicom.dcmread(path).pixel_array
    else:
        raise ValueError("Unsupported file format")

def save_heatmap(heatmap: np.ndarray, path: str):
    # Normalize and save as image
    pass
