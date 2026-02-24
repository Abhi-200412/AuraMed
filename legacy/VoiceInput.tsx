import React, { useEffect, useState } from 'react'

type Props = { onResult: (text: string) => void }

const VoiceInput: React.FC<Props> = ({ onResult }) => {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }, [])

  const start = () => {
    const Rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!Rec) return
    const r = new Rec()
    r.lang = 'en-US'
    r.interimResults = false
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript
      onResult(t)
    }
    r.onend = () => setListening(false)
    r.start()
    setListening(true)
  }

  if (!supported) return <div className="text-sm text-slate-500">Voice not supported</div>

  return (
    <button onClick={start} className={`px-3 py-2 glass rounded ${listening ? 'bg-cyan-600' : ''}`}>
      {listening ? 'Listening...' : 'Voice Input'}
    </button>
  )
}

export default VoiceInput
