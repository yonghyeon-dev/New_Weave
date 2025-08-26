'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import StatusBadge, { StatusType, getStatusLabel, getStatusColor } from './StatusBadge';
import Typography from './Typography';

// 카운트 데이터 타입
export interface StatusCount {
  status: StatusType;
  count: number;
  amount?: number; // 금액 (선택적)
}

// Props 인터페이스
export interface StatusCounterProps {
  title?: string;
  statusType: 'invoice' | 'payment' | 'general';
  counts: StatusCount[];
  showTotal?: boolean;
  showAmounts?: boolean;
  currency?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
}

// 금액 포맷팅 함수
const formatCurrency = (amount: number, currency: string = 'KRW'): string => {
  if (currency === 'KRW') {
    return `₩${amount.toLocaleString('ko-KR')}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
};

// 숫자 포맷팅 함수 (천단위 콤마)
const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

const StatusCounter = React.forwardRef<HTMLDivElement, StatusCounterProps>(
  ({ 
    title,
    statusType, 
    counts, 
    showTotal = true, 
    showAmounts = false,
    currency = 'KRW',
    layout = 'horizontal',
    className,
    ...props 
  }, ref) => {
    
    // 전체 합계 계산
    const totalCount = counts.reduce((sum, item) => sum + item.count, 0);
    const totalAmount = counts.reduce((sum, item) => sum + (item.amount || 0), 0);

    // 레이아웃별 스타일
    const layoutStyles = {
      horizontal: 'flex flex-wrap items-center gap-4',
      vertical: 'flex flex-col gap-3',
      grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
    };

    // 개별 상태 아이템 렌더링
    const renderStatusItem = (statusCount: StatusCount) => {
      const { status, count, amount } = statusCount;
      const label = getStatusLabel(status, statusType);
      const colorClass = getStatusColor(status, statusType);

      return (
        <div 
          key={status}
          className="flex items-center gap-2 min-w-0"
          role="group"
          aria-label={`${label} ${count}건${amount ? `, 총 ${formatCurrency(amount, currency)}` : ''}`}
        >
          <StatusBadge 
            status={status} 
            type={statusType} 
            size="sm"
            showIcon={true}
          />
          <div className="flex flex-col min-w-0">
            <Typography 
              variant="body2" 
              className={cn("font-semibold", colorClass)}
            >
              {formatNumber(count)}건
            </Typography>
            {showAmounts && amount !== undefined && amount > 0 && (
              <Typography 
                variant="caption" 
                className="text-txt-secondary truncate"
              >
                {formatCurrency(amount, currency)}
              </Typography>
            )}
          </div>
        </div>
      );
    };

    // 전체 합계 렌더링
    const renderTotal = () => {
      if (!showTotal) return null;

      return (
        <div 
          className="flex items-center gap-2 pt-2 border-t border-primary-borderSecondary"
          role="group"
          aria-label={`전체 ${totalCount}건${showAmounts && totalAmount > 0 ? `, 총 ${formatCurrency(totalAmount, currency)}` : ''}`}
        >
          <div className="w-6 h-6 rounded-full bg-primary-surfaceVariant border border-primary-borderSecondary flex items-center justify-center">
            <Typography variant="caption" className="text-txt-secondary font-semibold">
              합
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography 
              variant="body1" 
              className="font-semibold text-txt-primary"
            >
              전체 {formatNumber(totalCount)}건
            </Typography>
            {showAmounts && totalAmount > 0 && (
              <Typography 
                variant="body2" 
                className="text-txt-secondary"
              >
                총 {formatCurrency(totalAmount, currency)}
              </Typography>
            )}
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border border-primary-borderSecondary bg-primary-surface',
          className
        )}
        role="region"
        aria-label={title || `${statusType} 상태별 집계`}
        {...props}
      >
        {title && (
          <Typography 
            variant="h4" 
            className="mb-4 text-txt-primary font-semibold"
          >
            {title}
          </Typography>
        )}

        <div className={cn(layoutStyles[layout])}>
          {counts
            .filter(item => item.count > 0) // 0건인 항목은 숨김
            .map(renderStatusItem)
          }
        </div>

        {renderTotal()}
      </div>
    );
  }
);

StatusCounter.displayName = 'StatusCounter';

// 상태별 요약 카드 컴포넌트
export interface StatusSummaryCardProps {
  title: string;
  statusType: 'invoice' | 'payment' | 'general';
  counts: StatusCount[];
  icon?: React.ReactNode;
  showAmounts?: boolean;
  currency?: string;
  className?: string;
  onViewAll?: () => void;
}

export const StatusSummaryCard = React.forwardRef<HTMLDivElement, StatusSummaryCardProps>(
  ({
    title,
    statusType,
    counts,
    icon,
    showAmounts = false,
    currency = 'KRW',
    className,
    onViewAll,
    ...props
  }, ref) => {
    const totalCount = counts.reduce((sum, item) => sum + item.count, 0);
    const totalAmount = counts.reduce((sum, item) => sum + (item.amount || 0), 0);

    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-lg border border-primary-borderSecondary bg-primary-surface hover:shadow-sm transition-shadow duration-200',
          onViewAll && 'cursor-pointer hover:border-primary-border',
          className
        )}
        onClick={onViewAll}
        role={onViewAll ? 'button' : 'region'}
        aria-label={`${title} 요약 카드`}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon}
            <Typography variant="h4" className="text-txt-primary font-semibold">
              {title}
            </Typography>
          </div>
          {onViewAll && (
            <Typography variant="body2" className="text-weave-primary font-medium">
              전체보기 →
            </Typography>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <Typography variant="body1" className="text-txt-secondary">
              전체 건수
            </Typography>
            <Typography variant="h3" className="text-txt-primary font-bold">
              {formatNumber(totalCount)}건
            </Typography>
          </div>

          {showAmounts && totalAmount > 0 && (
            <div className="flex justify-between items-baseline">
              <Typography variant="body1" className="text-txt-secondary">
                총 금액
              </Typography>
              <Typography variant="h4" className="text-txt-primary font-semibold">
                {formatCurrency(totalAmount, currency)}
              </Typography>
            </div>
          )}

          <div className="pt-2 space-y-2">
            {counts
              .filter(item => item.count > 0)
              .slice(0, 3) // 상위 3개만 표시
              .map((statusCount) => {
                const label = getStatusLabel(statusCount.status, statusType);
                const colorClass = getStatusColor(statusCount.status, statusType);
                
                return (
                  <div key={statusCount.status} className="flex justify-between items-center">
                    <Typography variant="body2" className="text-txt-secondary">
                      {label}
                    </Typography>
                    <Typography variant="body2" className={cn("font-medium", colorClass)}>
                      {formatNumber(statusCount.count)}건
                    </Typography>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
);

StatusSummaryCard.displayName = 'StatusSummaryCard';

export default StatusCounter;