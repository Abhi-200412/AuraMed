# AuraMed: AI-Powered Medical Anomaly Detection

## Overview

**AuraMed** is a comprehensive, next-generation medical imaging platform that leverages advanced AI to detect anomalies in 3D medical scans (CT/MRI) and 2D images (X-rays) with high precision. It features a hybrid decision system combining classification and segmentation models, along with an AI chatbot for medical explanations. 

The system leverages a microservices-lite architecture combining a high-performance **Next.js frontend** for 3D/2D visualization and a robust **Python/FastAPI backend** for deep learning inference.

## Key Features

- **X-Ray & CT Classification**: Detects conditions (like COVID/Pneumonia vs. Normal) using DenseNet121.
- **MRI & CT Segmentation**: Precise anomaly and tumor segmentation using SwinUNETR.
- **Deep Ensemble Inference**: High reliability utilizing Test Time Augmentation (TTA).
- **Interactive Visualization**: Modern, dark-themed medical dashboard with heatmaps and interactive scan viewing.
- **AI Medical Assistant**: Built-in chat interface powered by Ollama to explain findings.

## Technology Stack

- **Frontend**: Next.js 14 (React), TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python 3.11), Uvicorn
- **AI & Deep Learning**: MONAI, PyTorch 2.1.0 (CUDA), DenseNet121, SwinUNETR
- **Medical AI Assistant**: Ollama (Mistral)
- **Data Processing**: Nibabel, Numpy, Scipy

## Datasets

The models were trained and evaluated using the following datasets. You can download these datasets and place them in the `dataset/` directory for testing or further training.

- **Chest CT Images (Normal + COVID)**: 
  - [Kaggle Link](https://www.kaggle.com/datasets/plameneduardo/sarscov2-ctscan-dataset)
  - *Details*: Includes normal CT slices. Smaller dataset, useful for augmentation rather than primary training.
- **X-Rays (COVID, Pneumonia, Normal)**:
  - [Kaggle Link](https://www.kaggle.com/datasets/sachinkumar413/covid-pneumonia-normal-chest-xray-images)
- **Brain MRI Tumor Dataset**:
  - [Kaggle Link](https://www.kaggle.com/datasets/navoneel/brain-mri-images-for-brain-tumor-detection)

## Setup & Installation

### Prerequisites
- Windows 10/11 with NVIDIA GPU (CUDA supported & drivers installed)
- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.ai/) (for the Chatbot functionality)

### 1. Clone the repository
```bash
git clone <repo-url>
cd aura-med
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Ollama Setup
- Download and install [Ollama](https://ollama.ai/)
- Run the following command in your terminal to pull the language model:
  ```bash
  ollama run mistral
  ```

## Running the Application

### 1. Start Backend
From the root directory, start the FastAPI server:
```bash
uvicorn backend.api.main:app --reload
```
*(Alternatively, you can use the `start-dev.js` script to launch both services simultaneously).*

### 2. Start Frontend
Open a new terminal and run:
```bash
cd frontend
npm run dev
```

### 3. Access the Platform
- **Web Dashboard**: [http://localhost:3000](http://localhost:3000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Important Notes
- **GPU Usage**: The application strictly requires an NVIDIA GPU for SwinUNETR training and inference. Ensure CUDA drivers are installed correctly.
- **Data Privacy**: Ensure that any uploaded `.nii.gz` or `.dcm` (DICOM) files respect patient privacy and HIPAA compliance guidelines when running in production.
