"use client";

import { createContext, useContext } from "react";

interface ChatContextType {
  isLoading: boolean;
  error: Error | null;
}

const ChatContext = createContext<ChatContextType>({
  isLoading: false,
  error: null,
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  return <ChatContext.Provider value={{ isLoading: false, error: null }}>{children}</ChatContext.Provider>;
}

export function useChat() {
  return useContext(ChatContext);
}
