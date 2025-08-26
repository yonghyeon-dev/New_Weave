'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// 숫자 포맷팅 옵션
export interface NumberFormatOptions {
  currency?: 'KRW' | 'USD' | 'EUR' | 'JPY';
  decimals?: number;
  showCurrency?: boolean;
  showSign?: boolean;
  locale?: string;
}

// 날짜 포맷팅 옵션
export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full';
  showTime?: boolean;
  showWeekday?: boolean;
  relative?: boolean;
  locale?: string;
}

// 숫자 포맷팅 유틸리티 함수들
export const formatNumber = (
  value: number,
  options: NumberFormatOptions = {}
): string => {
  const {
    currency = 'KRW',
    decimals = 0,
    showCurrency = false,
    showSign = false,
    locale = 'ko-KR',
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: showSign ? 'exceptZero' : 'auto',
    ...(showCurrency && {
      style: 'currency',
      currency: currency,
    }),
  });

  return formatter.format(value);
};

// 날짜 포맷팅 유틸리티 함수들
export const formatDate = (
  date: Date,
  options: DateFormatOptions = {}
): string => {
  const {
    format = 'medium',
    showTime = false,
    showWeekday = false,
    relative = false,
    locale = 'ko-KR',
  } = options;

  if (relative) {
    return formatRelativeDate(date, locale);
  }

  const formatOptions: Intl.DateTimeFormatOptions = {};

  // 날짜 포맷 설정
  switch (format) {
    case 'short':
      formatOptions.dateStyle = 'short';
      break;
    case 'medium':
      formatOptions.dateStyle = 'medium';
      break;
    case 'long':
      formatOptions.dateStyle = 'long';
      break;
    case 'full':
      formatOptions.dateStyle = 'full';
      break;
  }

  // 시간 표시 설정
  if (showTime) {
    formatOptions.timeStyle = 'short';
  }

  // 요일 표시 설정
  if (showWeekday && format !== 'full') {
    formatOptions.weekday = 'short';
  }

  const formatter = new Intl.DateTimeFormat(locale, formatOptions);
  return formatter.format(date);
};

// 상대적 날짜 포맷팅
export const formatRelativeDate = (date: Date, locale = 'ko-KR'): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return '오늘';
  } else if (diffInDays === 1) {
    return '어제';
  } else if (diffInDays === -1) {
    return '내일';
  } else if (diffInDays > 0 && diffInDays <= 7) {
    return `${diffInDays}일 전`;
  } else if (diffInDays < 0 && diffInDays >= -7) {
    return `${Math.abs(diffInDays)}일 후`;
  }

  // 상대적 시간 포매터 사용
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(-diffInDays, 'day');
  } else if (Math.abs(diffInDays) < 365) {
    const months = Math.floor(diffInDays / 30);
    return rtf.format(-months, 'month');
  } else {
    const years = Math.floor(diffInDays / 365);
    return rtf.format(-years, 'year');
  }
};

// D-Day 계산 함수
export const formatDday = (targetDate: Date, prefix = 'D'): string => {
  const today = new Date();
  const target = new Date(targetDate);
  
  // 시간을 00:00:00으로 설정하여 날짜만 비교
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffInMs = target.getTime() - today.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return `${prefix}-Day`;
  } else if (diffInDays > 0) {
    return `${prefix}-${diffInDays}`;
  } else {
    return `${prefix}+${Math.abs(diffInDays)}`;
  }
};

// 포맷팅된 숫자 표시 컴포넌트
export interface FormattedNumberProps extends NumberFormatOptions {
  value: number;
  className?: string;
  colorize?: boolean; // 양수/음수에 따른 색상 적용
}

export const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  className,
  colorize = false,
  ...options
}) => {
  const formatted = formatNumber(value, options);
  
  return (
    <span
      className={cn(
        className,
        {
          'text-status-success': colorize && value > 0,
          'text-status-error': colorize && value < 0,
          'text-txt-secondary': colorize && value === 0,
        }
      )}
    >
      {formatted}
    </span>
  );
};

