'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Phone, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { DoctorMessaging } from '@/components/doctor/DoctorMessaging';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/50';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'low': return <AlertTriangle className="w-5 h-5 text-green-400" />;
      default: return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Patients</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Patient Anomalies</h1>
        <Link 
          href="/doctor/dashboard" 
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

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
      ) : patients.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Patient Anomalies</h3>
          <p className="text-text-secondary mb-4">
            No patients with detected anomalies. All scans appear normal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{patient.name}</h3>
                  <p className="text-text-secondary text-sm">ID: {patient.id}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(patient.severity)}`}>
                  {getSeverityIcon(patient.severity)}
                  <span className="capitalize">{patient.severity} Severity</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-text-secondary" />
                  <span className="text-text-secondary">Age:</span>
                  <span>{patient.age}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-text-secondary" />
                  <span className="text-text-secondary">Contact:</span>
                  <span>{patient.contact}</span>
                </div>
                
                {patient.email !== 'N/A' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">Email:</span>
                    <span>{patient.email}</span>
                  </div>
                )}
                
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-text-secondary mt-0.5" />
                  <div>
                    <span className="text-text-secondary">Address:</span>
                    <p>{patient.address}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Findings:</h4>
                <p className="text-sm text-text-secondary">{patient.findings}</p>
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <div>
                  <span className="text-text-secondary">Confidence:</span>
                  <span className="font-semibold ml-1">{patient.confidence}%</span>
                </div>
                <div>
                  <span className="text-text-secondary">Date:</span>
                  <span className="font-semibold ml-1">
                    {new Date(patient.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedPatient(patient)}
                  className="flex-1 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message Patient
                </button>
                <button className="px-3 py-2 rounded-lg border border-border/50 text-text-secondary text-sm font-medium hover:bg-surface-light transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}