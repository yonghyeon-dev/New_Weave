'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { 
  LogIn, 
  UserPlus, 
  FileText, 
  Calculator, 
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const router = useRouter();
  const currentYear = 2025;

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

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                기능
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                요금제
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                고객 후기
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                문의
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="hidden sm:flex items-center gap-2"
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
                무료 시작
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
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

            {/* Quick Links */}
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
                  <Link href="/payments" className="text-gray-400 hover:text-white text-sm transition-colors">
                    결제 관리
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-4">서비스</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <FileText className="w-4 h-4" />
                  문서 자동화
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calculator className="w-4 h-4" />
                  세무 관리
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <CreditCard className="w-4 h-4" />
                  결제 추적
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
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
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
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                이용약관
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                사이트맵
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}