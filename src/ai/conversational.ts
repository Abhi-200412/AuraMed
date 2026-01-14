/**
 * Conversational AI Service for Patient Interactions
 * Supports Multi-Provider Architecture:
 * 1. Local LLM (Ollama) - Preferred (Free, Unlimited, Private)
 * 2. Google Gemini - Cloud Fallback
 * 3. Offline Simulation - Safety Net
 */

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatResponse {
  message: string;
  confidence: number;
  suggestedFollowUp?: string;
  resources?: Array<{ title: string; url: string }>;
  needsEscalation: boolean;
  provider: 'Ollama' | 'Gemini' | 'Offline';
}

// --- Configuration ---
const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama3';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

/**
 * Main Entry Point
 */
export async function generatePatientResponse(
  userMessage: string,
  conversationHistory: ConversationMessage[] = [],
  patientContext?: any
): Promise<ChatResponse> {
  const isDoctor = patientContext?.userType === 'doctor' || patientContext?.concernType === 'diagnostic';

  // 1. Try Local LLM (Ollama) first
  try {
    const ollamaResponse = await tryOllama(userMessage, conversationHistory, isDoctor, patientContext);
    if (ollamaResponse) {
      console.log('[AI Chat] Used Local LLM (Ollama)');
      return ollamaResponse;
    }
  } catch (e) {
    console.log('[AI Chat] Local LLM unavailable, switching to Cloud...');
  }

  // 2. Try Cloud LLM (Gemini)
  try {
    if (!GEMINI_API_KEY) throw new Error('No API Key');
    const geminiResponse = await tryGemini(userMessage, conversationHistory, isDoctor, patientContext);
    console.log('[AI Chat] Used Cloud LLM (Gemini)');
    return geminiResponse;
  } catch (e) {
    console.warn(`[AI Chat] Cloud API Error: ${e instanceof Error ? e.message : 'Unknown'}`);
  }

  // 3. Fallback to Offline Mode
  console.warn('[AI Chat] All AI providers failed. Engaging Offline Mode.');
  return generateOfflineResponse(userMessage, isDoctor, patientContext);
}

// --- Providers ---

async function tryOllama(
  userMessage: string,
  history: ConversationMessage[],
  isDoctor: boolean,
  context: any
): Promise<ChatResponse | null> {
  // Fast ping to see if Ollama is running
  try {
    const ping = await fetch(`${OLLAMA_URL}/api/tags`, { method: 'GET', signal: AbortSignal.timeout(1000) });
    if (!ping.ok) return null;
  } catch { return null; }

  const systemPrompt = buildSystemPrompt(isDoctor, context);

  // Convert to Ollama Message Format
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    { role: 'user', content: userMessage }
  ];

  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: messages,
      stream: false,
      options: {
        temperature: isDoctor ? 0.6 : 0.9,
        num_predict: isDoctor ? 1000 : 800
      }
    })
  });

  if (!response.ok) return null;

  const data = await response.json();
  return {
    message: data.message.content,
    confidence: 0.98,
    needsEscalation: checkEscalation(userMessage),
    suggestedFollowUp: undefined,
    provider: 'Ollama'
  };
}

async function tryGemini(
  userMessage: string,
  history: ConversationMessage[],
  isDoctor: boolean,
  context: any
): Promise<ChatResponse> {
  const systemPrompt = buildSystemPrompt(isDoctor, context);

  // Gemini Format
  const messages = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    ...history.slice(-15).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })),
    { role: 'user', parts: [{ text: userMessage }] }
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: isDoctor ? 0.6 : 0.9,
          maxOutputTokens: isDoctor ? 1000 : 800,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini status: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');

  return {
    message: text,
    confidence: 0.95,
    needsEscalation: checkEscalation(userMessage),
    provider: 'Gemini'
  };
}

function generateOfflineResponse(userMessage: string, isDoctor: boolean, context: any): ChatResponse {
  const lowerMsg = userMessage.toLowerCase();
  let message = "";

  if (isDoctor) {
    if (lowerMsg.includes('differential') || lowerMsg.includes('diagnosis')) {
      message = "Based on imaging: 1. Neoplastic (Primary/Metastatic), 2. Infectious, 3. Vascular. Correlate clinically.";
    } else {
      message = "Offline Mode: The scan indicates potential anomalies. Please review the detailed report.";
    }
  } else {
    // ... (existing logic) ...
    if (lowerMsg.includes('worry') || lowerMsg.includes('cancer')) {
      message = "I understand this is stressful. This is a screening result, not a final diagnosis. Please consult your doctor.";
    } else if (lowerMsg.includes('hello')) {
      message = "Hello! I'm your AI assistant. How can I help you today?";
    } else {
      message = "I'm currently offline, but I can see your scan results. Please show them to your doctor.";
    }
  }

  return {
    message,
    confidence: 0.5,
    needsEscalation: false,
    suggestedFollowUp: "Consult your doctor",
    provider: 'Offline'
  };
}

