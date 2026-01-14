'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface PatientNotification {
  id: number;
  type: 'anomaly_detected' | 'follow_up' | 'result_ready' | 'general';
  title: string;
  message: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export function PatientNotifications() {
  const [notifications, setNotifications] = useState<PatientNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load notifications from localStorage
    const storedNotifications = localStorage.getItem('patientNotifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
    
    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'patientNotifications') {
        setNotifications(JSON.parse(e.newValue || '[]'));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('patientNotifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({...n, read: true}));
    setNotifications(updatedNotifications);
    localStorage.setItem('patientNotifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('patientNotifications');
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  // Don't render on server to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-lg bg-surface border border-border hover:border-primary transition-all relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 glass border border-border/30 rounded-xl shadow-2xl p-4 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-primary">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAllNotifications}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Clear all
                  </button>
                )}
                <button 
                  onClick={closeNotifications}
                  className="text-xs text-text-secondary hover:text-text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg transition-all cursor-pointer ${
                      !notification.read 
                        ? 'bg-blue-500/10 border border-blue-500/30' 
                        : 'bg-surface-light hover:bg-surface-lighter'
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {notification.type === 'anomaly_detected' ? (
                            <AlertTriangle className={`w-4 h-4 ${
                              notification.severity === 'high' ? 'text-red-400' :
                              notification.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                            } flex-shrink-0`} />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          )}
                          <p className="font-semibold text-text-primary text-sm">
                            {notification.title}
                          </p>
                        </div>
                        <p className="text-text-secondary text-xs mb-1">
                          {notification.message}
                        </p>
                        <p className="text-text-tertiary text-xs">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-text-secondary text-center py-4">No notifications</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}