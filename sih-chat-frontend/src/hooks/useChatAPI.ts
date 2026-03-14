import { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addMessage,
  setLoading,
  setTyping,
  setError,
  setSessionId,
  setDetectedLanguage,
  startStreaming,
  appendToStreamingMessage,
  stopStreaming,
  type ChatMessage,
} from '../store/chatSlice';
import { setSessionId as setAppSessionId } from '../store/appSlice';
import { chatAPI } from '../services/chatAPI';
import { mockChatAPI } from '../services/mockChatAPI';

export const useChatAPI = () => {
  const dispatch = useAppDispatch();
  const { messages, isLoading, isTyping, sessionId, error, streamingMessageId } = useAppSelector(
    (state) => state.chat
  );
  const { settings } = useAppSelector((state) => state.app);
  const { demoMode, streamingEnabled } = settings;

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      if (!sessionId) {
        try {
          const api = demoMode ? mockChatAPI : chatAPI;
          const { sessionId: newSessionId } = await api.createSession();
          dispatch(setSessionId(newSessionId));
          dispatch(setAppSessionId(newSessionId));
        } catch (error) {
          console.error('Failed to create session:', error);
          // Fallback to local session ID
          const fallbackSessionId = `local-${uuidv4()}`;
          dispatch(setSessionId(fallbackSessionId));
          dispatch(setAppSessionId(fallbackSessionId));
        }
      }
    };

    initializeSession();
  }, [sessionId, demoMode, dispatch]);

  const sendMessage = useCallback(
    async (messageText: string, language?: string, manualLanguageOverride?: string) => {
      if (!messageText.trim() || isLoading) return;

      const userMessageId = uuidv4();
      const userMessage: ChatMessage = {
        id: userMessageId,
        text: messageText.trim(),
        sender: 'user',
        timestamp: new Date().toISOString(),
        language: language || 'auto',
        metadata: {
          sessionId,
        },
      };

      // Add user message immediately
      dispatch(addMessage(userMessage));
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const api = demoMode ? mockChatAPI : chatAPI;
        const request = {
          sessionId,
          message: messageText.trim(),
          language,
          manualLanguageOverride,
        };

        if (streamingEnabled && !demoMode) {
          // Handle streaming response
          const botMessageId = uuidv4();
          const botMessage: ChatMessage = {
            id: botMessageId,
            text: '',
            sender: 'bot',
            timestamp: new Date().toISOString(),
            isStreaming: true,
            metadata: {
              sessionId,
            },
          };

          dispatch(addMessage(botMessage));
          dispatch(startStreaming(botMessageId));
          dispatch(setTyping(true));

          try {
            for await (const chunk of api.sendMessageStreaming(request)) {
              if (chunk.done) {
                dispatch(stopStreaming());
                dispatch(setTyping(false));
                if (chunk.detectedLanguage) {
                  dispatch(setDetectedLanguage(chunk.detectedLanguage));
                }
                if (chunk.metadata) {
                  dispatch(
                    addMessage({
                      ...botMessage,
                      metadata: { ...botMessage.metadata, ...chunk.metadata },
                    })
                  );
                }
                break;
              } else {
                dispatch(appendToStreamingMessage({ id: botMessageId, text: chunk.token }));
                if (chunk.detectedLanguage) {
                  dispatch(setDetectedLanguage(chunk.detectedLanguage));
                }
              }
            }
          } catch (streamError) {
            console.error('Streaming error:', streamError);
            dispatch(stopStreaming());
            dispatch(setTyping(false));
            // Fallback to regular API call
            const response = await api.sendMessage(request);
            dispatch(
              addMessage({
                ...botMessage,
                text: response.reply,
                isStreaming: false,
                detectedLanguage: response.detectedLanguage,
                confidence: response.confidence,
                isTranslated: response.isTranslated,
                metadata: {
                  sessionId,
                  ...response.metadata,
                },
              })
            );
          }
        } else {
          // Handle regular response
          dispatch(setTyping(true));
          const response = await api.sendMessage(request);

          const botMessage: ChatMessage = {
            id: uuidv4(),
            text: response.reply,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            detectedLanguage: response.detectedLanguage,
            confidence: response.confidence,
            isTranslated: response.isTranslated,
            metadata: {
              sessionId,
              ...response.metadata,
            },
          };

          dispatch(addMessage(botMessage));
          if (response.detectedLanguage) {
            dispatch(setDetectedLanguage(response.detectedLanguage));
          }
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        dispatch(setError(errorMessage));

        // Add error message to chat
        const errorBotMessage: ChatMessage = {
          id: uuidv4(),
          text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          metadata: {
            sessionId,
          },
        };
        dispatch(addMessage(errorBotMessage));
      } finally {
        dispatch(setLoading(false));
        dispatch(setTyping(false));
      }
    },
    [sessionId, isLoading, demoMode, streamingEnabled, dispatch]
  );

  const clearMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find((msg) => msg.sender === 'user');
    if (lastUserMessage) {
      sendMessage(lastUserMessage.text, lastUserMessage.language);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    isTyping,
    error,
    sessionId,
    streamingMessageId,
    sendMessage,
    clearMessages,
    retryLastMessage,
  };
};

export type { ChatMessage };