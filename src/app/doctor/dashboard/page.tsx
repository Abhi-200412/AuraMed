"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Users,
  FileCheck,
  AlertCircle,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Stethoscope,
  Microscope,
  Calendar,
  FileText,
  Upload
} from "lucide-react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(() => import('@/components/doctor/DashboardCharts'), {
  loading: () => <div className="h-[300px] w-full animate-pulse bg-surface-light/20 rounded-2xl" />,
  ssr: false
});

// ... imports ...



const recentScans = [
  { id: 'PT-2024-101', name: 'John Smith', scanType: 'CT Liver Scan', date: '2 hours ago', severity: 'high', confidence: 98, status: 'Anomaly Detected' },
  { id: 'PT-2024-102', name: 'Sarah Johnson', scanType: 'MRI Brain Scan', date: '4 hours ago', severity: 'none', confidence: 95, status: 'Normal' },
  { id: 'PT-2024-103', name: 'Michael Chen', scanType: 'CT Liver Scan', date: '5 hours ago', severity: 'medium', confidence: 89, status: 'Anomaly Detected' },
  { id: 'PT-2024-104', name: 'Emily Rodriguez', scanType: 'X-Ray Chest', date: '1 day ago', severity: 'none', confidence: 99, status: 'Normal' },
  { id: 'PT-2024-105', name: 'James Wilson', scanType: 'CT Liver Scan', date: '1 day ago', severity: 'low', confidence: 94, status: 'Anomaly Detected' },
];

const StatCard = ({ title, value, change, icon: Icon, color, subtitle }: any) => {
  const colorVariants: any = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    "blue-500": "bg-blue-500/10 text-blue-500",
    "red-500": "bg-red-500/10 text-red-500",
    "green-500": "bg-green-500/10 text-green-500",
    "purple-500": "bg-purple-500/10 text-purple-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl border border-white/5"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorVariants[color] || colorVariants.primary}`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14} />
          {change}
        </div>
      </div>
      <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-text-primary">{value}</div>
      {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
    </motion.div>
  );
};

export default function DoctorDashboard() {
  const router = useRouter();
  const [scans, setScans] = useState(recentScans);
  const [currentDoctorId, setCurrentDoctorId] = useState<string>('DOC-001'); // Default to Dr. Sarah Johnson

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch('/api/analyze');
        if (response.ok) {
          const data = await response.json();
          if (data.patients && data.patients.length > 0) {
            // Filter scans based on current doctor
            const filteredPatients = data.patients.filter((p: any) =>
              !p.analysisResult?.sharedWith ||
              p.analysisResult.sharedWith === 'all' ||
              p.analysisResult.sharedWith === currentDoctorId
            );

            // Merge API scans with static scans, prioritizing API scans
            // Map API data to match UI structure
            const apiScans = filteredPatients.map((p: any) => ({
              id: p.id,
              name: p.name,
              scanType: p.scanType || 'CT Scan',
              date: new Date(p.timestamp).toLocaleDateString(), // Format date
              severity: p.severity,
              confidence: Math.round(p.confidence),
              status: p.status || 'Anomaly Detected'
            }));

            setScans(prev => {
              // Simple deduplication based on ID
              const existingIds = new Set(prev.map(s => s.id));
              const newScans = apiScans.filter((s: any) => !existingIds.has(s.id));
              return [...newScans, ...prev];
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch scans:', error);
      }
    };

    fetchScans();

    // Poll every 30 seconds for new updates
    const interval = setInterval(fetchScans, 30000);
    return () => clearInterval(interval);
  }, [currentDoctorId]); // Re-fetch when doctor changes

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Doctor Dashboard</h1>
          <p className="text-text-secondary">Welcome back, Dr. Johnson</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Demo Doctor Switcher */}
          <select
            className="bg-surface-light border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary"
            value={currentDoctorId}
            onChange={(e) => {
              setCurrentDoctorId(e.target.value);
              // Reset scans to initial state to re-filter correctly
              setScans(recentScans);
            }}
          >
            <option value="DOC-001">Dr. Sarah Johnson (You)</option>
            <option value="DOC-002">Dr. Michael Chen</option>
            <option value="DOC-003">Dr. Emily Rodriguez</option>
          </select>

          <button className="px-4 py-2 rounded-lg bg-surface-light hover:bg-white/5 transition-colors border border-white/10">
            Last 7 Days
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-white hover:shadow-lg transition-all btn-hover flex items-center gap-2">
            <Upload className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Scans"
          value="1,284"
          change="+12.5%"
          icon={Activity}
          color="primary"
          subtitle="This month"
        />
        <StatCard
          title="Active Patients"
          value="342"
          change="+4.2%"
          icon={Users}
          color="secondary"
          subtitle="Currently under care"
        />
        <StatCard
          title="Reports Generated"
          value="892"
          change="+8.1%"
          icon={FileCheck}
          color="blue-500"
          subtitle="Diagnostic reports"
        />
        <StatCard
          title="Anomalies Detected"
          value="28"
          change="+2.4%"
          icon={AlertCircle}
          color="red-500"
          subtitle="Requiring attention"
        />
      </div>

      {/* Charts Section (Lazy Loaded) */}
      <DashboardCharts />      {/* Recent Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl border border-white/5 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Recent Scans
          </h3>
          <button className="text-sm text-primary hover:text-primary-dark transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-light/50 text-text-secondary text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4 text-left">Patient</th>
                <th className="px-6 py-4 text-left">Scan Type</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Confidence</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{scan.name}</div>
                      <div className="text-text-secondary text-sm">{scan.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{scan.scanType}</td>
                  <td className="px-6 py-4 text-text-secondary flex items-center gap-2">
                    <Clock size={14} />
                    {scan.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scan.severity === 'high'
                      ? "bg-red-500/10 text-red-500"
                      : scan.severity === 'medium'
                        ? "bg-yellow-500/10 text-yellow-500"
                        : scan.severity === 'low'
                          ? "bg-green-500/10 text-green-500"
                          : "bg-green-500/10 text-green-500"
                      }`}>
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-light rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${scan.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-secondary">{scan.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => window.location.href = '/doctor/dashboard/analyze'}
                      className="text-sm text-primary hover:underline"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl border border-white/5 p-6"
      >
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/doctor/dashboard/upload')}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-light/50 hover:bg-surface-light transition-colors border border-white/5 cursor-pointer group"
          >
            <Upload className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Upload New Scan</span>
            <span className="text-text-secondary text-sm mt-1">Process medical imaging</span>
          </button>

          <button
            onClick={() => router.push('/doctor/dashboard/appointments')}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-light/50 hover:bg-surface-light transition-colors border border-white/5 cursor-pointer group"
          >
            <Calendar className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Patient Appointments</span>
            <span className="text-text-secondary text-sm mt-1">Manage consultation requests</span>
          </button>

          <button
            onClick={() => router.push('/doctor/dashboard/chat')}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-light/50 hover:bg-surface-light transition-colors border border-white/5 cursor-pointer group"
          >
            <Stethoscope className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium">AI Assistant</span>
            <span className="text-text-secondary text-sm mt-1">Chat with Diagnostic AI</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}