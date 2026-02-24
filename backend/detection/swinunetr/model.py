import torch
import torch.nn as nn


# -----------------------------------------
# 2D CT Autoencoder (SwinUNETR-inspired)
# -----------------------------------------
class CTAutoencoder(nn.Module):
    def __init__(self):
        super().__init__()

        # Encoder
        self.encoder = nn.Sequential(
            nn.Conv2d(1, 32, 3, stride=2, padding=1),  # 128 → 64
            nn.ReLU(),
            nn.Conv2d(32, 64, 3, stride=2, padding=1), # 64 → 32
            nn.ReLU(),
            nn.Conv2d(64, 128, 3, stride=2, padding=1),# 32 → 16
            nn.ReLU()
        )

        # Decoder
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(128, 64, 3, stride=2, padding=1, output_padding=1),
            nn.ReLU(),
            nn.ConvTranspose2d(64, 32, 3, stride=2, padding=1, output_padding=1),
            nn.ReLU(),
            nn.ConvTranspose2d(32, 1, 3, stride=2, padding=1, output_padding=1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.decoder(self.encoder(x))


# -----------------------------------------
# Loader
# -----------------------------------------
def get_autoencoder_model(device):
    model = CTAutoencoder().to(device)
    model.eval()
    return model
