'use client';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Animated3DViewer = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const [slice, setSlice] = useState(98);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlice((prev) => (prev >= 180 ? 1 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="w-full h-80 bg-surface rounded-2xl p-4 flex flex-col justify-between border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{ perspective: 800 }}
      onMouseMove={(e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - left - width / 2);
        y.set(e.clientY - top - height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className="flex justify-between items-center text-xs text-text-secondary">
        <span>Coronal View</span>
        <span>Slice: {slice}/180</span>
      </div>
      <motion.div
        className="flex-1 flex items-center justify-center"
        style={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 350, damping: 40 }}
      >
        <motion.div
          className="w-48 h-48 rounded-lg bg-black/20 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-32 h-40 bg-primary/20 rounded-sm animate-pulse-glow" />
        </motion.div>
      </motion.div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          <div className="w-10 h-6 bg-primary/20 rounded-md" />
          <div className="w-10 h-6 bg-surface-light rounded-md" />
          <div className="w-10 h-6 bg-surface-light rounded-md" />
        </div>
        <div className="w-24 h-4 bg-surface-light rounded-full" />
      </div>
    </motion.div>
  );
};
