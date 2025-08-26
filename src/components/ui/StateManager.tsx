'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Typography from './Typography';
import { AlertCircle, RefreshCw, Plus, Search } from 'lucide-react';

// 상태 타입 정의
export type StateType = 'loading' | 'empty' | 'error' | 'success';

// Props 인터페이스
export interface StateManagerProps {
  state: StateType;
  loading?: {
    type?: 'skeleton' | 'spinner';
    message?: string;
  };
  empty?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'secondary';
    };
  };
  error?: {
    title?: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  children?: React.ReactNode;
  className?: string;
}

// 스켈레톤 컴포넌트
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
};

// 로딩 스켈레톤 레이아웃들
const SkeletonCard = () => (
  <div className="p-6 space-y-3">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  </div>
);

const SkeletonList = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonTable = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-4 gap-4 p-4 border-b">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-4" />
      ))}
    </div>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="grid grid-cols-4 gap-4 p-4">
        {[...Array(4)].map((_, j) => (
          <Skeleton key={j} className="h-4" />
        ))}
      </div>
    ))}
  </div>
);

// 메인 StateManager 컴포넌트
const StateManager: React.FC<StateManagerProps> = ({
  state,
  loading = {},
  empty = {},
  error = {},
  children,
  className,
}) => {
  // Success 상태일 때는 children 렌더링
  if (state === 'success') {
    return <>{children}</>;
  }

  // Loading 상태
  if (state === 'loading') {
    const { type = 'skeleton', message = '데이터를 불러오는 중...' } = loading;
    
    return (
      <div className={cn("w-full", className)}>
        {type === 'spinner' ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-weave-primary"></div>
            <Typography variant="body2" className="text-txt-secondary">
              {message}
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonList />
          </div>
        )}
      </div>
    );
  }

  // Empty 상태
  if (state === 'empty') {
    const {
      icon = <Search className="w-12 h-12 text-txt-tertiary" />,
      title = '데이터가 없습니다',
      description = '아직 생성된 항목이 없어요. 새로운 항목을 추가해보세요.',
      action
    } = empty;

    return (
      <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}>
        <div className="mb-4">
          {icon}
        </div>
        <Typography variant="h3" className="mb-2 text-txt-primary">
          {title}
        </Typography>
        <Typography variant="body1" className="mb-6 text-txt-secondary max-w-md">
          {description}
        </Typography>
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'primary'}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  // Error 상태
  if (state === 'error') {
    const {
      title = '문제가 발생했습니다',
      description = '데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
      action = {
        label: '다시 시도',
        onClick: () => window.location.reload()
      }
    } = error;

    return (
      <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}>
        <div className="mb-4">
          <AlertCircle className="w-12 h-12 text-status-error" />
        </div>
        <Typography variant="h3" className="mb-2 text-txt-primary">
          {title}
        </Typography>
        <Typography variant="body1" className="mb-6 text-txt-secondary max-w-md">
          {description}
        </Typography>
        <Button
          onClick={action.onClick}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {action.label}
        </Button>
      </div>
    );
  }

  return null;
};

// 특화된 스켈레톤 컴포넌트들 내보내기
(StateManager as any).Skeleton = Skeleton;
(StateManager as any).SkeletonCard = SkeletonCard;
(StateManager as any).SkeletonList = SkeletonList;
(StateManager as any).SkeletonTable = SkeletonTable;

export default StateManager;