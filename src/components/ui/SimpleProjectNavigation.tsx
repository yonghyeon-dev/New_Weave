'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

export interface SimpleProjectNavigationProps {
  /** 현재 인덱스 (0부터 시작) */
  currentIndex: number;
  /** 총 아이템 수 */
  totalCount: number;
  /** 네비게이션 핸들러 */
  onNavigate: (direction: 'prev' | 'next') => void;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 클래스명 */
  className?: string;
  /** 접근성 라벨 */
  ariaLabel?: string;
  /** 아이템 타입 (예: "프로젝트") */
  itemType?: string;
  /** 현재 위치 표시 여부 */
  showPosition?: boolean;
  /** 컴팩트 모드 (위치 정보 텍스트 숨김) */
  compact?: boolean;
}

/**
 * 단순 프로젝트 네비게이션 컴포넌트
 * 
 * 특징:
 * - 이전/다음 버튼만으로 구성된 미니멀한 네비게이션
 * - 프로젝트 내부 상세 페이지에 최적화
 * - 현재 위치 표시 옵션
 * - 컴팩트 모드 지원
 * - 접근성 지원 및 키보드 네비게이션
 */
const SimpleProjectNavigation: React.FC<SimpleProjectNavigationProps> = ({
  currentIndex,
  totalCount,
  onNavigate,
  size = 'sm',
  className,
  ariaLabel = '프로젝트 네비게이션',
  itemType = '프로젝트',
  showPosition = true,
  compact = false
}) => {
  // 엣지 케이스 처리
  if (totalCount <= 0) return null;
  if (currentIndex < 0 || currentIndex >= totalCount) {
    console.warn(`Invalid currentIndex: ${currentIndex}. Should be between 0 and ${totalCount - 1}`);
    return null;
  }

  const currentPage = currentIndex + 1; // 사용자에게는 1부터 표시
  
  // 크기별 스타일
  const sizeClasses = {
    sm: 'h-8 min-w-8 px-2 text-sm',
    md: 'h-10 min-w-10 px-3 text-sm',
    lg: 'h-12 min-w-12 px-4 text-base',
  };

  // 네비게이션 상태
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalCount - 1;

  const handlePrev = () => canGoPrev && onNavigate('prev');
  const handleNext = () => canGoNext && onNavigate('next');

  return (
    <nav 
      className={cn("flex items-center gap-1", className)}
      aria-label={ariaLabel}
      role="navigation"
    >
      {/* 이전 버튼 */}
      <Button
        variant="ghost"
        size={size}
        onClick={handlePrev}
        disabled={!canGoPrev}
        className={sizeClasses[size]}
        aria-label={`이전 ${itemType}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* 현재 위치 표시 (옵션) */}
      {showPosition && (
        <div className={cn(
          "flex items-center justify-center rounded-lg bg-weave-primary text-white font-medium",
          sizeClasses[size]
        )}>
          {currentPage}
        </div>
      )}

      {/* 다음 버튼 */}
      <Button
        variant="ghost"
        size={size}
        onClick={handleNext}
        disabled={!canGoNext}
        className={sizeClasses[size]}
        aria-label={`다음 ${itemType}`}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* 위치 정보 텍스트 (컴팩트 모드가 아닐 때만) */}
      {!compact && (
        <span className="ml-2 text-sm text-txt-tertiary bg-bg-secondary px-3 py-1 rounded-md whitespace-nowrap">
          {currentPage} / {totalCount}
        </span>
      )}
    </nav>
  );
};

export default SimpleProjectNavigation;