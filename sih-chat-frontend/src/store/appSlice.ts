import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppSettings {
  demoMode: boolean;
  voiceEnabled: boolean;
  ttsEnabled: boolean;
  streamingEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

interface AppState {
  settings: AppSettings;
  isOnline: boolean;
  lastActivity: string;
  sessionId: string;
}

const initialState: AppState = {
  settings: {
    demoMode: false,
    voiceEnabled: true,
    ttsEnabled: false,
    streamingEnabled: true,
    theme: 'light',
  },
  isOnline: true,
  lastActivity: new Date().toISOString(),
  sessionId: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setDemoMode: (state, action: PayloadAction<boolean>) => {
      state.settings.demoMode = action.payload;
    },
    setVoiceEnabled: (state, action: PayloadAction<boolean>) => {
      state.settings.voiceEnabled = action.payload;
    },
    setTtsEnabled: (state, action: PayloadAction<boolean>) => {
      state.settings.ttsEnabled = action.payload;
    },
    setStreamingEnabled: (state, action: PayloadAction<boolean>) => {
      state.settings.streamingEnabled = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.settings.theme = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    resetApp: (state) => {
      return { ...initialState, sessionId: state.sessionId };
    },
  },
});

export const {
  setDemoMode,
  setVoiceEnabled,
  setTtsEnabled,
  setStreamingEnabled,
  setTheme,
  setOnlineStatus,
  updateLastActivity,
  setSessionId,
  resetApp,
} = appSlice.actions;

export default appSlice.reducer;