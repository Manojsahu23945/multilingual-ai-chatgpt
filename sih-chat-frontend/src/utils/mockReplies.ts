const mockReplies = [
  "Hello! How can I help you today?",
  "That's an interesting question. Let me think about it.",
  "I understand your concern. Here's what I suggest:",
  "Thank you for sharing that information with me.",
  "Can you provide more details about this?",
  "I'm here to assist you with any questions you might have.",
  "Let me help you with that request.",
  "That sounds like a great idea! Tell me more.",
];

export const getRandomReply = (): string => {
  const randomIndex = Math.floor(Math.random() * mockReplies.length);
  return mockReplies[randomIndex];
};

export const getContextualReply = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! Welcome to SIH Chat. How can I assist you today?";
  }
  
  if (lowerMessage.includes('help')) {
    return "I'm here to help! You can ask me questions and I'll do my best to provide useful answers.";
  }
  
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return "Goodbye! Have a great day!";
  }
  
  if (lowerMessage.includes('thank')) {
    return "You're welcome! I'm glad I could help.";
  }
  
  // Default to random reply
  return getRandomReply();
};