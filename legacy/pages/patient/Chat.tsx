import React, { useState, useRef } from 'react'
import AIAvatar from '../../components/AIAvatar'
import LoadingDots from '../../components/LoadingDots'
import useTTS from '../../hooks/useTTS'
import VoiceInput from '../../components/VoiceInput'
import LottiePlayer from '../../components/LottiePlayer'
import placeholderLottie from '../../assets/lottie/placeholder.json'
import Message from '../../components/Message'

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)

  const { speak } = useTTS()

  const send = async () => {
    if (!input) return
    setMessages((s) => [...s, { from: 'user', text: input }])
    setInput('')
    setThinking(true)
    // placeholder /api/chat
    await fetch('/api/chat', { method: 'POST' })
    setTimeout(() => {
      setMessages((s) => [...s, { from: 'ai', text: 'I hear you. You are not alone.' }])
      setThinking(false)
    }, 1200)
  }

  const onVoice = (text: string) => {
    setInput(text)
    send()
  }

  return (
    <div className="mt-6">
      <div className="flex gap-4 items-start">
        <AIAvatar speaking={thinking} />
        <div className="flex-1">
          <div className="space-y-2 max-h-[50vh] overflow-auto pr-2">
            {messages.map((m, i) => (
              <Message key={i} from={m.from}>{m.text}</Message>
            ))}
            {thinking && (
              <div className="flex items-center gap-4">
                <LottiePlayer src={placeholderLottie} className="w-20 h-20" />
                <LoadingDots />
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2 items-center">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-2 rounded glass" />
            <VoiceInput onResult={onVoice} />
            <button onClick={() => { send(); speak('Sending your message to Aura'); }} className="px-4 py-2 glass rounded">Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
