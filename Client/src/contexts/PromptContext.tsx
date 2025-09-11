import React, { createContext, useContext } from "react";

interface PromptContextType {
  showPrompt: (options: {
    title: string;
    defaultValue?: string;
  }) => Promise<string | null>;
}

const PromptContext = createContext<PromptContextType | null>(null);

export const PromptProvider: React.FC<{
  children: React.ReactNode;
  showPrompt: (options: {
    title: string;
    defaultValue?: string;
  }) => Promise<string | null>;
}> = ({ children, showPrompt }) => {
  return (
    <PromptContext.Provider value={{ showPrompt }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return context;
};
