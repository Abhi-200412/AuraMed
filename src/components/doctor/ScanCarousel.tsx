'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MedicalImageViewer3D } from './MedicalImageViewer3D';

const scans = [
  { id: 1, patient: 'John Doe', date: '2024-07-20' },
  { id: 2, patient: 'Jane Smith', date: '2024-07-19' },
  { id: 3, patient: 'Peter Jones', date: '2024-07-18' },
];

export function ScanCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? scans.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === scans.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Scans</h2>
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="h-64 bg-surface-light/50 rounded-lg flex items-center justify-center">
              {/* Replace with actual 3D viewer */}
              <MedicalImageViewer3D />
            </div>
            <div className="mt-4">
              <p className="font-bold">{scans[currentIndex].patient}</p>
              <p className="text-sm text-text-secondary">{scans[currentIndex].date}</p>
            </div>
          </motion.div>
        </div>
        <button onClick={handlePrev} className="absolute top-1/2 left-2 -translate-y-1/2 bg-primary/50 hover:bg-primary p-2 rounded-full">
          <ChevronLeft />
        </button>
        <button onClick={handleNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-primary/50 hover:bg-primary p-2 rounded-full">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
