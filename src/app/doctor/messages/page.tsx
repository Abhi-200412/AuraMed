'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Home, Upload, ClipboardList, User, MessageSquare, Settings, BrainCircuit, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { DoctorMessaging } from '@/components/doctor/DoctorMessaging';

export default function DoctorMessagesPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const sidebarItems = [
    { label: 'Dashboard', href: '/doctor/dashboard', icon: <Home /> },
    { label: 'Upload Scan', href: '/doctor/dashboard/upload', icon: <Upload /> },
    { label: 'Analyze', href: '/doctor/dashboard/analyze', icon: <BrainCircuit /> },
    { label: 'AI Chat', href: '/doctor/dashboard/chat', icon: <Bot /> },
    { label: 'Patients', href: '/doctor/patients', icon: <User /> },
    { label: 'Messages', href: '/doctor/messages', icon: <MessageSquare /> },
    { label: 'Settings', href: '/doctor/settings', icon: <Settings /> },
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Try to get patients from API first
        const response = await fetch('/api/analyze');
        if (response.ok) {
          const data = await response.json();
          setPatients(data.patients || []);
        } else {
          // Fallback to localStorage
          const storedPatients = localStorage.getItem('doctorPatients');
          if (storedPatients) {
            setPatients(JSON.parse(storedPatients));
          }
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        // Fallback to localStorage
        const storedPatients = localStorage.getItem('doctorPatients');
        if (storedPatients) {
          setPatients(JSON.parse(storedPatients));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-dark text-white">
        <Sidebar items={sidebarItems} userRole="doctor" />
        <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-dark text-white">
      <Sidebar items={sidebarItems} userRole="doctor" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          
          {selectedPatient ? (
            <div className="space-y-6">
              <button 
                onClick={() => setSelectedPatient(null)}
                className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
              >
                ← Back to Patient List
              </button>
              <DoctorMessaging patient={selectedPatient} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient List */}
              <div className="lg:col-span-1">
                <div className="glass rounded-xl p-6 border border-border/30">
                  <h2 className="font-bold text-lg mb-4">Patients</h2>
                  {patients.length === 0 ? (
                    <p className="text-text-secondary text-center py-8">
                      No patients with anomalies detected yet.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {patients.map((patient) => (
                        <motion.div
                          key={patient.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedPatient(patient)}
                          className="p-4 rounded-lg bg-surface-light hover:bg-surface-lighter cursor-pointer transition-colors border border-border/30"
                        >
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-text-secondary">ID: {patient.id}</p>
                          <p className="text-xs text-text-tertiary mt-1">
                            {new Date(patient.timestamp).toLocaleDateString()}
                          </p>
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
                  <h3 className="text-xl font-semibold mb-2">Select a Patient</h3>
                  <p className="text-text-secondary max-w-md">
                    Choose a patient from the list to start messaging. You can communicate with patients who have had anomalies detected in their scans.
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