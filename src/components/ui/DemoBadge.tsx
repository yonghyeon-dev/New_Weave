'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Typography from './Typography';
import { 
  Info, 
  AlertTriangle, 
  Eye, 
  Sparkles,
  Database,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';

// 데모 배지 타입
export type DemoBadgeType = 
  | 'sample'     // 샘플 데이터
  | 'demo'       // 데모 환경
  | 'preview'    // 미리보기
  | 'mock'       // 목업 데이터
  | 'test'       // 테스트 데이터
  | 'simulated'; // 시뮬레이션 데이터

// 데이터 소스 타입
export type DataSource = 
  | 'generated'   // AI 생성
  | 'template'    // 템플릿
  | 'historical'  // 과거 데이터
  | 'projected'   // 예상 수치
  | 'benchmark'   // 벤치마크
  | 'randomized'; // 랜덤 생성

// Props 인터페이스
export interface DemoBadgeProps {
  type: DemoBadgeType;
  source?: DataSource;
  description?: string;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'inline' | 'corner' | 'overlay';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  children?: React.ReactNode;
}

// 툴팁 Props
export interface DemoTooltipProps {
  type: DemoBadgeType;
  source?: DataSource;
  description?: string;
  isVisible: boolean;
  onClose: () => void;
}

// 타입별 설정
const typeConfig = {
  sample: {
    label: '샘플',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Database,
    defaultDescription: '이 데이터는 시연용 샘플입니다.'
  },
  demo: {
    label: '데모',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Eye,
    defaultDescription: '데모 환경의 시험 데이터입니다.'
  },
  preview: {
    label: '미리보기',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Eye,
    defaultDescription: '실제 구현 전 미리보기입니다.'
  },
  mock: {
    label: '목업',
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: Sparkles,
    defaultDescription: '디자인 검토용 목업 데이터입니다.'
  },
  test: {
    label: '테스트',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: AlertTriangle,
    defaultDescription: '테스트 환경의 임시 데이터입니다.'
  },
  simulated: {
    label: '시뮬레이션',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: TrendingUp,
    defaultDescription: '시뮬레이션으로 생성된 데이터입니다.'
  }
};

// 소스별 설정
const sourceConfig = {
  generated: {
    label: 'AI 생성',
    icon: Sparkles,
    description: 'AI가 자동 생성한'
  },
  template: {
    label: '템플릿',
    icon: Database,
    description: '표준 템플릿 기반'
  },
  historical: {
    label: '과거 데이터',
    icon: Calendar,
    description: '과거 실제 데이터 기반'
  },
  projected: {
    label: '예상 수치',
    icon: TrendingUp,
    description: '예상 수치 기반'
  },
  benchmark: {
    label: '벤치마크',
    icon: Users,
    description: '업계 벤치마크 기반'
  },
  randomized: {
    label: '랜덤 생성',
    icon: Sparkles,
    description: '무작위 생성된'
  }
};

// 툴팁 컴포넌트
const DemoTooltip: React.FC<DemoTooltipProps> = ({ 
  type, 
  source, 
  description, 
  isVisible, 
  onClose 
}) => {
  if (!isVisible) return null;

  const typeInfo = typeConfig[type];
  const sourceInfo = source ? sourceConfig[source] : null;

  return (
    <div className="absolute z-50 p-3 mt-1 bg-white border border-primary-borderSecondary rounded-lg shadow-lg min-w-64 max-w-80">
      <div className="flex items-start gap-2 mb-2">
        <typeInfo.icon className="w-4 h-4 text-weave-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <Typography variant="body2" className="font-semibold text-txt-primary mb-1">
            {typeInfo.label} 데이터
          </Typography>
          <Typography variant="caption" className="text-txt-secondary leading-relaxed">
            {description || typeInfo.defaultDescription}
          </Typography>
        </div>
      </div>

      {sourceInfo && (
        <div className="flex items-center gap-2 pt-2 border-t border-primary-borderSecondary">
          <sourceInfo.icon className="w-3 h-3 text-txt-tertiary" />
          <Typography variant="caption" className="text-txt-secondary">
            출처: {sourceInfo.description} 데이터
          </Typography>
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-1 right-1 p-1 hover:bg-primary-surfaceVariant rounded"
      >
        <Typography variant="caption" className="text-txt-tertiary">×</Typography>
      </button>
    </div>
  );
};

const DemoBadge = React.forwardRef<HTMLDivElement, DemoBadgeProps>(
  ({ 
    type, 
    source,
    description,
    showTooltip = true,
    size = 'md',
    variant = 'badge',
    position = 'top-right',
    className,
    children,
    ...props 
  }, ref) => {
    const [showTooltipState, setShowTooltipState] = useState(false);
    const typeInfo = typeConfig[type];
    const sourceInfo = source ? sourceConfig[source] : null;

    // 크기별 스타일
    const sizeStyles = {
      sm: {
        badge: 'px-1.5 py-0.5 text-xs gap-1',
        icon: 'w-3 h-3',
        text: 'text-xs'
      },
      md: {
        badge: 'px-2 py-1 text-sm gap-1.5',
        icon: 'w-3.5 w-3.5',
        text: 'text-sm'
      },
      lg: {
        badge: 'px-2.5 py-1.5 text-base gap-2',
        icon: 'w-4 h-4',
        text: 'text-base'
      }
    };

    // 위치별 스타일
    const positionStyles = {
      'top-left': 'top-2 left-2',
      'top-right': 'top-2 right-2',
      'bottom-left': 'bottom-2 left-2',
      'bottom-right': 'bottom-2 right-2'
    };

    const sizeConfig = sizeStyles[size];
    const Icon = typeInfo.icon;

    // 뱃지 컴포넌트
    const BadgeContent = () => (
      <div
        className={cn(
          'inline-flex items-center font-medium border rounded-full',
          'cursor-pointer hover:shadow-sm transition-all duration-200',
          typeInfo.color,
          sizeConfig.badge,
          className
        )}
        onClick={() => showTooltip && setShowTooltipState(!showTooltipState)}
        onMouseEnter={() => showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => showTooltip && setShowTooltipState(false)}
        role="button"
        aria-label={`${typeInfo.label} 데이터 - 상세 정보 보기`}
      >
        <Icon className={sizeConfig.icon} aria-hidden="true" />
        <span className={sizeConfig.text}>
          {typeInfo.label}
          {sourceInfo && ` (${sourceInfo.label})`}
        </span>
        {showTooltip && (
          <Info className="w-2.5 h-2.5 opacity-60" aria-hidden="true" />
        )}
      </div>
    );

    // 인라인 텍스트 컴포넌트
    const InlineContent = () => (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-txt-secondary',
          sizeConfig.text,
          'cursor-pointer hover:text-txt-primary transition-colors',
          className
        )}
        onClick={() => showTooltip && setShowTooltipState(!showTooltipState)}
        role="button"
        aria-label={`${typeInfo.label} 데이터 - 상세 정보 보기`}
      >
        <Icon className={cn(sizeConfig.icon, 'opacity-60')} aria-hidden="true" />
        {typeInfo.label}
        {showTooltip && <Info className="w-2.5 h-2.5 opacity-40" />}
      </span>
    );

    // 오버레이 컴포넌트
    const OverlayContent = () => (
      <div className="relative">
        {children}
        <div
          className={cn(
            'absolute',
            positionStyles[position],
            'z-10'
          )}
        >
          <BadgeContent />
        </div>
      </div>
    );

    if (variant === 'inline') {
      return (
        <div ref={ref} className="relative inline-block" {...props}>
          <InlineContent />
          <DemoTooltip
            type={type}
            source={source}
            description={description}
            isVisible={showTooltipState}
            onClose={() => setShowTooltipState(false)}
          />
        </div>
      );
    }

    if (variant === 'overlay') {
      return (
        <div ref={ref} className="relative" {...props}>
          <OverlayContent />
          {showTooltipState && (
            <div className={cn('absolute z-50', positionStyles[position])}>
              <DemoTooltip
                type={type}
                source={source}
                description={description}
                isVisible={showTooltipState}
                onClose={() => setShowTooltipState(false)}
              />
            </div>
          )}
        </div>
      );
    }

    if (variant === 'corner' && children) {
      return (
        <div ref={ref} className="relative" {...props}>
          {children}
          <div
            className={cn(
              'absolute',
              positionStyles[position],
              'z-10'
            )}
          >
            <BadgeContent />
            <DemoTooltip
              type={type}
              source={source}
              description={description}
              isVisible={showTooltipState}
              onClose={() => setShowTooltipState(false)}
            />
          </div>
        </div>
      );
    }

    // 기본 badge 형태
    return (
      <div ref={ref} className="relative inline-block" {...props}>
        <BadgeContent />
        <DemoTooltip
          type={type}
          source={source}
          description={description}
          isVisible={showTooltipState}
          onClose={() => setShowTooltipState(false)}
        />
      </div>
    );
  }
);

DemoBadge.displayName = 'DemoBadge';

// 데모 메트릭 래퍼 컴포넌트
export interface DemoMetricProps {
  value: string | number;
  label: string;
  type: DemoBadgeType;
  source?: DataSource;
  description?: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export const DemoMetric = React.forwardRef<HTMLDivElement, DemoMetricProps>(
  ({ value, label, type, source, description, unit, trend, className, ...props }, ref) => {
    const trendConfig = {
      up: { icon: '↗', color: 'text-status-success' },
      down: { icon: '↘', color: 'text-status-error' },
      stable: { icon: '→', color: 'text-txt-secondary' }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border border-primary-borderSecondary bg-primary-surface relative',
          className
        )}
        {...props}
      >
        <DemoBadge
          type={type}
          source={source}
          description={description}
          variant="corner"
          position="top-right"
          size="sm"
        />
        
        <div className="pr-16"> {/* 배지 공간 확보 */}
          <Typography variant="caption" className="text-txt-secondary block mb-1">
            {label}
          </Typography>
          
          <div className="flex items-baseline gap-2">
            <Typography variant="h2" className="text-txt-primary font-bold">
              {typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
            </Typography>
            
            {unit && (
              <Typography variant="body1" className="text-txt-secondary">
                {unit}
              </Typography>
            )}
            
            {trend && (
              <span className={cn('text-sm font-medium', trendConfig[trend].color)}>
                {trendConfig[trend].icon}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

DemoMetric.displayName = 'DemoMetric';

export default DemoBadge;