"use client";

import { AgentLogo } from "@/components/layout/AgentLogo";
import { useChatStore } from '@/store/useChatStore';
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { ChatInput, MOCK_MODELS } from "./ChatInput";
import { AGENT_MODES } from "./ModeSelector";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface UserMessageProps {
  content: string;
}

interface ChatSessionProps {
  sessionId: number;
  initialMessages: Array<Message>;
}

function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%]">
        <div className="px-4 py-3 text-[15px] tracking-[-0.01em] leading-[1.65] font-medium rounded-2xl bg-accent/10 text-accent rounded-br-sm">
          <div className="whitespace-pre-wrap break-words">{content}</div>
        </div>
      </div>
    </div>
  );
}

interface AssistantMessageProps {
  content: string;
}

function AssistantMessage({ content }: AssistantMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="flex relative items-start max-w-[85%]">
        <div className="absolute -left-8 top-2 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <AgentLogo />
        </div>
        <div className="px-4 py-3 text-[15px] tracking-[-0.01em] leading-[1.65] font-medium rounded-2xl text-foreground/90 rounded-bl-sm">
          <ReactMarkdown
            components={{
              // Style code blocks
              code: ({ inline, className, children, ...props } : any) => {
                if (inline) {
                  return (
                    <code className="bg-accent/10 rounded px-1 py-0.5" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <div className="my-3">
                    <pre className="bg-accent/10 p-3 rounded-lg overflow-x-auto">
                      <code {...props}>{children}</code>
                    </pre>
                  </div>
                );
              },
              // Style lists
              ul: ({ children }) => (
                <ul className="pl-6 my-2 list-disc">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="pl-6 my-2 list-decimal">{children}</ol>
              ),
              // Style headings
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold my-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold my-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold my-2">{children}</h3>
              ),
              // Style paragraphs
              p: ({ children }) => <div className="my-2">{children}</div>,
              // Style links
              a: ({ children, href }) => (
                <a 
                  href={href} 
                  className="text-blue-500 hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              // Add custom image component
              img: ({ src, alt }) => (
                <img 
                  src={src} 
                  alt={alt} 
                  className="max-w-full h-auto max-h-[150px] object-contain my-2 rounded-lg"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function ChatSession({ sessionId, initialMessages }: ChatSessionProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiCallMade = useRef(false);
  const { addMessageToSession, getSessionById } = useChatStore();
  const [selectedMode, setSelectedMode] = useState(AGENT_MODES[0]);
  const [wallets, setWallets] = useState([{
    name: "Default Agent Wallet",
    subTxt: "AgN7....3Pda",
  }]);
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]);
  const [selectedModel, setSelectedModel] = useState(MOCK_MODELS[0]);

  const chatStoreInitialMessage = useChatStore((state: any) => state.initialMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetch("/api/wallet")
      .then((res) => res.json())
      .then((data) => {
        setWallets(data.wallets);
      });
    const session = getSessionById(sessionId);
    if (session?.messages) {
      setMessages(session.messages);
      
      // If only one user message exists and API hasn't been called
      if (session.messages.length === 1 && 
          session.messages[0].role === 'user' && 
          !apiCallMade.current) {
        apiCallMade.current = true;
        handleApiCall(session.messages[0].content);
      }
    }
  }, [sessionId]);

  const handleApiCall = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, modelName: selectedModel?.name }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      
      // Add assistant message
      addMessageToSession(sessionId, {
        role: 'assistant',
        content: data.response
      });

      // Refresh messages from store
      const updatedSession = getSessionById(sessionId);
      if (updatedSession?.messages) {
        setMessages(updatedSession.messages);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);

    // Add user message and update messages state immediately
    addMessageToSession(sessionId, {
      role: 'user',
      content: input
    });
    
    // Refresh messages from store right away to show user message
    const updatedSession = getSessionById(sessionId);
    if (updatedSession?.messages) {
      setMessages(updatedSession.messages);
    }

    const currentInput = input; // Store input before clearing
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, modelName: selectedModel?.name }), // Use stored input
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      
      // Add assistant message
      addMessageToSession(sessionId, {
        role: 'assistant',
        content: data.response
      });

      // Refresh messages from store
      const updatedSession = getSessionById(sessionId);
      if (updatedSession?.messages) {
        setMessages(updatedSession.messages);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "user" ? (
                <UserMessage content={message.content} />
              ) : (
                <AssistantMessage content={message.content} />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex relative items-start max-w-[85%]">
                <div className="absolute -left-8 top-2 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <AgentLogo />
                </div>
                <div className="px-4 py-3 text-[15px] tracking-[-0.01em] leading-[1.65] font-medium rounded-2xl text-foreground/90 rounded-bl-sm">
                  <div className="whitespace-pre-wrap">Thinking...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </div>
      </div>
    </div>
  );
}