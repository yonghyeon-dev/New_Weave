'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { DataPageContainer } from '@/components/layout/PageContainer';
import { ProjectMasterDetailLayout } from './ProjectMasterDetailLayout';
import { ProjectList } from './ProjectList';
import { ProjectDetailPanel } from './ProjectDetailPanel';
import { ProjectCreateModal } from './ProjectCreateModal';
import { useProjectMasterDetail } from '@/lib/hooks/useProjectMasterDetail';
import type { ProjectTableRow } from '@/lib/types/project-table.types';
import { RefreshCw, Download } from 'lucide-react';

// 더미 데이터 생성 함수 (기존 new-projects-page.tsx에서 가져옴)
const generateMockData = (): ProjectTableRow[] => {
  const clients = ['A개발', 'B디자인', 'C마케팅', 'D컨설팅', 'E업체', 'F자체', 'A학교'];
  const statuses: Array<'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'> = 
    ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'];

  // 하이드레이션 안전 시드 기반 랜덤 함수 (정수 기반으로 개선)
  const seededRandom = (seed: number): number => {
    let x = Math.sin(seed) * 10000;
    x = x - Math.floor(x);
    // 정밀도 문제 해결을 위해 6자리까지만 사용
    return Math.floor(x * 1000000) / 1000000;
  };

  // 하이드레이션 안전 고정 날짜 (UTC 기준)
  const baseDate = new Date(2024, 0, 1, 0, 0, 0, 0);
  const dayInterval = 7;

  const projects = Array.from({ length: 20 }, (_, i) => {
    const seed1 = i * 1234 + 5678;
    const seed2 = i * 2345 + 6789;
    const seed3 = i * 3456 + 7890;
    const seed4 = i * 4567 + 8901;
    const seed5 = i * 5678 + 9012;

    const registrationDate = new Date(
      baseDate.getTime() + 
      (i * dayInterval * 24 * 60 * 60 * 1000) + 
      (Math.floor(seededRandom(seed1) * 3) * 24 * 60 * 60 * 1000)
    );
    const dueDate = new Date(registrationDate.getTime() + Math.floor(seededRandom(seed2) * 90) * 24 * 60 * 60 * 1000);
    
    // 하이드레이션 안전: 고정된 기준 날짜 사용 (2024년 12월 31일)
    const fixedCurrentDate = new Date(2024, 11, 31, 0, 0, 0, 0);
    const maxModifyTime = Math.min(fixedCurrentDate.getTime(), registrationDate.getTime() + 180 * 24 * 60 * 60 * 1000);
    const modifyTimeRange = maxModifyTime - registrationDate.getTime();
    const modifiedDate = new Date(registrationDate.getTime() + Math.floor(seededRandom(seed3) * modifyTimeRange));

    const progress = Math.floor(seededRandom(seed4) * 101);
    let paymentProgress = 0;
    
    if (progress >= 80) {
      paymentProgress = Math.floor(80 + seededRandom(seed5) * 21);
    } else if (progress >= 50) {
      paymentProgress = Math.floor(30 + seededRandom(seed5) * 51);
    } else if (progress >= 20) {
      paymentProgress = Math.floor(10 + seededRandom(seed5) * 31);
    } else {
      paymentProgress = Math.floor(seededRandom(seed5) * 21);
    }
    
    const statusIndex = Math.floor(seededRandom(seed1 + seed2) * statuses.length);
    if (statuses[statusIndex] === 'completed' && seededRandom(seed3 + seed4) > 0.3) {
      paymentProgress = 100;
    }

    return {
      id: `project-${i + 1}`,
      no: `WEAVE_${String(i + 1).padStart(3, '0')}`,
      name: `${['A개발', 'B디자인', 'C마케팅', 'D컨설팅', '카페 관리', '피시방 관리', 'A교육 강의'][i % 7]} 프로젝트`,
      registrationDate: registrationDate.toISOString(),
      client: clients[i % clients.length],
      progress,
      paymentProgress,
      status: statuses[statusIndex],
      dueDate: dueDate.toISOString(),
      modifiedDate: modifiedDate.toISOString(),
      hasContract: seededRandom(seed1 + 1000) > 0.5,
      hasBilling: seededRandom(seed2 + 1000) > 0.3,
      hasDocuments: seededRandom(seed3 + 1000) > 0.4
    };
  });

  // 최신 프로젝트가 상단에 오도록 내림차순 정렬 (등록일 기준)
  return projects.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
};

