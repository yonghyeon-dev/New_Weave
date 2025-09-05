'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { ViewMode } from '@/components/ui/ViewSwitchButtons';
import { UnifiedFilterBar } from '@/components/ui/UnifiedFilterBar';
import { 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface ProjectMasterDetailLayoutProps {
  // Header props
  title: string;
  subtitle: string;
  totalProjects: number;
  filteredProjects: number;
  
  // Breadcrumb props
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  
  // View mode props
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  
  // Filter props
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onResetFilters?: () => void;
  
  // Pagination props (Detail View용)
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  
  // Navigation props
  selectedProjectIndex: number;
  totalFilteredProjects: number;
  onNavigateProject: (direction: 'prev' | 'next') => void;
  
  // Content components
  masterContent: React.ReactNode; // 좌측 프로젝트 목록
  detailContent: React.ReactNode; // 우측 상세 패널
  createModal: React.ReactNode;   // 생성 모달
  
  // Loading state
  loading?: boolean;
}

/**
 * 프로젝트 마스터-디테일 레이아웃 컴포넌트
 * 
 * 특징:
 * - 반응형 레이아웃 (데스크톱: 30-70%, 모바일: 스택)
 * - 키보드 네비게이션 지원
 * - 접근성 준수 (ARIA labels, focus management)
 * - 통합된 검색 기능
 */
export function ProjectMasterDetailLayout({
  title,
  subtitle,
  totalProjects,
  filteredProjects,
  showBreadcrumb = false,
  breadcrumbItems = [],
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onResetFilters,
  pageSize = 5,
  onPageSizeChange,
  selectedProjectIndex,
  totalFilteredProjects,
  onNavigateProject,
  masterContent,
  detailContent,
  createModal,
  loading = false
}: ProjectMasterDetailLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* 브레드크럼 네비게이션 */}
      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-txt-tertiary" />
                )}
                {item.href ? (
                  <a 
                    href={item.href}
                    className="text-weave-primary hover:text-weave-primary-hover transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-txt-secondary">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}

      {/* 헤더 섹션 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {/* 제목 영역 + 뷰 스위치 */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="min-w-0">
              <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">
                {title}
              </Typography>
              <Typography variant="body1" className="text-txt-secondary">
                {subtitle}
              </Typography>
            </div>
            
          </div>
          
        </div>

        {/* 통합 필터 바 */}
        <UnifiedFilterBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onResetFilters={onResetFilters}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          showColumnSettings={currentView === 'list'}
          loading={loading}
        />
      </div>

      {/* 메인 컨텐츠 영역 - 마스터-디테일 레이아웃 */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* 좌측: 마스터 (프로젝트 목록) */}
        <Card className="w-full lg:w-[30%] flex flex-col min-h-0">
          <div className="p-4 border-b border-border-light flex-shrink-0">
            <div className="flex items-center justify-between">
              <Typography variant="h4" className="font-medium text-txt-primary">
                프로젝트 목록
              </Typography>
              {/* 통계 배지 */}
              <Typography variant="body2" className="text-txt-secondary">
                총 {totalProjects}개 중 {filteredProjects}개 표시
              </Typography>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {masterContent}
          </div>
        </Card>

        {/* 우측: 디테일 (상세 정보) */}
        <Card className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            {detailContent}
          </div>
        </Card>
      </div>

      {/* 생성 모달 */}
      {createModal}
      
      {/* 키보드 단축키 안내 (개발 모드에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 p-3 bg-gray-800 text-white text-xs rounded-lg opacity-75 z-10 pointer-events-none">
          <div>↑/↓: 프로젝트 탐색</div>
          <div>Enter: 프로젝트 선택</div>
          <div>Ctrl+N: 새 프로젝트</div>
        </div>
      )}
    </div>
  );
}

/**
 * 키보드 네비게이션을 위한 커스텀 훅
 */
export function useKeyboardNavigation({
  onNavigateProject,
  onCreateProject,
  totalProjects
}: {
  onNavigateProject: (direction: 'prev' | 'next') => void;
  onCreateProject: () => void;
  totalProjects: number;
}) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 입력 필드에서는 키보드 네비게이션 비활성화
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (totalProjects > 0) {
            onNavigateProject('prev');
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (totalProjects > 0) {
            onNavigateProject('next');
          }
          break;
        case 'n':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onCreateProject();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateProject, onCreateProject, totalProjects]);
}