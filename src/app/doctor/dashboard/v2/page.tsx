'use client';

import { Sidebar } from '@/components/shared/Sidebar';
import { MissionControl } from '@/components/doctor/v2/MissionControl';
import { Home, Upload, ClipboardList, User, MessageSquare, Settings } from 'lucide-react';

export default function DoctorDashboardV2() {
  const sidebarItems = [
    { label: 'Dashboard', href: '/doctor/dashboard/v2', icon: <Home /> },
    { label: 'Upload Scan', href: '#', icon: <Upload /> },
    { label: 'Review Queue', href: '#', icon: <ClipboardList /> },
    { label: 'Patients', href: '#', icon: <User /> },
    { label: 'Messages', href: '#', icon: <MessageSquare /> },
    { label: 'Settings', href: '#', icon: <Settings /> },
  ];

  return (
    <div className="flex h-screen bg-gradient-dark text-white">
      <Sidebar items={sidebarItems} userRole="doctor" />
      <main className="flex-1 overflow-y-auto">
        <MissionControl />
      </main>
    </div>
  );
}
