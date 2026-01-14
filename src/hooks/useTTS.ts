import { useCallback } from 'react'

export default function useTTS() {
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(u)
    }
  }, [])

  return { speak }
}
