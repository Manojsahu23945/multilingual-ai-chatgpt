import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import LanguageSelector from './components/LanguageSelector';
import { useChatAPI } from './hooks/useChatAPI';
import { useAppSelector } from './store/hooks';

function App() {
  const { messages, isLoading, isTyping, sendMessage } = useChatAPI();
  const { settings } = useAppSelector((state) => state.app);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple header for testing */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <Header />
          <LanguageSelector />
        </div>
      </div>
      
      {/* Main chat container */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full bg-white shadow-lg rounded-t-2xl mt-4 overflow-hidden">
        <ChatWindow messages={messages} isLoading={isLoading} isTyping={isTyping} />
        <InputBar onSendMessage={sendMessage} disabled={isLoading} />
      </div>
      
      {/* Simple footer */}
      <div className="text-center py-4 text-gray-500 text-sm">
        <p>
          SIH Chat Platform - Secure & Intelligent Communication
          {settings.demoMode && (
            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              Demo Mode
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default App;
