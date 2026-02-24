# backend/preprocessing/xray.py
import torchvision.transforms as T
from PIL import Image

xray_transform = T.Compose([
    T.Grayscale(num_output_channels=1),
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.5], std=[0.5])
])

def preprocess_xray(path):
    img = Image.open(path)
    return xray_transform(img)
