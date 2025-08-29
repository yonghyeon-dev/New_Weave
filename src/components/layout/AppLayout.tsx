'use client';

import React from 'react';
import HeaderNavigation from '@/components/navigation/HeaderNavigation';
import FloatingQuickMenu from '@/components/FloatingQuickMenu';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header Navigation */}
      <HeaderNavigation />
      
      {/* Main Content with Top Padding for Fixed Header */}
      <main className="pt-16 min-h-screen">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
      
      {/* Floating Quick Menu with AI Chatbot */}
      <FloatingQuickMenu />
    </div>
  );
}