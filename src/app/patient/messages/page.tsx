'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Home, Upload, ClipboardList, MessageSquare, Settings, Stethoscope, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientMessagesPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const sidebarItems = [
    { label: 'Dashboard', href: '/patient/dashboard', icon: <Home /> },
    { label: 'Upload Scan', href: '/patient/dashboard/upload', icon: <Upload /> },
    { label: 'Timeline', href: '/patient/dashboard/timeline', icon: <ClipboardList /> },
    { label: 'AI Chat', href: '/patient/dashboard/chat', icon: <Bot /> },
    { label: 'My Doctor', href: '/patient/doctor', icon: <Stethoscope /> },
    { label: 'Messages', href: '/patient/messages', icon: <MessageSquare /> },
    { label: 'Settings', href: '/patient/settings', icon: <Settings /> },
  ];

  useEffect(() => {
    // Mock doctors data for demonstration
    const mockDoctors = [
      {
        id: 'DOC-001',
        name: 'Dr. Sarah Johnson',
        specialty: 'Radiology',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        lastMessage: 'Your scan results look good. Let\'s schedule a follow-up in 6 months.',
        lastMessageTime: '2 hours ago',
        unread: 0
      },
      {
        id: 'DOC-002',
        name: 'Dr. Michael Chen',
        specialty: 'Hepatology',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        lastMessage: 'Thanks for sending your recent blood work. Everything looks normal.',
        lastMessageTime: '1 day ago',
        unread: 1
      },
      {
        id: 'DOC-003',
        name: 'Dr. Emily Rodriguez',
        specialty: 'General Medicine',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        lastMessage: 'Please remember to bring your medication list to our next appointment.',
        lastMessageTime: '3 days ago',
        unread: 0
      }
    ];

    setDoctors(mockDoctors);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-dark text-white">
        <Sidebar items={sidebarItems} userRole="patient" />
        <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-dark text-white">
      <Sidebar items={sidebarItems} userRole="patient" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          
          {selectedDoctor ? (
            <div className="space-y-6">
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
              >
                ← Back to Doctor List
              </button>
              <div className="glass rounded-xl p-6 border border-border/30">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border/30">
                  <img 
                    src={selectedDoctor.avatar} 
                    alt={selectedDoctor.name} 
                    className="w-12 h-12 rounded-full bg-surface-lighter"
                  />
                  <div>
                    <h2 className="font-bold text-lg">{selectedDoctor.name}</h2>
                    <p className="text-text-secondary">{selectedDoctor.specialty}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {/* Mock conversation */}
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-surface-lighter text-text-primary rounded-tl-none">
                      <p className="text-sm">Hello! I've reviewed your recent scan results.</p>
                      <p className="text-xs text-text-secondary mt-1">10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gradient-primary text-white rounded-tr-none">
                      <p className="text-sm">Thank you, Dr. What do the results show?</p>
                      <p className="text-xs text-white/70 mt-1">10:32 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-surface-lighter text-text-primary rounded-tl-none">
                      <p className="text-sm">Everything looks good. No anomalies detected. Your liver function appears normal.</p>
                      <p className="text-xs text-text-secondary mt-1">10:35 AM</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-surface-light border border-border/30 text-text-primary placeholder:text-text-secondary focus:border-primary outline-none transition-colors"
                  />
                  <button className="px-4 py-2 rounded-lg bg-gradient-primary text-white font-semibold hover:shadow-lg transition-all">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Doctor List */}
              <div className="lg:col-span-1">
                <div className="glass rounded-xl p-6 border border-border/30">
                  <h2 className="font-bold text-lg mb-4">Doctors</h2>
                  {doctors.length === 0 ? (
                    <p className="text-text-secondary text-center py-8">
                      No doctors available for messaging.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {doctors.map((doctor) => (
                        <motion.div
                          key={doctor.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDoctor(doctor)}
                          className="p-4 rounded-lg bg-surface-light hover:bg-surface-lighter cursor-pointer transition-colors border border-border/30"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={doctor.avatar} 
                              alt={doctor.name} 
                              className="w-10 h-10 rounded-full bg-surface-lighter"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{doctor.name}</h3>
                              <p className="text-sm text-text-secondary truncate">{doctor.specialty}</p>
                              <p className="text-xs text-text-tertiary truncate mt-1">
                                {doctor.lastMessageTime}
                              </p>
                            </div>
                            {doctor.unread > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {doctor.unread}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Message Placeholder */}
              <div className="lg:col-span-2">
                <div className="glass rounded-xl p-12 border border-border/30 h-full flex flex-col items-center justify-center text-center">
                  <MessageSquare className="w-16 h-16 text-text-secondary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Doctor</h3>
                  <p className="text-text-secondary max-w-md">
                    Choose a doctor from the list to start messaging. You can communicate with your healthcare providers about your scans and health concerns.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}