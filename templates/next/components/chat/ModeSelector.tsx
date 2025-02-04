"use client";

import { CaretDown, Browser } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AGENT_MODES = [
  {
    title: "Web",
    description: "Browse and analyze web content",
    icon: Browser,
  },
];

interface ModeSelectorProps {
  selectedMode: (typeof AGENT_MODES)[0];
  onModeChange: (mode: (typeof AGENT_MODES)[0]) => void;
}

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 py-1.5 px-2.5 -ml-2.5 rounded-lg",
            "text-sm text-muted-foreground hover:text-foreground",
            "transition-colors",
            "group",
          )}
        >
          <div className="text-accent transition-transform duration-200 ease-out group-hover:scale-110">
            <selectedMode.icon className="w-4 h-4" weight="bold" />
          </div>
          <span className="font-medium">{selectedMode.title}</span>
          <CaretDown size={14} weight="bold" className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 p-1 bg-popover border border-border">
        {AGENT_MODES.map((mode,index) => (
          <DropdownMenuItem
            key={index} 
            onClick={() => onModeChange(mode)}
            className={cn(
              "flex items-center gap-2 px-2 py-2 rounded-md text-sm",
              "hover:bg-muted",
              mode.title === selectedMode.title ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <div className="text-accent">
              <mode.icon className="w-4 h-4" weight="bold" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{mode.title}</span>
              <span className="text-xs text-muted-foreground">{mode.description}</span>
            </div>
            {mode.title === selectedMode.title && (
              <div className="ml-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
