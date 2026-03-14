import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header 
      className="flex items-center space-x-4"
      role="banner"
      aria-label="Application header"
    >
      {/* Simple logo design for testing */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare 
              size={24} 
              className="text-white" 
              aria-hidden="true"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
            <Sparkles size={10} className="text-white" aria-hidden="true" />
          </div>
        </div>
        
        {/* Simple branding */}
        <div className="flex flex-col">
          <h1 
            className="text-2xl font-bold text-gray-800 tracking-tight"
            id="app-title"
          >
            {t('welcome') || 'SIH Chat'}
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            Smart Innovation Hub
          </p>
        </div>
      </div>
      
      {/* Simple status indicator */}
      <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Online</span>
      </div>
    </header>
  );
};

export default Header;