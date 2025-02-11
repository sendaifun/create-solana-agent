"use client";

import { Input } from "@/components/ui/input";
import { ArrowRight } from "@phosphor-icons/react";
import * as React from "react";
import { AGENT_MODES } from "./ModeSelector";
import { DropdownComp } from "./WalletSelector";
import { useEffect, useState } from "react";
export const MOCK_MODELS = [
  {
    name: "Claude",
    subTxt: "Claude 3.5 Sonnet",
  },
  {
    name: "OpenAI",
    subTxt: "GPT-4o-mini",
  },
  {
    name: "DeepSeek",
    subTxt: "DeepSeek-V3 Base",
  }
];

type Item = {
  name: string;
  subTxt: string;
};

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent, selectedModel: Item) => void;
  selectedMode: (typeof AGENT_MODES)[0];
  setSelectedMode: (mode: (typeof AGENT_MODES)[0]) => void;
  selectedModel: Item;
  setSelectedModel: (model: Item) => void;
  selectedWallet: Item;
  setSelectedWallet: (wallet: Item) => void;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  selectedMode,
  setSelectedMode,
  selectedModel,
  setSelectedModel,
  selectedWallet,
  setSelectedWallet,
}: ChatInputProps) {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [wallets, setWallets] = useState([{
    name: "Default Agent Wallet",
    subTxt: "",
  }]);

  useEffect(() => {
    fetch("/api/wallet")
      .then((res) => res.json())
      .then((data) => {
        setWallets(data.wallets);
      });
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(e, selectedModel);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative rounded-2xl bg-card/90 backdrop-blur-xl shadow-sm transition-all duration-200">
        <div className="flex flex-col">
          <div className="relative flex items-center min-h-[72px]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    handleSubmit(e as any);
                  }
                }
              }}
              placeholder="Ask anything..."
              className="w-full h-[72px] px-6 py-4 outline-none text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>
          <div className="flex items-center h-12 px-6 border-t border-border">
            <div className="flex items-center overflow-x-auto scrollbar-none">
              <div className="flex items-center min-w-fit">
                <DropdownComp selectedItems={selectedModel} onItemsChange={setSelectedModel} items={MOCK_MODELS} />

                {/* You can use the ModeSelector component if you want to use the default mode selector UI */}
                {/* <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} /> */}
                <div className="mx-4 h-4 w-[1px] bg-border shrink-0" />
                <DropdownComp selectedItems={selectedWallet} onItemsChange={setSelectedWallet} items={wallets} />
              </div>
            </div>
            <div className="ml-auto flex items-center">
              
              {/* You can use the Toggle component if you want to use the default toggle UI */}
              {/* <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Auto Sign</span>
                <Toggle checked={isEnabled} onCheckedChange={setIsEnabled} aria-label="Auto sign toggle" />
              </div> */}
              <div className="mx-4 h-4 w-[1px] bg-border shrink-0" />
              <div 
                onClick={handleSubmit}
                className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                <kbd className="px-2 py-1 text-[11px] font-medium bg-muted rounded-md">⌘</kbd>
                <ArrowRight size={16} weight="bold" className="text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
