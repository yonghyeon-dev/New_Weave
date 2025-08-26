'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Calculator, 
  Users, 
  Settings,
  Menu,
  X,
  Building,
  Upload,
  Bell,
  Cpu,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 계층적 메뉴 구조 - 홈과 대시보드를 독립적으로 분리
const navigation = [
  {
    name: '홈',
    href: '/home',
    icon: LayoutDashboard,
    description: '메인 콘텐츠 및 빠른 시작',
    isMain: true
  },
  {
    name: '대시보드',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: '실시간 비즈니스 현황 및 인사이트'
  },
  {
    name: 'AI 업무 비서',
    href: '#',
    icon: Cpu,
    description: '통합 업무 허브 - AI 기반 업무 자동화',
    badge: 'Hub',
    isSection: true,
    children: [
      {
        name: 'AI 상담',
        href: '/ai-assistant/consult',
        icon: MessageCircle,
        description: 'AI 채팅 및 세무 상담 통합 서비스'
      },
      {
        name: '문서 생성',
        href: '/ai-assistant/generate',
        icon: FileText,
        description: '계약서, 제안서 등 문서 자동 생성'
      },
      {
        name: '정보 추출',
        href: '/ai-assistant/extract',
        icon: Upload,
        description: '파일에서 핵심 정보 자동 추출'
      },
      {
        name: '파일 처리',
        href: '/ai-assistant/file-process',
        icon: Upload,
        description: '보안 업로드 및 파일 분석 처리'
      },
      {
        name: '사업자 조회',
        href: '/ai-assistant/business-lookup',
        icon: Building,
        description: '사업자등록번호 조회 및 검증'
      }
    ]
  },
  {
    name: '업무 관리',
    href: '#',
    icon: FileText,
    description: '인보이스, 결제, 고객 관리',
    isSection: true,
    children: [
      {
        name: '인보이스',
        href: '/invoices',
        icon: FileText,
        description: '인보이스 생성 및 관리'
      },
      {
        name: '결제 관리',
        href: '/payments',
        icon: CreditCard,
        description: '결제 내역 및 미수금 추적'
      },
      {
        name: '리마인더',
        href: '/reminders',
        icon: Bell,
        description: '자동 결제 알림 설정'
      },
      {
        name: '클라이언트',
        href: '/clients',
        icon: Users,
        description: '고객 정보 관리'
      }
    ]
  },
  {
    name: '설정',
    href: '/settings',
    icon: Settings,
    description: '시스템 및 개인 설정'
  }
];


interface MainNavigationProps {
  className?: string;
}

