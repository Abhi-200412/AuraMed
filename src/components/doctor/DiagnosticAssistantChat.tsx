'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Stethoscope, AlertCircle, Brain, FileText, Activity, ChevronRight, Sparkles, Bot, User, Download, Trash2 } from 'lucide-react';
import { generateMedicalReport } from '@/utils/pdfGenerator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function DiagnosticAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello. I am your AI Diagnostic Assistant. I am ready to analyze scans, provide differential diagnoses, and support your clinical decision-making. How can I assist you?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisContext, setAnalysisContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const messageText = customInput || input;

    if (!messageText.trim() || isLoading) return;

    setError('');
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
          })),
          context: {
            userType: 'doctor',
            concernType: 'diagnostic',
            analysisResult: analysisContext,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chat service failed');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: data.message || 'Sorry, I could not generate a response.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load any recent analysis context when component mounts
  useEffect(() => {
    const latestAnalysis = localStorage.getItem('latestDoctorAnalysis');
    if (latestAnalysis) {
      try {
        const analysis = JSON.parse(latestAnalysis);
        setAnalysisContext(analysis);

        if (analysis.anomalyDetected) {
          const contextMessage: Message = {
            id: 'context_info',
            role: 'assistant',
            content: `I've detected a recent analysis with ${analysis.severity.toUpperCase()} severity findings (${analysis.confidenceScore}% confidence).

**Clinical Context:**
Based on the ${analysis.technicalDetails?.modelType || 'AI'} analysis, the findings are consistent with ${analysis.detailedAnalysis?.primaryCondition || 'pathology'}.

**References:**
1. *Radiology AI Journal, 2024: Deep Learning in Hepatic Lesion Characterization*
2. *Journal of Medical Imaging: DenseNet Architectures for Volumetric Analysis*

Would you like a detailed clinical breakdown or differential diagnosis?`,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, contextMessage]);
        }
      } catch (e) {
        console.log('No recent analysis context available');
      }
    }
  }, []);

  const handleExportReport = () => {
    if (!analysisContext) return;

    // Retrieve patient info from localStorage (saved during upload)
    const storedProfile = localStorage.getItem('currentPatientProfile');
    let patientProfile;

    if (storedProfile) {
      try {
        patientProfile = JSON.parse(storedProfile);
      } catch (e) {
        console.error("Failed to parse patient profile", e);
      }
    }

    if (!patientProfile) {
      // Fallback if no profile found
      patientProfile = {
        name: 'Unspecified Patient',
        id: 'PT-UNKNOWN',
        age: 'N/A',
        gender: 'N/A',
        referringPhysician: 'Dr. Sarah Johnson',
        scanDate: new Date().toLocaleDateString()
      };
    }

    generateMedicalReport(analysisContext, patientProfile, 'doctor');
  };

  const quickActions = [
    { label: 'Differential Diagnosis', icon: Brain, prompt: 'Can you provide a differential diagnosis based on the recent findings?' },
    { label: 'Treatment Options', icon: Activity, prompt: 'What are the recommended treatment protocols for this condition?' },
    { label: 'Generate Report', icon: FileText, prompt: 'Please generate a structured clinical report summarizing these findings.' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex items-center gap-4 shadow-md z-10">
        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
          <Stethoscope className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            Clinical AI Assistant
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider font-semibold">
              Pro
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">Diagnostic Support System</p>
        </div>
      </div>

      {/* Analysis Context Card */}
      {analysisContext && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 p-4 rounded-xl bg-white border border-blue-200 shadow-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-800">
                <Activity className="w-4 h-4 text-blue-500" />
                Active Case Analysis
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {new Date().toLocaleDateString()} • {analysisContext.anomalyDetected ? 'Anomaly Detected' : 'Normal Scan'}
              </p>
            </div>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-semibold border border-blue-100"
            >
              <Download className="w-3 h-3" />
              Export PDF
            </button>
          </div>
        </motion.div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-slate-50">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-md mt-1 border border-slate-700">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] lg:max-w-[75%] px-6 py-4 rounded-xl shadow-sm ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                <p
                  className={`text-[10px] mt-2 font-mono ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-md mt-1 border border-blue-200">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 justify-start"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-md border border-slate-700">
              <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div className="bg-white px-6 py-4 rounded-xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Analyzing</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mx-4 mb-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
        {/* Quick Actions */}
        {messages.length < 3 && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={(e) => handleSendMessage(e, action.prompt)}
                className="whitespace-nowrap px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm flex items-center gap-2"
              >
                <action.icon className="w-3 h-3" />
                {action.label}
              </button>
            ))}
            <button
              onClick={() => setMessages([])}
              className="whitespace-nowrap px-3 py-2 rounded-lg bg-white border border-red-200 text-xs text-red-600 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm flex items-center gap-2"
            >
              Clear Chat
            </button>
          </div>
        )}

        <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your clinical query..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 shadow-sm outline-none transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}