"use client";

import { AgentLogo } from "@/components/layout/AgentLogo";
import { useChatStore } from '@/store/useChatStore';
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { ChatInput, MOCK_MODELS, MOCK_WALLETS } from "./ChatInput";
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
          <div className="whitespace-pre-wrap">{content}</div>
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
  const [selectedWallet, setSelectedWallet] = useState(MOCK_WALLETS[0]);
  const [selectedModel, setSelectedModel] = useState(MOCK_MODELS[0]);

  const chatStoreInitialMessage = useChatStore((state: any) => state.initialMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
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
      // Add user message to local state first
      const userMessage = {
        id: String(Date.now()),
        content: message,
        role: 'user' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
  
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: message
          }]
        }),
      });
  
      if (!response.ok) throw new Error("Failed to get response");
  
      // Create a new assistant message
      const assistantMessageId = String(Date.now() + 1);
      let fullContent = '';
      
      // Initialize the assistant message
      const initialAssistantMessage = {
        id: assistantMessageId,
        content: '',
        role: 'assistant' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, initialAssistantMessage]);
  
      // Process the stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream available");
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = new TextDecoder().decode(value);
        const matches = chunk.match(/0:"([^"]*)"|\[DONE\]/g);
        if (matches) {
          for (const match of matches) {
            if (match === '[DONE]') continue;
            const text = match.slice(3, -1);
            fullContent += text;
            
            // Update messages with the new content
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg
            ));
          }
        }
      }
  
      // Add final messages to the chat store
      addMessageToSession(sessionId, {
        role: 'user',
        content: message
      });
      addMessageToSession(sessionId, {
        role: 'assistant',
        content: fullContent
      });
  
    } catch (error) {
      console.error("Error:", error);
      addMessageToSession(sessionId, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);

    // Create user message
    const userMessage = {
      id: String(Date.now()),
      content: input,
      role: 'user' as const,
      timestamp: new Date()
    };

    // Update both local state and store
    setMessages(prev => [...prev, userMessage]);
    addMessageToSession(sessionId, {
      role: 'user',
      content: input
    });
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: input
          }]
        }),
      });
      setIsLoading(false);
      if (!response.ok) throw new Error("Failed to get response");

      // Create a new assistant message with empty content
      const assistantMessageId = String(Date.now() + 1);
      let fullContent = '';
      
      // Initialize the assistant message in local state
      const initialMessage = {
        id: assistantMessageId,
        role: 'assistant' as const,
        content: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, initialMessage]);

      // Process the stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const matches = chunk.match(/0:"([^"]*)"|\[DONE\]/g);
        if (matches) {
          for (const match of matches) {
            if (match === '[DONE]') continue;
            const text = match.slice(3, -1);
            fullContent += text;
            
            // Update local state with new content
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg
            ));
          }
        }
      }
      // Add final assistant message to store
      addMessageToSession(sessionId, {
        role: 'assistant',
        content: fullContent
      });

    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: String(Date.now() + 2),
        role: 'assistant' as const,
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      addMessageToSession(sessionId, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      });
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