export default function MainNavigation({ className = '' }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['AI 업무 비서', '업무 관리']);
  const pathname = usePathname();

  const isActivePath = (href: string): boolean => {
    if (href === '/home') {
      return pathname === '/home';
    }
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    if (href === '#') {
      return false; // 섹션 헤더는 활성화되지 않음
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children: any[]): boolean => {
    return children.some(child => pathname.startsWith(child.href));
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  // 하위 메뉴 클릭 시 드롭다운 유지를 위한 핸들러
  const handleChildClick = (e: React.MouseEvent) => {
    // 하위 메뉴 클릭 시 이벤트 버블링 방지하여 드롭다운 유지
    e.stopPropagation();
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn("hidden lg:block bg-white border-r border-border-light", className)}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border-light">
            <Link href="/home" className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Weave Logo"
                width={32}
                height={32}
                className="rounded-lg"
                priority
              />
              <span className="text-xl font-bold text-txt-primary">Weave</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = isActivePath(item.href);
              const hasActiveChild = item.children ? isChildActive(item.children) : false;
              
              if (item.isSection) {
                return (
                  <div key={item.name} className="space-y-1">
                    {/* 섹션 헤더 */}
                    <button
                      onClick={() => toggleSection(item.name)}
                      className={cn(
                        "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-bg-secondary",
                        hasActiveChild 
                          ? "bg-weave-primary-light/50 text-weave-primary" 
                          : "text-txt-primary bg-bg-secondary"
                      )}
                    >
                      <item.icon 
                        className={cn(
                          "w-5 h-5 mr-3 flex-shrink-0",
                          hasActiveChild ? "text-weave-primary" : "text-txt-secondary"
                        )} 
                      />
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{item.name}</div>
                        <div className={cn(
                          "text-xs mt-0.5",
                          hasActiveChild ? "text-weave-primary/70" : "text-txt-tertiary"
                        )}>
                          {item.description}
                        </div>
                      </div>
                      <div className={cn(
                        "text-xs transition-transform",
                        expandedSections.includes(item.name) ? "rotate-90" : ""
                      )}>
                        ▶
                      </div>
                    </button>
                    
                    {/* 하위 메뉴 */}
                    {expandedSections.includes(item.name) && (
                      <div className="ml-6 space-y-1">
                        {item.children?.map((child) => {
                        const isChildActve = isActivePath(child.href);
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={handleChildClick}
                            className={cn(
                              "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                              isChildActve
                                ? "bg-weave-primary-light text-weave-primary border border-weave-primary/20"
                                : "text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary"
                            )}
                          >
                            <child.icon 
                              className={cn(
                                "w-4 h-4 mr-3 flex-shrink-0",
                                isChildActve ? "text-weave-primary" : "text-txt-tertiary group-hover:text-txt-secondary"
                              )} 
                            />
                            <div className="flex-1">
                              <div className="font-medium">{child.name}</div>
                              <div className={cn(
                                "text-xs mt-0.5",
                                isChildActve ? "text-weave-primary/70" : "text-txt-tertiary"
                              )}>
                                {child.description}
                              </div>
                            </div>
                          </Link>
                        );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              // 일반 메뉴 아이템
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group relative",
                    isActive
                      ? "bg-weave-primary-light text-weave-primary border border-weave-primary/20"
                      : "text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary",
                    item.isMain && "border-2 border-weave-primary/30 bg-gradient-to-r from-weave-primary/5 to-weave-secondary/5"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "w-5 h-5 mr-3 flex-shrink-0",
                      isActive ? "text-weave-primary" : "text-txt-tertiary group-hover:text-txt-secondary"
                    )} 
                  />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {item.name}
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-xs font-semibold bg-weave-primary text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-weave-primary/70" : "text-txt-tertiary"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-border-light">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-weave-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-txt-primary truncate">
                  사용자
                </p>
                <p className="text-xs text-txt-tertiary truncate">
                  user@example.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-border-light">
          <Link href="/home" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Weave Logo"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
            <span className="text-xl font-bold text-txt-primary">Weave</span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-txt-secondary hover:text-txt-primary"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
            <div className="fixed inset-y-0 left-0 w-64 bg-white">
              <div className="flex items-center justify-between h-16 px-4 border-b border-border-light">
                <Link 
                  href="/home" 
                  className="flex items-center space-x-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Image
                    src="/logo.png"
                    alt="Weave Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                    priority
                  />
                  <span className="text-xl font-bold text-txt-primary">Weave</span>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-txt-secondary hover:text-txt-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-4 py-6 space-y-1">
                {navigation.map((item) => {
                  const isActive = isActivePath(item.href);
                  const hasActiveChild = item.children ? isChildActive(item.children) : false;
                  
                  if (item.isSection) {
                    return (
                      <div key={item.name} className="space-y-1">
                        {/* 섹션 헤더 */}
                        <button
                          onClick={() => toggleSection(item.name)}
                          className={cn(
                            "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-bg-secondary",
                            hasActiveChild 
                              ? "bg-weave-primary-light/50 text-weave-primary" 
                              : "text-txt-primary bg-bg-secondary"
                          )}
                        >
                          <item.icon className={cn(
                            "w-5 h-5 mr-3 flex-shrink-0",
                            hasActiveChild ? "text-weave-primary" : "text-txt-secondary"
                          )} />
                          <div className="flex-1 text-left">
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-xs text-txt-tertiary mt-0.5">
                              {item.description}
                            </div>
                          </div>
                          <div className={cn(
                            "text-xs transition-transform",
                            expandedSections.includes(item.name) ? "rotate-90" : ""
                          )}>
                            ▶
                          </div>
                        </button>
                        
                        {/* 하위 메뉴 */}
                        {expandedSections.includes(item.name) && (
                          <div className="ml-6 space-y-1">
                            {item.children?.map((child) => {
                            const isChildActve = isActivePath(child.href);
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={(e) => {
                                  handleChildClick(e);
                                  setIsMobileMenuOpen(false);
                                }}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                  isChildActve
                                    ? "bg-weave-primary-light text-weave-primary"
                                    : "text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary"
                                )}
                              >
                                <child.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">{child.name}</div>
                                  <div className="text-xs text-txt-tertiary mt-0.5">
                                    {child.description}
                                  </div>
                                </div>
                              </Link>
                            );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  // 일반 메뉴 아이템
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-weave-primary-light text-weave-primary"
                          : "text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary",
                        item.isMain && "border border-weave-primary/30"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-xs font-semibold bg-weave-primary text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-txt-tertiary mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}