import os
import uuid
import shutil
import torch
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from backend.detection.densenet.infer import predict_image
from backend.detection.swinunetr.model import get_autoencoder_model
from backend.detection.swinunetr.infer import run_ct_inference

# ------------------------------------------------------------------
# App initialization (ORDER MATTERS)
# ------------------------------------------------------------------

app = FastAPI(title="AuraMed AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
# Global config
# ------------------------------------------------------------------

UPLOAD_DIR = "temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)

CT_THRESHOLD = 0.03365  # your computed threshold

# Define device ONCE, globally
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ------------------------------------------------------------------
# API Endpoint
# ------------------------------------------------------------------

@app.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    modality: str = "xray"
):
    file_id = str(uuid.uuid4())
    path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"

    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        # -------------------------------
        # XRAY / MRI (Classification)
        # -------------------------------
        if modality in ["xray", "mri"]:

            model_path = (
                "backend/models/densenet_xray.pth"
                if modality == "xray"
                else "backend/models/densenet_mri.pth"
            )

            cls_prob = predict_image(path, model_path)
            abnormal_prob = cls_prob["abnormal"]

            result = {
                "modality": modality,
                "classification_confidence": float(abnormal_prob),
                "anomaly": bool(abnormal_prob > 0.9),
            }

            return result

        # -------------------------------
        # CT (Autoencoder Anomaly Detection)
        # -------------------------------
        elif modality == "ct":

            model = get_autoencoder_model(DEVICE)
            model.load_state_dict(
                torch.load(
                    "backend/models/ct_autoencoder.pth",
                    map_location=DEVICE,
                )
            )
            model.eval()

            score, anomaly_map = run_ct_inference(path, model, DEVICE)

            CT_THRESHOLD = 0.0026848210603930044

            anomaly = score > CT_THRESHOLD


            result = {
                "modality": "ct",
                "anomaly_score": float(score),
                "threshold": CT_THRESHOLD,
                "anomaly": anomaly,
                "decision": "abnormal" if anomaly else "normal",
                "note": "CT anomaly detection using SwinUNETR autoencoder",
            }

            return result

        else:
            return {
                "error": f"Unsupported modality: {modality}"
            }

    finally:
        # Optional: clean temp file after request
        if os.path.exists(path):
            os.remove(path)
