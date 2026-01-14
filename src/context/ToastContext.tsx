import React, { createContext, useContext, useState } from 'react'

type Toast = { id: string; message: string }

const ToastCtx = createContext<any>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = (message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((s) => [...s, { id, message }])
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 4000)
  }

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed right-4 top-4 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="glass px-4 py-2 rounded">{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
