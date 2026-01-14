'use client';

import { motion } from 'framer-motion';
import { Bot, Send } from 'lucide-react';
import { useState } from 'react';

export function AICompanionCard() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // In a real app, you'd send the message to your AI service
    const botResponse = "I'm here to help. How are you feeling today?";
    setChatHistory([...chatHistory, { user: message, bot: botResponse }]);
    setMessage('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <motion.div whileHover={{ scale: 1.1 }} className="mr-4">
          <Bot size={40} className="text-primary" />
        </motion.div>
        <div>
          <h3 className="text-xl font-bold">Your AI Health Companion</h3>
          <p className="text-text-secondary">Ask me anything about your health.</p>
        </div>
      </div>
      <div className="space-y-4 h-48 overflow-y-auto mb-4 p-2 bg-surface-light/50 rounded-lg">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <p className="text-right font-semibold">{chat.user}</p>
            <p className="text-primary">{chat.bot}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-surface-light border border-border/20 focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <motion.button
          onClick={handleSendMessage}
          className="px-4 py-2 rounded-lg bg-primary text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Send size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}
