"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, LogOut, Menu, MessageSquare, Moon, Plus, Send, Settings, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const SUGGESTIONS = [
  {
    title: "Deploy SPL tokens",
    description: "Ask me to deploy a an SPL token from Metaplex",
  },
  {
    title: "Raydium pool creation",
    description: "Ask me to create a Raydium pool for a token pair",
  },
  {
    title: "Lending by Lulo",
    description: "Ask me to create a lending pool for a token pair on a Blink",
  },
  {
    title: "Fetch prices for a token pair",
    description: "Ask me to fetch prices for a token pair from Pyth",
  },
];

const HISTORY_ITEMS = [
  { id: 1, title: "Create a pumpfun token", timestamp: "1 day ago" },
  { id: 1, title: "Create an NFT collection", timestamp: "2 days ago" },
  { id: 1, title: "Create a Raydium pool", timestamp: "3 days ago" },
];

export default function Chat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await sendMessage(suggestion);
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");

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
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, there was an error processing your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 rounded-lg border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} />
          </Button>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Agent Chat</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        fixed md:static top-0 left-0 h-screen w-[300px] 
        bg-white dark:bg-zinc-950 
        border-r border-zinc-200 dark:border-zinc-800 
        flex flex-col z-40
        transition-transform duration-300
      `}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Agent Chat</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4">
          <Button className="w-full justify-start gap-2 mb-4 bg-primary hover:bg-primary/80 text-black" variant="ghost">
            <Plus size={16} />
            New chat
          </Button>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto px-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Your conversations</p>
          <div className="space-y-1">
            {HISTORY_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedConversation(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                  ${
                    selectedConversation === item.id
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span className="truncate">{item.title}</span>
                </div>
                <div className="ml-6 text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{item.timestamp}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                YA
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-white">Yash Agarwal</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Pro user</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto p-4 my-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-8">How can I help you today?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.title)}
                      className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-primary dark:hover:border-primary transition-colors text-left group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-zinc-900 dark:text-white">{suggestion.title}</h3>
                        <ArrowRight
                          size={16}
                          className="text-zinc-400 group-hover:text-primary transition-colors mt-1"
                        />
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{suggestion.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, index) => (
                <div key={index} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`
                    max-w-[85%] p-3 rounded-2xl
                    ${
                      m.role === "user"
                        ? "bg-primary text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900"
                    }
                  `}
                  >
                    <div className="text-sm">{m.content}</div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  <div className="text-sm text-zinc-900 dark:text-zinc-100 animate-pulse">Thinking...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your agent anything.."
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/80 text-black"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
