"use client";

import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { AGENT_MODES } from "./ModeSelector";
import { MOCK_WALLETS } from "./WalletSelector";
import { AgentLogo } from "@/components/layout/AgentLogo";

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

const PLACEHOLDER_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Let's brainstorm ideas for my next vacation. Start by asking what time of year I want to travel.",
    role: "user",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "2",
    content:
      "Great! Let's start planning your next vacation. What time of year are you thinking about traveling? This will help narrow down destinations and activities that fit your preferences.",
    role: "assistant",
    timestamp: new Date(Date.now() - 90000),
  },
  {
    id: "3",
    content: "I'm thinking of traveling during the summer months, particularly July or August.",
    role: "user",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "4",
    content:
      "Summer is a popular time for travel! Are you interested in beach destinations, cultural experiences, outdoor adventures, or a mix of activities? This will help me suggest destinations with ideal weather and activities during July/August.",
    role: "assistant",
    timestamp: new Date(Date.now() - 45000),
  },
  {
    id: "5",
    content:
      "I'd love a mix of beach time and cultural experiences. I enjoy exploring local cuisine and historical sites too.",
    role: "user",
    timestamp: new Date(Date.now() - 30000),
  },
  {
    id: "6",
    content:
      "That's a great combination! Based on your preferences and timing, here are some destinations to consider:\n\n1. Greek Islands - Perfect for beach hopping and ancient history\n2. Southern Italy - Stunning coastlines and rich cultural heritage\n3. Croatia - Beautiful beaches and historic coastal cities\n4. Portugal - Amazing beaches, food, and historic sites\n\nWould you like to explore any of these options in detail?",
    role: "assistant",
    timestamp: new Date(Date.now() - 15000),
  },
  {
    id: "7",
    content: "The Greek Islands sound amazing! Can you tell me more about the best islands to visit and when to go?",
    role: "user",
    timestamp: new Date(Date.now() - 12000),
  },
  {
    id: "8",
    content:
      "Great choice! For the Greek Islands in July/August, I'd recommend:\n\n1. Santorini - Famous for:\n   - Stunning sunsets in Oia\n   - Ancient ruins of Akrotiri\n   - Volcanic beaches\n   - Cycladic architecture\n\n2. Mykonos - Known for:\n   - Beautiful beaches\n   - Vibrant culture and nightlife\n   - Iconic windmills\n   - Local cuisine\n\n3. Crete - Highlights:\n   - Palace of Knossos\n   - Beautiful beaches like Elafonisi\n   - Mountain villages\n   - Rich food culture\n\nWould you like specific itinerary suggestions for any of these islands?",
    role: "assistant",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "9",
    content: "Yes, I'd love an itinerary for Santorini! How many days would you recommend staying there?",
    role: "user",
    timestamp: new Date(Date.now() - 8000),
  },
  {
    id: "10",
    content:
      "For Santorini, I recommend staying 4-5 days to fully experience the island. Here's a suggested itinerary:\n\nDay 1: Arrival & Fira\n- Check into your hotel\n- Explore Fira's narrow streets\n- Evening sunset dinner with caldera views\n\nDay 2: Oia & Sunset\n- Morning photography walk in Oia\n- Visit Atlantis Books\n- Famous Oia sunset viewing\n\nDay 3: Beach & History\n- Red Beach visit\n- Akrotiri archaeological site\n- Wine tasting at local vineyard\n\nDay 4: Island Activities\n- Catamaran cruise\n- Hot springs visit\n- Traditional village of Megalochori\n\nDay 5: Final Explorations\n- Hike from Fira to Oia\n- Local cooking class\n- Final sunset dinner\n\nWould you like specific recommendations for hotels or restaurants?",
    role: "assistant",
    timestamp: new Date(Date.now() - 5000),
  },
];

export function ChatSession() {
  const [messages, setMessages] = useState<Message[]>(PLACEHOLDER_MESSAGES);
  const [input, setInput] = useState("");
  const [selectedMode, setSelectedMode] = useState(AGENT_MODES[0]);
  const [selectedWallet, setSelectedWallet] = useState(MOCK_WALLETS[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: String(messages.length + 2),
        content:
          "I understand you want to proceed. Let me help you with that. First, could you confirm if you have your artwork ready in the correct format (preferably PNG or GIF)?",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
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
