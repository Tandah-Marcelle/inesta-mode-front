import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotContextType {
  messages: Message[];
  sendMessage: (text: string) => void;
  isChatOpen: boolean;
  toggleChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | null>(null);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Inesta Mode. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const sendMessage = (text: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Thank you for your message! How can I assist you with our dresses?",
        "I'd be happy to help you find the perfect dress for your occasion.",
        "Would you like information about our latest collections?",
        "We offer custom sizing on all our dresses. Would you like to know more?",
        "Our dresses are handmade with premium fabrics. Can I tell you more about our process?",
        "Would you like to schedule a virtual fitting session?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <ChatbotContext.Provider value={{ messages, sendMessage, isChatOpen, toggleChat }}>
      {children}
    </ChatbotContext.Provider>
  );
};