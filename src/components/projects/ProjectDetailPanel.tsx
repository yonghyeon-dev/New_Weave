'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import ProjectNavigation from '@/components/ui/ProjectNavigation';
import SimpleProjectNavigation from '@/components/ui/SimpleProjectNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProjectTableControls } from '@/components/ui/ProjectTableControls';
import type { 
  ProjectTableRow,
  TableFilterState 
} from '@/lib/types/project-table.types';
import type { DetailTabType } from '@/lib/hooks/useProjectMasterDetail';
import { 
  FileText, 
  FileCheck, 
  DollarSign, 
  BarChart3,
  Edit,
  Building,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  ArrowLeft
} from 'lucide-react';

export interface ProjectDetailPanelProps {
  project: ProjectTableRow | null;
  activeTab: DetailTabType;
  onTabChange: (tab: DetailTabType) => void;
  onEdit?: (project: ProjectTableRow) => void;
  onNavigate?: (direction: 'first' | 'prev' | 'next' | 'last') => void;
  canNavigatePrev?: boolean;
  canNavigateNext?: boolean;
  onBackToList?: () => void; // 목록으로 돌아가기 핸들러
  viewMode?: 'detail' | 'fullpage'; // 뷰 모드에 따른 렌더링 차별화
  
  // 네비게이션을 위한 추가 props
  currentProjectIndex?: number;
  totalProjectsCount?: number;
  
  // 새로운 필터 관련 props
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters?: TableFilterState;
  onFiltersChange?: (filters: TableFilterState) => void;
  onResetFilters?: () => void;
}

/**
 * 프로젝트 상세 패널 컴포넌트
 * 
 * 특징:
 * - 탭 기반 상세 정보 표시
 * - 기존 ProjectDetailModal 내용 재활용
 * - 편집 기능 통합
 * - 네비게이션 지원
 * - 빈 상태 처리
 */
export function ProjectDetailPanel({
  project,
  activeTab,
  onTabChange,
  onEdit,
  onNavigate,
  canNavigatePrev = false,
  canNavigateNext = false,
  onBackToList,
  viewMode = 'detail',
  
  // 네비게이션을 위한 추가 props
  currentProjectIndex = 0,
  totalProjectsCount = 0,
  
  // 새로운 필터 관련 props
  searchQuery = '',
  onSearchChange,
  filters,
  onFiltersChange,
  onResetFilters
}: ProjectDetailPanelProps) {
  const tabs = [
    { id: 'overview', label: '개요', icon: FileText },
    { id: 'contract', label: '계약서', icon: FileCheck },
    { id: 'billing', label: '청구/정산', icon: DollarSign },
    { id: 'documents', label: '문서', icon: BarChart3 }
  ];

  // 빈 상태 (선택된 프로젝트 없음)
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <FolderOpen className="w-16 h-16 text-txt-tertiary mb-4" />
        <Typography variant="h3" className="text-txt-secondary mb-2">
          프로젝트를 선택하세요
        </Typography>
        <Typography variant="body1" className="text-txt-tertiary">
          좌측 목록에서 프로젝트를 선택하면 상세 정보를 확인할 수 있습니다.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Detail 모드에서만 프로젝트 정보 헤더 표시 */}
      {viewMode === 'detail' && (
        <div className="flex items-center justify-between p-6 border-b border-border-light flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-weave-primary-light rounded-lg flex-shrink-0">
              <FileText className="w-5 h-5 text-weave-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <Typography variant="h3" className="text-xl font-semibold text-txt-primary truncate">
                {project.name}
              </Typography>
              <Typography variant="body2" className="text-txt-secondary">
                {project.no} • {project.client}
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 프로젝트 네비게이션 */}
            {onNavigate && totalProjectsCount > 1 && (
              <>
                {viewMode === 'fullpage' ? (
                  <SimpleProjectNavigation
                    currentIndex={currentProjectIndex}
                    totalCount={totalProjectsCount}
                    onNavigate={(direction) => {
                      // 4방향 네비게이션을 2방향으로 변환
                      if (direction === 'prev') {
                        onNavigate('prev');
                      } else if (direction === 'next') {
                        onNavigate('next');
                      }
                    }}
                    size="sm"
                    ariaLabel="프로젝트 네비게이션"
                    itemType="프로젝트"
                    showPosition={true}
                    compact={false}
                  />
                ) : (
                  <ProjectNavigation
                    currentIndex={currentProjectIndex}
                    totalCount={totalProjectsCount}
                    onNavigate={onNavigate}
                    size="sm"
                    ariaLabel="프로젝트 네비게이션"
                    itemType="프로젝트"
                  />
                )}
                
                <div className="w-px h-6 bg-border-light mx-2" />
              </>
            )}
            
            {/* 목록으로 버튼 (Detail 모드에서만) */}
            {onBackToList && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToList}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                목록으로
              </Button>
            )}
            
            {/* 편집 버튼 (Detail 모드에서만) */}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(project)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                편집
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="border-b border-border-light flex-shrink-0">
        <nav className="flex space-x-0">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as DetailTabType)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-weave-primary text-weave-primary'
                    : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6">
          {activeTab === 'overview' && (
            <ProjectOverviewTab project={project} />
          )}

          {activeTab === 'contract' && (
            <ProjectContractTab project={project} />
          )}

          {activeTab === 'billing' && (
            <ProjectBillingTab project={project} />
          )}

          {activeTab === 'documents' && (
            <ProjectDocumentsTab project={project} />
          )}
        </div>
      </div>
    </div>
  );
}

