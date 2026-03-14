import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  language?: string;
  detectedLanguage?: string;
  isTranslated?: boolean;
  confidence?: number;
  isStreaming?: boolean;
  metadata?: {
    sessionId?: string;
    requestId?: string;
    model?: string;
    tokens?: number;
  };
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  currentLanguage: string;
  detectedLanguage?: string;
  manualLanguageOverride?: string;
  sessionId: string;
  streamingMessageId?: string;
  error: string | null;
  messageHistory: string[];
  currentMessageIndex: number;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isTyping: false,
  currentLanguage: 'en',
  sessionId: '',
  messageHistory: [],
  currentMessageIndex: -1,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      if (action.payload.sender === 'user') {
        state.messageHistory.push(action.payload.text);
        state.currentMessageIndex = state.messageHistory.length;
      }
    },
    updateMessage: (state, action: PayloadAction<{ id: string; updates: Partial<ChatMessage> }>) => {
      const messageIndex = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = { ...state.messages[messageIndex], ...action.payload.updates };
      }
    },
    startStreaming: (state, action: PayloadAction<string>) => {
      state.streamingMessageId = action.payload;
    },
    appendToStreamingMessage: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const messageIndex = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (messageIndex !== -1) {
        state.messages[messageIndex].text += action.payload.text;
      }
    },
    stopStreaming: (state) => {
      state.streamingMessageId = undefined;
      const streamingMessage = state.messages.find(msg => msg.isStreaming);
      if (streamingMessage) {
        streamingMessage.isStreaming = false;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
    },
    setDetectedLanguage: (state, action: PayloadAction<string>) => {
      state.detectedLanguage = action.payload;
    },
    setManualLanguageOverride: (state, action: PayloadAction<string | undefined>) => {
      state.manualLanguageOverride = action.payload;
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.messageHistory = [];
      state.currentMessageIndex = -1;
      state.error = null;
    },
    navigateHistory: (state, action: PayloadAction<'up' | 'down'>) => {
      if (action.payload === 'up' && state.currentMessageIndex > 0) {
        state.currentMessageIndex -= 1;
      } else if (action.payload === 'down' && state.currentMessageIndex < state.messageHistory.length) {
        state.currentMessageIndex += 1;
      }
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
  },
});

export const {
  addMessage,
  updateMessage,
  startStreaming,
  appendToStreamingMessage,
  stopStreaming,
  setLoading,
  setTyping,
  setLanguage,
  setDetectedLanguage,
  setManualLanguageOverride,
  setSessionId,
  setError,
  clearMessages,
  navigateHistory,
  deleteMessage,
} = chatSlice.actions;

export default chatSlice.reducer;

export type { ChatMessage };