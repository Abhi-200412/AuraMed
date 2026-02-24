import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ParticleBackground from './ParticleBackground'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#040416] via-[#061025] to-[#03030b]">
      <ParticleBackground />
      <Sidebar />
      <div className="flex-1 p-6">
        <Topbar />
        <main className="mt-6">{children}</main>
      </div>
    </div>
  )
}

export default Layout
