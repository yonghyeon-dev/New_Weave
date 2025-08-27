'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InsightCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
  variant?: 'default' | 'warning' | 'success' | 'info';
  className?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export default function InsightCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  actionLabel,
  onActionClick,
  variant = 'default',
  className = '',
  isEmpty = false,
  emptyMessage = '데이터가 없습니다'
}: InsightCardProps) {
  const variantStyles = {
    default: 'border-border-light bg-white',
    warning: 'border-orange-200 bg-orange-50',
    success: 'border-green-200 bg-green-50', 
    info: 'border-weave-primary bg-weave-primary-light'
  };

  const valueStyles = {
    default: 'text-txt-primary',
    warning: 'text-orange-800',
    success: 'text-green-800',
    info: 'text-weave-primary-dark'
  };

  if (isEmpty) {
    return (
      <div className={cn(
        "rounded-lg border p-6 transition-all duration-200",
        "border-border-light bg-gray-50",
        className
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-txt-secondary">{title}</h3>
          {icon && (
            <div className="text-txt-disabled">
              {icon}
            </div>
          )}
        </div>
        
        <div className="text-center py-8">
          <div className="text-txt-tertiary text-sm">
            {emptyMessage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border p-6 transition-all duration-200 hover:shadow-md",
      variantStyles[variant],
      className
    )}>
      {/* Header - 모바일 가로 배치 최적화 */}
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <div className={cn("text-base flex-shrink-0", valueStyles[variant])}>
            {icon}
          </div>
        )}
        <h3 className="text-sm font-medium text-txt-secondary flex-1 truncate">{title}</h3>
      </div>
      
      {/* Value - 모바일 가독성 개선 */}
      <div className="mb-3">
        <div className={cn(
          "text-xl sm:text-2xl font-bold leading-tight",
          valueStyles[variant]
        )}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {subtitle && (
          <div className="text-xs sm:text-sm text-txt-tertiary mt-1 leading-tight">
            {subtitle}
          </div>
        )}
      </div>
      
      {/* Trend - 가로 배치 유지 */}
      {trend && (
        <div className="flex items-center mb-3 gap-2">
          <div className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full flex-shrink-0",
            trend.isPositive 
              ? "text-green-700 bg-green-100" 
              : "text-red-700 bg-red-100"
          )}>
            <span className="mr-1">
              {trend.isPositive ? '↑' : '↓'}
            </span>
            {Math.abs(trend.value)}%
          </div>
          <span className="text-xs text-txt-tertiary truncate">
            {trend.label}
          </span>
        </div>
      )}
      
      {/* Action Button */}
      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className={cn(
            "w-full mt-4 px-4 py-2 text-sm font-medium rounded-md transition-colors",
            "text-weave-primary border border-weave-primary",
            "hover:bg-weave-primary-light focus:outline-none focus:ring-2 focus:ring-weave-primary focus:ring-offset-2"
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}