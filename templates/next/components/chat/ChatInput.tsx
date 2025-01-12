"use client";

import * as React from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ModeSelector, AGENT_MODES } from "./ModeSelector";
import { WalletSelector, MOCK_WALLETS } from "./WalletSelector";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedMode: (typeof AGENT_MODES)[0];
  setSelectedMode: (mode: (typeof AGENT_MODES)[0]) => void;
  selectedWallet: (typeof MOCK_WALLETS)[0];
  setSelectedWallet: (wallet: (typeof MOCK_WALLETS)[0]) => void;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  selectedMode,
  setSelectedMode,
  selectedWallet,
  setSelectedWallet,
}: ChatInputProps) {
  const [isEnabled, setIsEnabled] = React.useState(false);

  return (
    <form onSubmit={onSubmit}>
      <div className="relative rounded-2xl bg-card/90 backdrop-blur-xl shadow-sm transition-all duration-200">
        <div className="flex flex-col">
          <div className="relative flex items-center min-h-[72px]">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full h-[72px] px-6 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center h-12 px-6 border-t border-border">
            <div className="flex items-center overflow-x-auto scrollbar-none">
              <div className="flex items-center min-w-fit">
                <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />
                <div className="mx-4 h-4 w-[1px] bg-border shrink-0" />
                {/* <WalletSelector selectedWallet={selectedWallet} onWalletChange={setSelectedWallet} /> */}
              </div>
            </div>
            <div className="ml-auto flex items-center">
              {/* <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Auto Sign</span>
                <Toggle checked={isEnabled} onCheckedChange={setIsEnabled} aria-label="Auto sign toggle" />
              </div> */}
              <div className="mx-4 h-4 w-[1px] bg-border shrink-0" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
