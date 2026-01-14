'use client';

import { motion } from 'framer-motion';
import { Bot, Lightbulb, Heart, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

const defaultTips = [
  "Remember to stay hydrated today!",
  "A short walk can do wonders for your mood and energy levels.",
  "Don't forget to take your medication as prescribed.",
  "A balanced diet is key to a healthy life.",
  "Good sleep hygiene improves overall health recovery.",
  "Stress management techniques like deep breathing can help."
];

export function AIWellnessGuide() {
  const [tip, setTip] = useState<string>("");
  const [context, setContext] = useState<string>("general");

  useEffect(() => {
    // Try to get context from recent analysis
    const storedAnalysis = localStorage.getItem('latestDoctorAnalysis');

    if (storedAnalysis) {
      try {
        const analysis = JSON.parse(storedAnalysis);

        if (analysis.anomalyDetected) {
          setContext("recovery");
          // Generate relevant tips based on findings (simplified logic)
          const findings = analysis.findings.toLowerCase();
          if (findings.includes("lung") || findings.includes("respiratory")) {
            setTip("Focus on deep breathing exercises to improve lung capacity.");
          } else if (findings.includes("bone") || findings.includes("fracture")) {
            setTip("Ensure you're getting enough calcium and Vitamin D for bone healing.");
          } else if (findings.includes("heart") || findings.includes("cardio")) {
            setTip("Monitor your blood pressure and avoid strenuous activities today.");
          } else {
            setTip("Rest is crucial for recovery. Listen to your body's signals.");
          }
        } else {
          setContext("maintenance");
          setTip("Great news on your recent scan! Keep maintaining your healthy lifestyle.");
        }
      } catch (e) {
        setTip(defaultTips[Math.floor(Math.random() * defaultTips.length)]);
      }
    } else {
      setTip(defaultTips[Math.floor(Math.random() * defaultTips.length)]);
    }
  }, []);

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
        className={`p-4 rounded-lg flex-grow ${context === 'recovery' ? 'bg-secondary/20' : 'bg-primary/20'
          }`}
      >
        <div className={`flex items-center mb-2 ${context === 'recovery' ? 'text-secondary' : 'text-warning'
          }`}>
          {context === 'recovery' ? <Activity size={20} className="mr-2" /> : <Lightbulb size={20} className="mr-2" />}
          <h3 className="font-bold">
            {context === 'recovery' ? 'Recovery Focus' : "Today's Tip"}
          </h3>
        </div>
        <p className="text-text-secondary leading-relaxed">{tip}</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center shadow-lg shadow-primary/20"
      >
        <Heart size={20} className="mr-2" />
        <span>Daily Check-in</span>
      </motion.button>
    </div>
  );
}
