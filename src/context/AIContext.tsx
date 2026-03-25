import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIContextType {
  isAIChatVisible: boolean;
  openAIChat: () => void;
  closeAIChat: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);

  const openAIChat = () => setIsAIChatVisible(true);
  const closeAIChat = () => setIsAIChatVisible(false);

  return (
    <AIContext.Provider value={{ isAIChatVisible, openAIChat, closeAIChat }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
