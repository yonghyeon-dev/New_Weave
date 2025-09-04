'use client';

import React, { Component, ReactNode } from 'react';
import { 
  ErrorState, 
  ErrorInfo, 
  ErrorBoundaryProps, 
  ErrorSeverity,
  ErrorStrategy
} from './types';
import { ErrorReporter } from '@/lib/monitoring/ErrorReporter';
import { GlobalErrorFallback } from './GlobalErrorFallback';

export class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorState> {
  private errorReporter: ErrorReporter;
  private retryTimeouts: Set<NodeJS.Timeout> = new Set();

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      errorId: '',
      timestamp: new Date(),
      retryCount: 0
    };
    
    this.errorReporter = ErrorReporter.getInstance();
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorState> {
    const errorReporter = ErrorReporter.getInstance();
    
    return {
      hasError: true,
      error,
      errorId: errorReporter.generateErrorId(),
      timestamp: new Date(),
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { errorId, retryCount } = this.state;

    // 에러 정보 보강
    const enhancedErrorInfo = {
      ...errorInfo,
      level: this.props.level,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
    };

    // 에러 리포터에 전송
    this.errorReporter.report(error, enhancedErrorInfo, retryCount);

    // 자동 복구 시도 (글로벌 레벨에서는 신중하게)
    if (this.props.autoRecover && this.shouldAttemptAutoRecover(error)) {
      this.scheduleAutoRecover();
    }

    // 상태 업데이트
    this.setState(prevState => ({
      ...prevState,
      error,
      errorInfo,
    }));
  }

  shouldAttemptAutoRecover = (error: Error): boolean => {
    const severity = this.errorReporter.determineErrorSeverity(error);
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    // Critical 에러나 최대 재시도 초과시 자동 복구 안함
    if (severity === ErrorSeverity.CRITICAL || retryCount >= maxRetries) {
      return false;
    }

    // 특정 에러 유형에 대해서만 자동 복구 시도
    const recoverableErrors = [
      'loading chunk',
      'network error',
      'fetch',
      'timeout'
    ];

    return recoverableErrors.some(keyword => 
      error.message.toLowerCase().includes(keyword)
    );
  };

  scheduleAutoRecover = (): void => {
    const { retryCount } = this.state;
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // 지수 백오프

    const timeout = setTimeout(() => {
      this.handleRetry();
      this.retryTimeouts.delete(timeout);
    }, delay);

    this.retryTimeouts.add(timeout);
  };

  handleRetry = (): void => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        ...prevState,
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
        timestamp: new Date()
      }));

      // 페이지 새로고침 (글로벌 에러의 경우 최후 수단)
      if (retryCount === maxRetries - 1) {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }
    }
  };

  handleResetError = (): void => {
    // 모든 타임아웃 정리
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: '',
      timestamp: new Date(),
      retryCount: 0
    });
  };

  componentWillUnmount(): void {
    // 타임아웃 정리
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  render(): ReactNode {
    const { children, fallback: CustomFallback, enableRetry = true, maxRetries = 3 } = this.props;
    const { hasError, error, errorInfo, retryCount } = this.state;

    if (hasError && error) {
      const severity = this.errorReporter.determineErrorSeverity(error);
      const canRetry = enableRetry && retryCount < maxRetries;

      const FallbackComponent = CustomFallback || GlobalErrorFallback;

      return (
        <FallbackComponent
          error={error}
          errorInfo={errorInfo}
          resetError={this.handleResetError}
          retryCount={retryCount}
          canRetry={canRetry}
          severity={severity}
        />
      );
    }

    return children;
  }
}

// 기본 설정을 가진 HOC
export const withGlobalErrorBoundary = (
  WrappedComponent: React.ComponentType<any>,
  options: Partial<ErrorBoundaryProps> = {}
) => {
  const WithErrorBoundary: React.FC = (props) => (
    <GlobalErrorBoundary
      level="global"
      enableRetry={true}
      maxRetries={3}
      autoRecover={false}
      isolateError={false}
      {...options}
    >
      <WrappedComponent {...props} />
    </GlobalErrorBoundary>
  );

  WithErrorBoundary.displayName = `withGlobalErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundary;
};