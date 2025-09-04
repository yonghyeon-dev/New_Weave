import { ErrorReport, ErrorSeverity } from '@/components/ErrorBoundary/types';

export class ErrorReporter {
  private static instance: ErrorReporter;
  private reports: ErrorReport[] = [];
  private maxLocalReports = 50;
  
  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }
  
  generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  determineErrorSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';
    
    // Critical: 앱 전체 중단
    if (message.includes('chunk') && message.includes('loading failed') ||
        message.includes('network error') ||
        stack.includes('layout.tsx') ||
        stack.includes('_app.tsx')) {
      return ErrorSeverity.CRITICAL;
    }
    
    // High: 주요 기능 영향
    if (message.includes('reference') && message.includes('not defined') ||
        message.includes('cannot read property') ||
        message.includes('undefined')) {
      return ErrorSeverity.HIGH;
    }
    
    // Medium: 부분 기능 제한
    if (message.includes('hydration') ||
        message.includes('prop') ||
        message.includes('render')) {
      return ErrorSeverity.MEDIUM;
    }
    
    // Low: 기본 오류
    return ErrorSeverity.LOW;
  }
  
  async report(
    error: Error,
    context: Record<string, any> = {},
    retryCount: number = 0
  ): Promise<void> {
    const errorId = this.generateErrorId();
    const severity = this.determineErrorSeverity(error);
    
    const report: ErrorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userId: context.userId,
      timestamp: new Date(),
      severity,
      context: {
        ...context,
        NODE_ENV: process.env.NODE_ENV,
        timestamp: Date.now()
      },
      retryCount
    };
    
    // 로컬 저장
    this.storeLocalReport(report);
    
    // 개발 환경에서만 콘솔 출력
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(report);
    }
    
    // 심각도에 따른 외부 서비스 전송 (프로덕션 환경)
    if (process.env.NODE_ENV === 'production' && 
        (severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL)) {
      await this.sendToExternalService(report);
    }
  }
  
  private storeLocalReport(report: ErrorReport): void {
    try {
      this.reports.push(report);
      
      // 최대 개수 제한
      if (this.reports.length > this.maxLocalReports) {
        this.reports = this.reports.slice(-this.maxLocalReports);
      }
      
      // localStorage에도 저장 (브라우저 환경에서만)
      if (typeof window !== 'undefined') {
        const existingReports = this.getLocalStorageReports();
        const updatedReports = [...existingReports, report].slice(-this.maxLocalReports);
        
        localStorage.setItem('weave_error_reports', JSON.stringify(updatedReports));
      }
    } catch (storageError) {
      console.warn('Failed to store error report locally:', storageError);
    }
  }
  
  private getLocalStorageReports(): ErrorReport[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem('weave_error_reports');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  private logToConsole(report: ErrorReport): void {
    const severityColor = {
      [ErrorSeverity.LOW]: '#6b7280',
      [ErrorSeverity.MEDIUM]: '#f59e0b', 
      [ErrorSeverity.HIGH]: '#ef4444',
      [ErrorSeverity.CRITICAL]: '#dc2626'
    };
    
    console.group(`%c🚨 Error Report [${report.severity.toUpperCase()}]`, 
      `color: ${severityColor[report.severity]}; font-weight: bold;`);
    
    console.log('Error ID:', report.errorId);
    console.log('Message:', report.message);
    console.log('Timestamp:', report.timestamp.toISOString());
    console.log('Retry Count:', report.retryCount);
    console.log('Context:', report.context);
    
    if (report.stack) {
      console.log('Stack Trace:', report.stack);
    }
    
    console.groupEnd();
  }
  
  private async sendToExternalService(report: ErrorReport): Promise<void> {
    try {
      // 실제 프로덕션에서는 Sentry, LogRocket, 또는 custom API endpoint 사용
      // 현재는 개발 목적으로 로그만 출력
      console.log('📤 Sending error report to external service:', report.errorId);
      
      // 예시: fetch를 통한 외부 서비스 전송
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(report)
      // });
      
    } catch (networkError) {
      console.warn('Failed to send error report to external service:', networkError);
    }
  }
  
  getReports(severity?: ErrorSeverity): ErrorReport[] {
    const allReports = [...this.reports, ...this.getLocalStorageReports()];
    
    if (severity) {
      return allReports.filter(report => report.severity === severity);
    }
    
    return allReports;
  }
  
  clearReports(): void {
    this.reports = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('weave_error_reports');
    }
  }
  
  getReportsByTimeRange(startTime: Date, endTime: Date): ErrorReport[] {
    return this.getReports().filter(report => 
      report.timestamp >= startTime && report.timestamp <= endTime
    );
  }
}