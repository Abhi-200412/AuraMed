'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastType } from '@/components/ui/Toast';

interface NotificationContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType; duration?: number }>>([]);

    const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Connect to SSE
    useEffect(() => {
        // Only connect in browser environment
        if (typeof window === 'undefined') return;

        const eventSource = new EventSource('http://localhost:8000/events');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // We only show toasts for major status changes to avoid spam
                if (data.status === 'completed') {
                    showToast(`Analysis Complete: ${data.message}`, 'success');
                } else if (data.status === 'failed') {
                    showToast(`Analysis Failed: ${data.message}`, 'error');
                }
            } catch (e) {
                console.error('Error parsing SSE event:', e);
            }
        };

        eventSource.onerror = (err) => {
            // Silent error logging to avoid console spam during dev/reloads
            // console.error('SSE Error:', err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [showToast]);

    return (
        <NotificationContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            id={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onDismiss={dismissToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
