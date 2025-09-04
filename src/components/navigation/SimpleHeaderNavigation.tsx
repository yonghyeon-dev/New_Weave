'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Briefcase,
  BrainCircuit,
  Bell,
  Search,
  Calculator,
  Menu,
  X
} from 'lucide-react';
import { Typography } from '@/components/ui';
import ProfileDropdown from './ProfileDropdown';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// 심플한 주요 네비게이션 메뉴
const mainNavItems: NavItem[] = [
  { 
    label: '대시보드', 
    href: '/dashboard', 
    icon: <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" /> 
  },
  { 
    label: '프로젝트', 
    href: '/projects', 
    icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" /> 
  },
  { 
    label: '세무 관리', 
    href: '/tax-management', 
    icon: <Calculator className="w-4 h-4 sm:w-5 sm:h-5" /> 
  },
];

// 개발자 전용 관리자 메뉴 (제거됨)
// const adminNavItems: NavItem[] = [];

export default function SimpleHeaderNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  // 사용자 정보 가져오기
  useEffect(() => {
    const supabase = createClient();
    
    // Mock 모드에서는 supabase가 null일 수 있음
    if (!supabase) {
      console.log('Mock mode - skipping auth check');
      setIsLoading(false);
      return;
    }
    
    const getUser = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          router.push('/login');
          return;
        }
        
        if (!session || !session.user) {
          console.log('No session found, redirecting to login');
          router.push('/login');
          return;
        }
        
        setUser(session.user);
        setIsLoading(false);
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/login');
      }
    };
    
    getUser();
    
    // Auth 상태 변경 리스너 (Mock 모드가 아닐 때만)
    if (!supabase) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        router.push('/login');
      } else if (session?.user) {
        setUser(session.user);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // 모바일 메뉴 토글 시 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary border-b border-border-light">
        <div className="px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - 모바일에서 크기 조정 */}
            <div className="flex items-center">
              <Link href="/home" className="flex items-center gap-2 sm:gap-3">
                <Image 
                  src="/logo.png" 
                  alt="Weave" 
                  width={28} 
                  height={28}
                  className="rounded-lg sm:w-8 sm:h-8"
                />
                <Typography 
                  variant="h3" 
                  className="text-weave-primary font-semibold text-lg sm:text-xl"
                >
                  WEAVE
                </Typography>
              </Link>
            </div>

            {/* Desktop Navigation - lg 이상에서만 표시 */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
              {mainNavItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive(item.href) 
                      ? 'bg-weave-primary-light text-weave-primary' 
                      : 'text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary'
                  }`}
                >
                  {item.icon}
                  <Typography variant="body1" className="font-medium">
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Profile Dropdown - 데스크톱에서만 표시 */}
              <div className="hidden sm:block">
                <ProfileDropdown 
                  userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || "사용자"}
                  userEmail={user?.email || ""}
                />
              </div>

              {/* Mobile Menu Toggle - lg 미만에서 표시 */}
              <button
                className="lg:hidden p-2 text-txt-secondary hover:text-txt-primary rounded-lg hover:bg-bg-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="메뉴 토글"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="fixed right-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-bg-primary shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-light">
              <Typography variant="h3" className="text-txt-primary font-semibold">
                메뉴
              </Typography>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-txt-secondary hover:text-txt-primary rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label="메뉴 닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile User Info - 모바일에서만 표시 */}
            {user && (
              <div className="sm:hidden p-4 border-b border-border-light bg-bg-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-weave-primary-light rounded-full flex items-center justify-center">
                    <Typography variant="body2" className="text-weave-primary font-semibold">
                      {(user?.user_metadata?.full_name || user?.email || "U")[0].toUpperCase()}
                    </Typography>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography variant="body2" className="text-txt-primary font-medium truncate">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "사용자"}
                    </Typography>
                    <Typography variant="caption" className="text-txt-tertiary truncate">
                      {user?.email || ""}
                    </Typography>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Items */}
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href) 
                      ? 'bg-weave-primary-light text-weave-primary' 
                      : 'text-txt-secondary hover:bg-bg-secondary hover:text-txt-primary'
                  }`}
                >
                  {item.icon}
                  <Typography variant="body1" className="font-medium">
                    {item.label}
                  </Typography>
                </Link>
              ))}

              {/* Mobile Logout Button */}
              <button
                onClick={async () => {
                  const supabase = createClient();
                  if (supabase) {
                    await supabase.auth.signOut();
                  }
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <Typography variant="body1" className="font-medium">
                  로그아웃
                </Typography>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}