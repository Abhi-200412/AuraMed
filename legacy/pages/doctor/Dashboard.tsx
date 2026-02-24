import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import ScanViewer from './ScanViewer'
import AnalysisPanel from './AnalysisPanel'
import ReportBuilder from './ReportBuilder'

const DoctorDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass p-6 rounded-2xl border border-purple-500/20">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🏥 Doctor Control Center
        </h2>
        <p className="text-slate-400 mt-2">Manage patient cases, analyze scans, and generate reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-lg border border-slate-700/50 hover:border-blue-500/50 transition cursor-pointer group">
          <div className="text-2xl mb-2 group-hover:scale-110 transition">📥</div>
          <div className="text-sm text-slate-400">Incoming Scans</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">12</div>
          <p className="text-xs text-slate-500 mt-2">5 awaiting review</p>
        </div>
        
        <div className="glass p-4 rounded-lg border border-slate-700/50 hover:border-orange-500/50 transition cursor-pointer group">
          <div className="text-2xl mb-2 group-hover:scale-110 transition">📋</div>
          <div className="text-sm text-slate-400">Pending Reports</div>
          <div className="text-2xl font-bold text-orange-400 mt-1">8</div>
          <p className="text-xs text-slate-500 mt-2">2 urgent</p>
        </div>
        
        <div className="glass p-4 rounded-lg border border-slate-700/50 hover:border-red-500/50 transition cursor-pointer group">
          <div className="text-2xl mb-2 group-hover:scale-110 transition">🚨</div>
          <div className="text-sm text-slate-400">Critical Alerts</div>
          <div className="text-2xl font-bold text-red-400 mt-1">2</div>
          <p className="text-xs text-slate-500 mt-2">Requires attention</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Link 
          to="scan/123" 
          className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-blue-500/10 border border-blue-500/50 text-blue-300 rounded-lg hover:from-blue-500/30 hover:to-blue-500/20 transition-all hover:scale-105 font-medium"
        >
          🔍 View Scan
        </Link>
        <Link 
          to="analysis" 
          className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/50 text-cyan-300 rounded-lg hover:from-cyan-500/30 hover:to-cyan-500/20 transition-all hover:scale-105 font-medium"
        >
          📊 AI Analysis
        </Link>
        <Link 
          to="report" 
          className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/50 text-green-300 rounded-lg hover:from-green-500/30 hover:to-green-500/20 transition-all hover:scale-105 font-medium"
        >
          📄 Build Report
        </Link>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        <Routes>
          <Route path="/" element={
            <div className="glass p-8 rounded-lg border border-slate-700/50 text-center">
              <p className="text-lg text-slate-400">👆 Select a tool above to get started</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/30 rounded">
                  <div className="text-3xl mb-2">🔬</div>
                  <div className="font-semibold text-slate-300">Review Scans</div>
                  <p className="text-xs text-slate-400 mt-2">3D medical imaging viewer</p>
                </div>
                <div className="p-4 bg-slate-800/30 rounded">
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="font-semibold text-slate-300">AI Insights</div>
                  <p className="text-xs text-slate-400 mt-2">Advanced analysis panel</p>
                </div>
                <div className="p-4 bg-slate-800/30 rounded">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-semibold text-slate-300">Generate Reports</div>
                  <p className="text-xs text-slate-400 mt-2">Create & sign reports</p>
                </div>
              </div>
            </div>
          } />
          <Route path="scan/:id" element={<ScanViewer />} />
          <Route path="analysis" element={<AnalysisPanel />} />
          <Route path="report" element={<ReportBuilder />} />
        </Routes>
      </div>
    </div>
  )
}

export default DoctorDashboard
