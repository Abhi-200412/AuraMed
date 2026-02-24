import torch
from monai.networks.nets import SwinUNETR
from monai.data import DataLoader, Dataset
from monai.losses import DiceCELoss
from monai.metrics import DiceMetric
from transforms import get_transforms
from pathlib import Path
from torch.cuda.amp import autocast, GradScaler

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

train_images = sorted(Path("dataset/ct/train/images").glob("*.nii*"))
train_masks  = sorted(Path("dataset/ct/train/masks").glob("*.nii*"))
val_images   = sorted(Path("dataset/ct/val/images").glob("*.nii*"))
val_masks    = sorted(Path("dataset/ct/val/masks").glob("*.nii*"))

train_data = [{"image": str(i), "label": str(l)} for i,l in zip(train_images, train_masks)]
val_data   = [{"image": str(i), "label": str(l)} for i,l in zip(val_images, val_masks)]

train_ds = Dataset(train_data, transform=get_transforms(train=True))
val_ds   = Dataset(val_data, transform=get_transforms(train=False))

train_loader = DataLoader(train_ds, batch_size=1, shuffle=True)
val_loader   = DataLoader(val_ds, batch_size=1)

model = SwinUNETR(
    in_channels=1,
    out_channels=1,
    feature_size=24,
    use_checkpoint=False
).to(device)

loss_fn = DiceCELoss(sigmoid=True)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
dice_metric = DiceMetric(include_background=False, reduction="mean")

for epoch in range(5):
    model.train()
    for batch in train_loader:
        optimizer.zero_grad()
        x = batch["image"].to(device)
        y = batch["label"].to(device)
        out = model(x)
        loss = loss_fn(out, y)
        loss.backward()
        optimizer.step()

    model.eval()
    dice_metric.reset()
    with torch.no_grad():
        for batch in val_loader:
            x = batch["image"].to(device)
            y = batch["label"].to(device)
            out = model(x)
            dice_metric(out, y)

    dice = dice_metric.aggregate().item()
    print(f"Epoch {epoch+1} | Dice Score: {dice:.4f}")

torch.save(model.state_dict(), "backend/models/swinunetr_ct.pth")
print("SwinUNETR model saved.")
