import React, { createContext, useContext, useState } from 'react'

type Role = 'patient' | 'doctor' | 'admin' | null

interface AppState {
  role: Role
  setRole: (r: Role) => void
  textSize: number
}

const AppCtx = createContext<AppState | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null)
  const [textSize] = useState<number>(16)

  return (
    <AppCtx.Provider value={{ role, setRole, textSize }}>{children}</AppCtx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