// 개요 탭 컴포넌트
function ProjectOverviewTab({ project }: { project: ProjectTableRow }) {
  const getStatusLabel = (status: string) => {
    const labels = {
      planning: '기획',
      in_progress: '진행중',
      review: '검토',
      completed: '완료',
      on_hold: '보류',
      cancelled: '취소'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-6">
      {/* 프로젝트 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">프로젝트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-txt-secondary">상태</span>
              <span className="text-txt-primary">{getStatusLabel(project.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-txt-secondary">진행률</span>
              <span className="text-txt-primary">{project.progress}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-txt-secondary">등록일</span>
              <span className="text-txt-primary">{new Date(project.registrationDate).toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-txt-secondary">마감일</span>
              <span className="text-txt-primary">{new Date(project.dueDate).toLocaleDateString('ko-KR')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">클라이언트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-txt-tertiary" />
              <span className="text-txt-primary">{project.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-txt-secondary">수급현황</span>
              <span className="text-txt-primary">{project.paymentProgress}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 진행률 차트 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">프로젝트 진행률</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-txt-secondary mb-2">전체 진행률</div>
            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden mb-1.5">
              <div 
                className="h-full bg-gradient-to-r from-weave-primary to-weave-primary-dark transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="text-center">
              <span className="text-sm text-txt-primary font-medium">{project.progress}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 계약 탭 컴포넌트
function ProjectContractTab({ project }: { project: ProjectTableRow }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">계약 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileCheck className="w-12 h-12 text-txt-tertiary mx-auto mb-3" />
            <Typography variant="body1" className="text-txt-secondary">
              계약 정보 기능은 향후 구현 예정입니다.
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 청구/정산 탭 컴포넌트
function ProjectBillingTab({ project }: { project: ProjectTableRow }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">청구/정산 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-txt-tertiary mx-auto mb-3" />
            <Typography variant="body1" className="text-txt-secondary">
              청구/정산 기능은 향후 구현 예정입니다.
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 문서 탭 컴포넌트
function ProjectDocumentsTab({ project }: { project: ProjectTableRow }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">프로젝트 문서</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-txt-tertiary mx-auto mb-3" />
            <Typography variant="body1" className="text-txt-secondary">
              문서 관리 기능은 향후 구현 예정입니다.
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}