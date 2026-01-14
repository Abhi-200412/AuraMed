'use client';

import { motion } from 'framer-motion';
import { FileText, Calendar, Activity, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  type: 'checkup' | 'scan' | 'test' | 'other';
}

const defaultEvents: TimelineEvent[] = [
  { id: 1, date: '2024-07-15', title: 'Annual Check-up', description: 'Routine check-up with Dr. Smith. All clear.', type: 'checkup' },
  { id: 2, date: '2024-05-20', title: 'MRI Scan', description: 'MRI of the knee. Report available.', type: 'scan' },
  { id: 3, date: '2024-02-10', title: 'Blood Test', description: 'Routine blood work. Results normal.', type: 'test' },
];

export function InteractiveHealthTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(defaultEvents);

  useEffect(() => {
    // Check for recent analysis in localStorage to add to timeline
    const storedAnalysis = localStorage.getItem('latestDoctorAnalysis');
    const storedPatientInfo = localStorage.getItem('patientInfo');

    if (storedAnalysis && storedPatientInfo) {
      try {
        const analysis = JSON.parse(storedAnalysis);
        const patient = JSON.parse(storedPatientInfo);

        // Check if this event is already in the list (simple check by date/title)
        const newEventDate = new Date().toISOString().split('T')[0];
        const newEventTitle = `AI Analysis: ${patient.fileName || 'Medical Scan'}`;

        const exists = events.some(e => e.date === newEventDate && e.title === newEventTitle);

        if (!exists) {
          const newEvent: TimelineEvent = {
            id: Date.now(),
            date: newEventDate,
            title: newEventTitle,
            description: analysis.anomalyDetected
              ? `Analysis detected potential anomalies. ${analysis.findings.substring(0, 50)}...`
              : 'No anomalies detected. Routine monitoring recommended.',
            type: 'scan'
          };

          setEvents(prev => [newEvent, ...prev]);
        }
      } catch (e) {
        console.error("Error parsing stored analysis for timeline", e);
      }
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'checkup': return <Calendar size={18} className="mr-2" />;
      case 'scan': return <Activity size={18} className="mr-2" />;
      case 'test': return <FileText size={18} className="mr-2" />;
      default: return <CheckCircle size={18} className="mr-2" />;
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center"><Calendar className="mr-3 text-primary" /> Health Timeline</h2>
      <div className="relative border-l-2 border-primary/30 ml-3">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="mb-8 pl-8"
          >
            <div className={`absolute -left-3.5 mt-1.5 w-6 h-6 rounded-full border-4 border-dark ${event.type === 'scan' ? 'bg-secondary' : 'bg-primary'
              }`}></div>
            <p className="text-sm text-text-secondary">{event.date}</p>
            <h3 className="text-lg font-bold flex items-center">
              {getIcon(event.type)}
              {event.title}
            </h3>
            <p className="text-text-secondary">{event.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
