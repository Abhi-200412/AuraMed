'use client';

import PatientChat from '@/components/patient/PatientChat';

export default function PatientChatPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Health Assistant</h1>
          <p className="text-text-secondary mt-2">
            Chat with your AI-powered health assistant for personalized medical insights
          </p>
        </div>
        
        <div className="glass rounded-xl p-6 h-[calc(100vh-200px)]">
          <PatientChat />
        </div>
      </div>
    </div>
  );
}