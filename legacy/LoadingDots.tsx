import React from 'react'

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-200" />
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-400" />
    </div>
  )
}

export default LoadingDots