// --- Helpers ---

function checkEscalation(text: string): boolean {
  const keywords = ['emergency', 'chest pain', 'unconscious', 'bleeding', 'suicide'];
  return keywords.some(k => text.toLowerCase().includes(k));
}

function buildSystemPrompt(isDoctor: boolean, context: any): string {
  const basePrompt = isDoctor
    ? `ROLE: Expert Medical AI Consultant (Radiology Specialist).
TONE: Professional, Clinical, Precise, Concise.
OBJECTIVE: Assist the physician with differential diagnosis, treatment planning, and report generation based on the provided scan analysis.
CONSTRAINTS: 
- Use standard medical terminology.
- cite specific findings from the context.
- Structure responses with clear headings (e.g., "Differential Diagnosis", "Recommendations").
- Do NOT hallucinate findings not present in the context.
- If the scan is NORMAL, focus on reassurance and standard screening protocols.`
    : (() => {
      // Patient Mode: Dynamic Tone Adaptation
      const isAnomaly = context?.analysisResult?.anomalyDetected;

      if (isAnomaly) {
        return `ROLE: Empathetic, Consoling Personal Health Assistant.
TONE: Emotional, Consoling, Gentle, Reassuring.
OBJECTIVE: Provide emotional support while explaining the results. The patient may be scared.
CONSTRAINTS:
- Acknowledge their potential anxiety immediately.
- Use comforting language ("I know this is scary," "We are here to support you").
- Explain the findings gently but clearly.
- Emphasize that this is a screening, not a final diagnosis.
- Guide them firmly but compassionately to see a doctor.`;
      } else {
        return `ROLE: Cheerful, Encouraging Personal Health Assistant.
TONE: Upbeat, Positive, Normal, Enthusiastic.
OBJECTIVE: Celebrate the good news and encourage healthy habits.
CONSTRAINTS:
- Use positive reinforcement ("Great news!", "Your scan looks healthy").
- Focus on wellness and prevention.
- Keep the conversation light and friendly.
- Still recommend routine check-ups as standard practice.`;
      }
    })();

  let contextBlock = `\n\n--- CURRENT CASE CONTEXT ---`;

  if (context?.analysisResult) {
    const r = context.analysisResult;
    contextBlock += `\nSTATUS: ${r.anomalyDetected ? 'ANOMALY DETECTED' : 'NORMAL SCAN'}`;
    if (r.confidenceScore) contextBlock += `\nCONFIDENCE: ${r.confidenceScore}%`;
    if (r.severity) contextBlock += `\nSEVERITY: ${r.severity.toUpperCase()}`;
    if (r.anatomicalRegion) contextBlock += `\nREGION: ${r.anatomicalRegion}`;
    // Heatmap / Location (Crucial for Surgeon/Radiologist)
    if (r.heatmapAreas && r.heatmapAreas.length > 0) contextBlock += `\nPRECISE LOCATION: ${r.heatmapAreas.join(', ')}`;

    if (r.findings) contextBlock += `\nKEY FINDINGS: ${r.findings}`;

    // Detailed Analysis (Doctor Only)
    if (isDoctor && r.detailedAnalysis) {
      if (r.detailedAnalysis.primaryCondition) contextBlock += `\nSUSPECTED CONDITION: ${r.detailedAnalysis.primaryCondition}`;
      if (r.detailedAnalysis.differentialDiagnoses) {
        contextBlock += `\nDIFFERENTIAL DIAGNOSIS: ${r.detailedAnalysis.differentialDiagnoses.map((d: any) => `${d.condition} (${d.probability}%)`).join(', ')}`;
      }
    }

    // AI Vision Report (Llava)
    if (r.visionReport) contextBlock += `\nVIISON MODEL NOTE: "${r.visionReport}"`;

    if (r.recommendations && r.recommendations.length > 0) {
      contextBlock += `\nRECOMMENDED ACTIONS: ${r.recommendations.join('; ')}`;
    }
  } else {
    contextBlock += `\n(No specific scan data provided currently. Answer general questions.)`;
  }

  if (context?.patientProfile) {
    const p = context.patientProfile;
    contextBlock += `\nPATIENT: ${p.age || 'Unknown'}yo ${p.gender || ''}`;
  }

  return basePrompt + contextBlock;
}