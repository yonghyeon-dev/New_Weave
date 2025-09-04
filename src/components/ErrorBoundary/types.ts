import { ReactNode } from 'react';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
  timestamp: Date;
  retryCount: number;
}

export interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
  timestamp: Date;
  severity: ErrorSeverity;
  context: Record<string, any>;
  retryCount: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  level: 'global' | 'page' | 'component';
  enableRetry?: boolean;
  maxRetries?: number;
  autoRecover?: boolean;
  isolateError?: boolean;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo?: ErrorInfo;
  resetError: () => void;
  retryCount: number;
  canRetry: boolean;
  severity: ErrorSeverity;
}

export interface ErrorStrategy {
  severity: ErrorSeverity;
  fallbackComponent?: React.ComponentType<ErrorFallbackProps>;
  retryEnabled: boolean;
  reportToService: boolean;
  autoRecover: boolean;
  maxRetries: number;
  isolateError: boolean;
}