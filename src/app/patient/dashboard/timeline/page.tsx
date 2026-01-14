'use client';

import { Sidebar } from '@/components/shared/Sidebar';
import { HealthReportTimeline } from '@/components/patient/HealthReportTimeline';
import { Home, Upload, ClipboardList, MessageSquare, Settings, Stethoscope, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientTimelinePage() {
  const sidebarItems = [
    { label: 'Dashboard', href: '/patient/dashboard', icon: <Home /> },
    { label: 'Upload Scan', href: '/patient/dashboard/upload', icon: <Upload /> },
    { label: 'Timeline', href: '/patient/dashboard/timeline', icon: <ClipboardList /> },
    { label: 'AI Chat', href: '/patient/dashboard/chat', icon: <Bot /> },
    { label: 'My Doctor', href: '/patient/doctor', icon: <Stethoscope /> },
    { label: 'Messages', href: '/patient/messages', icon: <MessageSquare /> },
    { label: 'Settings', href: '/patient/settings', icon: <Settings /> },
  ];

  return (
    <div className="flex h-screen bg-gradient-dark text-white">
      <Sidebar items={sidebarItems} userRole="patient" />
      <main className="flex-1 overflow-y-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <HealthReportTimeline />
        </motion.div>
      </main>
    </div>
  );
}
