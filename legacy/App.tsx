import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import PatientHome from './pages/patient/Home'
import DoctorDashboard from './pages/doctor/Dashboard'

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Routes>
          {/* Landing page without layout */}
          <Route path="/" element={<Landing />} />
          
          {/* All other routes with layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/auth/*" element={<Auth />} />
                  <Route path="/patient/*" element={<PatientHome />} />
                  <Route path="/doctor/*" element={<DoctorDashboard />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </ToastProvider>
    </AppProvider>
  )
}
