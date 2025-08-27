'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  FileText, 
  BarChart3,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  FolderPlus,
  LayoutDashboard,
  Settings
} from 'lucide-react';

interface QuickMenuItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
  color: string;
}

export default function FloatingQuickMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 스크롤에 따른 가시성 제어
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤 - 숨기기
        setIsVisible(false);
        setIsOpen(false);
      } else {
        // 위로 스크롤 - 보이기
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const menuItems: QuickMenuItem[] = [
    {
      id: 'project',
      icon: <FolderPlus className="w-5 h-5" />,
      title: '새 프로젝트',
      description: '새로운 프로젝트를 시작하세요',
      action: () => router.push('/projects'),
      color: 'bg-blue-600'
    },
    {
      id: 'dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: '대시보드',
      description: '실시간 비즈니스 현황을 확인하세요',
      action: () => router.push('/dashboard'),
      color: 'bg-green-500'
    },
    {
      id: 'ai',
      icon: <Brain className="w-5 h-5" />,
      title: 'AI 상담',
      description: 'AI와 대화하며 세무 및 업무 상담을 받으세요',
      action: () => router.push('/ai-assistant/consult'),
      color: 'bg-purple-500'
    },
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      title: '빠른 설정',
      description: '시스템 설정을 변경하세요',
      action: () => router.push('/settings'),
      color: 'bg-orange-500'
    }
  ];

  return (
    <>
      {/* 플로팅 버튼 */}
      <div
        className={`fixed right-6 bottom-6 z-50 transition-all duration-300 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            aria-label="빠른 메뉴 열기"
          >
            <Zap className="w-6 h-6" />
            
            {/* 툴팁 */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              빠른 시작
            </div>
            
            {/* 펄스 애니메이션 */}
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25"></div>
          </button>
        )}
      </div>

      {/* 플로팅 메뉴 패널 */}
      {isOpen && (
        <div
          className={`fixed right-6 bottom-6 z-50 transition-all duration-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <div className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? 'w-16' : 'w-80'
          }`}>
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              {!isMinimized && (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">빠른 시작</h3>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label={isMinimized ? "확장하기" : "최소화하기"}
                >
                  {isMinimized ? (
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="닫기"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* 메뉴 아이템 */}
            <div className={`p-2 ${isMinimized ? 'space-y-1' : 'space-y-2'}`}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group ${
                    isMinimized ? 'justify-center' : ''
                  }`}
                >
                  <div className={`${item.color} text-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    {item.icon}
                  </div>
                  
                  {!isMinimized && (
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 text-sm">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* 추가 액션 */}
            {!isMinimized && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  대시보드로 이동 →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}