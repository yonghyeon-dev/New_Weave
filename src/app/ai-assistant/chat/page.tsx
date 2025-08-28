'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <AppLayout>
      <div className="h-[calc(100vh-64px)] bg-bg-primary">
        <ChatInterface />
      </div>
    </AppLayout>
  );
}