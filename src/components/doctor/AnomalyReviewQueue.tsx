'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Scan {
  id: string;
  patientName: string;
  scanType: string;
  date: string;
  status: 'Pending Review' | 'Reviewed' | 'Normal';
  anomalyScore: number;
}

export function AnomalyReviewQueue() {
  const [scans] = useState<Scan[]>([
    {
      id: '1',
      patientName: 'John Smith',
      scanType: 'Brain MRI',
      date: '2024-01-15',
      status: 'Pending Review',
      anomalyScore: 0.87,
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      scanType: 'Chest CT',
      date: '2024-01-14',
      status: 'Reviewed',
      anomalyScore: 0.23,
    },
    {
      id: '3',
      patientName: 'Mike Davis',
      scanType: 'Spine X-Ray',
      date: '2024-01-13',
      status: 'Normal',
      anomalyScore: 0.05,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Review':
        return 'bg-warning/20 text-warning';
      case 'Reviewed':
        return 'bg-info/20 text-info';
      case 'Normal':
        return 'bg-success/20 text-success';
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
      <h2 className="text-2xl font-bold mb-6">Anomaly Review Queue</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20">
              <th className="text-left py-3 px-4 font-semibold">Patient</th>
              <th className="text-left py-3 px-4 font-semibold">Scan Type</th>
              <th className="text-left py-3 px-4 font-semibold">Date</th>
              <th className="text-left py-3 px-4 font-semibold">Anomaly Score</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id} className="border-b border-border/20 hover:bg-surface-light/30 transition-colors">
                <td className="py-3 px-4">{scan.patientName}</td>
                <td className="py-3 px-4">{scan.scanType}</td>
                <td className="py-3 px-4">{scan.date}</td>
                <td className="py-3 px-4">
                  <div className="w-16 h-2 bg-surface-light rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scan.anomalyScore * 100}%` }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="h-full bg-gradient-primary"
                    />
                  </div>
                  <span className="text-sm text-text-secondary">{(scan.anomalyScore * 100).toFixed(0)}%</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scan.status)}`}>
                    {scan.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
