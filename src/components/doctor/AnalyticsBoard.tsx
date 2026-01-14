'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const caseData = [
  { day: 'Mon', cases: 4 },
  { day: 'Tue', cases: 6 },
  { day: 'Wed', cases: 5 },
  { day: 'Thu', cases: 8 },
  { day: 'Fri', cases: 7 },
  { day: 'Sat', cases: 3 },
  { day: 'Sun', cases: 2 },
];

const anomalyData = [
  { week: 'Week 1', detected: 65, missed: 15 },
  { week: 'Week 2', detected: 72, missed: 12 },
  { week: 'Week 3', detected: 78, missed: 8 },
  { week: 'Week 4', detected: 84, missed: 6 },
];

export function AnalyticsBoard() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Cases Analyzed This Week */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-xl font-bold mb-4">Cases Analyzed This Week</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={caseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a3a4a" />
            <XAxis stroke="#a1a1a6" />
            <YAxis stroke="#a1a1a6" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #3a3a4a',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="cases" fill="#8d59f5" name="Cases" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Anomaly Detection Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-xl font-bold mb-4">AI Anomaly Detection Rate</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={anomalyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a3a4a" />
            <XAxis stroke="#a1a1a6" />
            <YAxis stroke="#a1a1a6" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #3a3a4a',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="detected" stroke="#8d59f5" name="Detected" strokeWidth={2} />
            <Line type="monotone" dataKey="missed" stroke="#10b981" name="Accuracy" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <h4 className="text-sm font-semibold text-text-secondary mb-2">Total Cases This Week</h4>
        <p className="text-4xl font-bold text-gradient">35</p>
        <p className="text-text-secondary text-sm mt-2">↑ 12% from last week</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6"
      >
        <h4 className="text-sm font-semibold text-text-secondary mb-2">Avg. Analysis Time</h4>
        <p className="text-4xl font-bold text-gradient">2.4 min</p>
        <p className="text-text-secondary text-sm mt-2">↓ 5% faster</p>
      </motion.div>
    </div>
  );
}
