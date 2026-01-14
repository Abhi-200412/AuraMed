"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Send, Bot, User, FileUp, CheckCircle, Loader2, X } from "lucide-react";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section className={`py-20 px-4 ${className}`}>
        <div className="container-custom">{children}</div>
    </section>
);

export const DemoSection = () => {
    const [step, setStep] = useState<'upload' | 'analyzing' | 'chat'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
        { role: 'bot', content: "Hello! I've analyzed your scan. I detected a potential anomaly in the liver region with 98.2% confidence. How can I assist you further?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            startAnalysis();
        }
    };

    const startAnalysis = () => {
        setStep('analyzing');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            setAnalysisProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setStep('chat');
            }
        }, 50);
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessages = [...messages, { role: 'user' as const, content: inputValue }];
        setMessages(newMessages);
        setInputValue("");

        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: "Based on the scan analysis, the highlighted region shows density variations consistent with early-stage fatty liver disease. I recommend consulting with a specialist for a comprehensive evaluation."
            }]);
        }, 1000);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Section className="bg-surface-light/30 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">Live Demo</span>
                    <h2 className="text-4xl font-bold mb-4 text-gradient">Experience AuraMed AI</h2>
                    <p className="text-text-secondary text-lg">Try our advanced diagnostic tool right now. Upload a scan and chat with our AI.</p>
                </div>

                <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                    {/* Header */}
                    <div className="bg-surface-light/50 p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="text-sm text-text-tertiary font-mono">AuraMed AI Diagnostic Interface v2.0</div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
                        <AnimatePresence mode="wait">
                            {step === 'upload' && (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="w-full max-w-md"
                                >
                                    <label
                                        htmlFor="demo-upload"
                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:bg-primary/5 hover:border-primary transition-all group"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="w-8 h-8 text-primary" />
                                            </div>
                                            <p className="mb-2 text-lg font-semibold text-text-primary">Click to upload scan</p>
                                            <p className="text-sm text-text-secondary">or drag and drop .nii.gz file</p>
                                        </div>
                                        <input id="demo-upload" type="file" className="hidden" onChange={handleFileChange} accept=".nii.gz,.nii" />
                                    </label>
                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-text-tertiary mb-2">Don't have a file?</p>
                                        <button
                                            onClick={startAnalysis}
                                            className="text-primary hover:underline text-sm font-medium"
                                        >
                                            Use sample liver scan
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'analyzing' && (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="w-full max-w-md text-center"
                                >
                                    <div className="relative w-32 h-32 mx-auto mb-8">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <circle
                                                className="text-surface-light stroke-current"
                                                strokeWidth="8"
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="transparent"
                                            />
                                            <circle
                                                className="text-primary stroke-current transition-all duration-300 ease-linear"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="transparent"
                                                strokeDasharray="251.2"
                                                strokeDashoffset={251.2 - (251.2 * analysisProgress) / 100}
                                                transform="rotate(-90 50 50)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-primary">{analysisProgress}%</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Analyzing Scan...</h3>
                                    <p className="text-text-secondary">Detecting anomalies and generating report</p>
                                    <div className="mt-8 space-y-2 text-left max-w-xs mx-auto">
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            {analysisProgress > 20 ? <CheckCircle className="w-4 h-4 text-success" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                            <span>Loading volumetric data</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            {analysisProgress > 50 ? <CheckCircle className="w-4 h-4 text-success" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                            <span>Applying Swin UNETR model</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            {analysisProgress > 80 ? <CheckCircle className="w-4 h-4 text-success" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                            <span>Generating diagnostic insights</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'chat' && (
                                <motion.div
                                    key="chat"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full h-full flex flex-col"
                                >
                                    <div className="flex-1 overflow-y-auto space-y-4 p-4 max-h-[400px] custom-scrollbar">
                                        {messages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                                                        {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                                                    </div>
                                                    <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-light text-text-primary rounded-tl-none'}`}>
                                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>
                                    <div className="p-4 border-t border-white/10 bg-surface-light/30">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Ask about the analysis..."
                                                className="flex-1 bg-surface border border-white/10 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                            >
                                                <Send size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </Section>
    );
};
