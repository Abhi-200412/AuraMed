# AI Data Flow Architecture

This document explains the process of how the Conversational AI (Chatbot) receives and uses data from the Detection AI (Medical Analysis).

## 1. Detection Phase (Python/MONAI)
- **Source**: `src/services/monai/app.py`
- **Trigger**: When a patient uploads an image in `PatientUploadPortal`.
- **Process**: The Python service uses the generic `app.py` logic (and `SwinUNETR` model) to analyze the image.
- **Output**: It produces a JSON object containing:
    - `anomalyDetected`: Boolean (True/False)
    - `confidenceScore`: Number (0-100)
    - `findings`: Text summary
    - `severity`: String ('low', 'medium', 'high')
- **Transmission**: This JSON is sent back to the frontend via the API response.

## 2. Frontend Storage (React)
- **Component**: `src/components/patient/PatientUploadPortal.tsx` received the API response.
- **Action**: It saves the result to the browser's **Local Storage** to persist it across pages.
    - Key: `'latestAnalysisResult'`
    - Value: `JSON.stringify(analysisResult)`

## 3. Context Retrieval (Patient Chat)
- **Component**: `src/components/patient/PatientChat.tsx`
- **Trigger**: When the chat component mounts.
- **Action**: 
    1. It reads the data from `localStorage.getItem('latestAnalysisResult')`.
    2. It stores this in the component's state (`analysisContext`).
    3. When you send a message, it includes this context in the API request payload:
    ```javascript
    body: JSON.stringify({
      message: messageText,
      context: {
        analysisResult: analysisContext, // <--- Data passed here
        // ...
      },
    })
    ```

## 4. Prompt Engineering (AI Service)
- **Service**: `src/ai/conversational.ts`
- **Function**: `buildSystemPrompt(isDoctor, context)`
- **Logic**: It inspects `context.analysisResult.anomalyDetected`.
    - **If True (Anomaly)**: It constructs a system prompt instructing the LLM to be **"Empathetic, Consoling, and Protectively Gentle"**.
    - **If False (Normal)**: It constructs a system prompt instructing the LLM to be **"Cheerful, Upbeat, and Encouraging"**.
- **Execution**: This custom-tailored prompt is sent to the Large Language Model (Ollama or Gemini) to generate the final response.
