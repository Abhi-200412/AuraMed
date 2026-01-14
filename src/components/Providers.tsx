'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import ParticleBackground from '@/components/ParticleBackground';
import StartMocks from '@/components/StartMocks';
import { AnimatePresence, motion } from 'framer-motion';
import Topbar from '@/components/Topbar';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <ParticleBackground />
                {/* start mock service worker in dev to handle /api/* mocks */}
                <StartMocks />
                <div className="flex min-h-screen flex-col">
                    <Topbar />
                    <AnimatePresence mode="wait">
                        <motion.main
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10 flex-grow"
                        >
                            {children}
                        </motion.main>
                    </AnimatePresence>
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
}
