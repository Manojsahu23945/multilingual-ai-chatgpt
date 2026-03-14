import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Mic, MicOff } from 'lucide-react';
import '../types/speech.d.ts';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, disabled = false }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      // Refocus input after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const isSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <div className="bg-white border-t border-secondary-200/50 shadow-inner-soft">
      {/* Professional input form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-end space-x-4 max-w-4xl mx-auto">
          {/* Professional input field container */}
          <div className="flex-1 relative">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('typeMessage') || 'Type your message...'}
                className="w-full bg-secondary-50 border border-secondary-200 rounded-2xl px-6 py-4 pr-16 text-secondary-800 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-300 resize-none shadow-sm hover:shadow-md disabled:bg-secondary-100 disabled:cursor-not-allowed"
                disabled={disabled}
                aria-label={t('messageInput') || 'Message input'}
                aria-describedby="send-help"
                maxLength={1000}
              />
              
              {/* Professional character counter */}
              {message.length > 800 && (
                <div className="absolute -top-8 right-4 bg-white px-2 py-1 rounded-md shadow-sm border border-secondary-200">
                  <span className={`text-xs font-medium ${
                    message.length > 950 ? 'text-red-500' : 
                    message.length > 900 ? 'text-amber-500' : 'text-secondary-500'
                  }`}>
                    {message.length}/1000
                  </span>
                </div>
              )}
              
              {/* Professional input decoration */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {message.trim() && (
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Professional microphone button */}
          {isSpeechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={disabled}
              className={`group relative p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isListening
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white focus:ring-red-500 shadow-lg'
                  : 'bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-600 hover:from-secondary-200 hover:to-secondary-300 focus:ring-primary-500'
              } disabled:from-secondary-100 disabled:to-secondary-100 disabled:text-secondary-400 disabled:cursor-not-allowed`}
              aria-label={isListening ? (t('stopListening') || 'Stop listening') : (t('startListening') || 'Start voice input')}
              title={isListening ? (t('stopListening') || 'Stop listening') : (t('startListening') || 'Start voice input')}
            >
              {isListening ? (
                <MicOff size={20} className="group-hover:scale-110 transition-transform" />
              ) : (
                <Mic size={20} className="group-hover:scale-110 transition-transform" />
              )}
              
              {/* Professional listening indicator */}
              {isListening && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          )}
          
          {/* Professional send button */}
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className={`group relative p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              message.trim() && !disabled
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg'
                : 'bg-gradient-to-br from-secondary-200 to-secondary-300 text-secondary-400 cursor-not-allowed'
            }`}
            aria-label={t('sendMessage') || 'Send message'}
            title={t('sendMessage') || 'Send message'}
          >
            <Send size={20} className="group-hover:scale-110 transition-transform" />
            
            {/* Professional send indicator */}
            {message.trim() && !disabled && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        </div>
        
        {/* Professional help text */}
        <div id="send-help" className="mt-4 flex items-center justify-between text-xs text-secondary-500">
          <div className="flex items-center space-x-4">
            <span>{t('sendHelp') || 'Press Enter to send, Shift+Enter for new line'}</span>
            {isSpeechSupported && (
              <span className="hidden sm:inline flex items-center space-x-1">
                <Mic size={12} />
                <span>Voice input available</span>
              </span>
            )}
          </div>
          
          {/* Professional status indicators */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-success-500">
              <div className="w-1.5 h-1.5 bg-success-500 rounded-full"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1 text-primary-500">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
              <span>AI Ready</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputBar;