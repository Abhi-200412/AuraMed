import os
import shutil
from nilearn import datasets

ATLAS_DIR = os.path.join(os.path.dirname(__file__), "data", "atlas")
os.makedirs(ATLAS_DIR, exist_ok=True)

def download_assets():
    print(f"Checking Atlas Assets in {ATLAS_DIR}...")
    
    # 1. Fetch MNI152 Template (1mm)
    print("Fetching MNI152 Template...")
    mni = datasets.load_mni152_template(resolution=1)
    mni_path = os.path.join(ATLAS_DIR, "mni152.nii.gz")
    if not os.path.exists(mni_path):
        mni.to_filename(mni_path)
        print("-> Saved MNI152 Template")
    else:
        print("-> MNI152 Template exists")

    # 2. Fetch Harvard-Oxford Atlas (Cortical & Subcortical)
    # We use HO because it gives nice region names like "Left Thalamus"
    print("Fetching Harvard-Oxford Atlas...")
    ho_cort = datasets.fetch_atlas_harvard_oxford('cort-maxprob-thr25-1mm')
    ho_sub = datasets.fetch_atlas_harvard_oxford('sub-maxprob-thr25-1mm')
    
    cort_path = os.path.join(ATLAS_DIR, "ho_cortical.nii.gz")
    sub_path = os.path.join(ATLAS_DIR, "ho_subcortical.nii.gz")
    
    if not os.path.exists(cort_path):
        import nibabel as nib
        # Copy file from nilearn cache to our dir
        # Fix: check if .maps is string or image
        if isinstance(ho_cort.maps, str):
             shutil.copy(ho_cort.maps, cort_path)
        else:
             ho_cort.maps.to_filename(cort_path)
        print("-> Saved HO Cortical Atlas")
    
    if not os.path.exists(sub_path):
        if isinstance(ho_sub.maps, str):
             shutil.copy(ho_sub.maps, sub_path)
        else:
             ho_sub.maps.to_filename(sub_path)
        print("-> Saved HO Subcortical Atlas")

    # Save labels mapping
    # Simple text dump for now, or just use nilearn's labels in app.py
    # But for offline usage we might want to cache them. 
    # For now we'll rely on nilearn cached labels or hardcode critical ones if needed.
    
    print("Atlas Download Complete.")

if __name__ == "__main__":
    download_assets()
