'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// 프린트 레이아웃 Props
export interface PrintLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** 프린트 제목 */
  title?: string;
  /** 페이지 크기 */
  pageSize?: 'A4' | 'A3' | 'letter' | 'legal';
  /** 페이지 방향 */
  orientation?: 'portrait' | 'landscape';
  /** 여백 크기 */
  margins?: 'none' | 'small' | 'medium' | 'large';
  /** 헤더 내용 */
  header?: React.ReactNode;
  /** 푸터 내용 */
  footer?: React.ReactNode;
  /** 페이지 번호 표시 */
  showPageNumbers?: boolean;
  /** 인쇄 날짜 표시 */
  showPrintDate?: boolean;
  /** 회사 정보 */
  companyInfo?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}

const PrintLayout: React.FC<PrintLayoutProps> = ({
  children,
  className,
  title,
  pageSize = 'A4',
  orientation = 'portrait',
  margins = 'medium',
  header,
  footer,
  showPageNumbers = true,
  showPrintDate = true,
  companyInfo,
}) => {
  // 페이지 크기별 스타일
  const pageSizeClasses = {
    A4: 'max-w-[210mm] min-h-[297mm]',
    A3: 'max-w-[297mm] min-h-[420mm]',
    letter: 'max-w-[8.5in] min-h-[11in]',
    legal: 'max-w-[8.5in] min-h-[14in]',
  };

  // 여백별 스타일
  const marginClasses = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-8',
    large: 'p-12',
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      {/* 프린트 전용 CSS */}
      <style jsx global>{`
        @media print {
          /* 기본 프린트 설정 */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            font-size: 12pt !important;
            line-height: 1.4 !important;
          }
          
          /* 페이지 설정 */
          @page {
            size: ${pageSize} ${orientation};
            margin: ${margins === 'none' ? '0' : margins === 'small' ? '0.5in' : margins === 'medium' ? '1in' : '1.5in'};
          }
          
          /* 프린트에서 숨길 요소들 */
          .no-print,
          button:not(.print-button),
          .print-hide {
            display: none !important;
          }
          
          /* 페이지 나누기 */
          .print-page-break {
            page-break-before: always;
          }
          
          .print-no-break {
            page-break-inside: avoid;
          }
          
          /* 색상 보정 */
          .print-layout {
            background: white !important;
            color: black !important;
          }
          
          /* 테이블 최적화 */
          table {
            border-collapse: collapse !important;
          }
          
          thead {
            display: table-header-group !important;
          }
          
          tbody {
            display: table-row-group !important;
          }
          
          tr {
            page-break-inside: avoid !important;
          }
          
          /* 폰트 크기 조정 */
          h1 { font-size: 18pt !important; }
          h2 { font-size: 16pt !important; }
          h3 { font-size: 14pt !important; }
          h4, h5, h6 { font-size: 12pt !important; }
          
          /* 링크 처리 */
          a {
            text-decoration: underline !important;
            color: black !important;
          }
          
          a[href]:after {
            content: " (" attr(href) ")";
            font-size: 10pt;
            color: #666;
          }
          
          /* 이미지 최적화 */
          img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* 그림자 제거 */
          * {
            box-shadow: none !important;
            text-shadow: none !important;
          }
        }
        
        /* 화면에서는 프린트 미리보기 스타일 */
        @media screen {
          .print-layout {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            background: white;
          }
        }
      `}</style>

      <div className={cn(
        "print-layout mx-auto bg-white",
        pageSizeClasses[pageSize],
        marginClasses[margins],
        className
      )}>
        {/* 헤더 */}
        {(header || companyInfo || title) && (
          <header className="print-no-break mb-6 pb-4 border-b border-gray-300">
            {/* 회사 정보 */}
            {companyInfo && (
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {companyInfo.name}
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                  {companyInfo.address && <div>{companyInfo.address}</div>}
                  <div className="flex gap-4">
                    {companyInfo.phone && <span>Tel: {companyInfo.phone}</span>}
                    {companyInfo.email && <span>Email: {companyInfo.email}</span>}
                  </div>
                  {companyInfo.website && <div>Website: {companyInfo.website}</div>}
                </div>
              </div>
            )}

            {/* 문서 제목 */}
            {title && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              </div>
            )}

            {/* 커스텀 헤더 */}
            {header && (
              <div className="mt-4">
                {header}
              </div>
            )}

            {/* 인쇄 정보 */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
              {showPrintDate && (
                <div>인쇄일: {formatDate(new Date())}</div>
              )}
              {showPageNumbers && (
                <div className="print-page-number">페이지 1</div>
              )}
            </div>
          </header>
        )}

        {/* 메인 콘텐츠 */}
        <main className="print-content">
          {children}
        </main>

        {/* 푸터 */}
        {footer && (
          <footer className="print-no-break mt-6 pt-4 border-t border-gray-300 text-sm text-gray-600">
            {footer}
          </footer>
        )}
      </div>
    </>
  );
};

// 프린트 버튼 컴포넌트
export interface PrintButtonProps {
  className?: string;
  children?: React.ReactNode;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  className,
  children = "인쇄하기",
  onBeforePrint,
  onAfterPrint,
}) => {
  const handlePrint = () => {
    onBeforePrint?.();
    
    // 프린트 실행
    window.print();
    
    // 프린트 후 콜백 (약간의 지연 후)
    setTimeout(() => {
      onAfterPrint?.();
    }, 100);
  };

  return (
    <button
      onClick={handlePrint}
      className={cn(
        "no-print inline-flex items-center gap-2 px-4 py-2 bg-weave-primary text-white rounded-lg hover:bg-weave-primary-hover transition-colors print-button",
        className
      )}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      {children}
    </button>
  );
};

// 페이지 나누기 컴포넌트
export const PageBreak: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("print-page-break", className)} />
);

// 프린트에서 숨기기 컴포넌트
export const NoPrint: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("no-print", className)}>
    {children}
  </div>
);

export default PrintLayout;