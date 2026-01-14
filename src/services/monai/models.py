
import torch
import torch.nn as nn
from monai.networks.nets import SwinUNETR

class SwinUNETRAutoencoder(nn.Module):
    def __init__(self, img_size=(96, 96, 96), in_channels=1, feature_size=24, use_pretrained=False):
        super().__init__()
        # SwinUNETR is typically a segmentation model (Encoder-Decoder).
        # We use it as an Autoencoder by setting out_channels = in_channels.
        # It will learn to reconstruct the input.
        self.swin_unetr = SwinUNETR(
            img_size, # Positional argument
            in_channels=in_channels,
            out_channels=in_channels, # Reconstruction: Output matches Input
            feature_size=feature_size,
            use_checkpoint=True,
        )
        
        if use_pretrained:
            self._load_pretrained_weights()

    def _load_pretrained_weights(self):
        import torch.hub
        import os
        
        # URL for Swin-UNETR pre-trained weights (from MONAI Model Zoo / Official Repo)
        # Using the official weights for Swin-UNETR backbone (5050 CTs)
        url = "https://github.com/Project-MONAI/MONAI-extra-test-data/releases/download/0.8.1/model_swinvit.pt"
        
        weight_path = os.path.join(os.getcwd(), "model_swinvit.pt")
        
        try:
            if not os.path.exists(weight_path):
                print(f"Downloading pre-trained weights from {url}...")
                torch.hub.download_url_to_file(url, weight_path)
                
            print(f"Loading pre-trained weights from {weight_path}")
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            pretrained_state_dict = torch.load(weight_path, map_location=device)
            
            # The pre-trained weights are often just the encoder (backbone) or have different keys.
            # We need to be careful. The official 'model_swinvit.pt' is usually the backbone.
            # SwinUNETR has a 'swinViT' submodule.
            
            model_dict = self.swin_unetr.state_dict()
            
            # Filter out unnecessary keys and adjust if needed
            # For 'model_swinvit.pt', keys usually start with 'module.' or match swinViT directly.
            # Let's try to load into self.swin_unetr.swinViT
            
            # Check if keys match 'swinViT' prefix or need it
            new_state_dict = {}
            for k, v in pretrained_state_dict.items():
                if k in model_dict:
                    new_state_dict[k] = v
                elif "swinViT." + k in model_dict:
                     new_state_dict["swinViT." + k] = v
                # Also handle 'module.' prefix removal if present in file
                elif k.startswith("module.") and k[7:] in model_dict:
                    new_state_dict[k[7:]] = v
            
            # Update dict
            model_dict.update(new_state_dict)
            self.swin_unetr.load_state_dict(model_dict, strict=False)
            print("Pre-trained weights loaded successfully (Strict=False)")
            
        except Exception as e:
            print(f"Failed to load pre-trained weights: {e}")

    def forward(self, x):
        return self.swin_unetr(x)

def get_autoencoder_model(device, use_pretrained=False):
    model = SwinUNETRAutoencoder(use_pretrained=use_pretrained).to(device)
    return model
