import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', value: 70 },
  { name: 'Feb', value: 72 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 75 },
]

const PatientDashboard: React.FC = () => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2 glass p-4 rounded">
        <h3 className="mb-2">Health Trends</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass p-4 rounded">
        <h3>Past Scans</h3>
        <ul className="mt-2 text-sm text-slate-300">
          <li>Scan 2025-10-02 — Normal</li>
          <li>Scan 2025-09-21 — Anomaly found</li>
        </ul>
      </div>
    </div>
  )
}

export default PatientDashboard
