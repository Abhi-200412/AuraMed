# backend/preprocessing/mri.py
import torchvision.transforms as T
from PIL import Image

mri_transform = T.Compose([
    T.Grayscale(num_output_channels=1),
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.5], std=[0.25])
])

def preprocess_mri(path):
    img = Image.open(path)
    return mri_transform(img)
