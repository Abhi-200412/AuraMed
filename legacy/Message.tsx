import React from 'react'
import { motion } from 'framer-motion'

const Message: React.FC<{ from: 'ai' | 'user'; children: React.ReactNode }> = ({ from, children }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={`p-2 rounded ${from === 'ai' ? 'bg-white/5 text-slate-100' : 'bg-cyan-900/40 text-cyan-200'}`}>
      {children}
    </motion.div>
  )
}

export default Message
