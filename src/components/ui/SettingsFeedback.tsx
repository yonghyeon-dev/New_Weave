'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Typography from './Typography';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Save,
  RefreshCw,
  Info,
  X,
  AlertTriangle
} from 'lucide-react';

// 설정 상태 타입
export type SettingStatus = 'idle' | 'saving' | 'saved' | 'error';

// 필드 에러 타입
export interface FieldError {
  field: string;
  message: string;
}

// 설정 토스트 타입
export interface SettingsToast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Props 인터페이스
export interface SettingsFeedbackProps {
  status: SettingStatus;
  fieldErrors?: FieldError[];
  onSave?: () => void;
  onReset?: () => void;
  hasUnsavedChanges?: boolean;
  saveLabel?: string;
  resetLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

// 토스트 컴포넌트
export interface ToastProps extends SettingsToast {
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  action, 
  onClose 
}) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-status-success/10 border-status-success/30',
      iconColor: 'text-status-success',
      titleColor: 'text-status-success'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-status-error/10 border-status-error/30',
      iconColor: 'text-status-error',
      titleColor: 'text-status-error'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-status-warning/10 border-status-warning/30',
      iconColor: 'text-status-warning',
      titleColor: 'text-status-warning'
    },
    info: {
      icon: Info,
      bgColor: 'bg-weave-primary/10 border-weave-primary/30',
      iconColor: 'text-weave-primary',
      titleColor: 'text-weave-primary'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-sm animate-in slide-in-from-right-5',
        config.bgColor
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
      
      <div className="flex-1 min-w-0">
        <Typography 
          variant="body2" 
          className={cn('font-semibold', config.titleColor)}
        >
          {title}
        </Typography>
        
        {message && (
          <Typography variant="caption" className="text-txt-secondary mt-1">
            {message}
          </Typography>
        )}
        
        {action && (
          <Button
            variant="ghost"
            size="sm"
            onClick={action.onClick}
            className="mt-2 h-auto p-0 text-xs font-medium"
          >
            {action.label}
          </Button>
        )}
      </div>
      
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
        aria-label="알림 닫기"
      >
        <X className="w-4 h-4 text-txt-tertiary" />
      </button>
    </div>
  );
};

// 필드 에러 표시 컴포넌트
export interface FieldErrorDisplayProps {
  errors: FieldError[];
  className?: string;
}