// 포맷팅된 날짜 표시 컴포넌트
export interface FormattedDateProps extends DateFormatOptions {
  date: Date;
  className?: string;
  showTooltip?: boolean;
}

export const FormattedDate: React.FC<FormattedDateProps> = ({
  date,
  className,
  showTooltip = false,
  ...options
}) => {
  const formatted = formatDate(date, options);
  const fullDate = showTooltip ? formatDate(date, { format: 'full', showTime: true }) : undefined;
  
  return (
    <span
      className={cn("cursor-default", className)}
      title={showTooltip ? fullDate : undefined}
    >
      {formatted}
    </span>
  );
};

// D-Day 표시 컴포넌트
export interface DdayBadgeProps {
  targetDate: Date;
  prefix?: string;
  className?: string;
  colorize?: boolean;
}

export const DdayBadge: React.FC<DdayBadgeProps> = ({
  targetDate,
  prefix = 'D',
  className,
  colorize = true,
}) => {
  const dday = formatDday(targetDate, prefix);
  const today = new Date();
  const isOverdue = targetDate < today;
  const isToday = formatDday(targetDate, prefix).includes('Day');
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
        {
          'bg-status-error bg-opacity-10 text-status-error': colorize && isOverdue,
          'bg-status-warning bg-opacity-10 text-status-warning': colorize && isToday,
          'bg-status-info bg-opacity-10 text-status-info': colorize && !isOverdue && !isToday,
          'bg-bg-secondary text-txt-secondary': !colorize,
        },
        className
      )}
    >
      {dday}
    </span>
  );
};

// 파일 크기 포맷팅
export const formatFileSize = (bytes: number, locale = 'ko-KR'): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const threshold = 1024;
  
  if (bytes === 0) return '0 B';
  
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= threshold && unitIndex < units.length - 1) {
    size /= threshold;
    unitIndex++;
  }
  
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: unitIndex === 0 ? 0 : 1,
  });
  
  return `${formatter.format(size)} ${units[unitIndex]}`;
};

// 퍼센트 포맷팅
export const formatPercent = (
  value: number,
  decimals = 1,
  locale = 'ko-KR'
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(value / 100);
};

// 전화번호 포맷팅
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // 휴대폰 번호 (010-1234-5678)
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 10) {
    // 지역번호 (02-123-4567)
    return cleaned.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 8) {
    // 지역번호 없는 번호 (123-4567)
    return cleaned.replace(/(\d{3,4})(\d{4})/, '$1-$2');
  }
  
  return phone;
};

// 사업자등록번호 포맷팅
export const formatBusinessNumber = (number: string): string => {
  const cleaned = number.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
  }
  
  return number;
};

// 긴 텍스트 줄임 처리
export interface TruncatedTextProps {
  text: string;
  maxLength: number;
  showTooltip?: boolean;
  className?: string;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength,
  showTooltip = true,
  className,
}) => {
  const shouldTruncate = text.length > maxLength;
  const truncated = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;
  
  return (
    <span
      className={cn("cursor-default", className)}
      title={showTooltip && shouldTruncate ? text : undefined}
    >
      {truncated}
    </span>
  );
};

// 포맷팅 가이드라인 표시 컴포넌트
export const FormattingGuide: React.FC = () => {
  return (
    <div className="p-4 bg-bg-secondary rounded-lg border border-border-light">
      <h3 className="font-semibold text-txt-primary mb-3">숫자 및 날짜 표기 규칙</h3>
      <div className="space-y-2 text-sm text-txt-secondary">
        <div>• <strong>통화:</strong> KRW 천단위 콤마, 소수점 없음</div>
        <div>• <strong>날짜:</strong> YYYY.MM.DD 형식 또는 상대적 표기</div>
        <div>• <strong>만료일:</strong> D-Day 표기로 긴급도 표시</div>
        <div>• <strong>음수:</strong> 빨간색으로 표시</div>
        <div>• <strong>VAT:</strong> 포함/제외 명시</div>
        <div>• <strong>퍼센트:</strong> 소수점 1자리까지</div>
      </div>
    </div>
  );
};

export default FormattedNumber;