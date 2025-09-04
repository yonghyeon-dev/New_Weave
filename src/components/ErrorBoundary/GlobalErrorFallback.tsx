'use client';

import React from 'react';
import { ErrorFallbackProps, ErrorSeverity } from './types';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';

export const GlobalErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
  retryCount,
  canRetry,
  severity
}) => {
  const getSeverityConfig = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return {
          title: '심각한 시스템 오류',
          description: '애플리케이션에 중대한 문제가 발생했습니다.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          icon: '🚨'
        };
      case ErrorSeverity.HIGH:
        return {
          title: '주요 기능 오류',
          description: '일부 주요 기능을 사용할 수 없습니다.',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
          icon: '⚠️'
        };
      case ErrorSeverity.MEDIUM:
        return {
          title: '일시적인 문제',
          description: '일시적인 문제가 발생했습니다.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          icon: '⚡'
        };
      default:
        return {
          title: '알 수 없는 오류',
          description: '예상치 못한 문제가 발생했습니다.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
          icon: '❓'
        };
    }
  };

  const config = getSeverityConfig(severity);
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handlePageReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleReportIssue = () => {
    // GitHub Issues 또는 고객 지원 페이지로 이동
    const issueUrl = `https://github.com/your-repo/issues/new?title=Error%20Report&body=${encodeURIComponent(
      `**Error Message:**\n${error.message}\n\n**Error Stack:**\n${error.stack}\n\n**Severity:** ${severity}\n**Retry Count:** ${retryCount}`
    )}`;
    
    if (typeof window !== 'undefined') {
      window.open(issueUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-secondary">
      <Card className={`max-w-2xl w-full p-8 ${config.bgColor} ${config.borderColor} border-2`}>
        <div className="text-center space-y-6">
          {/* 아이콘 및 제목 */}
          <div className="space-y-4">
            <div className="text-6xl">{config.icon}</div>
            <div>
              <Typography variant="h1" className={`text-3xl font-bold ${config.color} mb-2`}>
                {config.title}
              </Typography>
              <Typography variant="body1" className="text-txt-secondary text-lg">
                {config.description}
              </Typography>
            </div>
          </div>

          {/* 에러 메시지 */}
          <div className="bg-white rounded-lg p-4 border border-border-light">
            <Typography variant="body2" className="font-mono text-sm text-left break-words">
              {error.message}
            </Typography>
          </div>

          {/* 재시도 정보 */}
          {retryCount > 0 && (
            <div className="text-sm text-txt-secondary">
              자동 복구 시도: {retryCount}회
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {canRetry && (
              <Button
                onClick={resetError}
                className={`${config.buttonColor} text-white px-6 py-3`}
              >
                다시 시도
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handlePageReload}
              className="px-6 py-3"
            >
              페이지 새로고침
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="px-6 py-3"
            >
              홈으로 이동
            </Button>
          </div>

          {/* 고급 옵션 */}
          <details className="text-left">
            <summary className="cursor-pointer text-txt-secondary hover:text-txt-primary text-sm">
              고급 옵션 및 정보
            </summary>
            <div className="mt-4 space-y-3">
              <Button
                variant="ghost"
                onClick={handleReportIssue}
                className="text-sm"
              >
                🐛 문제 신고하기
              </Button>
              
              {isDevelopment && (
                <div className="bg-gray-100 rounded p-3 text-xs font-mono overflow-x-auto">
                  <div className="font-bold text-gray-700 mb-2">개발자 정보:</div>
                  <div className="text-gray-600">
                    <div>Severity: {severity}</div>
                    <div>Retry Count: {retryCount}</div>
                    <div>Timestamp: {new Date().toISOString()}</div>
                    {errorInfo && (
                      <details className="mt-2">
                        <summary className="cursor-pointer">Stack Trace</summary>
                        <pre className="mt-2 text-xs whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}
            </div>
          </details>

          {/* 추가 도움말 */}
          <div className="text-sm text-txt-tertiary pt-4 border-t border-border-light">
            <Typography variant="body2">
              문제가 지속되면 고객 지원팀에 문의하시거나 잠시 후 다시 시도해 주세요.
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
};