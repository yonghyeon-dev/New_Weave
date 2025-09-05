'use client';

import React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { 
  BaseInteractiveProps, 
  ComponentSize, 
  SizedComponentProps 
} from '@/lib/types/components';

export interface CheckboxProps extends BaseInteractiveProps, SizedComponentProps {
  /** 체크 상태 */
  checked?: boolean;
  /** 부분선택 상태 (전체선택에서 사용) */
  indeterminate?: boolean;
  /** 상태 변경 핸들러 */
  onChange?: (checked: boolean) => void;
  /** 라벨 텍스트 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 폼 필드명 */
  name?: string;
  /** 값 */
  value?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      onChange,
      disabled = false,
      size = 'md',
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      name,
      value,
      id,
      'aria-label': ariaLabel,
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    // 고유 ID 생성 (접근성을 위해)
    const generatedId = React.useId();
    const checkboxId = id || generatedId;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const helperId = helperText ? `${checkboxId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    const handleClick = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    // 크기별 스타일 정의
    const sizeClasses = {
      sm: {
        checkbox: 'w-4 h-4',
        icon: 'w-3.5 h-3.5',
        text: 'text-sm'
      },
      md: {
        checkbox: 'w-5 h-5',
        icon: 'w-4 h-4',
        text: 'text-sm'
      },
      lg: {
        checkbox: 'w-6 h-6',
        icon: 'w-5 h-5',
        text: 'text-base'
      }
    };

    const checkboxElement = (
      <button
        ref={ref}
        type="button"
        id={checkboxId}
        name={name}
        value={value}
        onClick={handleClick}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-label={ariaLabel || label}
        aria-describedby={describedBy}
        data-testid={dataTestId}
        className={cn(
          // 기본 스타일
          'inline-flex items-center justify-center rounded-sm border-2 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-weave-primary focus:ring-offset-2',
          
          // 크기
          sizeClasses[size].checkbox,
          
          // 상태별 스타일 - 체크시 배경 채우기 제거, 테두리만 유지
          checked || indeterminate
            ? 'bg-transparent border-weave-primary text-weave-primary hover:border-weave-primary-hover'
            : 'bg-transparent border-border-light hover:border-weave-primary hover:bg-weave-primary-light',
            
          // 에러 상태
          error && 'border-red-500 focus:ring-red-500',
          
          // 비활성화
          disabled && 'opacity-50 cursor-not-allowed hover:bg-bg-primary hover:border-border-light',
          
          // 활성화
          !disabled && 'cursor-pointer',
          
          // 라벨이 없을 때는 별도 클래스 적용 안함
          !label && className
        )}
        {...props}
      >
        {/* 체크 아이콘 - 포인트 컬러 적용 및 굵은 선 */}
        {checked && !indeterminate && (
          <Check className={cn(sizeClasses[size].icon, 'stroke-[3] text-weave-primary')} />
        )}
        
        {/* 부분선택 아이콘 - 포인트 컬러 적용 및 굵은 선 */}
        {indeterminate && (
          <Minus className={cn(sizeClasses[size].icon, 'stroke-[3] text-weave-primary')} />
        )}
      </button>
    );

    // 라벨이 있는 경우 라벨과 함께 렌더링
    if (label) {
      return (
        <div className={cn(
          'space-y-2',
          fullWidth && 'w-full',
          className
        )}>
          <div className="flex items-center gap-3">
            {checkboxElement}
            <label 
              htmlFor={checkboxId}
              className={cn(
                'font-medium text-txt-primary cursor-pointer select-none',
                sizeClasses[size].text,
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          </div>
          
          {/* 에러 메시지 */}
          {error && (
            <div id={errorId} className="text-sm text-red-500" role="alert">
              {error}
            </div>
          )}
          
          {/* 도움말 텍스트 */}
          {helperText && !error && (
            <div id={helperId} className="text-sm text-txt-secondary">
              {helperText}
            </div>
          )}
        </div>
      );
    }

    // 라벨이 없는 경우 체크박스만 렌더링 (테이블용)
    return checkboxElement;
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;