'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { 
  FileText,
  Upload,
  ArrowRight,
  Sparkles,
  FileImage,
  FileCode,
  Zap,
  Cpu,
  Download,
  Edit3,
  CheckCircle,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';

// 기능 카드 타입
interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
  features: string[];
}

// 통계 데이터 타입
interface StatCard {
  label: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
}

export default function AIAssistant() {
  const router = useRouter();

  // 주요 기능 카드들
  const featureCards: FeatureCard[] = [
    {
      id: 'extract',
      title: '정보 추출',
      description: '이미지나 PDF에서 데이터를 자동으로 추출하고 구조화합니다',
      icon: <Upload className="w-6 h-6" />,
      href: '/ai-assistant/extract',
      color: 'bg-blue-500',
      badge: 'AI 지원',
      features: [
        '드래그앤드롭 파일 업로드',
        'PDF/이미지 자동 인식',
        'JSON 형식 데이터 추출',
        '실시간 미리보기'
      ]
    },
    {
      id: 'generate',
      title: '문서 생성',
      description: '템플릿 기반으로 전문적인 비즈니스 문서를 자동 생성합니다',
      icon: <FileText className="w-6 h-6" />,
      href: '/ai-assistant/generate',
      color: 'bg-purple-500',
      badge: '신규 기능',
      features: [
        '5종 문서 템플릿',
        '마크다운 에디터 통합',
        'PDF/Word 내보내기',
        '실시간 편집 가능'
      ]
    },
    {
      id: 'lookup',
      title: '사업자 조회',
      description: '사업자 정보를 빠르게 조회하고 검증합니다',
      icon: <FileImage className="w-6 h-6" />,
      href: '/ai-assistant/lookup',
      color: 'bg-green-500',
      features: [
        '사업자번호 검증',
        '상호명 조회',
        '업태/종목 확인',
        '사업자 상태 확인'
      ]
    },
    {
      id: 'analysis',
      title: 'AI 분석',
      description: 'Gemini AI를 활용한 고급 데이터 분석 및 인사이트',
      icon: <Sparkles className="w-6 h-6" />,
      href: '/ai-assistant/analysis',
      color: 'bg-yellow-500',
      badge: 'Coming Soon',
      features: [
        '패턴 분석',
        '트렌드 예측',
        '자동 보고서 생성',
        '데이터 시각화'
      ]
    }
  ];

  // 통계 카드 데이터
  const statCards: StatCard[] = [
    {
      label: '처리한 문서',
      value: '1,234',
      trend: '+12%',
      icon: <FileText className="w-5 h-5 text-blue-500" />
    },
    {
      label: '절약한 시간',
      value: '156시간',
      trend: '+23%',
      icon: <Clock className="w-5 h-5 text-green-500" />
    },
    {
      label: '정확도',
      value: '99.8%',
      icon: <Shield className="w-5 h-5 text-purple-500" />
    },
    {
      label: '처리 속도',
      value: '< 2초',
      icon: <Zap className="w-5 h-5 text-yellow-500" />
    }
  ];

  // 최근 업데이트 내용
  const recentUpdates = [
    {
      date: '2025-08-27',
      title: 'PDF/Word 내보내기 기능 추가',
      type: 'feature'
    },
    {
      date: '2025-08-27',
      title: '마크다운 에디터 통합',
      type: 'feature'
    },
    {
      date: '2025-08-27',
      title: '5종 문서 템플릿 추가',
      type: 'enhancement'
    }
  ];

  return (
    <AppLayout>
      <div className="bg-bg-primary min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* 헤더 섹션 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-weave-primary to-weave-primary-light rounded-xl shadow-lg">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <div>
                  <Typography variant="h1" className="text-3xl font-bold mb-2">
                    AI Assistant Hub
                  </Typography>
                  <Typography variant="body1" className="text-txt-secondary">
                    AI 기반 업무 자동화 통합 플랫폼
                  </Typography>
                </div>
              </div>
              <Button 
                variant="primary"
                onClick={() => router.push('/ai-assistant/generate')}
                className="hidden md:flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                빠른 시작
              </Button>
            </div>
          </div>

          {/* 통계 카드 섹션 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <Typography variant="body2" className="text-txt-secondary mb-1">
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" className="text-2xl font-bold">
                      {stat.value}
                    </Typography>
                    {stat.trend && (
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <Typography variant="body2" className="text-green-500">
                          {stat.trend}
                        </Typography>
                      </div>
                    )}
                  </div>
                  {stat.icon}
                </div>
              </Card>
            ))}
          </div>

          {/* 주요 기능 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featureCards.map((feature) => (
              <Card 
                key={feature.id}
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => router.push(feature.href)}
              >
                <div className={`h-2 ${feature.color}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${feature.color} bg-opacity-10 rounded-lg`}>
                      <div className={`${feature.color} bg-opacity-100 text-white rounded-lg p-2`}>
                        {feature.icon}
                      </div>
                    </div>
                    {feature.badge && (
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        feature.badge === 'AI 지원' ? 'bg-blue-100 text-blue-700' :
                        feature.badge === '신규 기능' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  
                  <Typography variant="h3" className="text-xl font-bold mb-2">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" className="text-txt-secondary mb-4">
                    {feature.description}
                  </Typography>

                  {/* 기능 목록 */}
                  <div className="space-y-2 mb-4">
                    {feature.features.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <Typography variant="body2" className="text-txt-secondary">
                          {item}
                        </Typography>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border-light">
                    <Button
                      variant="outline"
                      size="sm"
                      className="group-hover:bg-weave-primary group-hover:text-white transition-colors"
                    >
                      자세히 보기
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 하단 정보 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 최근 업데이트 */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-weave-primary" />
                <Typography variant="h3" className="text-lg font-bold">최근 업데이트</Typography>
              </div>
              <div className="space-y-3">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      update.type === 'feature' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <Typography variant="body1" className="font-medium">
                        {update.title}
                      </Typography>
                      <Typography variant="body2" className="text-txt-secondary">
                        {update.date}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 빠른 시작 가이드 */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                <Typography variant="h3" className="text-lg font-bold">빠른 시작 가이드</Typography>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <div>
                      <Typography variant="body1" className="font-medium text-yellow-900">
                        파일 업로드
                      </Typography>
                      <Typography variant="body2" className="text-yellow-700">
                        PDF나 이미지를 드래그앤드롭으로 업로드
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <div>
                      <Typography variant="body1" className="font-medium text-blue-900">
                        AI 처리
                      </Typography>
                      <Typography variant="body2" className="text-blue-700">
                        Gemini AI가 자동으로 데이터 추출 및 분석
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <div>
                      <Typography variant="body1" className="font-medium text-green-900">
                        문서 생성
                      </Typography>
                      <Typography variant="body2" className="text-green-700">
                        원하는 형식으로 문서 생성 및 내보내기
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA 섹션 */}
          <div className="mt-8 p-8 bg-gradient-to-r from-weave-primary to-weave-primary-light rounded-xl text-white text-center">
            <Typography variant="h2" className="text-2xl font-bold mb-3">
              업무 자동화의 새로운 시작
            </Typography>
            <Typography variant="body1" className="mb-6 opacity-90">
              AI Assistant로 반복적인 업무를 자동화하고 생산성을 높이세요
            </Typography>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                className="bg-white text-weave-primary hover:bg-gray-100"
                onClick={() => router.push('/ai-assistant/extract')}
              >
                <Upload className="w-4 h-4 mr-2" />
                정보 추출 시작
              </Button>
              <Button 
                variant="outline"
                className="bg-white text-weave-primary hover:bg-gray-100"
                onClick={() => router.push('/ai-assistant/generate')}
              >
                <FileText className="w-4 h-4 mr-2" />
                문서 생성 시작
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}