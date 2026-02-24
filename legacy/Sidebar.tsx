import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('patient')

  const handleNavClick = (role: string, path: string) => {
    setActiveNav(role)
    navigate(path)
  }

  return (
    <aside className="w-20 bg-slate-900/50 backdrop-blur border-r border-slate-800/50 p-3 flex flex-col gap-4 items-center justify-start pt-6">
      <nav className="flex flex-col gap-3 w-full">
        {/* Patient */}
        <button
          onClick={() => handleNavClick('patient', '/patient')}
          className={`w-full p-3 rounded-lg transition flex items-center justify-center ${
            activeNav === 'patient'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/30 border border-transparent'
          }`}
          title="Patient Portal"
        >
          👤
        </button>

        {/* Doctor */}
        <button
          onClick={() => handleNavClick('doctor', '/doctor')}
          className={`w-full p-3 rounded-lg transition flex items-center justify-center ${
            activeNav === 'doctor'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/30 border border-transparent'
          }`}
          title="Doctor Dashboard"
        >
          🏥
        </button>

        {/* Auth */}
        <button
          onClick={() => handleNavClick('auth', '/auth')}
          className={`w-full p-3 rounded-lg transition flex items-center justify-center ${
            activeNav === 'auth'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'text-slate-400 hover:text-green-300 hover:bg-slate-800/30 border border-transparent'
          }`}
          title="Authentication"
        >
          🔐
        </button>
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-slate-700/30 my-2"></div>

      {/* Settings */}
      <button className="w-full p-3 rounded-lg transition text-slate-400 hover:text-yellow-300 hover:bg-slate-800/30 flex items-center justify-center" title="Settings">
        ⚙️
      </button>

      {/* Help */}
      <button className="w-full p-3 rounded-lg transition text-slate-400 hover:text-blue-300 hover:bg-slate-800/30 flex items-center justify-center" title="Help">
        ❓
      </button>
    </aside>
  )
}

export default Sidebar
