import React from 'react'
import Lottie from 'lottie-react'

const LottiePlayer: React.FC<{ src: any; loop?: boolean; className?: string }> = ({ src, loop = true, className }) => {
  return <Lottie animationData={src} loop={loop} className={className} />
}

export default LottiePlayer
