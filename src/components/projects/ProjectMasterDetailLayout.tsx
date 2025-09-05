'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { ViewMode } from '@/components/ui/ViewSwitchButtons';
import { UnifiedFilterBar } from '@/components/ui/UnifiedFilterBar';
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts';
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
  onCreateProject: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  
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
  onCreateProject,
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
      
      {/* 통합 키보드 네비게이션 (Detail view) */}
      <KeyboardShortcuts
        mode="detail"
        onNavigateProject={onNavigateProject}
        onCreateProject={onCreateProject}
        totalProjects={totalFilteredProjects}
      />
    </div>
  );
}

