'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, User, FileText } from 'lucide-react';

const triageItems = [
  { id: 1, patient: 'John Doe', issue: 'Potential anomaly detected in recent scan.', priority: 'High' },
  { id: 2, patient: 'Jane Smith', issue: 'Contradictory lab results require review.', priority: 'High' },
  { id: 3, patient: 'Peter Jones', issue: 'Patient reported severe symptoms.', priority: 'Medium' },
  { id: 4, patient: 'Mary Johnson', issue: 'Follow-up required for medication adjustment.', priority: 'Low' },
];

export function AIPoweredTriage() {
  return (
    <div className="glass rounded-xl p-6 h-full">
      <div className="flex items-center mb-4">
        <AlertTriangle className="text-warning mr-3" size={24} />
        <h2 className="text-2xl font-bold">AI-Powered Triage</h2>
      </div>
      <p className="text-text-secondary mb-6">AI-flagged priorities requiring your attention.</p>
      <div className="space-y-4">
        {triageItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-surface-light/50 p-4 rounded-lg flex items-start"
          >
            <div className={`w-2 h-12 rounded-full mr-4 ${item.priority === 'High' ? 'bg-danger' : item.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`}></div>
            <div>
              <p className="font-bold flex items-center"><User size={16} className="mr-2" /> {item.patient}</p>
              <p className="text-sm text-text-secondary flex items-center"><FileText size={16} className="mr-2" /> {item.issue}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
