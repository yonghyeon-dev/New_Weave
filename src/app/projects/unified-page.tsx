'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { DataPageContainer } from '@/components/layout/PageContainer';
import { ViewModeSwitch, ViewMode } from '@/components/ui/ViewModeSwitch';
import NewProjectsPage from './new-projects-page';
import { ProjectMasterDetailPage } from '@/components/projects/ProjectMasterDetailPage';
import { ProjectCreateModal } from '@/components/projects/ProjectCreateModal';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import { Briefcase, Plus, Download, Upload, Eye, Play, CheckCircle } from 'lucide-react';
import type { ProjectTableRow } from '@/lib/types/project-table.types';
import { useProjectTable } from '@/lib/hooks/useProjectTable';

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
  const [rawProjectData, setRawProjectData] = useState<ProjectTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // useProjectTable 훅을 사용해서 정렬된 데이터 가져오기
  const { data: sortedProjectData } = useProjectTable(rawProjectData);

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

  // Detail View에서 선택된 프로젝트가 없을 때 첫 번째 프로젝트 자동 선택 (정렬된 데이터 기준)
  useEffect(() => {
    if (isInitialized && viewMode === 'detail' && !selectedProjectId && sortedProjectData.length > 0 && !loading) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('selected', sortedProjectData[0].no);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [isInitialized, viewMode, selectedProjectId, sortedProjectData, loading, pathname, router, searchParams]);

  // 뷰 모드 변경 핸들러
  const handleViewModeChange = useCallback((newMode: ViewMode) => {
    setViewMode(newMode);
    
    // localStorage에 저장
    localStorage.setItem('preferredViewMode', newMode);
    
    // URL 업데이트
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newMode);
    
    if (newMode === 'list' && params.has('selected')) {
      // List View로 전환 시 선택된 프로젝트 제거
      params.delete('selected');
    } else if (newMode === 'detail' && !params.has('selected') && sortedProjectData.length > 0) {
      // Detail View로 전환 시 선택된 프로젝트가 없으면 첫 번째 프로젝트 자동 선택 (정렬된 데이터 기준)
      params.set('selected', sortedProjectData[0].no);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams, sortedProjectData]);

  // 프로젝트 선택 핸들러 (List View에서 사용)
  const handleProjectSelect = useCallback((projectNo: string) => {
    // Detail View로 전환하면서 선택된 프로젝트 설정
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', 'detail');
    params.set('selected', projectNo);
    
    localStorage.setItem('preferredViewMode', 'detail');
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  // 통계 데이터 계산 (원시 데이터 기준)
  const { stats, totalCount } = useMemo(() => {
    if (loading || rawProjectData.length === 0) {
      return {
        stats: { inProgress: 0, completed: 0, review: 0 },
        totalCount: 0
      };
    }
    
    return {
      stats: {
        inProgress: rawProjectData.filter(p => p.status === 'in_progress').length,
        completed: rawProjectData.filter(p => p.status === 'completed').length,
        review: rawProjectData.filter(p => p.status === 'review').length
      },
      totalCount: rawProjectData.length
    };
  }, [rawProjectData, loading]);

  // 프로젝트 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // 실제로는 NewProjectsPage에서 데이터를 가져오므로 여기서는 기본값 설정
      // 통계를 위한 샘플 데이터 생성
      const generateMockData = (): ProjectTableRow[] => {
        const clients = ['A개발', 'B디자인', 'C마케팅', 'D컨설팅', 'E업체', 'F자체', 'A학교'];
        const statuses: Array<'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'> = 
          ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'];
      
        const seededRandom = (seed: number): number => {
          const x = Math.sin(seed) * 10000;
          return x - Math.floor(x);
        };
      
        const baseDate = new Date(2024, 0, 1);
        const dayInterval = 7;
      
        return Array.from({ length: 20 }, (_, i) => {
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
          
          const currentDate = new Date();
          const maxModifyTime = Math.min(currentDate.getTime(), registrationDate.getTime() + 180 * 24 * 60 * 60 * 1000);
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
      };
      
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = generateMockData();
      setRawProjectData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  // 액션 버튼 핸들러들

  const handleExport = useCallback(() => {
    // 엑셀 내보내기 로직
    console.log('Export to Excel');
    alert('엑셀 파일이 다운로드됩니다.');
  }, []);

  const handleCreateProject = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  // 프로젝트 생성 성공 핸들러
  const handleProjectCreateSuccess = useCallback((newProject: ProjectTableRow) => {
    setRawProjectData(prev => [newProject, ...prev]);
    setIsCreateModalOpen(false);
    
    // 성공 알림 (선택적)
    console.log('프로젝트가 성공적으로 생성되었습니다:', newProject.name);
  }, []);

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
      
      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-border-light p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-txt-primary min-w-[3rem] min-h-[2rem]">
                {loading ? (
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  totalCount
                )}
              </div>
              <div className="text-sm text-txt-secondary">총 프로젝트</div>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-border-light p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600 min-w-[3rem] min-h-[2rem]">
                {loading ? (
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stats.inProgress
                )}
              </div>
              <div className="text-sm text-txt-secondary">진행중</div>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Play className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-border-light p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600 min-w-[3rem] min-h-[2rem]">
                {loading ? (
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stats.review
                )}
              </div>
              <div className="text-sm text-txt-secondary">검토</div>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Eye className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-border-light p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600 min-w-[3rem] min-h-[2rem]">
                {loading ? (
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stats.completed
                )}
              </div>
              <div className="text-sm text-txt-secondary">완료</div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 프로젝트 생성 모달 */}
      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleProjectCreateSuccess}
      />
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
            onCreateProject={handleCreateProject}
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