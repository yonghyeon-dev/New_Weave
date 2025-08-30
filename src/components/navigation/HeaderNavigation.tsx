'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  Calculator,
  FileText,
  Receipt,
  CreditCard,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Typography } from '@/components/ui';
import ProfileDropdown from './ProfileDropdown';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavSection {
  title: string;
  items: MenuItem[];
}

const navStructure: NavSection[] = [
  {
    title: '프로젝트 관리',
    items: [
      { label: '프로젝트 목록', href: '/projects', icon: <Briefcase className="w-4 h-4" /> },
      { label: '클라이언트', href: '/clients', icon: <Users className="w-4 h-4" /> },
      { label: '설정', href: '/projects/settings', icon: <Settings className="w-4 h-4" /> },
    ]
  },
  {
    title: '세무 관리',
    items: [
      { label: '세금 계산', href: '/tax', icon: <Calculator className="w-4 h-4" /> },
      { label: '문서 관리', href: '/documents', icon: <FileText className="w-4 h-4" /> },
      { label: '송장 관리', href: '/invoices', icon: <Receipt className="w-4 h-4" /> },
      { label: '결제 관리', href: '/payments', icon: <CreditCard className="w-4 h-4" /> },
    ]
  }
];

export default function HeaderNavigation() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  const handleMouseEnter = (title: string) => {
    // 기존 타임아웃이 있으면 취소
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(title);
  };

  const handleMouseLeave = () => {
    // 300ms 지연 후 드롭다운 닫기
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
    setDropdownTimeout(timeout);
  };

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary border-b border-border-light">
      <div className="px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Weave" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
              <Typography variant="h3" className="text-weave-primary font-semibold">
                WEAVE
              </Typography>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Dashboard Link */}
            <Link 
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                pathname === '/dashboard' 
                  ? 'text-weave-primary' 
                  : 'text-txt-secondary hover:text-txt-primary'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <Typography variant="body1" className="font-medium">
                대시보드
              </Typography>
            </Link>

            {/* Dropdown Menus */}
            {navStructure.map((section) => (
              <div
                key={section.title}
                className="relative"
                onMouseEnter={() => handleMouseEnter(section.title)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-2 px-4 py-2 text-txt-secondary hover:text-txt-primary transition-colors">
                  <Typography variant="body1" className="font-medium">
                    {section.title}
                  </Typography>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    activeDropdown === section.title ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Menu - pt-2로 버튼과 메뉴 사이 갭 연결 */}
                {activeDropdown === section.title && (
                  <div 
                    className="absolute top-full left-0 pt-2 w-56"
                    onMouseEnter={() => handleMouseEnter(section.title)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-bg-secondary rounded-lg shadow-lg border border-border-light overflow-hidden">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 hover:bg-bg-tertiary transition-colors ${
                            isActive(item.href) ? 'bg-bg-tertiary text-weave-primary' : 'text-txt-secondary'
                          }`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.icon}
                          <Typography variant="body2">
                            {item.label}
                          </Typography>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <ProfileDropdown 
              userName="홍길동"
              userEmail="hong@example.com"
            />

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-txt-secondary hover:text-txt-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-bg-primary z-40">
          <nav className="px-6 py-4">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-4 transition-colors ${
                pathname === '/dashboard' 
                  ? 'bg-bg-secondary text-weave-primary' 
                  : 'text-txt-secondary hover:bg-bg-secondary'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <Typography variant="body1">
                대시보드
              </Typography>
            </Link>

            {/* Menu Sections */}
            {navStructure.map((section) => (
              <div key={section.title} className="mb-6">
                <Typography variant="h4" className="text-txt-tertiary mb-3 px-2">
                  {section.title}
                </Typography>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-bg-secondary transition-colors ${
                        isActive(item.href) ? 'bg-bg-secondary text-weave-primary' : 'text-txt-secondary'
                      }`}
                    >
                      {item.icon}
                      <Typography variant="body1">
                        {item.label}
                      </Typography>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}