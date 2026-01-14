'use client';

import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export function WelcomeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary to-primary/70 text-white p-6 rounded-xl shadow-lg flex justify-between items-center"
    >
      <div>
        <h2 className="text-2xl font-bold">Welcome back, Dr. Smith</h2>
        <p className="text-sm opacity-80">Here's a summary of your recent activity.</p>
      </div>
      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
        <BrainCircuit size={48} />
      </motion.div>
    </motion.div>
  );
}
