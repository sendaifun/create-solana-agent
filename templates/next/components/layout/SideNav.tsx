"use client";

import { Button } from "@/components/ui/button";
import { CaretLeft, CaretRight, Plus, Keyboard } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AgentLogo } from "./AgentLogo";
import { UserProfile } from "./UserProfile";
import { MobileNav } from "./MobileNav";
import { HISTORY_ITEMS } from "@/config/history";

export default function SideNav() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <MobileNav isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:static top-0 left-0 h-screen",
          "bg-card",
          "flex flex-col z-40",
          "transition-all duration-300 ease-out",
          "border-r border-border",
          "w-[280px] md:w-auto",
          isExpanded ? "md:w-[280px]" : "md:w-[70px]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Add top spacing for mobile */}
        <div className="h-16 md:hidden" />

        {/* Sidebar Content Container */}
        <div className="relative flex flex-col flex-1 gap-2 h-full max-h-screen">
          {/* Sidebar Header */}
          <div
            className={cn(
              "flex flex-col shrink-0",
              "px-3 sm:px-4 pt-3 sm:pt-4 pb-3 sm:pb-4 gap-4 sm:gap-6",
              "bg-gradient-to-b from-muted/50 to-transparent",
              !isExpanded && "md:px-3",
            )}
          >
            <div className={cn("flex items-center", isExpanded ? "justify-between px-1" : "md:justify-center")}>
              <div
                className={cn(
                  "flex items-center cursor-pointer",
                  "gap-2 sm:gap-3 md:group py-1",
                  !isExpanded && "md:justify-center",
                )}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <AgentLogo />
                {(isExpanded || (!isExpanded && isMobile)) && (
                  <h1
                    className={cn(
                      "text-base sm:text-[18px] font-semibold",
                      "text-foreground",
                      "transition-all duration-300 ease-out",
                      "group-hover:text-accent",
                    )}
                  >
                    Your Agent
                  </h1>
                )}
              </div>
              {isExpanded && !isMobile && (
                <Button variant="ghostNoBackground" size="icon" onClick={toggleSidebar} className="hover:bg-muted">
                  <CaretLeft className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* New Thread Button */}
            <Button
              variant="newThread"
              className={cn(
                "h-11 bg-accent/10 text-accent hover:bg-accent/20",
                !isExpanded && !isMobile && "justify-center p-2",
              )}
            >
              <Plus size={17} weight="bold" />
              {(isExpanded || (!isExpanded && isMobile)) && (
                <>
                  <span className="text-[15px]">New Thread</span>
                  <div className="ml-auto flex items-center gap-1.5 text-[13px] opacity-60">
                    <Keyboard size={13} weight="bold" />
                    <span>K</span>
                  </div>
                </>
              )}
            </Button>
          </div>

          {/* Custom Divider */}
          <div className="h-[1px] w-full bg-border/50 shrink-0" />

          {/* Recent Items - Only show when expanded on desktop */}
          {(isExpanded || (!isExpanded && isMobile)) && (
            <div className="flex-1 min-h-0">
              <div className="flex items-center justify-between px-6 py-2 shrink-0">
                <p className="text-sm font-medium text-muted-foreground">Recent</p>
                <span className="text-xs text-muted-foreground">{HISTORY_ITEMS.length} chats</span>
              </div>
              <div className="px-3 space-y-1">
                {HISTORY_ITEMS.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "flex flex-col items-start w-full px-2 sm:px-3 py-2 sm:py-2.5 h-auto",
                      "overflow-hidden",
                      selectedConversation === item.id ? "bg-muted" : "hover:bg-muted/50",
                    )}
                    onClick={() => setSelectedConversation(item.id)}
                  >
                    <div className="w-full">
                      <p
                        className={cn(
                          "text-[13px] sm:text-[14px] text-left truncate",
                          selectedConversation === item.id ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {item.title}
                      </p>
                      <p className="text-[11px] sm:text-[12px] text-muted-foreground mt-1 text-left truncate">
                        {item.timestamp}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Spacer when sidebar is collapsed on desktop */}
          {!isExpanded && !isMobile && <div className="flex-1" />}

          {/* Custom Divider */}
          <div className="h-[1px] w-full bg-border/50 shrink-0" />

          {/* Sidebar Footer */}
          <div className={cn("transition-all duration-300 ease-out p-3 shrink-0")}>
            {!isExpanded && !isMobile && (
              <Button
                variant="ghostNoBackground"
                size="iconSm"
                className="w-full mb-3 hover:bg-muted/50"
                onClick={toggleSidebar}
              >
                <CaretRight className="h-5 w-5" />
              </Button>
            )}
            <UserProfile isExpanded={isExpanded} />
          </div>
        </div>
      </div>
    </>
  );
}
