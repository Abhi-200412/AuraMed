'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Stethoscope } from 'lucide-react';

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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export function PatientMessaging({ doctor }: { doctor: Doctor }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [patientInfo, setPatientInfo] = useState<any>(null);

  useEffect(() => {
    // Load patient information from localStorage
    const storedPatientInfo = localStorage.getItem('patientInfo');
    if (storedPatientInfo) {
      setPatientInfo(JSON.parse(storedPatientInfo));
    }
    
    fetchMessages();
  }, [doctor.id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // In a real app, you would filter by patient ID
      const response = await fetch(`/api/messages?patientId=${patientInfo?.id || 'current-patient'}`);
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
    if (!newMessage.trim() || sending || !patientInfo) return;

    try {
      setSending(true);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: patientInfo.id || 'current-patient', // Patient ID
          senderRole: 'patient',
          recipientId: doctor.id,
          recipientRole: 'doctor',
          patientId: patientInfo.id || 'current-patient',
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
          <h3 className="text-xl font-bold">Message {doctor.name}</h3>
          <p className="text-sm text-text-secondary">{doctor.specialty}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <p>No messages yet. Send a message to your doctor.</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderRole === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderRole === 'patient'
                    ? 'bg-secondary text-white rounded-br-none'
                    : 'bg-surface-light text-text-primary rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderRole === 'patient' ? 'text-secondary-foreground/70' : 'text-text-secondary'
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
          placeholder={`Message ${doctor.name}...`}
          className="flex-1 px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-secondary outline-none transition-colors placeholder:text-text-secondary resize-none"
          rows={2}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || sending}
          className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-accent disabled:opacity-50 transition-colors flex items-center justify-center"
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