'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { 
  Plus, 
  Briefcase, 
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface ProjectMasterDetailLayoutProps {
  // Header props
  title: string;
  subtitle: string;
  totalProjects: number;
  filteredProjects: number;
  onCreateProject: () => void;
  onRefresh: () => void;
  onExport: () => void;
  
  // Breadcrumb props
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  
  // Search props
  searchQuery: string;
  onSearchChange: (query: string) => void;
  
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
  onCreateProject,
  onRefresh,
  onExport,
  showBreadcrumb = false,
  breadcrumbItems = [],
  searchQuery,
  onSearchChange,
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
          {/* 제목 영역 */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
              <Briefcase className="w-6 h-6 text-weave-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">
                {title}
              </Typography>
              <Typography variant="body1" className="text-txt-secondary">
                {subtitle}
              </Typography>
            </div>
          </div>
          
          {/* 액션 버튼 그룹 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              새로고침
            </Button>
            
            <Button
              variant="outline"
              onClick={onExport}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              내보내기
            </Button>
            
            <Button
              variant="primary"
              onClick={onCreateProject}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              새 프로젝트
            </Button>
          </div>
        </div>

        {/* 통계 및 검색 영역 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Typography variant="body2" className="text-txt-secondary">
              총 {totalProjects}개 중 {filteredProjects}개 표시
            </Typography>
            
            {/* 네비게이션 컨트롤 */}
            {selectedProjectIndex >= 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateProject('prev')}
                  disabled={totalFilteredProjects <= 1}
                  className="p-1"
                  aria-label="이전 프로젝트"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Typography variant="body2" className="text-txt-tertiary">
                  {selectedProjectIndex + 1} / {totalFilteredProjects}
                </Typography>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateProject('next')}
                  disabled={totalFilteredProjects <= 1}
                  className="p-1"
                  aria-label="다음 프로젝트"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* 검색 입력 */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
            <input
              type="text"
              placeholder="프로젝트 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-weave-primary text-sm"
              aria-label="프로젝트 검색"
            />
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 - 마스터-디테일 레이아웃 */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* 좌측: 마스터 (프로젝트 목록) */}
        <Card className="w-full lg:w-[30%] flex flex-col min-h-0">
          <div className="p-4 border-b border-border-light flex-shrink-0">
            <Typography variant="h4" className="font-medium text-txt-primary">
              프로젝트 목록
            </Typography>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {masterContent}
          </div>
        </Card>

        {/* 우측: 디테일 (상세 정보) */}
        <Card className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
            {detailContent}
          </div>
        </Card>
      </div>

      {/* 생성 모달 */}
      {createModal}
      
      {/* 키보드 단축키 안내 (개발 모드에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white text-xs rounded-lg opacity-75 z-40">
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