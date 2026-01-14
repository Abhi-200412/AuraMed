'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function MedicalImageViewer3D() {
  const [sliceMode, setSliceMode] = useState<'axial' | 'coronal' | 'sagittal'>('axial');
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-6">3D Medical Imaging Viewer</h2>

      {/* Viewer Area */}
      <div className="w-full h-96 bg-surface-light/30 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <p className="text-text-secondary">3D Medical Scan Visualization</p>
          <p className="text-text-secondary text-sm mt-2">{sliceMode.toUpperCase()} View</p>
        </div>

        {/* Overlay Indicators */}
        {showSegmentation && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-success/20 text-success text-sm">
            🎨 Segmentation ON
          </div>
        )}
        {showHeatmap && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-warning/20 text-warning text-sm">
            🔥 Heatmap ON
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Slice Mode</h3>
          <div className="flex gap-2">
            {(['axial', 'coronal', 'sagittal'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSliceMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sliceMode === mode
                    ? 'bg-primary text-white'
                    : 'bg-surface-light text-text-secondary hover:bg-surface-light/70'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">AI Overlays</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-surface-light/30 transition-colors">
              <input
                type="checkbox"
                checked={showSegmentation}
                onChange={(e) => setShowSegmentation(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <span>Show Segmentation</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-surface-light/30 transition-colors">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <span>Show Anomaly Heatmap</span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
