'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function EmpatheticAICompanion() {
  const [showSupport, setShowSupport] = useState(false);
  const [hasAnomaly] = useState(true); // Simulating anomaly detection

  const resources = [
    { title: 'Mental Health Support', link: '#' },
    { title: 'Medical Glossary', link: '#' },
    { title: 'Support Groups', link: '#' },
    { title: 'Wellness Resources', link: '#' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="text-6xl">🤖</div>
        <div>
          <h2 className="text-2xl font-bold">Your AI Companion</h2>
          <p className="text-text-secondary">Here to help you understand your health</p>
        </div>
      </div>

      <div className="bg-surface-light/30 rounded-lg p-6 mb-6">
        <p className="text-lg leading-relaxed mb-4">
          {hasAnomaly
            ? "I noticed something in your latest scan that your doctor flagged. While this might feel concerning, remember that early detection is a positive step towards your recovery. Your doctor will guide you through the next steps."
            : "Great news! Your latest scan came back normal. Keep up with your regular checkups and healthy lifestyle!"}
        </p>
      </div>

      {hasAnomaly && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowSupport(!showSupport)}
          className="w-full px-4 py-2 rounded-lg bg-secondary text-white hover:shadow-lg transition-all font-semibold mb-6"
        >
          💚 I need emotional support
        </motion.button>
      )}

      {showSupport && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 mb-6"
        >
          <h3 className="font-bold text-lg mb-4">Supportive Resources</h3>
          <p className="text-text-secondary mb-4">
            It's completely normal to feel anxious about medical findings. Here are some resources that might help:
          </p>
          <div className="space-y-2">
            {resources.map((resource, index) => (
              <motion.a
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                href={resource.link}
                className="block p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors text-secondary font-medium"
              >
                → {resource.title}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button className="px-4 py-2 rounded-lg bg-surface-light hover:bg-surface-light/70 transition-colors">
          📞 Contact Doctor
        </button>
        <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
          💬 Chat with AI
        </button>
      </div>
    </motion.div>
  );
}
