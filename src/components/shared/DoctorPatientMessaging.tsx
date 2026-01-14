'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  senderName: string;
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  doctorName: string;
  patientName: string;
  messages: Message[];
}

export function DoctorPatientMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      doctorName: 'Dr. Smith',
      patientName: 'John Doe',
      messages: [
        {
          id: '1',
          sender: 'doctor',
          senderName: 'Dr. Smith',
          content: 'Hi John, I reviewed your latest scan. Everything looks good!',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          sender: 'patient',
          senderName: 'John Doe',
          content: 'That\'s great news, doctor. Thank you for reviewing it so quickly!',
          timestamp: new Date(Date.now() - 1800000),
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState('1');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: Date.now().toString(),
                sender: 'doctor',
                senderName: 'Dr. Smith',
                content: newMessage,
                timestamp: new Date(),
              },
            ],
          };
        }
        return conv;
      })
    );
    setNewMessage('');
  };

  const currentConversation = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="glass rounded-xl overflow-hidden h-96 flex">
      {/* Conversation List */}
      <div className="w-64 border-r border-border/20 overflow-y-auto">
        <div className="p-4 border-b border-border/20">
          <h2 className="font-bold text-lg">Messages</h2>
        </div>
        <div className="space-y-1 p-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedConversation === conv.id
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-surface-light/50'
              }`}
            >
              <p className="font-semibold text-sm">{conv.patientName}</p>
              <p className="text-xs text-text-secondary">{conv.doctorName}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {currentConversation && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border/20 p-4">
            <p className="font-bold">{currentConversation.patientName}</p>
            <p className="text-sm text-text-secondary">{currentConversation.doctorName}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentConversation.messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'doctor' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'doctor'
                      ? 'bg-surface-light text-text-primary'
                      : 'bg-primary/20 text-primary'
                  }`}
                >
                  <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border/20 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:shadow-lg disabled:opacity-50 transition-all"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
