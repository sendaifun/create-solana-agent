import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatSession {
  id: number
  title: string
  timestamp: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
}

interface ChatStore {
  initialMessage: string
  sessions: ChatSession[]
  currentSessionId: number | null
  setInitialMessage: (message: string) => void
  addSession: () => ChatSession
  setCurrentSession: (sessionId: number) => void
  addMessageToSession: (sessionId: number, message: { role: 'user' | 'assistant'; content: string }) => void
  deleteSession: (sessionId: number) => void
  getSessionById: (sessionId: number) => ChatSession | undefined
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      initialMessage: '',
      sessions: [],
      currentSessionId: null,
      setInitialMessage: (message: string) => set({ initialMessage: message }),
      addSession: () => {
        const newSession = {
          id: Date.now(),
          title: 'New Chat',
          timestamp: new Date().toLocaleString(),
          messages: []
        }
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id
        }))
        return newSession
      },
      setCurrentSession: (sessionId: number) => set({ currentSessionId: sessionId }),
      addMessageToSession: (sessionId: number, message) => {
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id === sessionId) {
              return {
                ...session,
                messages: [...session.messages, message],
                title: message.role === 'user' && session.title === 'New Chat' 
                  ? message.content.slice(0, 30) + '...'
                  : session.title
              }
            }
            return session
          })
        }))
      },
      deleteSession: (sessionId: number) => set((state) => ({
        sessions: state.sessions.filter((session) => session.id !== sessionId),
        currentSessionId: state.currentSessionId === sessionId 
          ? state.sessions[1]?.id || null // Select next session or null if none left
          : state.currentSessionId
      })),
      getSessionById: (sessionId: number) => {
        return get().sessions.find(session => session.id === sessionId)
      },
    }),
    {
      name: 'chat-storage'
    }
  )
) 