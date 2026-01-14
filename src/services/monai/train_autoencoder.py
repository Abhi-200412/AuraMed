
import os
import glob
import logging
import torch
import numpy as np
from torch.utils.data import DataLoader
from sklearn.model_selection import train_test_split
import monai
from monai.data import Dataset, CacheDataset
from monai.transforms import (
    Compose,
    LoadImaged,
    EnsureChannelFirstd,
    ScaleIntensityd,
    Resized,
    EnsureTyped,
    RandRotated,
    RandFlipd,
    RandZoomd,
)
from models import get_autoencoder_model

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("train_autoencoder")

def main():
    # --- 1. Data Preparation ---
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../dataset"))
    
    # Load from all "Normal" sources
    # We assume download_multimodal_data.py has populated these folders
    ct_dir = os.path.join(root_dir, "RawData", "Training", "img", "CT")
    mri_dir = os.path.join(root_dir, "RawData", "Training", "img", "MRI")
    # X-ray might need special handling (2D -> 3D), for now we focus on 3D volumes if X-rays are not NIfTI
    # Or we assume X-rays are converted/stacked. 
    # For simplicity in this v1, we load all .nii.gz files found in Training/img recursively
    
    # Search for NIfTI and common image formats (for X-rays)
    extensions = ["*.nii.gz", "*.nii", "*.jpeg", "*.jpg", "*.png"]
    all_files = []
    
    for ext in extensions:
        search_path = os.path.join(root_dir, "RawData", "Training", "img", "**", ext)
        found = glob.glob(search_path, recursive=True)
        all_files.extend(found)
    
    # Also include the original liver data
    original_normal_dir = os.path.join(root_dir, "RawData", "Training", "img")
    original_files = glob.glob(os.path.join(original_normal_dir, "*.nii.gz"))
    
    # Combine and deduplicate
    all_files = list(set(all_files + original_files))
    
    # Verify existence (in case of race conditions or deletion)
    all_files = [f for f in all_files if os.path.exists(f)]
    
    if not all_files:
        logger.error("No training data found! Please run download_multimodal_data.py first.")
        return

    logger.info(f"Found {len(all_files)} total training volumes.")
    
    # Create file list (Self-supervised: Label is the Image itself, but MONAI transforms handle keys)
    # We just need "image" key.
    files = [{"image": f} for f in all_files]
    
    # Split
    train_files, val_files = train_test_split(files, test_size=0.1, random_state=42)
    
    # --- 2. Transforms ---
    train_transforms = Compose([
        LoadImaged(keys=["image"]),
        EnsureChannelFirstd(keys=["image"]),
        ScaleIntensityd(keys=["image"]), # Normalize to 0-1
        Resized(keys=["image"], spatial_size=(96, 96, 96)),
        RandRotated(keys=["image"], range_x=np.pi/12, prob=0.5, keep_size=True),
        RandFlipd(keys=["image"], spatial_axis=0, prob=0.5),
        EnsureTyped(keys=["image"]),
    ])
    
    val_transforms = Compose([
        LoadImaged(keys=["image"]),
        EnsureChannelFirstd(keys=["image"]),
        ScaleIntensityd(keys=["image"]),
        Resized(keys=["image"], spatial_size=(96, 96, 96)),
        EnsureTyped(keys=["image"]),
    ])
    
    # --- 3. Datasets ---
    # Use CacheDataset for speed if memory allows, else Dataset
    train_ds = Dataset(data=train_files, transform=train_transforms)
    val_ds = Dataset(data=val_files, transform=val_transforms)
    
    train_loader = DataLoader(train_ds, batch_size=1, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_ds, batch_size=1, shuffle=False, num_workers=0)
    
    # --- 4. Model ---
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Using device: {device}")
    
    model = get_autoencoder_model(device, use_pretrained=True)
    
    # Loss: L1 Loss (Reconstruction Error)
    loss_function = torch.nn.L1Loss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
    
    # --- 5. Training Loop ---
    max_epochs = 50
    best_val_loss = float("inf")
    
    for epoch in range(max_epochs):
        logger.info(f"Epoch {epoch + 1}/{max_epochs}")
        model.train()
        epoch_loss = 0
        step = 0
        
        for batch_data in train_loader:
            try:
                step += 1
                inputs = batch_data["image"].to(device)
                # Autoencoder target is the input itself
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = loss_function(outputs, inputs)
                loss.backward()
                optimizer.step()
                epoch_loss += loss.item()
                
                if step % 10 == 0:
                    logger.info(f"{step}/{len(train_ds)}, train_loss: {loss.item():.4f}")
            except Exception as e:
                logger.error(f"Error in training step: {e}")
                continue
        
        if step > 0:
            epoch_loss /= step
            logger.info(f"Epoch {epoch + 1} avg loss: {epoch_loss:.4f}")
            
        # Validation
        if (epoch + 1) % 1 == 0:
            model.eval()
            val_loss = 0
            val_steps = 0
            with torch.no_grad():
                for val_data in val_loader:
                    try:
                        val_inputs = val_data["image"].to(device)
                        val_outputs = model(val_inputs)
                        val_loss += loss_function(val_outputs, val_inputs).item()
                        val_steps += 1
                    except Exception as e:
                        continue
            
            if val_steps > 0:
                val_loss /= val_steps
                logger.info(f"Validation Loss: {val_loss:.4f}")
                
                if val_loss < best_val_loss:
                    best_val_loss = val_loss
                    torch.save(model.state_dict(), "autoencoder_model.pth")
                    logger.info("Saved new best autoencoder model!")

    logger.info("Training completed.")

if __name__ == "__main__":
    main()
