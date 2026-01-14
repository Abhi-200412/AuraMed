'use client';

import { Sidebar } from '@/components/shared/Sidebar';
import { WellnessJourney } from '@/components/patient/v2/WellnessJourney';
import { Home, Upload, ClipboardList, User, MessageSquare, Settings, Stethoscope } from 'lucide-react';

export default function PatientDashboardV2() {
  const sidebarItems = [
    { label: 'Dashboard', href: '/patient/dashboard/v2', icon: <Home /> },
    { label: 'Upload Scan', href: '#', icon: <Upload /> },
    { label: 'My Reports', href: '#', icon: <ClipboardList /> },
    { label: 'My Doctor', href: '#', icon: <Stethoscope /> },
    { label: 'Messages', href: '#', icon: <MessageSquare /> },
    { label: 'Settings', href: '#', icon: <Settings /> },
  ];

  return (
    <div className="flex h-screen bg-gradient-dark text-white">
      <Sidebar items={sidebarItems} userRole="patient" />
      <main className="flex-1 overflow-y-auto">
        <WellnessJourney />
      </main>
    </div>
  );
}
