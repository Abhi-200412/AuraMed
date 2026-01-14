
import os
import glob
import logging
import torch
import numpy as np
from torch.utils.data import DataLoader
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score, classification_report

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
from monai.networks.nets import DenseNet121
from monai.utils import set_determinism

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("train_anomaly")

def main():
    # Set deterministic training for reproducibility
    set_determinism(seed=42)
    
    # --- 1. Data Preparation ---
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../dataset"))
    
    # Define paths
    normal_dir = os.path.join(root_dir, "RawData", "Training", "img")
    anomaly_dir = os.path.join(root_dir, "Task03_Liver", "imagesTr")
    
    logger.info(f"Looking for data in:")
    logger.info(f"  Normal: {normal_dir}")
    logger.info(f"  Anomaly: {anomaly_dir}")
    
    # Get file lists
    normal_files = glob.glob(os.path.join(normal_dir, "*.nii.gz"))
    anomaly_files = glob.glob(os.path.join(anomaly_dir, "*.nii.gz"))
    
    if not normal_files or not anomaly_files:
        logger.error("Data not found! Please check the paths.")
        return
        
    logger.info(f"Found {len(normal_files)} normal scans and {len(anomaly_files)} anomaly scans.")
    logger.info("Building file list...")
    
    # Create file list with labels (0 for Normal, 1 for Anomaly)
    files = []
    labels = []
    
    for f in normal_files:
        files.append({"image": f, "label": 0})
        labels.append(0)
        
    for f in anomaly_files:
        files.append({"image": f, "label": 1})
        labels.append(1)
        
    # Split data (80% train, 20% val)
    train_files, val_files = train_test_split(files, test_size=0.2, stratify=labels, random_state=42)
    logger.info(f"Training set: {len(train_files)} items")
    logger.info(f"Validation set: {len(val_files)} items")
    logger.info("Defining transforms...")
    
    # --- 2. Transforms ---
    # Use Dictionary Transforms (suffix 'd') because our data is a list of dicts
    train_transforms = Compose([
        LoadImaged(keys=["image"]),
        EnsureChannelFirstd(keys=["image"]),
        ScaleIntensityd(keys=["image"]),
        Resized(keys=["image"], spatial_size=(96, 96, 96)),
        RandRotated(keys=["image"], range_x=np.pi/12, prob=0.5, keep_size=True),
        RandFlipd(keys=["image"], spatial_axis=0, prob=0.5),
        RandZoomd(keys=["image"], min_zoom=0.9, max_zoom=1.1, prob=0.5),
        EnsureTyped(keys=["image"]),
    ])
    
    val_transforms = Compose([
        LoadImaged(keys=["image"]),
        EnsureChannelFirstd(keys=["image"]),
        ScaleIntensityd(keys=["image"]),
        Resized(keys=["image"], spatial_size=(96, 96, 96)),
        EnsureTyped(keys=["image"]),
    ])
    
    # --- 3. Datasets and DataLoaders ---
    # Use standard Dataset to avoid memory issues
    train_ds = Dataset(data=train_files, transform=train_transforms)
    val_ds = Dataset(data=val_files, transform=val_transforms)
    logger.info("Datasets created.")
    
    # Batch size 1 for maximum stability
    train_loader = DataLoader(train_ds, batch_size=1, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_ds, batch_size=1, shuffle=False, num_workers=0)
    logger.info("DataLoaders created.")
    
    # --- 4. Model, Loss, Optimizer ---
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Using device: {device}")
    
    # Using DenseNet121 for 3D classification
    model = DenseNet121(spatial_dims=3, in_channels=1, out_channels=2).to(device)
    logger.info("Model initialized.")
    
    # Weighted Loss
    class_counts = [len(normal_files), len(anomaly_files)]
    weights = torch.tensor([1.0 / c for c in class_counts]).float().to(device)
    weights = weights / weights.sum()
    
    loss_function = torch.nn.CrossEntropyLoss(weight=weights)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4, weight_decay=1e-5)
    
    # --- 5. Training Loop ---
    max_epochs = 100
    val_interval = 1
    best_metric = -1
    best_metric_epoch = -1
    
    for epoch in range(max_epochs):
        logger.info(f"Starting Epoch {epoch + 1}...")
        logger.info(f"-" * 10)
        logger.info(f"Epoch {epoch + 1}/{max_epochs}")
        model.train()
        epoch_loss = 0
        step = 0
        
        for batch_data in train_loader:
            try:
                step += 1
                inputs, labels = batch_data["image"].to(device), batch_data["label"].to(device)
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = loss_function(outputs, labels)
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
            logger.info(f"Epoch {epoch + 1} average loss: {epoch_loss:.4f}")
        
        if (epoch + 1) % val_interval == 0:
            model.eval()
            with torch.no_grad():
                y_pred = []
                y_true = []
                
                for val_data in val_loader:
                    try:
                        val_images, val_labels = val_data["image"].to(device), val_data["label"].to(device)
                        val_outputs = model(val_images)
                        y_pred.extend(torch.softmax(val_outputs, dim=1)[:, 1].cpu().numpy())
                        y_true.extend(val_labels.cpu().numpy())
                    except Exception as e:
                        logger.error(f"Error in validation step: {e}")
                        continue
                
                try:
                    if len(y_true) > 0:
                        auc_score = roc_auc_score(y_true, y_pred)
                        acc_score = accuracy_score(y_true, np.array(y_pred) > 0.5)
                        
                        logger.info(f"Validation AUC: {auc_score:.4f} | Accuracy: {acc_score:.4f}")
                        
                        if auc_score > best_metric:
                            best_metric = auc_score
                            best_metric_epoch = epoch + 1
                            torch.save(model.state_dict(), "anomaly_detection_model.pth")
                            logger.info("Saved new best model!")
                    else:
                        logger.warning("No validation data processed.")
                        
                except Exception as e:
                    logger.error(f"Error calculating metrics: {e}")
                    
    logger.info(f"Training completed. Best AUC: {best_metric:.4f} at epoch {best_metric_epoch}")

    logger.info(f"Training completed. Best AUC: {best_metric:.4f} at epoch {best_metric_epoch}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logger.critical(f"CRITICAL ERROR: {e}")
        import traceback
        traceback.print_exc()
