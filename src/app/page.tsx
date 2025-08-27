'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { 
  LogIn, 
  UserPlus,
  Brain,
  FileText,
  Calculator,
  CreditCard,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Github,
  Menu
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const currentYear = 2025;

  return (
    <div className="min-h-screen">
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

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="#features" className="flex items-center h-6 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                기능
              </Link>
              <Link href="#benefits" className="flex items-center h-6 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                혜택
              </Link>
              <Link href="#testimonials" className="flex items-center h-6 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                고객 후기
              </Link>
              <Link href="#contact" className="flex items-center h-6 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                문의
              </Link>
            </nav>

            {/* CTA Buttons */}
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
              onClick={() => {/* Mobile menu logic if needed */}}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Main Content */}
      <main id="main-content">
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="sm:inline">흩어진 당신의 업무를</span>
                <br className="hidden sm:block" />
                <span className="text-yellow-300">하나로 엮다</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100">
독립 비즈니스를 위한 개인화 AI 기반 ERP. 프리랜서, 소상공인, 전문직, 크리에이터까지 계약부터 세무까지 모든 업무를 한 곳에서 관리하세요.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/home')}
                  className="px-8 py-4 text-lg font-semibold"
                >
                  홈 화면 바로가기 <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="secondary-dark"
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-4 text-lg font-semibold"
                >
                  데모 보기
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-300" />
                  <span>무료 가입</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-300" />
                  <span>즉시 사용 가능</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-300" />
                  <span>AI 기반 자동화</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Hero Image Placeholder - AI Workspace */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Brain className="w-8 h-8 text-blue-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">AI 분석</h3>
                    <p className="text-xs text-gray-600">스마트 업무 최적화</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">성과 추적</h3>
                    <p className="text-xs text-gray-600">실시간 수익 분석</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <FileText className="w-8 h-8 text-purple-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">문서 자동화</h3>
                    <p className="text-xs text-gray-600">계약서, 인보이스</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Calculator className="w-8 h-8 text-orange-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">세무 관리</h3>
                    <p className="text-xs text-gray-600">자동 세금 계산</p>
                  </div>
                </div>
                
                {/* Mini Dashboard Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">이번 달 수익</h4>
                    <span className="text-2xl font-bold text-green-600">₩2,450,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI가 처리하고, 당신은 창작에 집중하세요
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              반복적인 업무는 AI에게 맡기고, 정말 중요한 창작 활동에만 집중할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Brain className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">AI 업무 비서</h3>
              <p className="text-gray-600 mb-4">
                문서 생성, 정보 추출, 세무 상담까지 AI가 24시간 업무를 도와드립니다.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  견적서/계약서 자동 생성
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  영수증 데이터 자동 추출
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  세무 상담 및 절세 전략
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">통합 대시보드</h3>
              <p className="text-gray-600 mb-4">
                흩어진 업무 데이터를 한눈에 보고, 비즈니스 성과를 실시간으로 추적하세요.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  실시간 수익 및 지출 분석
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  프로젝트 진행률 추적
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  클라이언트 관계 관리
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">보안 & 자동화</h3>
              <p className="text-gray-600 mb-4">
                안전한 파일 처리와 스마트한 알림 시스템으로 놓치는 일 없이 업무하세요.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  TTL 기반 보안 업로드
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  자동 리마인더 & 알림
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  결제 추적 및 미수금 관리
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
독립 워커의 성공을 위한 모든 것
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                업무 효율성을 극대화하고 수익을 증대시키는 스마트한 도구들을 제공합니다.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">업무 시간 70% 단축</h3>
                    <p className="text-gray-600">AI 자동화로 반복 업무를 줄이고 창작에 더 많은 시간을 투자하세요.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">수익 증가 평균 40%</h3>
                    <p className="text-gray-600">체계적인 클라이언트 관리와 효율적인 프로젝트 추적으로 수익성을 개선하세요.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">세무 스트레스 제로</h3>
                    <p className="text-gray-600">AI 세무 상담과 자동 문서 정리로 세무 신고를 간편하게 처리하세요.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600">활성 사용자</div>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                  <div className="text-gray-600">서비스 가동률</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
                  <div className="text-gray-600">처리된 문서</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">4.9★</div>
                  <div className="text-gray-600">평균 평점</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
성공한 독립 워커들의 이야기
            </h2>
            <p className="text-xl text-gray-600">
              Weave와 함께 업무 효율성을 높이고 수익을 늘린 실제 사용자들의 후기입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-6">
                &ldquo;AI 비서 덕분에 견적서 작성 시간이 80% 줄었어요. 이제 창작에만 집중할 수 있습니다.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <div className="font-semibold">김창작</div>
                  <div className="text-sm text-gray-500">UI/UX 디자이너</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-6">
                &ldquo;세무 관리가 이렇게 쉬울 줄 몰랐어요. AI 상담으로 절세 효과도 톡톡히 봤습니다.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <div className="font-semibold">박프리</div>
                  <div className="text-sm text-gray-500">웹 개발자</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-6">
                &ldquo;클라이언트 관리부터 결제 추적까지 모든 게 자동화되어 업무가 너무 편해졌어요.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <div className="font-semibold">이효율</div>
                  <div className="text-sm text-gray-500">콘텐츠 마케터</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            오늘부터 스마트하게 일을 시작하세요
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            무료로 시작하고, 독립 비즈니스의 새로운 기준을 경험해보세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/home')}
              className="px-8 py-4 text-lg font-semibold"
            >
              홈 화면 바로가기 <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="secondary-dark"
              size="lg"
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 text-lg font-semibold"
            >
              더 알아보기
            </Button>
          </div>

          <p className="text-sm text-blue-200 mt-6">
            신용카드 등록 불필요 · 언제든 취소 가능
          </p>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold mb-4">제품</h3>
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
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">지원</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    도움말 센터
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    사용 가이드
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    API 문서
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    개발자 리소스
                  </a>
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
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Weave. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                개인정보처리방침
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                이용약관
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}