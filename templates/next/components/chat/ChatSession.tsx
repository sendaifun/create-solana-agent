"use client";

import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { AGENT_MODES } from "./ModeSelector";
import { MOCK_WALLETS } from "./WalletSelector";
import { AgentLogo } from "@/components/layout/AgentLogo";
import { useSearchParams } from "next/navigation";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface UserMessageProps {
  content: string;
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
          <div className="whitespace-pre-wrap">
            {content.split("\n").map((line, i) =>
              line.startsWith("- ") ? (
                <div key={i} className="pl-3 text-[14.5px] leading-[1.75] font-normal opacity-90">
                  {line}
                </div>
              ) : line.match(/^\d+\./) ? (
                <div key={i} className="font-semibold mb-1">
                  {line}
                </div>
              ) : (
                <div key={i} className={line === "" ? "my-2" : ""}>
                  {line}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatSession() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState(AGENT_MODES[0]);
  const [selectedWallet, setSelectedWallet] = useState(MOCK_WALLETS[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const initialMessageSent = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);

    const newMessage: Message = {
      id: String(messages.length + 1),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: String(messages.length + 2),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: String(messages.length + 2),
        content: "Sorry, there was an error processing your request.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialMessage = searchParams.get("initial_message");

    if (initialMessage && !initialMessageSent.current) {
      const decodedMessage = decodeURIComponent(initialMessage);
      handleInitialMessage(decodedMessage);
      initialMessageSent.current = true;
    }
  }, [searchParams]);

  const handleInitialMessage = async (message: string) => {
    const newMessage: Message = {
      id: "1",
      content: message,
      role: "user",
      timestamp: new Date(),
    };

    setMessages([newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: "2",
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: "2",
        content: "Sorry, there was an error processing your request.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
          />
        </div>
      </div>
    </div>
  );
}
