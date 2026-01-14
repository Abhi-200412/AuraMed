'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Award, Target } from 'lucide-react';

const achievements = [
  { id: 1, name: 'First Scan Uploaded', achieved: true },
  { id: 2, name: 'Health Profile Complete', achieved: true },
  { id: 3, name: 'First Health Report Reviewed', achieved: false },
  { id: 4, name: 'Three Consecutive Healthy Check-ins', achieved: false },
];

export function ProgressTracker() {
  const progress = (achievements.filter(a => a.achieved).length / achievements.length) * 100;

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center"><Target className="mr-3 text-primary" /> Your Progress</h2>
      <div className="w-full bg-surface-light/50 rounded-full h-4 mb-4">
        <motion.div
          className="bg-primary h-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <p className="text-text-secondary mb-6 text-right">{Math.round(progress)}% complete</p>
      <h3 className="text-xl font-bold mb-4 flex items-center"><Award className="mr-3 text-warning" /> Achievements</h3>
      <div className="space-y-3">
        {achievements.map((ach, index) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            className={`flex items-center ${ach.achieved ? 'text-white' : 'text-text-secondary'}`}
          >
            <CheckCircle className={`mr-3 ${ach.achieved ? 'text-success' : 'text-text-secondary/50'}`} />
            <span>{ach.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
