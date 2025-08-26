'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';

// Tooltip 위치 타입
export type TooltipPosition = 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right' 
  | 'top-start' 
  | 'top-end'
  | 'bottom-start' 
  | 'bottom-end'
  | 'left-start' 
  | 'left-end'
  | 'right-start' 
  | 'right-end';

// Tooltip Props
export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  disabled?: boolean;
  delay?: number;
  maxWidth?: number;
  trigger?: 'hover' | 'click' | 'focus';
  className?: string;
  contentClassName?: string;
  arrow?: boolean;
}

// Tooltip 위치 클래스 매핑
const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  'top-start': 'bottom-full left-0 mb-2',
  'top-end': 'bottom-full right-0 mb-2',
  'bottom-start': 'top-full left-0 mt-2',
  'bottom-end': 'top-full right-0 mt-2',
  'left-start': 'right-full top-0 mr-2',
  'left-end': 'right-full bottom-0 mr-2',
  'right-start': 'left-full top-0 ml-2',
  'right-end': 'left-full bottom-0 ml-2',
};

// Arrow 위치 클래스 매핑
const arrowClasses: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
  bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
  left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
  right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
  'top-start': 'top-full left-4 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
  'top-end': 'top-full right-4 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
  'bottom-start': 'bottom-full left-4 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
  'bottom-end': 'bottom-full right-4 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
  'left-start': 'left-full top-4 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
  'left-end': 'left-full bottom-4 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
  'right-start': 'right-full top-4 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
  'right-end': 'right-full bottom-4 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
};

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  disabled = false,
  delay = 500,
  maxWidth = 250,
  trigger = 'hover',
  className,
  contentClassName,
  arrow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // 지연 시간 후 툴팁 표시
  useEffect(() => {
    if (shouldShow && !disabled) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shouldShow, disabled, delay]);

  // 마우스 이벤트 핸들러
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setShouldShow(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setShouldShow(false);
    }
  };

  // 클릭 이벤트 핸들러
  const handleClick = () => {
    if (trigger === 'click') {
      setShouldShow(!shouldShow);
    }
  };

  // 포커스 이벤트 핸들러
  const handleFocus = () => {
    if (trigger === 'focus') {
      setShouldShow(true);
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      setShouldShow(false);
    }
  };

  // 외부 클릭 감지 (클릭 트리거용)
  useEffect(() => {
    if (trigger === 'click' && isVisible) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (
          tooltipRef.current &&
          triggerRef.current &&
          !tooltipRef.current.contains(event.target as Node) &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setShouldShow(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [trigger, isVisible]);

  // 키보드 접근성
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (trigger === 'click' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setShouldShow(!shouldShow);
    } else if (event.key === 'Escape') {
      setShouldShow(false);
    }
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div 
      ref={triggerRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      tabIndex={trigger === 'click' ? 0 : undefined}
      role={trigger === 'click' ? 'button' : undefined}
      aria-describedby={isVisible ? 'tooltip' : undefined}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={cn(
            "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg transition-all duration-200 opacity-100 pointer-events-none",
            positionClasses[position],
            contentClassName
          )}
          style={{ maxWidth }}
        >
          {content}
          
          {/* Arrow */}
          {arrow && (
            <div
              className={cn(
                "absolute w-0 h-0 border-4",
                arrowClasses[position]
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Help Tooltip 전용 컴포넌트
export interface HelpTooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  className?: string;
  iconClassName?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  position = 'top',
  className,
  iconClassName,
}) => {
  return (
    <Tooltip content={content} position={position} className={className}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center w-4 h-4 text-txt-tertiary hover:text-txt-primary transition-colors focus:outline-none focus:ring-2 focus:ring-weave-primary focus:ring-offset-2 rounded-full",
          iconClassName
        )}
        aria-label="도움말"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </Tooltip>
  );
};

// Field Tooltip (폼 필드용)
export interface FieldTooltipProps {
  label: string;
  description?: string;
  example?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FieldTooltip: React.FC<FieldTooltipProps> = ({
  label,
  description,
  example,
  required,
  children,
}) => {
  const tooltipContent = (
    <div className="space-y-2 max-w-xs">
      <div className="font-semibold">
        {label}
        {required && <span className="text-status-error ml-1">*</span>}
      </div>
      {description && (
        <div className="text-xs text-gray-300">
          {description}
        </div>
      )}
      {example && (
        <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
          <strong>예시:</strong> {example}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {children}
      <HelpTooltip content={tooltipContent} position="right" />
    </div>
  );
};

export default Tooltip;