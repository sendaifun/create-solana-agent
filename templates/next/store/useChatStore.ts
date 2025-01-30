import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatSession {
  id: number;
  title: string;
  timestamp: string;
  messages: Message[];  // Update to use Message type
}

interface ChatStore {
  initialMessage: string
  sessions: ChatSession[]
  currentSessionId: number | null
  setInitialMessage: (message: string) => void
  addSession: () => ChatSession
  setCurrentSession: (sessionId: number) => void
  addMessageToSession: (sessionId: number, message: { role: "user" | "assistant"; content: string }) => void
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
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id
        }));
        return newSession;
      },
      setCurrentSession: (sessionId: number) => set({ currentSessionId: sessionId }),
      addMessageToSession: (sessionId: number, message: { role: "user" | "assistant"; content: string }) => {
        console.log('Adding message to session:', sessionId, message); // Debug log
        
        set((state) => {
          const updatedSessions = state.sessions.map((session) => {
            if (session.id === sessionId) {
              const newMessage: Message = {
                id: String(Date.now()),
                content: message.content,
                role: message.role,
                timestamp: new Date()
              };
              
              console.log('Current session messages:', session.messages); // Debug log
              console.log('New message:', newMessage); // Debug log
              
              return {
                ...session,
                title: session.title === 'New Chat' && message.role === 'user' 
                  ? message.content.slice(0, 30) + '...'
                  : session.title,
                messages: [...session.messages, newMessage]
              };
            }
            return session;
          });

          console.log('Updated sessions:', updatedSessions); // Debug log
          return { sessions: updatedSessions };
        });
      },
      deleteSession: (sessionId: number) => set((state) => ({
        sessions: state.sessions.filter((session) => session.id !== sessionId),
        currentSessionId: state.currentSessionId === sessionId 
          ? state.sessions[1]?.id || null // Select next session or null if none left
          : state.currentSessionId
      })),
      getSessionById: (sessionId: number) => {
        const session = get().sessions.find(s => s.id === sessionId);
        console.log('Getting session:', sessionId, session); // Debug log
        return session;
      },
    }),
    {
      name: 'chat-storage'
    }
  )
) 