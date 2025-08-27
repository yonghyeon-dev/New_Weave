'use client';

import React from 'react';
import MainNavigation from '@/components/navigation/MainNavigation';
import FloatingQuickMenu from '@/components/FloatingQuickMenu';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0 h-full overflow-y-auto border-r border-border-light">
        <MainNavigation className="h-full" />
      </div>

      {/* Main Content - 전체 영역이 스크롤 가능 */}
      <div className="flex-1 h-full overflow-y-auto">
        <main>
          {children}
        </main>
      </div>
      
      {/* 플로팅 퀵메뉴 - 전역 적용 */}
      <FloatingQuickMenu />
    </div>
  );
}