'use client';

import React, { useState } from 'react';
import MainNavigation from '@/components/navigation/MainNavigation';
import FloatingQuickMenu from '@/components/FloatingQuickMenu';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Mobile-First Responsive Layout */}
      
      {/* Desktop Layout: lg 이상 */}
      <div className="hidden lg:flex lg:h-screen lg:overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="w-64 flex-shrink-0 h-full overflow-y-auto border-r border-border-light bg-white">
          <MainNavigation 
            className="h-full" 
            isMobile={false}
            onMobileMenuToggle={() => {}} 
          />
        </div>

        {/* Desktop Main Content */}
        <div className="flex-1 h-full overflow-y-auto">
          <main className="w-full h-full">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout: lg 미만 */}
      <div className="lg:hidden min-h-screen">
        {/* Mobile Navigation Header */}
        <MainNavigation 
          isMobile={true}
          isOpen={isMobileNavOpen}
          onMobileMenuToggle={setIsMobileNavOpen}
        />

        {/* Mobile Main Content */}
        <main className="w-full">
          {children}
        </main>
      </div>
      
      {/* 플로팅 퀵메뉴 - 데스크톱 전용 */}
      <div className="hidden lg:block">
        <FloatingQuickMenu />
      </div>
    </div>
  );
}