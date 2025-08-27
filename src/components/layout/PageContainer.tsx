'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type ContainerType = 'data' | 'workspace' | 'form' | 'reading';

interface PageContainerProps {
  children: React.ReactNode;
  type?: ContainerType;
  className?: string;
  paddingY?: 'sm' | 'md' | 'lg' | 'xl';
  paddingX?: 'sm' | 'md' | 'lg' | 'xl';
}

// 좌우는 고정 패딩 + 콘텐츠 영역 가변으로 유지
const CONTAINER_STYLES = {
  data: '', // 데이터 테이블/차트 - 전체 폭 활용
  workspace: '', // 멀티태스킹 도구 - 전체 폭 활용  
  form: '', // 폼 페이지 - 전체 폭 활용
  reading: '' // 텍스트 읽기 - 전체 폭 활용
};

const PADDING_Y = {
  sm: 'py-4 md:py-8',     // 모바일: 16px, 데스크톱: 32px
  md: 'py-6 md:py-12',    // 모바일: 24px, 데스크톱: 48px
  lg: 'py-8 md:py-16',    // 모바일: 32px, 데스크톱: 64px
  xl: 'py-12 md:py-24'    // 모바일: 48px, 데스크톱: 96px
};

const PADDING_X = {
  sm: 'px-4 md:px-8',     // 모바일: 16px, 데스크톱: 32px
  md: 'px-4 md:px-12',    // 모바일: 16px, 데스크톱: 48px
  lg: 'px-6 md:px-16',    // 모바일: 24px, 데스크톱: 64px
  xl: 'px-8 md:px-24'     // 모바일: 32px, 데스크톱: 96px
};

/**
 * WEAVE 페이지 컨테이너 컴포넌트
 * 
 * 고정된 좌우 여백과 가변적인 콘텐츠 영역을 제공합니다.
 * 
 * @param type - 컨테이너 유형 (현재 모든 타입이 동일한 레이아웃 사용)
 *   - 'data': 테이블, 차트, 대시보드
 *   - 'workspace': 멀티태스킹, 도구 페이지
 *   - 'form': 단일 폼, 설정 페이지
 *   - 'reading': 텍스트 중심 페이지
 * @param paddingX - 좌우 여백 크기 (고정)
 * @param paddingY - 상하 여백 크기
 */
export default function PageContainer({ 
  children, 
  type = 'workspace',
  className,
  paddingY = 'md',
  paddingX = 'md'
}: PageContainerProps) {
  return (
    <div className="bg-bg-primary min-h-full">
      <div 
        className={cn(
          CONTAINER_STYLES[type],
          PADDING_Y[paddingY],
          PADDING_X[paddingX],
          // 모바일 최적화: 안전한 여백과 스크롤 영역 확보
          'min-h-screen lg:min-h-full',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * 타입별 특화 컴포넌트들
 */
export function DataPageContainer({ children, className, ...props }: Omit<PageContainerProps, 'type'>) {
  return (
    <PageContainer type="data" className={className} {...props}>
      {children}
    </PageContainer>
  );
}

export function WorkspacePageContainer({ children, className, ...props }: Omit<PageContainerProps, 'type'>) {
  return (
    <PageContainer type="workspace" className={className} {...props}>
      {children}
    </PageContainer>
  );
}

export function FormPageContainer({ children, className, ...props }: Omit<PageContainerProps, 'type'>) {
  return (
    <PageContainer type="form" className={className} {...props}>
      {children}
    </PageContainer>
  );
}

export function ReadingPageContainer({ children, className, ...props }: Omit<PageContainerProps, 'type'>) {
  return (
    <PageContainer type="reading" className={className} {...props}>
      {children}
    </PageContainer>
  );
}