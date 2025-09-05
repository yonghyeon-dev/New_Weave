'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { DataPageContainer } from '@/components/layout/PageContainer';
import { ViewModeSwitch, ViewMode } from '@/components/ui/ViewModeSwitch';
import NewProjectsPage from './new-projects-page';
import { ProjectMasterDetailPage } from '@/components/projects/ProjectMasterDetailPage';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import { Briefcase, Plus, RefreshCw, Download } from 'lucide-react';

/**
 * 통합 프로젝트 페이지
 * List View와 Detail View를 전환 가능한 단일 페이지
 */
export default function UnifiedProjectsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // URL에서 뷰 모드와 선택된 프로젝트 읽기
  const urlViewMode = searchParams.get('view') as ViewMode | null;
  const selectedProjectId = searchParams.get('selected');
  
  // localStorage에서 사용자 선호 모드 읽기 (초기값)
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기화 - localStorage와 URL 파라미터 확인
  useEffect(() => {
    if (!isInitialized) {
      // URL 파라미터가 있으면 우선 사용
      if (urlViewMode === 'list' || urlViewMode === 'detail') {
        setViewMode(urlViewMode);
      } else {
        // localStorage에서 사용자 선호 읽기
        const savedMode = localStorage.getItem('preferredViewMode') as ViewMode | null;
        if (savedMode === 'list' || savedMode === 'detail') {
          setViewMode(savedMode);
        }
      }
      setIsInitialized(true);
    }
  }, [urlViewMode, isInitialized]);

  // 뷰 모드 변경 핸들러
  const handleViewModeChange = useCallback((newMode: ViewMode) => {
    setViewMode(newMode);
    
    // localStorage에 저장
    localStorage.setItem('preferredViewMode', newMode);
    
    // URL 업데이트
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newMode);
    
    // Detail View로 전환 시 선택된 프로젝트가 없으면 제거
    if (newMode === 'list' && params.has('selected')) {
      params.delete('selected');
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // 프로젝트 선택 핸들러 (List View에서 사용)
  const handleProjectSelect = useCallback((projectNo: string) => {
    // Detail View로 전환하면서 선택된 프로젝트 설정
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', 'detail');
    params.set('selected', projectNo);
    
    localStorage.setItem('preferredViewMode', 'detail');
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  // 액션 버튼 핸들러들
  const handleRefresh = useCallback(() => {
    // 새로고침 로직 (현재는 페이지 새로고침으로 대체)
    window.location.reload();
  }, []);

  const handleExport = useCallback(() => {
    // 엑셀 내보내기 로직
    console.log('Export to Excel');
    alert('엑셀 파일이 다운로드됩니다.');
  }, []);

  const handleCreateProject = useCallback(() => {
    router.push('/projects/new');
  }, [router]);

  // 헤더 컴포넌트
  const renderHeader = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
            <Briefcase className="w-6 h-6 text-weave-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-4 mb-1">
              <Typography variant="h2" className="text-2xl text-txt-primary">
                프로젝트 관리
              </Typography>
              <ViewModeSwitch
                mode={viewMode}
                onModeChange={handleViewModeChange}
              />
            </div>
            <Typography variant="body1" className="text-txt-secondary">
              프로젝트를 효율적으로 관리하고 추적하세요
            </Typography>
          </div>
        </div>
        
        {/* 우측 액션 버튼 그룹 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            내보내기
          </Button>
          
          <Button
            variant="primary"
            onClick={handleCreateProject}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            새 프로젝트
          </Button>
        </div>
      </div>
    </div>
  );

  // 로딩 중이거나 초기화되지 않은 경우
  if (!isInitialized) {
    return (
      <AppLayout>
        <DataPageContainer>
          {renderHeader()}
          <div className="flex items-center justify-center h-64">
            <div className="text-txt-secondary">로딩 중...</div>
          </div>
        </DataPageContainer>
      </AppLayout>
    );
  }

  // List View
  if (viewMode === 'list') {
    return (
      <AppLayout>
        <DataPageContainer>
          {renderHeader()}
          <NewProjectsPage 
            hideHeader={true}
            onProjectClick={handleProjectSelect}
          />
        </DataPageContainer>
      </AppLayout>
    );
  }

  // Detail View (Master-Detail Layout)
  return (
    <AppLayout>
      <DataPageContainer>
        {renderHeader()}
        <ProjectMasterDetailPage 
          initialProjectId={selectedProjectId || undefined}
          hideWrapper={true}
          hideTitle={true}
        />
      </DataPageContainer>
    </AppLayout>
  );
}