export interface ProjectMasterDetailPageProps {
  initialProjectId?: string; // URL에서 전달받은 프로젝트 ID
  hideWrapper?: boolean; // AppLayout과 DataPageContainer를 숨길지 여부
  hideTitle?: boolean; // 프로젝트 관리 타이틀을 숨길지 여부
  projects?: ProjectTableRow[]; // 외부에서 전달받은 프로젝트 데이터 (통합 데이터 사용)
}

/**
 * 프로젝트 마스터-디테일 메인 페이지 컴포넌트
 * 
 * 특징:
 * - 중앙화된 상태 관리
 * - 마스터-디테일 레이아웃
 * - 프로젝트 생성 모달
 * - 검색 및 필터링
 * - 키보드 네비게이션
 * - 반응형 디자인
 * - URL 기반 초기 프로젝트 선택
 */
export function ProjectMasterDetailPage({ 
  initialProjectId,
  hideWrapper = false,
  hideTitle = false,
  projects: externalProjects
}: ProjectMasterDetailPageProps) {
  const [initialLoading, setInitialLoading] = useState(true);
  
  // 중앙화된 상태 관리
  const { state, actions } = useProjectMasterDetail();

  // 초기 데이터 로딩 (외부 데이터 우선 사용)
  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      actions.setLoading(true);
      
      try {
        let data: ProjectTableRow[];
        
        if (externalProjects && externalProjects.length > 0) {
          // 외부에서 전달받은 데이터가 있으면 우선 사용 (통합 데이터)
          console.log('🔄 Using external projects data:', externalProjects.length);
          data = externalProjects;
          // 외부 데이터는 즉시 사용 가능
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          // 외부 데이터가 없으면 내부 데이터 생성
          console.log('🔄 Loading internal mock data');
          await new Promise(resolve => setTimeout(resolve, 500));
          data = generateMockData();
        }
        
        actions.refreshProjects(data);
        return data;
      } catch (error) {
        console.error('Failed to load projects:', error);
        return [];
      } finally {
        setInitialLoading(false);
        actions.setLoading(false);
      }
    };

    loadData();
  }, [externalProjects]); // externalProjects 의존성 추가

  // 초기 선택 여부를 추적하는 ref
  const hasInitiallySelected = useRef(false);

  // 프로젝트 자동 선택 (최적화된 useEffect)
  useEffect(() => {
    // initialProjectId가 없거나 프로젝트 목록이 비어있으면 실행하지 않음
    if (!initialProjectId || state.projects.length === 0) {
      return;
    }
    
    // 이미 초기 선택이 완료되었으면 실행하지 않음
    if (hasInitiallySelected.current) {
      return;
    }
    
    // 이미 올바른 프로젝트가 선택되어 있다면 실행하지 않음
    if (state.selectedProject?.no === initialProjectId) {
      console.log('✅ Target project already selected:', initialProjectId);
      hasInitiallySelected.current = true;
      return;
    }
    
    console.log('🔍 Auto-selecting initial project:', {
      initialProjectId,
      projectsCount: state.projects.length,
      currentSelected: state.selectedProject?.no,
      availableProjects: state.projects.map(p => p.no)
    });
    
    const targetProject = state.projects.find(p => p.no === initialProjectId);
    
    if (targetProject) {
      console.log('✅ Selecting initial project:', {
        id: targetProject.id,
        no: targetProject.no,
        name: targetProject.name
      });
      actions.selectProject(targetProject);
      hasInitiallySelected.current = true; // 초기 선택 완료 표시
    } else {
      console.warn('⚠️ Initial project not found:', initialProjectId);
    }
  }, [initialProjectId, state.projects, actions.selectProject]); // state.selectedProject?.no 의존성 제거

  // 데이터 새로고침
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual Refresh Triggered');
    actions.setLoading(true);
    
    setTimeout(() => {
      const newData = generateMockData();
      console.log('🔄 Manual Refresh: Generated new data, calling refreshProjects');
      actions.refreshProjects(newData);
      actions.setLoading(false);
    }, 300);
  }, [actions]);

  // 엑셀 내보내기 (더미 구현)
  const handleExport = useCallback(() => {
    console.log('Export to Excel:', state.filteredProjects);
    alert('엑셀 파일이 다운로드됩니다.');
  }, [state.filteredProjects]);

  // 프로젝트 편집 핸들러 (향후 구현)
  const handleEditProject = useCallback((project: ProjectTableRow) => {
    console.log('Edit project:', project);
    alert('프로젝트 편집 기능은 향후 구현 예정입니다.');
  }, []);

  // 키보드 네비게이션은 이제 ProjectMasterDetailLayout에서 통합 관리됨

  // 네비게이션 가능 여부 계산
  const canNavigatePrev = useMemo(() => {
    return state.selectedProjectIndex > 0;
  }, [state.selectedProjectIndex]);

  const canNavigateNext = useMemo(() => {
    return state.selectedProjectIndex < state.filteredProjects.length - 1;
  }, [state.selectedProjectIndex, state.filteredProjects.length]);

  // 통계 계산 (메모화)
  const stats = useMemo(() => {
    const { projects } = state;
    if (projects.length === 0) return { inProgress: 0, completed: 0, avgProgress: 0 };
    
    return {
      inProgress: projects.filter(p => p.status === 'in_progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      avgProgress: Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length || 0)
    };
  }, [state.projects]);

  const content = (
    <>
      <ProjectMasterDetailLayout
          // Header props
          title={hideTitle ? "" : "프로젝트 관리"}
          subtitle={hideTitle ? "" : "프로젝트를 효율적으로 관리하고 추적하세요"}
          totalProjects={state.projects.length}
          filteredProjects={state.filteredProjects.length}
          onCreateProject={actions.openCreateModal}
          onRefresh={handleRefresh}
          onExport={handleExport}
          
          // Breadcrumb props (상세 페이지인 경우 표시)
          showBreadcrumb={!!initialProjectId}
          breadcrumbItems={[
            { label: '프로젝트', href: '/projects' },
            { label: initialProjectId || '상세' }
          ]}
          
          // View mode props
          currentView={state.currentView}
          onViewChange={actions.setCurrentView}
          
          // Filter props
          searchQuery={state.searchQuery}
          onSearchChange={actions.setSearchQuery}
          filters={state.filters}
          onFiltersChange={actions.updateFilters}
          onResetFilters={actions.resetFilters}
          
          // Pagination props
          pageSize={state.pageSize}
          onPageSizeChange={actions.setPageSize}
          
          // Navigation props
          selectedProjectIndex={state.selectedProjectIndex}
          totalFilteredProjects={state.filteredProjects.length}
          onNavigateProject={actions.navigateProject}
          
          // Content components
          masterContent={
            <ProjectList
              projects={state.paginatedProjects}
              selectedProject={state.selectedProject}
              onProjectSelect={actions.selectProject}
              loading={state.isLoading || initialLoading}
              searchQuery={state.searchQuery}
              currentPage={state.currentPage}
              totalPages={state.totalPages}
              totalCount={state.filteredProjects.length}
              onPageChange={actions.setCurrentPage}
            />
          }
          
          detailContent={
            <ProjectDetailPanel
              project={state.selectedProject}
              activeTab={state.activeDetailTab}
              onTabChange={actions.setActiveDetailTab}
              onEdit={handleEditProject}
              onNavigate={actions.navigateProject}
              canNavigatePrev={canNavigatePrev}
              canNavigateNext={canNavigateNext}
              viewMode="detail"
              currentProjectIndex={state.selectedProjectIndex}
              totalProjectsCount={state.filteredProjects.length}
              searchQuery={state.searchQuery}
              onSearchChange={actions.setSearchQuery}
              filters={state.filters}
              onFiltersChange={actions.updateFilters}
              onResetFilters={actions.resetFilters}
            />
          }
          
          createModal={
            <ProjectCreateModal
              isOpen={state.isCreateModalOpen}
              onClose={actions.closeCreateModal}
              onSuccess={actions.addNewProject}
            />
          }
          
          loading={state.isLoading || initialLoading}
        />

      {/* 개발 도구 (개발 환경에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">개발 도구</div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>총 프로젝트: {state.projects.length}</span>
            <span>필터된 프로젝트: {state.filteredProjects.length}</span>
            <span>선택된 인덱스: {state.selectedProjectIndex}</span>
            <span>진행중: {stats.inProgress}</span>
            <span>완료: {stats.completed}</span>
            <span>평균 진행률: {stats.avgProgress}%</span>
          </div>
        </div>
      )}
    </>
  );

  if (hideWrapper) {
    return content;
  }

  return (
    <AppLayout>
      <DataPageContainer>
        {content}
      </DataPageContainer>
    </AppLayout>
  );
}