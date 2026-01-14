'use client';

import { motion } from 'framer-motion';
import { Bot, Lightbulb, Heart } from 'lucide-react';

const tips = [
  "Remember to stay hydrated today!",
  "A short walk can do wonders for your mood and energy levels.",
  "Don't forget to take your medication as prescribed.",
  "A balanced diet is key to a healthy life.",
];

export function AIWellnessGuide() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="glass rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Bot className="text-primary mr-3" size={24} />
        <h2 className="text-2xl font-bold">AI Wellness Guide</h2>
      </div>
      <p className="text-text-secondary mb-6">Your personal guide to a healthier life.</p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-primary/20 p-4 rounded-lg flex-grow"
      >
        <div className="flex items-center text-warning mb-2">
          <Lightbulb size={20} className="mr-2" />
          <h3 className="font-bold">Today's Tip</h3>
        </div>
        <p className="text-text-secondary">{randomTip}</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center"
      >
        <Heart size={20} className="mr-2" />
        <span>Daily Check-in</span>
      </motion.button>
    </div>
  );
}
