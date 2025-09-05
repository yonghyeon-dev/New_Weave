'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { List, LayoutGrid } from 'lucide-react';

export type ViewMode = 'list' | 'detail';

interface ViewModeSwitchProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * 뷰 모드 전환 스위치 컴포넌트
 * List View와 Detail View 간 전환을 제공
 */
export function ViewModeSwitch({ 
  mode, 
  onModeChange, 
  className,
  disabled = false 
}: ViewModeSwitchProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center bg-bg-secondary rounded-lg p-1 border border-border-light",
        className
      )}
      role="group"
      aria-label="뷰 모드 선택"
    >
      <button
        type="button"
        onClick={() => onModeChange('list')}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
          "focus:outline-none focus:ring-2 focus:ring-weave-primary focus:ring-offset-1",
          mode === 'list' 
            ? "bg-white text-weave-primary shadow-sm" 
            : "text-txt-secondary hover:text-txt-primary hover:bg-bg-tertiary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-pressed={mode === 'list'}
        aria-label="List View"
      >
        <List className="w-4 h-4" />
        <span>List View</span>
      </button>
      
      <button
        type="button"
        onClick={() => onModeChange('detail')}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
          "focus:outline-none focus:ring-2 focus:ring-weave-primary focus:ring-offset-1",
          mode === 'detail' 
            ? "bg-white text-weave-primary shadow-sm" 
            : "text-txt-secondary hover:text-txt-primary hover:bg-bg-tertiary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-pressed={mode === 'detail'}
        aria-label="Detail View"
      >
        <LayoutGrid className="w-4 h-4" />
        <span>Detail View</span>
      </button>
    </div>
  );
}

export default ViewModeSwitch;