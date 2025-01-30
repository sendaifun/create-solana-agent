"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  logo?: React.ComponentType<{ className?: string }>;
  category: string;
  onClick?: () => void;
}

export function IntegrationCard({ title, description, icon, logo: Logo, category, onClick }: IntegrationCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 p-4",
        "bg-card border border-border/60 rounded-xl",
        "text-left",
        "hover:bg-muted/50 hover:border-border",
        "transition-colors",
      )}
    >
      <div className="flex items-center gap-3">
        {Logo && <Logo className="w-6 h-6" />}
        {icon}
        <div className="flex-1">
          <h3 className="text-[15px] font-medium text-foreground">{title}</h3>
          <div className="text-xs text-muted-foreground mt-0.5">{category}</div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">{description}</div>
    </button>
  );
}
