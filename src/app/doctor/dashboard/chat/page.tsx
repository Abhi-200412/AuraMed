'use client';

import { DiagnosticAssistantChat } from '@/components/doctor/DiagnosticAssistantChat';

export default function DoctorChatPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Diagnostic Assistant</h1>
          <p className="text-text-secondary mt-2">
            Professional medical insights and analysis for diagnostic support
          </p>
        </div>
        
        <div className="glass rounded-xl p-6 h-[calc(100vh-200px)]">
          <DiagnosticAssistantChat />
        </div>
      </div>
    </div>
  );
}