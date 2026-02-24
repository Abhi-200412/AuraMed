import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

from backend.detection.swinunetr.model import get_autoencoder_model

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

DATA_DIR = "dataset/ct/train/normal"
SAVE_PATH = "backend/models/ct_autoencoder.pth"

transform = transforms.Compose([
    transforms.Grayscale(),
    transforms.Resize((256, 256)),
    transforms.ToTensor(),  # [0,1]
])

dataset = datasets.ImageFolder(
    root="dataset/ct/train",
    transform=transform
)

# IMPORTANT: only normal images
dataset.samples = [s for s in dataset.samples if s[1] == 0]

loader = DataLoader(dataset, batch_size=16, shuffle=True)

model = get_autoencoder_model(device)
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

EPOCHS = 15

for epoch in range(EPOCHS):
    model.train()
    running_loss = 0

    for x, _ in loader:
        x = x.to(device)

        optimizer.zero_grad()
        recon = model(x)
        loss = criterion(recon, x)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

    print(f"Epoch [{epoch+1}/{EPOCHS}] | Loss: {running_loss/len(loader):.6f}")

os.makedirs("backend/models", exist_ok=True)
torch.save(model.state_dict(), SAVE_PATH)

print("✅ CT autoencoder trained & saved")
