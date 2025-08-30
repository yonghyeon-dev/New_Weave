import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/Toast';
import { useOffline } from './useOffline';

interface ErrorRecoveryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  timeout?: number;
  enableOfflineQueue?: boolean;
  onError?: (error: Error, context: ErrorContext) => void;
  onRecovery?: (context: ErrorContext) => void;
  onMaxRetriesExceeded?: (error: Error, context: ErrorContext) => void;
}

interface ErrorContext {
  operation: string;
  params?: any;
  attemptNumber: number;
  totalAttempts: number;
  timestamp: Date;
  duration: number;
  recovered: boolean;
}

interface RecoveryState {
  isRecovering: boolean;
  lastError: Error | null;
  attemptCount: number;
  recoveryHistory: ErrorContext[];
}

export function useErrorRecovery(config: ErrorRecoveryConfig = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    timeout = 60000,
    enableOfflineQueue = true,
    onError,
    onRecovery,
    onMaxRetriesExceeded
  } = config;

  const { addToast } = useToast();
  const { isOnline, saveOfflineData } = useOffline();
  const [state, setState] = useState<RecoveryState>({
    isRecovering: false,
    lastError: null,
    attemptCount: 0,
    recoveryHistory: []
  });

  const abortControllerRef = useRef<AbortController>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  // 지연 시간 계산 (Exponential Backoff with Jitter)
  const calculateDelay = useCallback((attemptNumber: number): number => {
    const exponentialDelay = initialDelay * Math.pow(backoffMultiplier, attemptNumber - 1);
    const clampedDelay = Math.min(exponentialDelay, maxDelay);
    // Jitter 추가 (0.5 ~ 1.5배)
    const jitter = 0.5 + Math.random();
    return Math.floor(clampedDelay * jitter);
  }, [initialDelay, maxDelay, backoffMultiplier]);

  // 에러 분류
  const classifyError = useCallback((error: Error): {
    isRetryable: boolean;
    category: 'network' | 'timeout' | 'rate_limit' | 'server' | 'client' | 'unknown';
    severity: 'low' | 'medium' | 'high' | 'critical';
  } => {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    // 네트워크 에러
    if (name.includes('network') || message.includes('fetch') || !navigator.onLine) {
      return { isRetryable: true, category: 'network', severity: 'medium' };
    }

    // 타임아웃
    if (name.includes('timeout') || message.includes('timeout')) {
      return { isRetryable: true, category: 'timeout', severity: 'low' };
    }

    // Rate Limiting
    if (message.includes('429') || message.includes('rate limit')) {
      return { isRetryable: true, category: 'rate_limit', severity: 'low' };
    }

    // 서버 에러 (5xx)
    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
      return { isRetryable: true, category: 'server', severity: 'high' };
    }

    // 클라이언트 에러 (4xx)
    if (message.includes('400') || message.includes('401') || message.includes('403') || message.includes('404')) {
      return { isRetryable: false, category: 'client', severity: 'critical' };
    }

    // 알 수 없는 에러
    return { isRetryable: true, category: 'unknown', severity: 'medium' };
  }, []);

  // 에러 복구 실행
  const executeWithRecovery = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string,
    params?: any
  ): Promise<T> => {
    const startTime = Date.now();
    let lastError: Error | null = null;
    
    setState(prev => ({
      ...prev,
      isRecovering: false,
      attemptCount: 0
    }));

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        // AbortController 설정 (타임아웃 처리)
        abortControllerRef.current = new AbortController();
        const timeoutId = setTimeout(() => {
          abortControllerRef.current?.abort();
        }, timeout);

        setState(prev => ({
          ...prev,
          isRecovering: attempt > 1,
          attemptCount: attempt
        }));

        // 작업 실행
        const result = await operation();
        
        clearTimeout(timeoutId);

        // 성공 시 복구 알림
        if (attempt > 1) {
          const context: ErrorContext = {
            operation: operationName,
            params,
            attemptNumber: attempt,
            totalAttempts: attempt,
            timestamp: new Date(),
            duration: Date.now() - startTime,
            recovered: true
          };

          setState(prev => ({
            ...prev,
            isRecovering: false,
            lastError: null,
            recoveryHistory: [...prev.recoveryHistory, context].slice(-20)
          }));

          onRecovery?.(context);
          addToast(`작업이 성공적으로 복구되었습니다 (${attempt}번째 시도)`, 'success');
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        const errorInfo = classifyError(lastError);
        
        const context: ErrorContext = {
          operation: operationName,
          params,
          attemptNumber: attempt,
          totalAttempts: maxRetries + 1,
          timestamp: new Date(),
          duration: Date.now() - startTime,
          recovered: false
        };

        onError?.(lastError, context);

        // 재시도 불가능한 에러
        if (!errorInfo.isRetryable) {
          setState(prev => ({
            ...prev,
            isRecovering: false,
            lastError,
            recoveryHistory: [...prev.recoveryHistory, context].slice(-20)
          }));

          throw lastError;
        }

        // 최대 재시도 초과
        if (attempt > maxRetries) {
          setState(prev => ({
            ...prev,
            isRecovering: false,
            lastError,
            recoveryHistory: [...prev.recoveryHistory, context].slice(-20)
          }));

          onMaxRetriesExceeded?.(lastError, context);

          // 오프라인 큐에 저장
          if (!isOnline && enableOfflineQueue) {
            await saveOfflineData({
              type: 'failed_operation',
              operation: operationName,
              params,
              error: lastError.message,
              timestamp: new Date().toISOString()
            });
            
            addToast('작업이 오프라인 큐에 저장되었습니다.', 'info');
          } else {
            addToast(`작업 실패: ${lastError.message}`, 'error');
          }

          throw lastError;
        }

        // 재시도 대기
        const delay = calculateDelay(attempt);
        
        // 사용자에게 재시도 알림
        if (errorInfo.severity === 'high' || errorInfo.severity === 'critical') {
          addToast(
            `연결 문제가 발생했습니다. ${Math.floor(delay / 1000)}초 후 재시도합니다... (${attempt}/${maxRetries})`,
            'warning'
          );
        }

        await new Promise(resolve => {
          retryTimeoutRef.current = setTimeout(resolve, delay);
        });
      }
    }

    throw lastError;
  }, [maxRetries, timeout, calculateDelay, classifyError, isOnline, enableOfflineQueue, saveOfflineData, addToast, onError, onRecovery, onMaxRetriesExceeded]);

  // Circuit Breaker 패턴
  const circuitBreaker = useCallback(<T>(
    operation: () => Promise<T>,
    operationName: string,
    config?: {
      failureThreshold?: number;
      resetTimeout?: number;
    }
  ) => {
    const { failureThreshold = 5, resetTimeout = 60000 } = config || {};
    let failures = 0;
    let isOpen = false;
    let lastFailureTime = 0;

    return async (): Promise<T> => {
      // Circuit이 열려 있는지 확인
      if (isOpen) {
        const timeSinceFailure = Date.now() - lastFailureTime;
        if (timeSinceFailure < resetTimeout) {
          throw new Error(`Circuit breaker is open. Retry after ${Math.ceil((resetTimeout - timeSinceFailure) / 1000)} seconds`);
        }
        // Reset timeout 경과, half-open 상태로 전환
        isOpen = false;
        failures = 0;
      }

      try {
        const result = await executeWithRecovery(operation, operationName);
        failures = 0; // 성공 시 실패 카운트 리셋
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = Date.now();

        if (failures >= failureThreshold) {
          isOpen = true;
          addToast(`${operationName} 서비스가 일시적으로 사용 불가능합니다.`, 'error');
        }

        throw error;
      }
    };
  }, [executeWithRecovery, addToast]);

  // Bulkhead 패턴 (동시 실행 제한)
  const bulkhead = useCallback(<T>(
    operation: () => Promise<T>,
    maxConcurrent: number = 5
  ) => {
    let running = 0;
    const queue: (() => void)[] = [];

    const execute = async (): Promise<T> => {
      if (running >= maxConcurrent) {
        await new Promise<void>(resolve => {
          queue.push(resolve);
        });
      }

      running++;
      try {
        return await operation();
      } finally {
        running--;
        const next = queue.shift();
        if (next) next();
      }
    };

    return execute;
  }, []);

  // 타임아웃 래퍼
  const withTimeout = useCallback(<T>(
    operation: () => Promise<T>,
    timeoutMs: number = timeout
  ): Promise<T> => {
    return Promise.race([
      operation(),
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
      )
    ]);
  }, [timeout]);

  // 재시도 취소
  const cancelRetry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(prev => ({
      ...prev,
      isRecovering: false,
      attemptCount: 0
    }));
  }, []);

  // 복구 기록 초기화
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      recoveryHistory: []
    }));
  }, []);

  return {
    ...state,
    executeWithRecovery,
    circuitBreaker,
    bulkhead,
    withTimeout,
    cancelRetry,
    clearHistory
  };
}

// Supabase 서비스와 통합된 에러 복구 Hook
export function useSupabaseErrorRecovery() {
  const errorRecovery = useErrorRecovery({
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    enableOfflineQueue: true
  });

  // Supabase 특화 래퍼
  const executeSupabaseOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    try {
      return await errorRecovery.executeWithRecovery(
        operation,
        `Supabase: ${operationName}`
      );
    } catch (error) {
      const err = error as any;
      
      // Supabase 특정 에러 처리
      if (err.code === 'PGRST301') {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      }
      if (err.code === 'PGRST204') {
        throw new Error('요청한 데이터를 찾을 수 없습니다.');
      }
      if (err.code === '23505') {
        throw new Error('중복된 데이터입니다.');
      }
      
      throw error;
    }
  }, [errorRecovery]);

  return {
    ...errorRecovery,
    executeSupabaseOperation
  };
}