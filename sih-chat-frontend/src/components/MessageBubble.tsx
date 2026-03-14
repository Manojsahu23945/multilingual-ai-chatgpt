import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
  detectedLanguage?: string;
  isTranslated?: boolean;
  confidence?: number;
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  sender, 
  timestamp, 
  language, 
  detectedLanguage, 
  isTranslated, 
  confidence, 
  isStreaming 
}) => {
  const isUser = sender === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.25, 0, 1],
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      className={`flex items-end space-x-3 group ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Professional avatar for bot messages */}
      {!isUser && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          className="flex-shrink-0 mb-2"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-elegant ring-2 ring-white">
              <Bot size={18} className="text-white" aria-hidden="true" />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-400 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </motion.div>
      )}
      
      {/* Professional message bubble */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
        className={`relative max-w-md lg:max-w-lg xl:max-w-xl ${
          isUser ? 'order-1' : 'order-2'
        }`}
      >
        {/* Professional message content */}
        <div
          className={`relative px-6 py-4 shadow-elegant backdrop-blur-sm ${
            isUser
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-3xl rounded-br-lg'
              : 'bg-white text-secondary-800 border border-secondary-100 rounded-3xl rounded-bl-lg'
          } group-hover:shadow-professional transition-all duration-300`}
          role="article"
          aria-label={`Message from ${isUser ? 'you' : 'assistant'} at ${timestamp.toLocaleTimeString()}`}
        >
          {/* Professional message text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
            {message}
          </p>
          
          {/* Professional timestamp and status */}
          <div className={`flex items-center justify-between mt-3 pt-2 border-t ${
            isUser ? 'border-primary-400/30' : 'border-secondary-100'
          }`}>
            <time 
              dateTime={timestamp.toISOString()}
              className={`text-xs font-medium ${
                isUser ? 'text-primary-100' : 'text-secondary-500'
              }`}
              aria-label={`Sent at ${timestamp.toLocaleString()}`}
            >
              {timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </time>
            
            {/* Professional message status for user messages */}
            {isUser && (
              <div className="flex items-center space-x-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <CheckCheck size={14} className="text-primary-200" />
                </motion.div>
              </div>
            )}
          </div>
          
          {/* Professional message tail */}
          <div className={`absolute bottom-0 w-4 h-4 ${
            isUser 
              ? 'right-0 transform translate-x-2 translate-y-2 bg-gradient-to-br from-primary-500 to-primary-600' 
              : 'left-0 transform -translate-x-2 translate-y-2 bg-white border-l border-b border-secondary-100'
          } rotate-45`} />
        </div>
      </motion.div>
      
      {/* Professional avatar for user messages */}
      {isUser && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          className="flex-shrink-0 mb-2 order-2"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center shadow-elegant ring-2 ring-white">
              <User size={18} className="text-white" aria-hidden="true" />
            </div>
            {/* Active indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-400 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MessageBubble;