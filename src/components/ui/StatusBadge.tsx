'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  CreditCard, 
  Loader2,
  Archive,
  Calendar
} from 'lucide-react';

// 상태 타입 정의
export type InvoiceStatus = 
  | 'draft'      // 임시저장
  | 'issued'     // 발행됨
  | 'paid'       // 결제완료
  | 'overdue'    // 연체
  | 'cancelled'; // 취소됨

export type PaymentStatus = 
  | 'pending'    // 대기중
  | 'processing' // 처리중
  | 'completed'  // 완료
  | 'failed'     // 실패
  | 'refunded';  // 환불됨

export type GeneralStatus = 
  | 'active'     // 활성
  | 'inactive'   // 비활성
  | 'archived'   // 보관됨
  | 'scheduled'; // 예약됨

export type StatusType = InvoiceStatus | PaymentStatus | GeneralStatus;

// Props 인터페이스
export interface StatusBadgeProps {
  status: StatusType;
  type: 'invoice' | 'payment' | 'general';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

// 인보이스 상태 설정
const invoiceConfig: Record<InvoiceStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
  ariaLabel: string;
}> = {
  draft: {
    label: '임시저장',
    color: 'text-txt-secondary',
    bgColor: 'bg-primary-surfaceVariant border-primary-borderSecondary',
    icon: FileText,
    ariaLabel: '인보이스가 임시저장 상태입니다'
  },
  issued: {
    label: '발행됨',
    color: 'text-weave-primary',
    bgColor: 'bg-weave-primary/10 border-weave-primary/30',
    icon: CheckCircle,
    ariaLabel: '인보이스가 발행된 상태입니다'
  },
  paid: {
    label: '결제완료',
    color: 'text-status-success',
    bgColor: 'bg-status-success/10 border-status-success/30',
    icon: CheckCircle,
    ariaLabel: '인보이스 결제가 완료되었습니다'
  },
  overdue: {
    label: '연체',
    color: 'text-status-error',
    bgColor: 'bg-status-error/10 border-status-error/30',
    icon: AlertTriangle,
    ariaLabel: '인보이스가 연체 상태입니다'
  },
  cancelled: {
    label: '취소됨',
    color: 'text-txt-tertiary',
    bgColor: 'bg-primary-surfaceVariant/50 border-primary-borderSecondary',
    icon: XCircle,
    ariaLabel: '인보이스가 취소되었습니다'
  }
};

// 결제 상태 설정
const paymentConfig: Record<PaymentStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
  ariaLabel: string;
}> = {
  pending: {
    label: '대기중',
    color: 'text-status-warning',
    bgColor: 'bg-status-warning/10 border-status-warning/30',
    icon: Clock,
    ariaLabel: '결제가 대기중입니다'
  },
  processing: {
    label: '처리중',
    color: 'text-weave-primary',
    bgColor: 'bg-weave-primary/10 border-weave-primary/30',
    icon: Loader2,
    ariaLabel: '결제가 처리중입니다'
  },
  completed: {
    label: '완료',
    color: 'text-status-success',
    bgColor: 'bg-status-success/10 border-status-success/30',
    icon: CheckCircle,
    ariaLabel: '결제가 완료되었습니다'
  },
  failed: {
    label: '실패',
    color: 'text-status-error',
    bgColor: 'bg-status-error/10 border-status-error/30',
    icon: XCircle,
    ariaLabel: '결제가 실패했습니다'
  },
  refunded: {
    label: '환불됨',
    color: 'text-txt-secondary',
    bgColor: 'bg-primary-surfaceVariant border-primary-borderSecondary',
    icon: CreditCard,
    ariaLabel: '결제가 환불되었습니다'
  }
};

// 일반 상태 설정
const generalConfig: Record<GeneralStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
  ariaLabel: string;
}> = {
  active: {
    label: '활성',
    color: 'text-status-success',
    bgColor: 'bg-status-success/10 border-status-success/30',
    icon: CheckCircle,
    ariaLabel: '활성 상태입니다'
  },
  inactive: {
    label: '비활성',
    color: 'text-txt-tertiary',
    bgColor: 'bg-primary-surfaceVariant/50 border-primary-borderSecondary',
    icon: XCircle,
    ariaLabel: '비활성 상태입니다'
  },
  archived: {
    label: '보관됨',
    color: 'text-txt-secondary',
    bgColor: 'bg-primary-surfaceVariant border-primary-borderSecondary',
    icon: Archive,
    ariaLabel: '보관된 상태입니다'
  },
  scheduled: {
    label: '예약됨',
    color: 'text-weave-primary',
    bgColor: 'bg-weave-primary/10 border-weave-primary/30',
    icon: Calendar,
    ariaLabel: '예약된 상태입니다'
  }
};

// 상태 설정 맵
const statusConfigMap = {
  invoice: invoiceConfig,
  payment: paymentConfig,
  general: generalConfig
};

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, type, size = 'md', showIcon = true, className, ...props }, ref) => {
    const config = statusConfigMap[type][status as keyof typeof statusConfigMap[typeof type]];
    
    if (!config) {
      console.warn(`Unknown status: ${status} for type: ${type}`);
      return null;
    }

    const { label, color, bgColor, icon: Icon, ariaLabel } = config;

    // 크기별 스타일
    const sizeStyles = {
      sm: {
        container: 'px-2 py-1 text-xs gap-1',
        icon: 'h-3 w-3',
        text: 'text-xs font-medium'
      },
      md: {
        container: 'px-2.5 py-1.5 text-sm gap-1.5',
        icon: 'h-3.5 w-3.5', 
        text: 'text-sm font-medium'
      },
      lg: {
        container: 'px-3 py-2 text-base gap-2',
        icon: 'h-4 w-4',
        text: 'text-base font-medium'
      }
    };

    const sizeConfig = sizeStyles[size];

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border transition-colors duration-200',
          bgColor,
          sizeConfig.container,
          className
        )}
        role="status"
        aria-label={ariaLabel}
        {...props}
      >
        {showIcon && (
          <Icon 
            className={cn(
              sizeConfig.icon,
              color,
              status === 'processing' && 'animate-spin'
            )} 
            aria-hidden="true"
          />
        )}
        <span className={cn(sizeConfig.text, color)}>
          {label}
        </span>
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;

// 유틸리티 함수들
export const getStatusColor = (status: StatusType, type: 'invoice' | 'payment' | 'general'): string => {
  const config = statusConfigMap[type][status as keyof typeof statusConfigMap[typeof type]];
  return config?.color || 'text-txt-secondary';
};

export const getStatusLabel = (status: StatusType, type: 'invoice' | 'payment' | 'general'): string => {
  const config = statusConfigMap[type][status as keyof typeof statusConfigMap[typeof type]];
  return config?.label || status.toString();
};

export const getStatusIcon = (status: StatusType, type: 'invoice' | 'payment' | 'general') => {
  const config = statusConfigMap[type][status as keyof typeof statusConfigMap[typeof type]];
  return config?.icon;
};

// 상태 전환 규칙 (비즈니스 로직 가이드용)
export const statusTransitions = {
  invoice: {
    draft: ['issued', 'cancelled'],
    issued: ['paid', 'overdue', 'cancelled'],
    paid: ['refunded'], // 환불은 payment 상태에서 관리
    overdue: ['paid', 'cancelled'],
    cancelled: [] // 최종 상태
  },
  payment: {
    pending: ['processing', 'failed'],
    processing: ['completed', 'failed'],
    completed: ['refunded'],
    failed: ['pending'], // 재시도 가능
    refunded: [] // 최종 상태
  }
};