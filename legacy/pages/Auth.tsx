import React, { useState } from 'react'

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(isLogin ? 'Logging in...' : 'Signing up...', { email, password })
    // Firebase Auth integration would go here
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-8 rounded-2xl border border-cyan-500/20 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AuraMed
          </h1>
          <p className="text-slate-400 mt-2">AI-Powered Medical Platform</p>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-900/50 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded transition font-medium ${
              isLogin
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded transition font-medium ${
              !isLogin
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <select className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition">
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition mt-6"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <p className="text-center text-sm text-slate-400">
            This is a demo app. Use any credentials to proceed.
          </p>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 px-4 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-300 hover:text-white text-sm transition">
              🔵 Google
            </button>
            <button className="flex-1 py-2 px-4 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-300 hover:text-white text-sm transition">
              📱 Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
