'use client';

import { useParams } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';
import { Chatcomp } from '@/components/chat/Chatcomp';
import { redirect } from 'next/navigation';
import { Chat } from '@phosphor-icons/react';
import { ChatSession } from '@/components/chat/ChatSession';

export default function ChatPage() {
  const params = useParams();
  const sessionId = Number(params.sessionId);
  const { getSessionById } = useChatStore();
  
  const session = getSessionById(sessionId);
  
  if (!session) {
    redirect('/');
  }

  return <ChatSession sessionId={sessionId} initialMessages={session.messages} />;
} 