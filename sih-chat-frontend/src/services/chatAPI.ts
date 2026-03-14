import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface ChatRequest {
  sessionId: string;
  message: string;
  language?: string;
  manualLanguageOverride?: string;
}

export interface ChatResponse {
  reply: string;
  detectedLanguage?: string;
  confidence?: number;
  isTranslated?: boolean;
  metadata?: {
    requestId: string;
    model: string;
    tokens: number;
  };
}

export interface StreamingChatResponse {
  token: string;
  done: boolean;
  detectedLanguage?: string;
  confidence?: number;
  metadata?: {
    requestId: string;
    model: string;
    totalTokens: number;
  };
}

class ChatAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.setupInterceptors();
  }

  private setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        config.timeout = 30000; // 30 seconds
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNABORTED') {
          return Promise.reject(new Error('Request timeout'));
        }
        if (!error.response) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.reject(error);
      }
    );
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat`, request);
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }

  async *sendMessageStreaming(request: ChatRequest): AsyncGenerator<StreamingChatResponse, void, unknown> {
    try {
      const response = await fetch(`${this.baseURL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              yield data;
              if (data.done) return;
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming chat API error:', error);
      throw error;
    }
  }

  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    try {
      const response = await axios.post(`${this.baseURL}/api/detect-language`, { text });
      return response.data;
    } catch (error) {
      console.error('Language detection API error:', error);
      throw error;
    }
  }

  async createSession(): Promise<{ sessionId: string }> {
    try {
      const response = await axios.post(`${this.baseURL}/api/sessions`);
      return response.data;
    } catch (error) {
      console.error('Session creation API error:', error);
      throw error;
    }
  }
}

export const chatAPI = new ChatAPI();