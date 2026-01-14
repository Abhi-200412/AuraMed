'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, AlertCircle, Sparkles, User, Bot, Brain, ChevronRight, Activity, Download, Trash2 } from 'lucide-react';
import { generateMedicalReport } from '@/utils/pdfGenerator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  provider?: 'Ollama' | 'Gemini' | 'Offline';
}



export default function PatientChat({
  patientContext,
}: {
  patientContext?: { condition?: string; lastAnalysis?: string };
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisContext, setAnalysisContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load analysis context from localStorage on mount
  useEffect(() => {
    const storedAnalysis = localStorage.getItem('latestAnalysisResult');
    const storedDoctor = localStorage.getItem('assignedDoctor');

    if (storedAnalysis) {
      const analysis = JSON.parse(storedAnalysis);
      setAnalysisContext({
        ...analysis,
        doctor: storedDoctor ? JSON.parse(storedDoctor) : null,
      });
      // Default welcome if no analysis
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your personal AI Health Assistant. I can help explain medical terms, discuss symptoms, or guide you through your wellness journey. How can I help you today?",
        timestamp: Date.now(),
      }]);
    }

    // Check for any unread notifications
    const storedNotifications = localStorage.getItem('patientNotifications');
    if (storedNotifications) {
      const notifications = JSON.parse(storedNotifications);
      const unreadNotifications = notifications.filter((n: any) => !n.read);

      // Mark notifications as read since user is now viewing them
      if (unreadNotifications.length > 0) {
        const updatedNotifications = notifications.map((n: any) => ({ ...n, read: true }));
        localStorage.setItem('patientNotifications', JSON.stringify(updatedNotifications));
      }
    }
  }, []);

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
            ...patientContext,
            userType: 'patient',
            analysisResult: analysisContext,
            hasRecentScan: !!analysisContext,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chat service failed');
      }

      const data = await response.json();
      const aiResponse = data.response || data;

      const assistantMessage: Message = {
        id: aiResponse.messageId || `msg_${Date.now()}`,
        role: 'assistant',
        content: aiResponse.message || 'Sorry, I could not generate a response.',
        timestamp: Date.now(),
        provider: aiResponse.provider,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Check if escalation needed
      if (aiResponse.needsEscalation) {
        setError('⚠️ URGENT: Emergency assistance needed. Please contact emergency services or your healthcare provider immediately.');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!analysisContext) return;
    // ... existing logic ...
    const patientProfile = {
      name: 'John Doe',
      id: 'PT-2024-001',
      age: 34,
      gender: 'Male',
      scanDate: new Date().toLocaleDateString()
    };
    generateMedicalReport(analysisContext, patientProfile, 'patient');
  };

  // Appointment Logic
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    doctorId: 'DOC-001',
    date: '',
    time: '09:00 AM'
  });

  const submitAppointment = async () => {
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: 'John Doe', // Mock
          doctorId: bookingData.doctorId,
          date: bookingData.date,
          time: bookingData.time,
          reason: 'AI Assistant Referral'
        })
      });
      setIsBooking(false);
      setMessages(prev => [...prev, {
        id: `sys_${Date.now()}`,
        role: 'assistant',
        content: `✅ Appointment Requested!\n\nI've sent a request to Dr. ${bookingData.doctorId === 'DOC-001' ? 'Johnson' : 'Chen'} for ${bookingData.date} at ${bookingData.time}. You will receive a confirmation shortly.`,
        timestamp: Date.now()
      }]);
    } catch (e) {
      setError('Failed to book appointment');
    }
  };

  const suggestions = [
    "Explain my results simply",
    "What are the next steps?",
    "Should I be worried?",
    "Dietary recommendations"
  ];

  return (
    <div className="h-full flex flex-col bg-surface-light/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/90 to-secondary/90 p-4 flex items-center gap-4 shadow-md z-10">
        <div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            AuraMed Assistant
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          </h2>
          <p className="text-xs text-white/80 font-medium">AI-Powered • 24/7 Support</p>
        </div>
      </div>

      {/* Analysis Summary Card (If context exists) */}
      {analysisContext && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 p-4 rounded-xl bg-surface-light/50 border border-primary/20 backdrop-blur-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2 text-primary">
                <Activity className="w-4 h-4" />
                Latest Scan Analysis
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {new Date().toLocaleDateString()} • {analysisContext.anomalyDetected ? 'Anomaly Detected' : 'Normal Scan'}
              </p>
            </div>

            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-semibold"
            >
              <Download className="w-3 h-3" />
              Report
            </button>
          </div>
        </motion.div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] lg:max-w-[75%] px-5 py-3.5 rounded-2xl shadow-sm ${message.role === 'user'
                  ? 'bg-gradient-to-br from-primary to-primary/90 text-white rounded-tr-none'
                  : 'bg-white/80 backdrop-blur-md text-text-primary border border-white/40 rounded-tl-none'
                  }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p
                    className={`text-[10px] font-medium ${message.role === 'user' ? 'text-white/70' : 'text-text-tertiary'
                      }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>

                  {/* Provider Badge */}
                  {message.role === 'assistant' && message.provider && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 border ${message.provider === 'Ollama' ? 'bg-green-100 text-green-700 border-green-200' :
                      message.provider === 'Gemini' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                      {message.provider === 'Ollama' && '⚡ Local'}
                      {message.provider === 'Gemini' && '☁️ Cloud'}
                      {message.provider === 'Offline' && '📡 Offline'}
                    </span>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-md mt-1">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white/50 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-none border border-white/20 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
      <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/20">
        {/* Suggestions */}
        {messages.length < 3 && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={(e) => handleSendMessage(e, suggestion)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/50 border border-white/30 text-xs text-text-secondary hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all shadow-sm"
              >
                {suggestion}
              </button>
            ))}
            <button
              onClick={() => setIsBooking(true)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-blue-50/50 border border-blue-200/50 text-xs text-blue-600 hover:bg-blue-100/50 hover:border-blue-300 transition-all shadow-sm flex items-center gap-1"
            >
              <Activity className="w-3 h-3" />
              Book Appointment
            </button>
            <button
              onClick={() => setMessages([])}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-red-50/50 border border-red-200/50 text-xs text-red-500 hover:bg-red-100/50 hover:border-red-300 transition-all shadow-sm flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Reset
            </button>
          </div>
        )}

        <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health question..."
            className="flex-1 bg-white/70 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-text-tertiary shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>


      {/* Appointment Modal */}
      <AnimatePresence>
        {isBooking && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Schedule Appointment
                </h3>
                <button onClick={() => setIsBooking(false)} className="text-slate-400 hover:text-slate-600">×</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Specialist</label>
                  <select
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                    value={bookingData.doctorId}
                    onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                  >
                    <option value="DOC-001">Dr. Sarah Johnson (Radiologist)</option>
                    <option value="DOC-002">Dr. Michael Chen (Oncologist)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                    <select
                      className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    >
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>02:00 PM</option>
                      <option>04:00 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={submitAppointment}
                  disabled={!bookingData.date}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  Confirm Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div >
  );
}