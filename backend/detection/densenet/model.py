import torch.nn as nn
from torchvision.models import densenet121

def load_densenet(num_classes=2):
    # 🔥 NO PRETRAINED WEIGHTS — RANDOM INITIALIZATION
    model = densenet121(weights=None)   # or pretrained=False for older versions

    # Replace classifier for your task
    model.classifier = nn.Linear(
        model.classifier.in_features,
        num_classes
    )

    return model

