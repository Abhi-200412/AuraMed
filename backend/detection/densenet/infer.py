import torch
import torchvision.transforms as T
from PIL import Image
from backend.detection.densenet.model import load_densenet

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 🔥 Explicit class mapping (matches ImageFolder alphabetical order)
CLASS_MAP = {
    "abnormal": 0,
    "normal": 1
}

def predict_image(image_path, model_path):
    model = load_densenet(num_classes=2)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()

    transform = T.Compose([
        T.Resize((224,224)),
        T.Grayscale(num_output_channels=3),
        T.ToTensor(),
        T.Normalize(
            mean=[0.485, 0.456, 0.406],
            std =[0.229, 0.224, 0.225]
        )
    ])

    img = Image.open(image_path).convert("L")
    img = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        out = model(img)
        prob = torch.softmax(out, dim=1)[0]

        abnormal_prob = prob[CLASS_MAP["abnormal"]].item()
        normal_prob   = prob[CLASS_MAP["normal"]].item()

    return {
        "abnormal": abnormal_prob,
        "normal": normal_prob
    }
