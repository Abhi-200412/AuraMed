'use client';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Message = ({ text, isUser = false }: { text: string; isUser?: boolean }) => (
  <motion.div
    className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}
    variants={messageVariants}
  >
    {!isUser && (
      <div className="w-8 h-8 rounded-full bg-secondary/20 flex-shrink-0 flex items-center justify-center">
        <Bot size={16} className="text-secondary" />
      </div>
    )}
    <div
      className={`max-w-[75%] p-3 rounded-xl transition-transform hover:scale-105 ${
        isUser
          ? 'bg-primary text-white rounded-br-none'
          : 'bg-surface-light text-text-primary rounded-bl-none'
      }`}
    >
      <p className="text-sm">{text}</p>
    </div>
    {isUser && (
      <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
        <User size={16} className="text-primary" />
      </div>
    )}
  </motion.div>
);

const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    <motion.div
      className="w-2 h-2 bg-text-secondary rounded-full"
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="w-2 h-2 bg-text-secondary rounded-full"
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
    />
    <motion.div
      className="w-2 h-2 bg-text-secondary rounded-full"
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    />
  </div>
);

export const AICompanionUI = () => {
  const chatContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 1.2,
      },
    },
  };

  return (
    <motion.div
      className="w-full h-80 bg-surface rounded-2xl p-4 flex flex-col gap-4 border border-white/10"
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.7 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <motion.div
        className="flex flex-col gap-4"
        variants={chatContainerVariants}
      >
        <Message text="Hello! I'm your AI Health Companion. How are you feeling today?" />
        <Message isUser text="I've been having some headaches lately." />
        <Message text="I'm sorry to hear that. Can you tell me more about the location and intensity of the pain?" />
      </motion.div>
      <div className="flex-1" />
      <div className="h-10 bg-surface-light rounded-lg flex items-center px-3">
        <TypingIndicator />
      </div>
    </motion.div>
  );
};
