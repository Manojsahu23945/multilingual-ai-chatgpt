import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Brain } from 'lucide-react';
import MessageBubble from './MessageBubble.tsx';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date | string;
  language?: string;
  detectedLanguage?: string;
  isTranslated?: boolean;
  confidence?: number;
  isStreaming?: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  isTyping?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading = false, isTyping = false }) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [messages, isLoading, isTyping]);

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto bg-gradient-to-b from-secondary-25 to-white relative chat-scrollbar"
      role="log"
      aria-live="polite"
      aria-label={t('chatWindow') || 'Chat messages'}
      tabIndex={0}
    >
      {/* Professional chat background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Chat content */}
      <div className="relative z-10 p-6 space-y-6 min-h-full">
        {messages.length === 0 ? (
          /* Professional welcome screen */
          <div className="flex items-center justify-center h-full min-h-96">
            <div className="text-center max-w-md space-y-6 animate-fade-in">
              {/* Professional welcome icon */}
              <div className="relative mx-auto w-20 h-20">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center shadow-elegant">
                  <Brain size={32} className="text-primary-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles size={16} className="text-white" />
                </div>
              </div>
              
              {/* Professional welcome content */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-secondary-800">
                  {t('welcomeTitle') || 'Welcome to SIH Chat'}
                </h2>
                <p className="text-secondary-600 leading-relaxed">
                  {t('welcomeMessage') || 'Your intelligent conversation partner is ready. Start by sending a message below to begin our interaction.'}
                </p>
              </div>
              
              {/* Professional feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-secondary-100">
                  <div className="text-primary-600 font-semibold">Smart AI</div>
                  <div className="text-secondary-500">Intelligent responses</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-secondary-100">
                  <div className="text-success-600 font-semibold">Secure</div>
                  <div className="text-secondary-500">Privacy protected</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-secondary-100">
                  <div className="text-accent-600 font-semibold">Multi-lingual</div>
                  <div className="text-secondary-500">4+ languages</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Professional message list */
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MessageBubble
                  message={message.text}
                  sender={message.sender}
                  timestamp={typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp}
                  language={message.language}
                  detectedLanguage={message.detectedLanguage}
                  isTranslated={message.isTranslated}
                  confidence={message.confidence}
                  isStreaming={message.isStreaming}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Professional loading indicator */}
        {(isLoading || isTyping) && (
          <div className="flex justify-start animate-slide-up">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-elegant border border-secondary-100 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-secondary-600 font-medium">
                  {isTyping ? 'AI is typing...' : 'AI is thinking...'}
                </span>
              </div>
              <span className="sr-only">{t('loading') || 'Loading response...'}</span>
            </div>
          </div>
        )}
        
        {/* Invisible element for auto-scrolling */}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>
    </div>
  );
};

export default ChatWindow;