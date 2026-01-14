'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface HealthReport {
  id: string;
  scanType: string;
  date: string;
  status: 'Normal' | 'Anomaly Detected' | 'Pending';
  doctorNotes: string;
  result: string;
}

export function HealthReportTimeline() {
  const [reports] = useState<HealthReport[]>([
    {
      id: '1',
      scanType: 'Brain MRI',
      date: '2024-01-15',
      status: 'Normal',
      doctorNotes: 'Dr. Smith',
      result: 'No significant abnormalities detected',
    },
    {
      id: '2',
      scanType: 'Chest CT',
      date: '2024-01-10',
      status: 'Normal',
      doctorNotes: 'Dr. Johnson',
      result: 'All clear',
    },
    {
      id: '3',
      scanType: 'Spine X-Ray',
      date: '2024-01-05',
      status: 'Anomaly Detected',
      doctorNotes: 'Dr. Williams',
      result: 'Minor deviation observed, follow-up recommended',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-success/20 text-success';
      case 'Anomaly Detected':
        return 'bg-warning/20 text-warning';
      case 'Pending':
        return 'bg-info/20 text-info';
      default:
        return 'bg-border/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Your Medical Timeline</h2>

      <div className="space-y-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg border border-border/20 hover:bg-surface-light/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-1 h-20 bg-gradient-primary rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{report.scanType}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-2">{report.date}</p>
                <p className="text-text-primary mb-2">{report.result}</p>
                <p className="text-text-secondary text-sm">Reviewed by: {report.doctorNotes}</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 opacity-0 group-hover:opacity-100 transition-all">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
