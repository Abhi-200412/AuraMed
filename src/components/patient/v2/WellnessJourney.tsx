'use client';

import { motion } from 'framer-motion';
import { ProgressTracker } from './ProgressTracker';
import { InteractiveHealthTimeline } from './InteractiveHealthTimeline';
import { AIWellnessGuide } from './AIWellnessGuide';

export function WellnessJourney() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-xl p-6"
      >
        <h1 className="text-3xl font-bold">Your Wellness Journey</h1>
        <p className="text-text-secondary">Track your progress, get insights, and stay healthy.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <InteractiveHealthTimeline />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <ProgressTracker />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <AIWellnessGuide />
        </motion.div>
      </div>
    </div>
  );
}
