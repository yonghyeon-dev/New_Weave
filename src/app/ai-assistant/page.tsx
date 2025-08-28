'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { WorkspacePageContainer } from '@/components/layout/PageContainer';
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
  Clock,
  BrainCircuit
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
  const [isLoading, setIsLoading] = useState(false);

  // 주요 기능 카드들
  const featureCards: FeatureCard[] = [
    {
      id: 'chat',
      title: 'AI 챗봇',
      description: '실시간 대화형 AI 어시스턴트와 질문하고 답변받으세요',
      icon: <Cpu className="w-6 h-6" />,
      href: '/ai-assistant/chat',
      color: 'bg-green-500',
      badge: '새로운 기능',
      features: [
        '실시간 스트리밍 응답',
        '대화 컨텍스트 유지',
        '마크다운 지원',
        '대화 내보내기 기능'
      ]
    },
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
      date: '2025-08-28',
      title: 'AI 챗봇 기능 출시',
      type: 'feature'
    },
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
      <WorkspacePageContainer>
        <div className="space-y-8">
          {/* 헤더 섹션 - 대시보드/프로젝트와 동일한 형식 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 sm:p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
                <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-weave-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="h2" className="text-xl sm:text-2xl mb-0 sm:mb-1 text-txt-primary leading-tight">AI Assistant</Typography>
                <Typography variant="body1" className="text-sm sm:text-base text-txt-secondary leading-tight hidden sm:block">
                  AI 기반 업무 자동화 도구를 활용하세요
                </Typography>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3 flex-shrink-0">
              <Button 
                variant="primary"
                onClick={() => router.push('/ai-assistant/chat')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2"
              >
                <Cpu className="w-4 h-4" />
                <span className="hidden sm:inline">AI 챗봇 시작</span>
              </Button>
              <Button 
                variant="secondary"
                onClick={() => router.push('/ai-assistant/generate')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">문서 생성</span>
              </Button>
            </div>
          </div>

            {/* 통계 카드 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card className="bg-white rounded-lg border border-border-light p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-bg-secondary rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                    <Typography variant="body2" className="text-txt-tertiary mb-1">
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" className="text-2xl font-bold text-txt-primary">
                      {stat.value}
                    </Typography>
                    {stat.trend && (
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <Typography variant="body2" className="text-green-500 font-medium">
                          {stat.trend}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

            {/* 주요 기능 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featureCards.map((feature) => (
                <Card 
                  key={feature.id}
                  className="bg-white rounded-lg border border-border-light hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                  onClick={() => router.push(feature.href)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-bg-secondary rounded-lg">
                        <div className={`${feature.color} bg-opacity-20 rounded-lg p-2`}>
                          {React.cloneElement(feature.icon as React.ReactElement, { 
                            className: `w-6 h-6 ${feature.color.replace('bg-', 'text-')}`
                          })}
                        </div>
                      </div>
                      {feature.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          feature.badge === 'AI 지원' ? 'bg-blue-50 text-blue-600' :
                          feature.badge === '신규 기능' ? 'bg-green-50 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {feature.badge}
                        </span>
                      )}
                    </div>
                  
                    <Typography variant="h3" className="text-lg font-semibold mb-2 text-txt-primary">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="text-txt-secondary mb-4">
                      {feature.description}
                    </Typography>

                    {/* 기능 목록 */}
                    <div className="space-y-2 mb-4">
                      {feature.features.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <Typography variant="body2" className="text-txt-tertiary text-sm">
                            {item}
                          </Typography>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-border-light">
                      <div className="flex items-center gap-1 text-weave-primary group-hover:gap-2 transition-all">
                        <Typography variant="body2" className="font-medium">
                          시작하기
                        </Typography>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Card>
            ))}
          </div>

            {/* 하단 정보 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 최근 업데이트 */}
              <div className="bg-white rounded-lg border border-border-light p-6">
                <Typography variant="h4" className="mb-4 font-semibold">
                  최근 업데이트
                </Typography>
              <div className="space-y-3">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-border-light last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      update.type === 'feature' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <Typography variant="body2" className="font-medium text-txt-primary">
                        {update.title}
                      </Typography>
                      <Typography variant="body2" className="text-txt-tertiary text-sm">
                        {update.date}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
              </div>

              {/* 빠른 시작 가이드 */}
              <div className="bg-white rounded-lg border border-border-light p-6">
                <Typography variant="h4" className="mb-4 font-semibold">
                  빠른 시작 가이드
                </Typography>
              <div className="space-y-3">
                  <div className="flex items-start gap-3 pb-3 border-b border-border-light">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div className="flex-1">
                      <Typography variant="body2" className="font-medium text-txt-primary mb-1">
                        파일 업로드
                      </Typography>
                      <Typography variant="body2" className="text-txt-tertiary text-sm">
                        PDF나 이미지를 드래그앤드롭으로 업로드
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-3 border-b border-border-light">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div className="flex-1">
                      <Typography variant="body2" className="font-medium text-txt-primary mb-1">
                        AI 처리
                      </Typography>
                      <Typography variant="body2" className="text-txt-tertiary text-sm">
                        Gemini AI가 자동으로 데이터 추출 및 분석
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div className="flex-1">
                      <Typography variant="body2" className="font-medium text-txt-primary mb-1">
                        문서 생성
                      </Typography>
                      <Typography variant="body2" className="text-txt-tertiary text-sm">
                        원하는 형식으로 문서 생성 및 내보내기
                      </Typography>
                    </div>
                  </div>
              </div>
              </div>
            </div>

        </div>
      </WorkspacePageContainer>
    </AppLayout>
  );
}