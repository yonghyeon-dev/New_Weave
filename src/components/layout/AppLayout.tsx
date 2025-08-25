'use client';

import React from 'react';
import MainNavigation from '@/components/navigation/MainNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0">
        <MainNavigation className="h-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}