const FieldErrorDisplay: React.FC<FieldErrorDisplayProps> = ({ errors, className }) => {
  if (errors.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {errors.map((error) => (
        <div
          key={error.field}
          className="flex items-center gap-2 p-3 rounded-lg bg-status-error/10 border border-status-error/30"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-status-error flex-shrink-0" />
          <div className="min-w-0">
            <Typography variant="body2" className="text-status-error font-medium">
              {error.field}
            </Typography>
            <Typography variant="caption" className="text-txt-secondary">
              {error.message}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

// 메인 설정 피드백 컴포넌트
const SettingsFeedback = React.forwardRef<HTMLDivElement, SettingsFeedbackProps>(
  ({ 
    status, 
    fieldErrors = [], 
    onSave, 
    onReset, 
    hasUnsavedChanges = false,
    saveLabel = '저장',
    resetLabel = '초기화',
    className,
    children,
    ...props 
  }, ref) => {
    const [toasts, setToasts] = useState<SettingsToast[]>([]);

    // 토스트 추가 함수
    const addToast = useCallback((toast: Omit<SettingsToast, 'id'>) => {
      const id = Date.now().toString();
      const newToast: SettingsToast = {
        id,
        duration: 5000,
        ...toast
      };
      
      setToasts(prev => [...prev, newToast]);
      
      // 자동 제거
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, newToast.duration);
      }
    }, []);

    // 토스트 제거 함수
    const removeToast = useCallback((id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // 저장 핸들러
    const handleSave = useCallback(async () => {
      try {
        await onSave?.();
        addToast({
          type: 'success',
          title: '설정이 저장되었습니다',
          message: '변경사항이 성공적으로 적용되었습니다.'
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: '저장 중 오류가 발생했습니다',
          message: '잠시 후 다시 시도해주세요.',
          action: {
            label: '다시 시도',
            onClick: handleSave
          }
        });
      }
    }, [onSave, addToast]);

    // 초기화 핸들러
    const handleReset = useCallback(() => {
      onReset?.();
      addToast({
        type: 'info',
        title: '설정이 초기화되었습니다',
        message: '모든 변경사항이 되돌려졌습니다.'
      });
    }, [onReset, addToast]);

    // 상태별 버튼 설정
    const getSaveButtonProps = () => {
      const baseProps = {
        onClick: handleSave,
        className: "flex items-center gap-2"
      };

      switch (status) {
        case 'saving':
          return {
            ...baseProps,
            disabled: true,
            children: (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                저장 중...
              </>
            )
          };
        
        case 'saved':
          return {
            ...baseProps,
            disabled: !hasUnsavedChanges,
            variant: 'primary' as const,
            children: (
              <>
                <CheckCircle className="w-4 h-4" />
                저장됨
              </>
            )
          };
        
        case 'error':
          return {
            ...baseProps,
            variant: 'danger' as const,
            children: (
              <>
                <RefreshCw className="w-4 h-4" />
                다시 시도
              </>
            )
          };
        
        default:
          return {
            ...baseProps,
            disabled: !hasUnsavedChanges,
            children: (
              <>
                <Save className="w-4 h-4" />
                {saveLabel}
              </>
            )
          };
      }
    };

    const saveButtonProps = getSaveButtonProps();

    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        {/* 설정 컨텐츠 */}
        {children}

        {/* 필드 에러 표시 */}
        {fieldErrors.length > 0 && (
          <FieldErrorDisplay errors={fieldErrors} />
        )}

        {/* 액션 버튼 영역 */}
        <div className="flex items-center justify-between pt-6 border-t border-primary-borderSecondary bg-primary-surfaceVariant/30 -mx-6 px-6 py-4 mt-6">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-status-warning">
                <div className="w-2 h-2 rounded-full bg-status-warning animate-pulse" />
                <Typography variant="caption" className="font-medium">
                  저장되지 않은 변경사항이 있습니다
                </Typography>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleReset}
              disabled={status === 'saving' || !hasUnsavedChanges}
            >
              {resetLabel}
            </Button>
            
            <Button {...saveButtonProps} />
          </div>
        </div>

        {/* 토스트 컨테이너 */}
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
          {toasts.map((toast) => (
            <ToastComponent
              key={toast.id}
              {...toast}
              onClose={removeToast}
            />
          ))}
        </div>
      </div>
    );
  }
);

SettingsFeedback.displayName = 'SettingsFeedback';

// 설정 섹션 컴포넌트
export interface SettingSectionProps {
  title: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingSection = React.forwardRef<HTMLDivElement, SettingSectionProps>(
  ({ title, description, error, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'space-y-4 p-6 rounded-lg border border-primary-borderSecondary bg-primary-surface',
          error && 'border-status-error/30 bg-status-error/5',
          className
        )}
        {...props}
      >
        <div>
          <Typography 
            variant="h4" 
            className={cn(
              'font-semibold text-txt-primary',
              error && 'text-status-error'
            )}
          >
            {title}
          </Typography>
          
          {description && (
            <Typography variant="body2" className="text-txt-secondary mt-1">
              {description}
            </Typography>
          )}
          
          {error && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="w-4 h-4 text-status-error" />
              <Typography variant="caption" className="text-status-error font-medium">
                {error}
              </Typography>
            </div>
          )}
        </div>
        
        {children}
      </div>
    );
  }
);

SettingSection.displayName = 'SettingSection';

export default SettingsFeedback;

// 유틸리티 훅 (설정 상태 관리용)
export const useSettingsState = () => {
  const [status, setStatus] = useState<SettingStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
    if (status === 'saved') {
      setStatus('idle');
    }
  }, [status]);

  const addFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => {
      const filtered = prev.filter(e => e.field !== field);
      return [...filtered, { field, message }];
    });
  }, []);

  const removeFieldError = useCallback((field: string) => {
    setFieldErrors(prev => prev.filter(e => e.field !== field));
  }, []);

  const clearFieldErrors = useCallback(() => {
    setFieldErrors([]);
  }, []);

  const save = useCallback(async (saveFunction: () => Promise<void>) => {
    setStatus('saving');
    clearFieldErrors();
    
    try {
      await saveFunction();
      setStatus('saved');
      setHasUnsavedChanges(false);
    } catch (error) {
      setStatus('error');
      // 에러 처리 로직 추가 가능
    }
  }, [clearFieldErrors]);

  const reset = useCallback(() => {
    setStatus('idle');
    setHasUnsavedChanges(false);
    clearFieldErrors();
  }, [clearFieldErrors]);

  return {
    status,
    fieldErrors,
    hasUnsavedChanges,
    markAsChanged,
    addFieldError,
    removeFieldError,
    clearFieldErrors,
    save,
    reset
  };
};