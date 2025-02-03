"use client";

import { ChatSession } from "@/components/chat/ChatSession";
import { Suspense } from "react";

export default function ChatSessionPage() {
  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <ChatSession sessionId={1} initialMessages={[]} />
      </Suspense>
    </div>
  );
}
