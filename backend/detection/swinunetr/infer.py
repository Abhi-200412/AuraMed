import torch
import numpy as np
from torchvision import transforms
from PIL import Image


def run_ct_inference(img_path, model, device):
    transform = transforms.Compose([
        transforms.Grayscale(),
        transforms.Resize((128, 128)),
        transforms.ToTensor()
    ])

    img = Image.open(img_path)
    x = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        recon = model(x)
        error = torch.mean((x - recon) ** 2).item()

    return error, None
