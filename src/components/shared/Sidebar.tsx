'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut, Sparkles } from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  userRole: 'doctor' | 'patient';
}

export function Sidebar({ items, userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const roleColors = {
    doctor: 'from-primary to-secondary',
    patient: 'from-secondary to-accent',
  };

  // Optimize animations for better performance
  const sidebarTransition = { duration: 0.2, ease: 'easeInOut' };
  const itemTransition = { duration: 0.15 };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={sidebarTransition}
      className="glass border-r border-border/30 flex flex-col h-screen sticky top-0 z-40 overflow-hidden"
    >
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={itemTransition}
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[userRole]} flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200`}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-gradient">AuraMed</span>
                  <p className="text-xs text-text-tertiary capitalize">{userRole} Portal</p>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-surface-light rounded-lg transition-all border border-transparent hover:border-primary/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={itemTransition}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-text-secondary" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-text-secondary" />
          )}
        </motion.button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={itemTransition}
            >
              <Link
                href={item.href}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${roleColors[userRole]} text-white shadow-lg`
                    : 'text-text-secondary hover:bg-surface-light hover:text-primary'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.1, duration: 0.3 }}
                  />
                )}
                
                <span className={`relative z-10 text-xl ${
                  isActive ? 'transform scale-110' : 'group-hover:scale-110'
                } transition-transform duration-200`}>
                  {item.icon}
                </span>
                
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={itemTransition}
                      className="relative z-10 font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Badge */}
                {item.badge && !isCollapsed && (
                  <span className="ml-auto px-2 py-1 bg-error text-white text-xs rounded-full font-bold">
                    {item.badge}
                  </span>
                )}

                {/* Hover glow effect - simplified for performance */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border/30 space-y-2">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={itemTransition}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-light/50"
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleColors[userRole]} flex items-center justify-center text-white font-bold`}>
                {userRole === 'doctor' ? 'Dr' : 'P'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text-primary text-sm">
                  {userRole === 'doctor' ? 'Dr. Smith' : 'John Doe'}
                </p>
                <p className="text-xs text-text-tertiary">
                  {mounted ? `ID: #${Math.floor(Math.random() * 10000)}` : 'ID: #----'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => {
            // Handle logout
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-error/10 hover:bg-error/20 text-error transition-all border border-error/30 hover:border-error/50 duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={itemTransition}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
}
