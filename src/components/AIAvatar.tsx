
import React from 'react'
import { motion } from 'framer-motion'

const AIAvatar: React.FC<{ speaking?: boolean }> = ({ speaking = false }) => {
  return (
    <motion.div
      animate={speaking ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 1.2, repeat: Infinity }}
      className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center neon"
    >
      <motion.div animate={speaking ? { opacity: [0.8, 1, 0.8] } : { opacity: 1 }} className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
        AI
      </motion.div>
    </motion.div>
  )
}

export default AIAvatar
