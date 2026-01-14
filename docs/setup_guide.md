# AuraMed - Setup & Installation Guide

This comprehensive guide describes how to completely set up the **AuraMed** AI-Powered Medical Imaging Platform on a new device.

---

## 1. System Requirements

*   **Operating System**: Windows 10/11, macOS, or Linux (Ubuntu 20.04+).
*   **RAM**: Minimum 16GB (Recommended for 3D Medical Imaging).
*   **GPU (Optional)**: NVIDIA GPU with CUDA support is highly recommended for faster AI analysis, but the system will fallback to CPU if unavailable.
*   **Disk Space**: ~10GB free space (for dependencies, models, and Docker images).

---

## 2. Prerequisites

Before installing the application, ensure you have the following software installed on your machine:

### 2.1 Developer Tools
1.  **Git**: [Download Git](https://git-scm.com/downloads)
    *   *Verify*: `git --version`
2.  **Node.js**: Version 18.x or 20.x (LTS recommended)
    *   [Download Node.js](https://nodejs.org/)
    *   *Verify*: `node --version && npm --version`
3.  **Python**: **Version 3.11** (Strict Requirement for MONAI/Torch compatibility)
    *   [Download Python 3.11](https://www.python.org/downloads/release/python-3110/)
    *   *Verify*: `python --version` (Should say 3.11.x)

### 2.2 Local AI Setup (Crucial)
AuraMed uses **Ollama** to run local Large Language Models for chat privacy and vision analysis.

1.  **Download Ollama**: Visit [ollama.com](https://ollama.com) and install it.
2.  **Pull Required Models**:
    Open your terminal (PowerShell or Bash) and run:
    ```bash
    ollama pull llama3
    ollama pull llava
    ```
    *   `llama3`: Handles Patient/Doctor Chat interactions.
    *   `llava`: performing Visual Question Answering (VQA) on medical images.
3.  **Verify Service**: Ensure Ollama is running in the background (Check system tray or run `ollama serve`).

---

## 3. Installation Guide

### 3.1 Clone the Repository
```bash
git clone <repository_url>
cd aura-med
```

### 3.2 Environment Configuration
Create a `.env` file in the root directory. You can copy the example:
```bash
cp .env.example .env
```
**Required Variables**:
*   `NEXT_PUBLIC_GEMINI_API_KEY`: (Optional) Fallback for AI Chat if Ollama is unavailable. Get one from [Google AI Studio](https://aistudio.google.com/).

### 3.3 Frontend Installation
Install the JavaScript dependencies:
```bash
npm install
```
*   *Note*: If you see `EACCES` errors on Mac/Linux, use `sudo` or check your npm permissions.

### 3.4 Backend Installation (Python)
We strictly enforce a virtual environment to prevent dependency conflicts.

1.  **Create Virtual Environment (.venv_311)**:
    *   **Windows**:
        ```powershell
        python -3.11 -m venv .venv_311
        ```
    *   **Mac/Linux**:
        ```bash
        python3.11 -m venv .venv_311
        ```

2.  **Activate Environment**:
    *   **Windows (PowerShell)**:
        ```powershell
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
        .\.venv_311\Scripts\Activate.ps1
        ```
    *   **Mac/Linux**:
        ```bash
        source .venv_311/bin/activate
        ```

3.  **Install Dependencies**:
    ```bash
    pip install --upgrade pip
    pip install -r requirements.txt
    ```

    > **GPU Users**: PyTorch installs the CPU version by default. To enable CUDA, run:
    > `pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118` (Adjust `cu118` to your CUDA version).

---

## 4. Running the Application

### Option A: valid All-in-One CLI (Recommended)
This command launches both the Next.js frontend and the Python backend in parallel.

```bash
npm run dev-all
```
*   **Web App**: [http://localhost:3000](http://localhost:3000)
*   **API Server**: [http://localhost:8000](http://localhost:8000)

### Option B: Manual Startup
Run services in separate terminals for better debugging.

**Terminal 1: Backend**
```bash
# Activate Env first!
.\.venv_311\Scripts\Activate  # Windows
source .venv_311/bin/activate # Mac/Linux

python src/services/monai/app.py
```

**Terminal 2: Frontend**
```bash
npm run dev
```

---

## 5. Troubleshooting Common Issues

### "Python not found" or "Spawn Error"
*   **Cause**: The startup script (`start-dev.js`) expects the virtual environment to be named exactly `.venv_311`.
*   **Fix**: Ensure you created the venv with that name. If you used a different name, edit `start-dev.js` or rename your folder.

### "ModuleNotFoundError: No module named 'monai'"
*   **Cause**: Dependencies were installed globally or in the wrong environment.
*   **Fix**: ensure `.venv_311` is active (`(venv)` should appear in your terminal prompt) before running `pip install -r requirements.txt`.

### "Ollama Connection Refused"
*   **Cause**: Ollama is not running.
*   **Fix**: Open a new terminal and type `ollama serve`. Keep this window open.

### Port Conflicts (EADDRINUSE)
*   **Cause**: Another application is using port 3000 or 8000.
*   **Fix**: Kill the processes:
    *   **Windows**: `netstat -ano | findstr :8000` -> `taskkill /PID <PID> /F`
    *   **Mac/Linux**: `lsof -i :8000` -> `kill -9 <PID>`

### Slow Analysis?
*   **Reason**: First-time analysis might be slow as models load into memory.
*   **Solution**: Ensure you are using a Machine with reasonable RAM. If on CPU, analysis of 3D NIfTI files can take 10-20 seconds.

---

## 6. Accessing the Application
1.  **Doctor Portal**: `/dashboard` - Upload medical scans (NIfTI/DICOM) for professional analysis.
2.  **Patient Portal**: `/` (Home) - Review results, chat with the AI assistant, and upload basic images.
