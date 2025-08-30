'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast 타입 정의
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast 데이터 인터페이스
export interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

// Toast 컨텍스트 타입
interface ToastContextType {
  toasts: ToastData[];
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

// Toast 컨텍스트 생성
const ToastContext = createContext<ToastContextType | null>(null);

// Toast Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // ToastProvider가 없을 때 기본 동작 제공
    return {
      toasts: [],
      showToast: () => {},
      hideToast: () => {},
      clearAll: () => {},
      addToast: (message: string, type: ToastType = 'info', options?: Partial<Omit<ToastData, 'id' | 'type' | 'message'>>) => {
        console.warn('ToastProvider가 설정되지 않았습니다.');
      }
    };
  }
  
  // addToast 편의 메서드 추가
  const addToast = (message: string, type: ToastType = 'info', options?: Partial<Omit<ToastData, 'id' | 'type' | 'message'>>) => {
    context.showToast({
      type,
      message,
      ...options
    });
  };
  
  return {
    ...context,
    addToast
  };
};

// Toast 아이콘 매핑
const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

// Toast 색상 클래스 매핑
const toastClasses: Record<ToastType, string> = {
  success: 'bg-status-success text-white border-status-success',
  error: 'bg-status-error text-white border-status-error',
  warning: 'bg-status-warning text-white border-status-warning',
  info: 'bg-status-info text-white border-status-info',
};

// 개별 Toast 컴포넌트
export interface ToastItemProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // 애니메이션 시간
  }, [toast.id, onClose]);

  useEffect(() => {
    // 입장 애니메이션
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 자동 종료 타이머
    if (!toast.persistent && toast.duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.persistent, handleClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 max-w-md",
        toastClasses[toast.type],
        {
          "translate-x-full opacity-0": !isVisible || isLeaving,
          "translate-x-0 opacity-100": isVisible && !isLeaving,
        }
      )}
    >
      {/* 아이콘 */}
      <div className="flex-shrink-0 mt-0.5">
        {toastIcons[toast.type]}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-sm mb-1">
            {toast.title}
          </div>
        )}
        <div className="text-sm opacity-90">
          {toast.message}
        </div>
        
        {/* 액션 버튼 */}
        {toast.action && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toast.action.onClick}
              className="text-white hover:bg-white hover:bg-opacity-20 h-8 px-3 text-xs"
            >
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>

      {/* 닫기 버튼 */}
      {!toast.persistent && (
        <button
          type="button"
          onClick={handleClose}
          className="flex-shrink-0 ml-2 rounded-md hover:bg-white hover:bg-opacity-20 p-1 transition-colors"
          aria-label="알림 닫기"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* 진행 바 (지속 시간 표시) */}
      {!toast.persistent && toast.duration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30 rounded-b-lg">
          <div 
            className="h-full bg-white rounded-b-lg transition-all linear"
            style={{
              animation: `toast-progress ${toast.duration}ms linear`,
              transformOrigin: 'left',
            }}
          />
        </div>
      )}
    </div>
  );
};

// Toast 컨테이너 컴포넌트
export interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  onClose, 
  position = 'top-right' 
}) => {
  if (toasts.length === 0) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div
      className={cn(
        "fixed z-50 space-y-3 pointer-events-none",
        positionClasses[position]
      )}
      aria-label="알림"
    >
      <div className="space-y-3 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};

// Toast Provider 컴포넌트
export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right',
  defaultDuration = 5000
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((toastData: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastData = {
      ...toastData,
      id,
      duration: toastData.duration ?? defaultDuration,
    };

    setToasts((prev) => [...prev, toast]);
  }, [defaultDuration]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ToastContextType = {
    toasts,
    showToast,
    hideToast,
    clearAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        onClose={hideToast}
        position={position}
      />
      
      {/* Toast 애니메이션 CSS */}
      <style jsx global>{`
        @keyframes toast-progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// 편의 함수들
export const toast = {
  success: (message: string, options?: Partial<Omit<ToastData, 'id' | 'type' | 'message'>>) => {
    // 이 함수는 useToast 훅을 사용하는 컴포넌트에서만 작동합니다
    console.warn('toast.success는 useToast 훅을 사용하는 컴포넌트에서만 작동합니다.');
  },
  error: (message: string, options?: Partial<Omit<ToastData, 'id' | 'type' | 'message'>>) => {
    console.warn('toast.error는 useToast 훅을 사용하는 컴포넌트에서만 작동합니다.');
  },
  warning: (message: string, options?: Partial<Omit<ToastData, 'id' | 'type' | 'message'>>) => {
    console.warn('toast.warning는 useToast 훅을 사용하는 컴포넌트에서만 작동합니다.');
  },
  info: (message: string, options?: Partial<Omit<ToastData, 'id' | 'type' | 'message'>>) => {
    console.warn('toast.info는 useToast 훅을 사용하는 컴포넌트에서만 작동합니다.');
  },
};

export default ToastItem;