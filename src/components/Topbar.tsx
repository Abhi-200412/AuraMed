'use client';

import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Topbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we're on a patient dashboard page
    const isPatientDashboard = window.location.pathname.includes('/patient/');
    const isDoctorDashboard = window.location.pathname.includes('/doctor/');
    
    if (isPatientDashboard) {
      setUserRole('patient');
      // Load patient information from localStorage
      const storedPatientInfo = localStorage.getItem('patientInfo');
      if (storedPatientInfo) {
        setPatientInfo(JSON.parse(storedPatientInfo));
      }
    } else if (isDoctorDashboard) {
      setUserRole('doctor');
      // Load doctor information from localStorage
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setPatientInfo({ name: storedEmail.split('@')[0] }); // Use email prefix as name
      }
    }
  }, []);

  const handleSignOut = () => {
    // Clear all localStorage items related to user sessions
    localStorage.removeItem('patientInfo');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    router.push('/login');
  };

  const notifications = [
    { id: 1, title: 'New analysis ready', desc: 'patient@example.com', time: '5 min ago', unread: true },
    { id: 2, title: 'System update scheduled', desc: 'at 02:00 AM', time: '1 hour ago', unread: true },
    { id: 3, title: 'Review flagged scans', desc: '3 pending reviews', time: '2 hours ago', unread: false },
    { id: 4, title: 'New message received', desc: 'from Dr. Johnson', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="relative flex items-center justify-between glass p-4 rounded-xl mb-4 mx-4 mt-4 sticky top-4 z-50 border-2 border-border/30">
      <div className="flex items-center gap-4">
        <motion.div 
          className="text-3xl cursor-pointer"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          🔬
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-gradient">AuraMed</h1>
          <p className="text-xs text-text-tertiary">AI Medical Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Profile Section */}
        {userRole && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">
                  {patientInfo?.name || 'User'}
                </p>
                <p className="text-xs text-text-tertiary capitalize">{userRole}</p>
              </div>
            </div>
            
            <motion.button
              onClick={handleSignOut}
              className="p-2 rounded-lg bg-surface border border-border hover:border-error transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5 text-text-secondary group-hover:text-error transition-colors" />
            </motion.button>
          </div>
        )}

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-surface border border-border hover:border-primary transition-all group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-expanded={showNotifications}
            aria-label="Toggle notifications"
          >
            <Bell className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-error text-text-primary text-xs rounded-full flex items-center justify-center font-bold"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-96 glass border border-border/30 rounded-xl shadow-2xl p-4 z-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-text-primary">Notifications</h4>
                  <button className="text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                  {notifications.map((notif, idx) => (
                    <motion.li
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-3 rounded-lg transition-all cursor-pointer ${
                        notif.unread ? 'bg-primary/10 border border-primary/30' : 'bg-surface-light hover:bg-surface-lighter'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-text-primary text-sm">{notif.title}</p>
                          <p className="text-text-tertiary text-xs mt-1">{notif.desc}</p>
                        </div>
                        {notif.unread && (
                          <span className="w-2 h-2 bg-primary rounded-full mt-1"></span>
                        )}
                      </div>
                      <p className="text-text-tertiary text-xs mt-2">{notif.time}</p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;