import torchvision.transforms as T
from PIL import Image

def preprocess_ct(path):
    transform = T.Compose([
        T.Resize((256, 256)),
        T.Grayscale(),
        T.ToTensor(),           # [0,1]
    ])

    img = Image.open(path).convert("L")
    return transform(img).unsqueeze(0)  # [1,1,128,128]
