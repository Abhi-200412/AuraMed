'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { WellnessJourney } from '@/components/patient/WellnessJourney';
import { PatientNotifications } from '@/components/patient/PatientNotifications';
import { Home, Upload, ClipboardList, User, MessageSquare, Settings, Stethoscope, Bot } from 'lucide-react';

export default function PatientDashboard() {
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load patient information from localStorage
    const storedPatientInfo = localStorage.getItem('patientInfo');
    if (storedPatientInfo) {
      setPatientInfo(JSON.parse(storedPatientInfo));
    }
    setLoading(false);
  }, []);

  const sidebarItems = [
    { label: 'Dashboard', href: '/patient/dashboard', icon: <Home /> },
    { label: 'Upload Scan', href: '/patient/dashboard/upload', icon: <Upload /> },
    { label: 'Timeline', href: '/patient/dashboard/timeline', icon: <ClipboardList /> },
    { label: 'AI Chat', href: '/patient/dashboard/chat', icon: <Bot /> },
    { label: 'My Doctor', href: '/patient/doctor', icon: <Stethoscope /> },
    { label: 'Messages', href: '/patient/messages', icon: <MessageSquare /> },
    { label: 'Settings', href: '/patient/settings', icon: <Settings /> },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-dark text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-dark text-white">
      <Sidebar items={sidebarItems} userRole="patient" />
      <main className="flex-1 overflow-y-auto p-6 relative">
        {/* Patient Info Banner */}
        {patientInfo && (
          <div className="glass rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Welcome, {patientInfo.name}</h2>
              <p className="text-text-secondary">
                Age: {patientInfo.age} • Contact: {patientInfo.contact}
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary">Patient ID: PAT-{Math.floor(Math.random() * 10000)}</p>
              <p className="text-text-secondary text-sm">
                Last visit: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Notifications Bell */}
        <div className="absolute top-6 right-6 z-50">
          <PatientNotifications />
        </div>
        <WellnessJourney />
      </main>
    </div>
  );
}