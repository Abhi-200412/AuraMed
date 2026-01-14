'use client';

import { motion } from 'framer-motion';
import { FileText, Calendar } from 'lucide-react';

const timelineEvents = [
  { id: 1, date: '2024-07-15', title: 'Annual Check-up', description: 'Routine check-up with Dr. Smith. All clear.' },
  { id: 2, date: '2024-05-20', title: 'MRI Scan', description: 'MRI of the knee. Report available.' },
  { id: 3, date: '2024-02-10', title: 'Blood Test', description: 'Routine blood work. Results normal.' },
];

export function InteractiveHealthTimeline() {
  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center"><Calendar className="mr-3 text-primary" /> Health Timeline</h2>
      <div className="relative border-l-2 border-primary/30 ml-3">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="mb-8 pl-8"
          >
            <div className="absolute -left-3.5 mt-1.5 w-6 h-6 bg-primary rounded-full border-4 border-dark"></div>
            <p className="text-sm text-text-secondary">{event.date}</p>
            <h3 className="text-lg font-bold flex items-center"><FileText size={18} className="mr-2" /> {event.title}</h3>
            <p className="text-text-secondary">{event.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
