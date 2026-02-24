import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AIAvatar from '../components/AIAvatar'

const Landing: React.FC = () => {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const features = [
    {
      id: 'avatar',
      icon: '🤖',
      title: 'AI Avatar',
      description: 'Interactive AI companion with breathing animations',
      color: 'from-cyan-500/20 to-cyan-500/10 border-cyan-500/50'
    },
    {
      id: 'upload',
      icon: '📤',
      title: 'Image Upload',
      description: 'Drag-and-drop medical image analyzer',
      color: 'from-purple-500/20 to-purple-500/10 border-purple-500/50'
    },
    {
      id: 'chat',
      icon: '💬',
      title: 'AI Chat',
      description: 'Real-time conversation with voice I/O',
      color: 'from-pink-500/20 to-pink-500/10 border-pink-500/50'
    },
    {
      id: 'voice',
      icon: '🎤',
      title: 'Voice Features',
      description: 'Web Speech API powered voice input & output',
      color: 'from-green-500/20 to-green-500/10 border-green-500/50'
    },
    {
      id: 'dashboard',
      icon: '📊',
      title: 'Dashboard',
      description: 'Interactive health metrics and charts',
      color: 'from-orange-500/20 to-orange-500/10 border-orange-500/50'
    },
    {
      id: '3d',
      icon: '🔍',
      title: '3D Viewer',
      description: 'Medical scan visualization (Three.js)',
      color: 'from-blue-500/20 to-blue-500/10 border-blue-500/50'
    }
  ]

  const portals = [
    {
      role: 'patient',
      icon: '👤',
      title: 'Patient Portal',
      description: 'AI health companion, image analysis, chat & dashboard',
      color: 'from-cyan-500 to-blue-500',
      path: '/patient'
    },
    {
      role: 'doctor',
      icon: '🏥',
      title: 'Doctor Dashboard',
      description: 'Patient management, scan viewer, AI analysis, reports',
      color: 'from-purple-500 to-pink-500',
      path: '/doctor'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#040416] via-[#061025] to-[#03030b] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 50%, rgba(0, 188, 212, 0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 50%, rgba(0, 188, 212, 0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
      </div>

      {/* Navigation Header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur border-b border-slate-700/50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ✨ AuraMed
          </motion.div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-2 text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/patient')}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-32 pb-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left: Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    The Future of Medical AI
                  </span>
                </h1>
              </motion.div>

              <motion.p variants={itemVariants} className="text-xl text-slate-300 leading-relaxed">
                AuraMed combines cutting-edge artificial intelligence with intuitive design to revolutionize medical diagnosis and patient care. Experience the next generation of healthcare technology.
              </motion.p>

              <motion.div variants={itemVariants} className="flex gap-4 flex-wrap pt-4">
                <button
                  onClick={() => navigate('/patient')}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105"
                >
                  Explore Patient Portal
                </button>
                <button
                  onClick={() => navigate('/doctor')}
                  className="px-8 py-3 border border-purple-500/50 text-purple-300 rounded-lg font-semibold hover:bg-purple-500/10 transition transform hover:scale-105"
                >
                  Doctor Dashboard
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-8">
                <div className="glass p-4 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">31+</div>
                  <div className="text-sm text-slate-400">Components</div>
                </div>
                <div className="glass p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-sm text-slate-400">Errors</div>
                </div>
                <div className="glass p-4 rounded-lg">
                  <div className="text-2xl font-bold text-pink-400">100%</div>
                  <div className="text-sm text-slate-400">TypeScript</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: AI Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <AIAvatar />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Portal Selection */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
              Choose Your Portal
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {portals.map((portal) => (
                <motion.button
                  key={portal.role}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(portal.path)}
                  className={`group glass p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition transform hover:scale-105 text-left`}
                >
                  <div className={`inline-block text-4xl mb-4 bg-gradient-to-r ${portal.color} bg-clip-text`}>
                    {portal.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${portal.color} bg-clip-text text-transparent`}>
                    {portal.title}
                  </h3>
                  <p className="text-slate-300 mb-4">{portal.description}</p>
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${portal.color} text-white rounded-lg text-sm font-semibold group-hover:shadow-lg transition`}>
                    Enter Portal →
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
              Powerful Features
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onMouseEnter={() => setHoveredCard(feature.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`glass p-6 rounded-lg border transition cursor-pointer ${
                    hoveredCard === feature.id
                      ? `bg-gradient-to-br ${feature.color} border-slate-600/50 shadow-lg`
                      : `bg-slate-900/20 border-slate-700/30 hover:border-slate-600/50`
                  }`}
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
              Built With Modern Tech
            </motion.h2>
            <div className="glass p-8 rounded-xl border border-slate-700/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: 'React 18', icon: '⚛️' },
                  { name: 'TypeScript', icon: '🔷' },
                  { name: 'Vite', icon: '⚡' },
                  { name: 'Tailwind CSS', icon: '🎨' },
                  { name: 'Framer Motion', icon: '🎬' },
                  { name: 'React Router', icon: '🗺️' },
                  { name: 'Web Speech API', icon: '🎤' },
                  { name: 'Three.js', icon: '🌐' }
                ].map((tech) => (
                  <motion.div
                    key={tech.name}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition"
                  >
                    <div className="text-3xl">{tech.icon}</div>
                    <div className="text-sm font-semibold text-slate-300">{tech.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <div className="glass p-12 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-center">
              <motion.h3 variants={itemVariants} className="text-3xl font-bold mb-4">
                Ready to Transform Healthcare?
              </motion.h3>
              <motion.p variants={itemVariants} className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Experience the power of AI-assisted medical diagnosis. Try our interactive demo now and see the future of healthcare.
              </motion.p>
              <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate('/patient')}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105"
                >
                  Start as Patient 👤
                </button>
                <button
                  onClick={() => navigate('/doctor')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105"
                >
                  Start as Doctor 🏥
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
              Why Choose AuraMed?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: '🎯 Precise Diagnosis',
                  description: 'AI-powered analysis for accurate medical imaging results'
                },
                {
                  title: '🎨 Beautiful Design',
                  description: 'Modern, intuitive interface with glassmorphism aesthetics'
                },
                {
                  title: '🚀 Lightning Fast',
                  description: 'Vite-powered development with instant HMR'
                },
                {
                  title: '🔒 Type Safe',
                  description: 'Full TypeScript coverage for reliability'
                },
                {
                  title: '🎤 Voice Enabled',
                  description: 'Natural interaction with Web Speech API'
                },
                {
                  title: '📱 Responsive',
                  description: 'Works perfectly on mobile, tablet, and desktop'
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="glass p-6 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 transition"
                >
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className="border-t border-slate-700/50 pt-8 text-center text-slate-400"
          >
            <p className="mb-4">
              Built with React, TypeScript, Tailwind CSS, and ❤️
            </p>
            <p className="text-sm">
              © 2025 AuraMed. All rights reserved. | <a href="#" className="text-cyan-400 hover:text-cyan-300">Docs</a> | <a href="#" className="text-cyan-400 hover:text-cyan-300">GitHub</a>
            </p>
          </motion.footer>
        </div>
      </motion.section>
    </div>
  )
}

export default Landing
