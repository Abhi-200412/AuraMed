
import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral" # or llama3

def get_medical_explanation(prompt: str, context: str = ""):
    """
    Query local Ollama instance.
    """
    full_prompt = f"Context: {context}\n\nQuestion: {prompt}\n\nPlease explain in safe medical terms. Include a disclaimer."
    
    payload = {
        "model": MODEL_NAME,
        "prompt": full_prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        return response.json().get("response", "Error getting response from AI.")
    except Exception as e:
        return f"Error communicating with Ollama: {str(e)}"
