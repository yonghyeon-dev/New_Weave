'use client';

import { useState } from 'react';
import { HomeContentSection } from '@/components/home/HomeContentSection';
import FloatingQuickMenu from '@/components/FloatingQuickMenu';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { mockHomeContent } from '@/lib/data/mockHomeContent';
import { 
  LogIn, 
  UserPlus,
  Brain,
  FileText,
  Calculator,
  CreditCard,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Github,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Cpu,
  Users
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [workMenuOpen, setWorkMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/home" className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Weave Logo"
                width={40}
                height={40}
                className="rounded-lg"
                priority
              />
              <span className="text-xl font-bold text-gray-900">Weave</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/home" 
                className="flex items-center h-6 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                홈
              </Link>
              
              <Link 
                href="/dashboard" 
                className="flex items-center h-6 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                대시보드
              </Link>

              {/* AI 업무 비서 드롭다운 */}
              <div className="relative">
                <button
                  onClick={() => {
                    setAiMenuOpen(!aiMenuOpen);
                    setWorkMenuOpen(false);
                  }}
                  className="flex items-center gap-1 h-6 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  AI 업무 비서
                  <ChevronDown className={`w-4 h-4 transition-transform ${aiMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {aiMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link 
                      href="/ai-assistant/consult" 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setAiMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">AI 상담</div>
                      <div className="text-sm text-gray-500">AI 채팅 및 세무 상담</div>
                    </Link>
                    <Link 
                      href="/ai-assistant/generate" 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setAiMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">문서 생성</div>
                      <div className="text-sm text-gray-500">계약서, 제안서 자동 생성</div>
                    </Link>
                    <Link 
                      href="/ai-assistant/extract" 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setAiMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">정보 추출</div>
                      <div className="text-sm text-gray-500">파일에서 핵심 정보 추출</div>
                    </Link>
                    <Link 
                      href="/ai-assistant/file-process" 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setAiMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">파일 처리</div>
                      <div className="text-sm text-gray-500">보안 업로드 및 분석</div>
                    </Link>
                    <Link 
                      href="/ai-assistant/business-lookup" 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setAiMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">사업자 조회</div>
                      <div className="text-sm text-gray-500">사업자등록번호 검증</div>
                    </Link>
                  </div>
                )}
              </div>

              {/* 업무 관리 드롭다운 */}
              <div className="relative">
                <button
                  onClick={() => {
                    setWorkMenuOpen(!workMenuOpen);
                    setAiMenuOpen(false);
                  }}
                  className="flex items-center gap-1 h-6 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  업무 관리
                  <ChevronDown className={`w-4 h-4 transition-transform ${workMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {workMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link 
                      href="/invoices" 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setWorkMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">인보이스</div>
                      <div className="text-sm text-gray-500">인보이스 생성 및 관리</div>
                    </Link>
                    <Link 
                      href="/payments" 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setWorkMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">결제 관리</div>
                      <div className="text-sm text-gray-500">결제 내역 및 미수금 추적</div>
                    </Link>
                    <Link 
                      href="/reminders" 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setWorkMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">리마인더</div>
                      <div className="text-sm text-gray-500">자동 결제 알림 설정</div>
                    </Link>
                    <Link 
                      href="/clients" 
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setWorkMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">클라이언트</div>
                      <div className="text-sm text-gray-500">고객 정보 관리</div>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                로그인
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                시작하기
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <nav className="space-y-2">
                <Link 
                  href="/home" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  홈
                </Link>
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  대시보드
                </Link>
                
                {/* AI 업무 비서 모바일 */}
                <div className="px-4 py-2">
                  <div className="font-medium text-gray-900 mb-2">AI 업무 비서</div>
                  <div className="ml-4 space-y-1">
                    <Link 
                      href="/ai-assistant/consult" 
                      className="block py-1 text-gray-600 hover:text-blue-600 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      AI 상담
                    </Link>
                    <Link 
                      href="/ai-assistant/generate" 
                      className="block py-1 text-gray-600 hover:text-blue-600 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      문서 생성
                    </Link>
                    <Link 
                      href="/ai-assistant/extract" 
                      className="block py-1 text-gray-600 hover:text-blue-600 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      정보 추출
                    </Link>
                    <Link 
                      href="/ai-assistant/file-process" 
                      className="block py-1 text-gray-600 hover:text-blue-600 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      파일 처리
                    </Link>
                    <Link 
                      href="/ai-assistant/business-lookup" 
                      className="block py-1 text-gray-600 hover:text-blue-600 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      사업자 조회
                    </Link>
                  </div>
                </div>

                {/* 업무 관리 모바일 */}
                <div className="px-4 py-2">
                  <div className="font-medium text-gray-900 mb-2">업무 관리</div>
                  <div className="ml-4 space-y-1">
                    <Link 
                      href="/invoices" 
                      className="block py-1 text-gray-600 hover:text-blue-600 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      인보이스
                    </Link>
                    <Link 
                      href="/payments" 
                      className="block py-1 text-gray-600 hover:text-blue-600 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      결제 관리
                    </Link>
                    <Link 
                      href="/reminders" 
                      className="block py-1 text-gray-600 hover:text-blue-600 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      리마인더
                    </Link>
                    <Link 
                      href="/clients" 
                      className="block py-1 text-gray-600 hover:text-blue-600 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      클라이언트
                    </Link>
                  </div>
                </div>

                {/* Mobile CTA Buttons */}
                <div className="flex gap-2 px-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      router.push('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 justify-center"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    로그인
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      router.push('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 justify-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    시작하기
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* 히어로 섹션 */}
            <div className="relative bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8 mb-12 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 gap-4 h-full">
                  {[...Array(32)].map((_, i) => (
                    <div key={i} className="bg-blue-600 rounded-full w-2 h-2 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                  ))}
                </div>
              </div>
              
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    흩어진 당신의 업무를
                    <span className="text-blue-600"> 하나로 엮다</span>
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
독립 비즈니스를 위한 개인화 AI 기반 ERP. 프리랜서, 소상공인, 전문직, 크리에이터까지 계약부터 세무까지 모든 업무를 한 곳에서 관리하세요.
                  </p>
                  
                  <div className="flex gap-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => router.push('/dashboard')}
                      className="px-6 py-3"
                    >
                      무료로 시작하기 <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => router.push('/')}
                      className="px-6 py-3"
                    >
                      더 알아보기
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  {/* Hero Illustration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <Brain className="w-8 h-8 text-blue-600 mb-2" />
                      <h3 className="font-semibold text-sm">AI 분석</h3>
                      <p className="text-xs text-gray-600">스마트 업무 최적화</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <FileText className="w-8 h-8 text-green-600 mb-2" />
                      <h3 className="font-semibold text-sm">문서 자동화</h3>
                      <p className="text-xs text-gray-600">계약서, 인보이스</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <Calculator className="w-8 h-8 text-purple-600 mb-2" />
                      <h3 className="font-semibold text-sm">세무 관리</h3>
                      <p className="text-xs text-gray-600">자동 세금 계산</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <CreditCard className="w-8 h-8 text-orange-600 mb-2" />
                      <h3 className="font-semibold text-sm">결제 추적</h3>
                      <p className="text-xs text-gray-600">수익 실시간 분석</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 홈 콘텐츠 섹션 */}
            <HomeContentSection content={mockHomeContent} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/logo.png"
                  alt="Weave Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold">Weave</span>
              </div>
              <p className="text-gray-400 text-sm">
독립 비즈니스를 위한 개인화 AI 기반 ERP
              </p>
              <p className="text-gray-400 text-sm mt-2">
                계약부터 세무까지, 모든 업무를 한 곳에서
              </p>
            </div>

            {/* Quick Links - 실제 구현된 기능만 */}
            <div>
              <h3 className="text-white font-semibold mb-4">바로가기</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
                    대시보드
                  </Link>
                </li>
                <li>
                  <Link href="/ai-assistant" className="text-gray-400 hover:text-white text-sm transition-colors">
                    AI 비서
                  </Link>
                </li>
                <li>
                  <Link href="/invoices" className="text-gray-400 hover:text-white text-sm transition-colors">
                    인보이스
                  </Link>
                </li>
                <li>
                  <Link href="/clients" className="text-gray-400 hover:text-white text-sm transition-colors">
                    클라이언트 관리
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="text-gray-400 hover:text-white text-sm transition-colors">
                    설정
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">연락처</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail className="w-4 h-4" />
                  support@weave.ai
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone className="w-4 h-4" />
                  1600-0000
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  서울시 강남구
                </li>
              </ul>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-4">
                <a href="https://github.com/yonghyeon-dev/New_Weave" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Weave. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 플로팅 퀵메뉴 */}
      <FloatingQuickMenu />
    </div>
  );
}