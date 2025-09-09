'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { DataPageContainer } from '@/components/layout/PageContainer';
import { ProjectDetailPanel } from './ProjectDetailPanel';
import { ProjectCreateModal } from './ProjectCreateModal';
import { UnifiedFilterBar } from '@/components/ui/UnifiedFilterBar';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import ProjectNavigation from '@/components/ui/ProjectNavigation';
import SimpleProjectNavigation from '@/components/ui/SimpleProjectNavigation';
import { 
  Briefcase, 
  ArrowLeft, 
  Plus, 
  Edit
} from 'lucide-react';
import type { ProjectTableRow, TableFilterState } from '@/lib/types/project-table.types';
import type { DetailTabType } from '@/lib/hooks/useProjectMasterDetail';

export interface ProjectFullPageDetailProps {
  project: ProjectTableRow | null;
  allProjects: ProjectTableRow[];
  onProjectChange?: (projectNo: string) => void;
}

/**
 * 전체 페이지 프로젝트 상세 컴포넌트
 * 
 * 특징:
 * - 전체 페이지 레이아웃으로 프로젝트 상세 정보 표시
 * - 목록으로 돌아가기 버튼
 * - 필터 및 검색 기능 (상단 고정)
 * - 좌우 네비게이션으로 다른 프로젝트 탐색
 * - 탭 기반 상세 정보
 */
export function ProjectFullPageDetail({
  project,
  allProjects,
  onProjectChange
}: ProjectFullPageDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DetailTabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TableFilterState>({
    searchQuery: '',
    statusFilter: 'all',
    clientFilter: 'all',
    customFilters: {}
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 현재 프로젝트의 인덱스 찾기
  const currentProjectIndex = useMemo(() => {
    if (!project) return -1;
    return allProjects.findIndex(p => p.no === project.no);
  }, [project, allProjects]);

  // 네비게이션 가능 여부
  const canNavigatePrev = currentProjectIndex > 0;
  const canNavigateNext = currentProjectIndex < allProjects.length - 1;

  // 클라이언트 목록 생성
  const availableClients = useMemo(() => {
    const clients = allProjects
      .map(p => p.client)
      .filter(client => client && client.trim() !== '')
      .filter((client, index, array) => array.indexOf(client) === index)
      .sort((a, b) => a.localeCompare(b, 'ko-KR'));
    return clients;
  }, [allProjects]);

  // 목록으로 돌아가기
  const handleBackToList = () => {
    router.push('/projects');
  };

  // 프로젝트 네비게이션 (2방향 지원)
  const handleNavigateProject = (direction: 'prev' | 'next') => {
    if (!project || !onProjectChange) return;
    
    let newIndex: number;
    
    switch (direction) {
      case 'prev':
        newIndex = currentProjectIndex - 1;
        break;
      case 'next':
        newIndex = currentProjectIndex + 1;
        break;
      default:
        return;
    }
    
    if (newIndex >= 0 && newIndex < allProjects.length) {
      const newProject = allProjects[newIndex];
      onProjectChange(newProject.no);
    }
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      statusFilter: 'all',
      clientFilter: 'all',
      customFilters: {}
    });
    setSearchQuery('');
  };

  // 프로젝트 편집 (향후 구현)
  const handleEditProject = () => {
    if (project) {
      console.log('Edit project:', project);
      alert('프로젝트 편집 기능은 향후 구현 예정입니다.');
    }
  };


  if (!project) {
    return (
      <AppLayout>
        <DataPageContainer>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Typography variant="h3" className="text-txt-secondary mb-2">
                프로젝트를 찾을 수 없습니다
              </Typography>
              <Button 
                variant="outline" 
                onClick={handleBackToList}
                className="flex items-center gap-2 mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </DataPageContainer>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DataPageContainer>
        {/* 통합 헤더 - 프로젝트 정보와 액션 버튼 통합 */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-6 bg-white rounded-lg border border-border-light">
            {/* 좌측: 프로젝트 정보 */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
                <Briefcase className="w-6 h-6 text-weave-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Typography variant="h2" className="text-xl font-semibold text-txt-primary truncate">
                    {project.name}
                  </Typography>
                  <span className="text-sm text-txt-tertiary bg-bg-secondary px-2 py-1 rounded">
                    {project.no}
                  </span>
                </div>
                <Typography variant="body2" className="text-txt-secondary">
                  {project.client} • 프로젝트 상세 정보
                </Typography>
              </div>
            </div>
            
            {/* 중앙: 프로젝트 네비게이션 */}
            <div className="mx-6">
              <SimpleProjectNavigation
                currentIndex={currentProjectIndex}
                totalCount={allProjects.length}
                onNavigate={handleNavigateProject}
                size="sm"
                ariaLabel="프로젝트 네비게이션"
                itemType="프로젝트"
                showPosition={false}
                compact={true}
              />
            </div>
            
            {/* 우측: 액션 버튼 그룹 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToList}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                목록으로
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditProject}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                편집
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                새 프로젝트
              </Button>
            </div>
          </div>
        </div>


        {/* 프로젝트 상세 패널 */}
        <div className="bg-white rounded-lg border border-border-light min-h-[600px]">
          <ProjectDetailPanel
            project={project}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNavigate={handleNavigateProject}
            canNavigatePrev={canNavigatePrev}
            canNavigateNext={canNavigateNext}
            viewMode="fullpage"
            currentProjectIndex={currentProjectIndex}
            totalProjectsCount={allProjects.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* 프로젝트 생성 모달 */}
        <ProjectCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(newProject) => {
            console.log('새 프로젝트 생성:', newProject);
            setIsCreateModalOpen(false);
          }}
        />

        {/* 개발 도구 (개발 환경에서만) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">개발 도구</div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>현재 프로젝트: {project.no}</span>
              <span>인덱스: {currentProjectIndex + 1}/{allProjects.length}</span>
              <span>활성 탭: {activeTab}</span>
              <span>검색어: {searchQuery || '없음'}</span>
            </div>
          </div>
        )}
      </DataPageContainer>
    </AppLayout>
  );
}