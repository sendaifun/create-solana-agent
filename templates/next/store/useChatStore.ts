import { create } from 'zustand'

interface ChatStore {
  initialMessage: string
  setInitialMessage: (message: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  initialMessage: '',
  setInitialMessage: (message: string) => set({ initialMessage: message }),
})) 