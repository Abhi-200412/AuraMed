import React from 'react'
import AIAvatar from '../../components/AIAvatar'
import { Link, Routes, Route } from 'react-router-dom'
import UploadPage from './Upload'
import ChatPage from './Chat'
import PatientDashboard from './Dashboard'

const PatientHome: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section with AI Avatar */}
      <div className="glass p-8 rounded-2xl border border-cyan-500/20">
        <div className="flex gap-8 items-center">
          <div className="flex-shrink-0">
            <AIAvatar />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Hello — I'm Aura
            </h2>
            <p className="text-slate-300 mt-2 text-lg">Your AI health companion. How can I help today?</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link 
                to="upload" 
                className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/50 text-cyan-300 rounded-lg hover:from-cyan-500/30 hover:to-cyan-500/20 transition-all hover:scale-105 font-medium"
              >
                📤 Upload Medical Image
              </Link>
              <Link 
                to="chat" 
                className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-purple-500/10 border border-purple-500/50 text-purple-300 rounded-lg hover:from-purple-500/30 hover:to-purple-500/20 transition-all hover:scale-105 font-medium"
              >
                💬 Chat With AI
              </Link>
              <Link 
                to="dashboard" 
                className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/50 text-green-300 rounded-lg hover:from-green-500/30 hover:to-green-500/20 transition-all hover:scale-105 font-medium"
              >
                📊 View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 transition">
          <div className="text-2xl mb-2">❤️</div>
          <div className="text-sm text-slate-400">Health Score</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">92%</div>
        </div>
        <div className="glass p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/50 transition">
          <div className="text-2xl mb-2">🔬</div>
          <div className="text-sm text-slate-400">Recent Scans</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">3</div>
        </div>
        <div className="glass p-4 rounded-lg border border-slate-700/50 hover:border-green-500/50 transition">
          <div className="text-2xl mb-2">📋</div>
          <div className="text-sm text-slate-400">Reports Ready</div>
          <div className="text-2xl font-bold text-green-400 mt-1">2</div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        <Routes>
          <Route path="/" element={
            <div className="glass p-8 rounded-lg border border-slate-700/50 text-center text-slate-400">
              <p className="text-lg">👆 Select an action above to get started</p>
            </div>
          } />
          <Route path="upload" element={<UploadPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="dashboard" element={<PatientDashboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default PatientHome
