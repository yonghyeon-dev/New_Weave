'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Badge from './Badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  FileText,
  CreditCard,
  BarChart3,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';

// 시나리오 단계 타입
export interface ScenarioStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number; // 밀리초
  component?: React.ReactNode;
  status: 'waiting' | 'running' | 'completed' | 'error';
}

// 데모 시나리오 Props
export interface DemoScenarioProps {
  className?: string;
  title?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
  onStepChange?: (step: ScenarioStep) => void;
}

// 기본 시나리오: 인보이스 생성 → 상태 변경 → 대시보드 반영
const DEFAULT_SCENARIO: ScenarioStep[] = [
  {
    id: 'create-invoice',
    title: '인보이스 생성',
    description: '새 인보이스를 생성하고 클라이언트 정보를 입력합니다.',
    icon: <FileText className="w-5 h-5" />,
    duration: 2000,
    status: 'waiting',
    component: (
      <div className="p-4 bg-bg-secondary rounded-lg">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-weave-primary rounded-full animate-pulse"></div>
            <span className="text-sm">클라이언트: (주)테크스타트업</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-weave-primary rounded-full animate-pulse"></div>
            <span className="text-sm">금액: ₩2,500,000</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-weave-primary rounded-full animate-pulse"></div>
            <span className="text-sm">상태: 임시저장</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'send-invoice',
    title: '인보이스 발송',
    description: '생성된 인보이스를 클라이언트에게 발송합니다.',
    icon: <ArrowRight className="w-5 h-5" />,
    duration: 1500,
    status: 'waiting',
    component: (
      <div className="p-4 bg-status-info bg-opacity-10 border border-status-info rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-status-success" />
          <span className="text-sm">이메일 발송 완료: client@techstartup.com</span>
        </div>
      </div>
    )
  },
  {
    id: 'payment-received',
    title: '결제 완료',
    description: '클라이언트로부터 결제가 완료되었습니다.',
    icon: <CreditCard className="w-5 h-5" />,
    duration: 1800,
    status: 'waiting',
    component: (
      <div className="p-4 bg-status-success bg-opacity-10 border border-status-success rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-status-success" />
            <span className="text-sm font-medium">결제 완료</span>
          </div>
          <div className="text-sm text-txt-secondary">
            결제금액: ₩2,500,000 | 결제수단: 계좌이체
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'dashboard-update',
    title: '대시보드 반영',
    description: '매출과 통계가 실시간으로 대시보드에 반영됩니다.',
    icon: <BarChart3 className="w-5 h-5" />,
    duration: 2200,
    status: 'waiting',
    component: (
      <div className="p-4 bg-weave-primary-light rounded-lg">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">이번 달 매출</span>
            <span className="font-semibold text-weave-primary">₩12,500,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">완료된 인보이스</span>
            <span className="font-semibold text-status-success">8개</span>
          </div>
          <div className="w-full bg-bg-primary rounded-full h-2">
            <div 
              className="bg-weave-primary h-2 rounded-full transition-all duration-500" 
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      </div>
    )
  }
];

const DemoScenario: React.FC<DemoScenarioProps> = ({
  className,
  title = "인보이스 생성 → 결제 완료 데모 시나리오",
  autoPlay = false,
  onComplete,
  onStepChange,
}) => {
  const [steps, setSteps] = useState<ScenarioStep[]>(DEFAULT_SCENARIO);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 시나리오 리셋
  const resetScenario = () => {
    setSteps(DEFAULT_SCENARIO.map(step => ({ ...step, status: 'waiting' })));
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setIsPaused(false);
  };

  // 시나리오 재생/일시정지
  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      setIsPaused(!isPaused);
    } else {
      setIsPlaying(true);
      setIsPaused(false);
      if (currentStepIndex === -1) {
        setCurrentStepIndex(0);
      }
    }
  }, [isPlaying, isPaused, currentStepIndex]);

  // 단계별 실행
  useEffect(() => {
    if (!isPlaying || isPaused || currentStepIndex === -1) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep || currentStep.status === 'completed') return;

    // 현재 단계를 실행 중으로 설정
    setSteps(prev => prev.map((step, index) => 
      index === currentStepIndex 
        ? { ...step, status: 'running' }
        : step
    ));

    onStepChange?.(currentStep);

    const timer = setTimeout(() => {
      // 현재 단계를 완료로 설정
      setSteps(prev => prev.map((step, index) => 
        index === currentStepIndex 
          ? { ...step, status: 'completed' }
          : step
      ));

      // 다음 단계로 이동
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // 모든 단계 완료
        setIsPlaying(false);
        onComplete?.();
      }
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isPlaying, isPaused, steps, onComplete, onStepChange]);

  // 자동 재생
  useEffect(() => {
    if (autoPlay) {
      const autoTimer = setTimeout(() => {
        togglePlayback();
      }, 1000);
      return () => clearTimeout(autoTimer);
    }
  }, [autoPlay, togglePlayback]);

  const getStepIcon = (step: ScenarioStep) => {
    switch (step.status) {
      case 'running':
        return <Clock className="w-4 h-4 text-weave-primary animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-status-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-status-error" />;
      default:
        return step.icon;
    }
  };

  const getStepStatus = (step: ScenarioStep) => {
    switch (step.status) {
      case 'running':
        return <Badge variant="secondary" className="bg-weave-primary-light text-weave-primary">실행 중</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-status-success text-white">완료</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-status-error text-white">오류</Badge>;
      default:
        return <Badge variant="outline">대기 중</Badge>;
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className={cn("max-w-4xl mx-auto p-6 bg-bg-primary border border-border-light rounded-lg", className)}>
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-txt-primary">{title}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayback}
              leftIcon={isPlaying && !isPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {isPlaying && !isPaused ? '일시정지' : '재생'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetScenario}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              리셋
            </Button>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-txt-secondary">진행률</span>
            <span className="text-txt-primary font-medium">{completedSteps}/{steps.length} 단계 완료</span>
          </div>
          <div className="w-full bg-bg-secondary rounded-full h-2">
            <div 
              className="bg-weave-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 시나리오 단계들 */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex gap-4 p-4 rounded-lg border transition-all duration-300",
              step.status === 'running' && "border-weave-primary bg-weave-primary-light",
              step.status === 'completed' && "border-status-success bg-green-50",
              step.status === 'waiting' && "border-border-light bg-bg-primary",
              step.status === 'error' && "border-status-error bg-red-50"
            )}
          >
            {/* 단계 아이콘 */}
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
              step.status === 'running' && "bg-weave-primary text-white",
              step.status === 'completed' && "bg-status-success text-white",
              step.status === 'waiting' && "bg-bg-secondary text-txt-tertiary",
              step.status === 'error' && "bg-status-error text-white"
            )}>
              {getStepIcon(step)}
            </div>

            {/* 단계 내용 */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-txt-primary">{step.title}</h3>
                {getStepStatus(step)}
              </div>
              <p className="text-sm text-txt-secondary">{step.description}</p>
              
              {/* 단계별 컴포넌트 */}
              {step.status !== 'waiting' && step.component && (
                <div className="mt-3">
                  {step.component}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 완료 메시지 */}
      {completedSteps === steps.length && (
        <div className="mt-6 p-4 bg-status-success bg-opacity-10 border border-status-success rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-status-success" />
            <span className="font-medium text-status-success">
              데모 시나리오가 성공적으로 완료되었습니다! 🎉
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoScenario;