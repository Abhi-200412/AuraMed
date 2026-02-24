from pathlib import Path
import numpy as np
import torch

from backend.detection.swinunetr.model import get_autoencoder_model
from backend.detection.swinunetr.infer import run_ct_inference

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = get_autoencoder_model(device)
model.load_state_dict(
    torch.load("backend/models/ct_autoencoder.pth", map_location=device)
)
model.eval()

normal_dir = Path("dataset/ct/train/normal")

scores = []

print("\nComputing CT thresholds...\n")

for img in normal_dir.glob("*.png"):
    s, _ = run_ct_inference(str(img), model, device)
    scores.append(s)

scores = np.array(scores)

threshold = np.percentile(scores, 97.5)

print("\n==============================")
print("CT Threshold:", threshold)
print("==============================\n")
