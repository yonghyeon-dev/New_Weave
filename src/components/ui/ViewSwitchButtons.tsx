'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { List, Eye } from 'lucide-react';

export type ViewMode = 'list' | 'detail';

export interface ViewSwitchButtonsProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 뷰 모드 전환 버튼 컴포넌트
 * 
 * 특징:
 * - 리스트/디테일 뷰 전환
 * - 현재 활성 상태 표시
 * - WEAVE 디자인 시스템 준수
 * - 접근성 지원
 */
export function ViewSwitchButtons({
  currentView,
  onViewChange,
  disabled = false,
  className = ''
}: ViewSwitchButtonsProps) {
  return (
    <div className={`flex items-center border border-border-light rounded-lg overflow-hidden ${className}`}>
      {/* 리스트 뷰 버튼 */}
      <Button
        variant={currentView === 'list' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        disabled={disabled}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-none
          ${currentView === 'list' 
            ? 'bg-weave-primary text-white' 
            : 'bg-transparent text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary'
          }
        `}
        aria-label="리스트 뷰로 전환"
        aria-pressed={currentView === 'list'}
      >
        <List className="w-4 h-4" />
        리스트
      </Button>

      {/* 구분선 */}
      <div className="w-px h-6 bg-border-light" />

      {/* 디테일 뷰 버튼 */}
      <Button
        variant={currentView === 'detail' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('detail')}
        disabled={disabled}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-none
          ${currentView === 'detail' 
            ? 'bg-weave-primary text-white' 
            : 'bg-transparent text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary'
          }
        `}
        aria-label="디테일 뷰로 전환"
        aria-pressed={currentView === 'detail'}
      >
        <Eye className="w-4 h-4" />
        디테일
      </Button>
    </div>
  );
}