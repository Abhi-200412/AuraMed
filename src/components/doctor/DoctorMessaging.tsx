'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Phone, Mail } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  recipientId: string;
  recipientRole: string;
  patientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Patient {
  id: string;
  name: string;
  contact: string;
  email: string;
}

export function DoctorMessaging({ patient }: { patient: Patient }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [patient.id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?patientId=${patient.id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: 'DOC-001', // Doctor ID
          senderRole: 'doctor',
          recipientId: patient.id,
          recipientRole: 'patient',
          patientId: patient.id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 border border-border/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Message {patient.name}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{patient.contact}</span>
            </div>
            {patient.email !== 'N/A' && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{patient.email}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <p>No messages yet. Send a message to start the conversation.</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderRole === 'doctor' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderRole === 'doctor'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-surface-light text-text-primary rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderRole === 'doctor' ? 'text-primary-foreground/70' : 'text-text-secondary'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Message ${patient.name}...`}
          className="flex-1 px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary resize-none"
          rows={2}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || sending}
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}