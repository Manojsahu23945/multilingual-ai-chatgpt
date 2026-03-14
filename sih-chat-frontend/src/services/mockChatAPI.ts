import { franc } from 'franc-min';
import { getContextualReply } from '../utils/mockReplies';
import type { ChatRequest, ChatResponse, StreamingChatResponse } from './chatAPI';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  language: string;
  keywords: string[];
}

class MockChatAPI {
  private faqs: FAQ[] = [];
  private requestId = 0;

  constructor() {
    this.loadFAQs();
    this.seedDefaultFAQs();
  }

  private loadFAQs() {
    try {
      const stored = localStorage.getItem('sih-chat-faqs');
      if (stored) {
        this.faqs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  }

  private saveFAQs() {
    try {
      localStorage.setItem('sih-chat-faqs', JSON.stringify(this.faqs));
    } catch (error) {
      console.error('Error saving FAQs:', error);
    }
  }

  private seedDefaultFAQs() {
    if (this.faqs.length === 0) {
      this.faqs = [
        {
          id: '1',
          question: 'What is SIH Chat?',
          answer: 'SIH Chat is an intelligent multilingual chat platform designed for the Smart India Hackathon. It supports real-time communication in multiple Indian languages with advanced features like language detection, voice input, and text-to-speech.',
          language: 'en',
          keywords: ['sih', 'chat', 'what', 'platform', 'about'],
        },
        {
          id: '2',
          question: 'Which languages are supported?',
          answer: 'We support English, Hindi (हिंदी), Telugu (తెలుగు), and Tamil (தமிழ்) with automatic language detection and translation capabilities.',
          language: 'en',
          keywords: ['language', 'languages', 'supported', 'hindi', 'telugu', 'tamil'],
        },
        {
          id: '3',
          question: 'How does voice input work?',
          answer: 'Click the microphone button to start voice recognition. Speak clearly and the system will convert your speech to text. Voice input supports multiple languages with high accuracy.',
          language: 'en',
          keywords: ['voice', 'microphone', 'speech', 'recognition', 'speak'],
        },
        {
          id: '4',
          question: 'SIH चैट क्या है?',
          answer: 'SIH चैट एक बुद्धिमान बहुभाषी चैट प्लेटफॉर्म है जो स्मार्ट इंडिया हैकाथॉन के लिए डिज़ाइन किया गया है। यह भाषा पहचान, आवाज़ इनपुट और टेक्स्ट-टू-स्पीच जैसी उन्नत सुविधाओं के साथ कई भारतीय भाषाओं में वास्तविक समय संचार का समर्थन करता है।',
          language: 'hi',
          keywords: ['sih', 'चैट', 'क्या', 'प्लेटफॉर्म', 'के बारे में'],
        },
      ];
      this.saveFAQs();
    }
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    this.requestId++;
    const detectedLanguage = await this.detectLanguage(request.message);
    
    // Try to find FAQ match
    const faqMatch = this.findFAQMatch(request.message);
    let reply: string;
    
    if (faqMatch) {
      reply = faqMatch.answer;
    } else {
      reply = getContextualReply(request.message);
    }

    return {
      reply,
      detectedLanguage: detectedLanguage.language,
      confidence: detectedLanguage.confidence,
      isTranslated: false,
      metadata: {
        requestId: `mock-${this.requestId}`,
        model: 'mock-gpt-3.5',
        tokens: reply.length,
      },
    };
  }

  async *sendMessageStreaming(request: ChatRequest): AsyncGenerator<StreamingChatResponse, void, unknown> {
    const response = await this.sendMessage(request);
    const words = response.reply.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      
      yield {
        token: i === 0 ? words[i] : ' ' + words[i],
        done: false,
        detectedLanguage: response.detectedLanguage,
        confidence: response.confidence,
      };
    }
    
      yield {
        token: '',
        done: true,
        detectedLanguage: response.detectedLanguage,
        confidence: response.confidence,
        metadata: {
          requestId: response.metadata?.requestId || `mock-${this.requestId}`,
          model: response.metadata?.model || 'mock-gpt-3.5',
          totalTokens: response.metadata?.tokens || response.reply.length,
        },
      };
  }

  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    try {
      const detected = franc(text);
      const languageMap: Record<string, string> = {
        'eng': 'en',
        'hin': 'hi',
        'tel': 'te',
        'tam': 'ta',
      };
      
      const language = languageMap[detected] || 'en';
      const confidence = Math.random() * 0.3 + 0.7; // Mock confidence between 0.7-1.0
      
      return { language, confidence };
    } catch (error) {
      return { language: 'en', confidence: 0.5 };
    }
  }

  private findFAQMatch(message: string): FAQ | null {
    const messageLower = message.toLowerCase();
    const words = messageLower.split(/\s+/);
    
    for (const faq of this.faqs) {
      const keywordMatches = faq.keywords.filter(keyword => 
        words.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))
      );
      
      if (keywordMatches.length >= 1) {
        return faq;
      }
    }
    
    return null;
  }

  async createSession(): Promise<{ sessionId: string }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { sessionId: `mock-session-${Date.now()}` };
  }

  // FAQ Management
  getFAQs(): FAQ[] {
    return [...this.faqs];
  }

  addFAQ(faq: Omit<FAQ, 'id'>): FAQ {
    const newFAQ: FAQ = {
      ...faq,
      id: Date.now().toString(),
    };
    this.faqs.push(newFAQ);
    this.saveFAQs();
    return newFAQ;
  }

  updateFAQ(id: string, updates: Partial<Omit<FAQ, 'id'>>): FAQ | null {
    const index = this.faqs.findIndex(faq => faq.id === id);
    if (index === -1) return null;
    
    this.faqs[index] = { ...this.faqs[index], ...updates };
    this.saveFAQs();
    return this.faqs[index];
  }

  deleteFAQ(id: string): boolean {
    const index = this.faqs.findIndex(faq => faq.id === id);
    if (index === -1) return false;
    
    this.faqs.splice(index, 1);
    this.saveFAQs();
    return true;
  }
}

export const mockChatAPI = new MockChatAPI();
export type { FAQ };