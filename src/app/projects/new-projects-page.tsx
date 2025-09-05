'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { DataPageContainer } from '@/components/layout/PageContainer';
import { AdvancedTable } from '@/components/ui/AdvancedTable';
import { ProjectDetailModal } from '@/components/ui/ProjectDetailModal';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { useProjectTable } from '@/lib/hooks/useProjectTable';
import type { ProjectTableRow } from '@/lib/types/project-table.types';
import { 
  Plus, 
  Briefcase, 
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

// 더미 데이터 - 실제 환경에서는 API에서 가져옴
const generateMockData = (): ProjectTableRow[] => {
  const clients = ['A개발', 'B디자인', 'C마케팅', 'D컨설팅', 'E업체', 'F자체', 'A학교'];
  const statuses: Array<'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'> = 
    ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'];

  // 하이드레이션 에러 방지를 위한 시드 기반 랜덤 함수
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 데이터 무결성을 위한 기준 날짜 설정 (2024년 1월 1일)
  const baseDate = new Date(2024, 0, 1);
  const dayInterval = 7; // 프로젝트마다 약 1주일 간격

  return Array.from({ length: 20 }, (_, i) => { // LCP 개선을 위해 초기 데이터 축소
    // 시드 생성 (인덱스 기반)
    const seed1 = i * 1234 + 5678;
    const seed2 = i * 2345 + 6789;
    const seed3 = i * 3456 + 7890;
    const seed4 = i * 4567 + 8901;
    const seed5 = i * 5678 + 9012;

    // No 순서에 맞는 순차적 등록일 생성 (논리적 일관성 확보)
    const registrationDate = new Date(
      baseDate.getTime() + 
      (i * dayInterval * 24 * 60 * 60 * 1000) + // 기본 간격
      (Math.floor(seededRandom(seed1) * 3) * 24 * 60 * 60 * 1000) // 0-2일 랜덤 오프셋
    );
    const dueDate = new Date(registrationDate.getTime() + Math.floor(seededRandom(seed2) * 90) * 24 * 60 * 60 * 1000);
    
    // 수정일: 등록일 이후부터 현재까지의 랜덤한 시점 (논리적 일관성 확보)
    const currentDate = new Date();
    const maxModifyTime = Math.min(currentDate.getTime(), registrationDate.getTime() + 180 * 24 * 60 * 60 * 1000);
    const modifyTimeRange = maxModifyTime - registrationDate.getTime();
    const modifiedDate = new Date(registrationDate.getTime() + Math.floor(seededRandom(seed3) * modifyTimeRange));

    // 프로젝트 진행률에 따른 현실적인 수금현황 계산
    const progress = Math.floor(seededRandom(seed4) * 101);
    let paymentProgress = 0;
    
    // 프로젝트 진행률에 따른 수금현황 로직
    if (progress >= 80) {
      // 거의 완료된 프로젝트: 80-100% 수금
      paymentProgress = Math.floor(80 + seededRandom(seed5) * 21);
    } else if (progress >= 50) {
      // 중간 단계 프로젝트: 30-80% 수금 (계약금 + 중도금 일부)
      paymentProgress = Math.floor(30 + seededRandom(seed5) * 51);
    } else if (progress >= 20) {
      // 초기 단계 프로젝트: 10-40% 수금 (계약금 위주)
      paymentProgress = Math.floor(10 + seededRandom(seed5) * 31);
    } else {
      // 계획/초기 프로젝트: 0-20% 수금
      paymentProgress = Math.floor(seededRandom(seed5) * 21);
    }
    
    // 완료된 프로젝트는 수금도 높은 확률로 완료
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
      // 세부 정보 - 지연 로딩을 위한 플래그만 저장
      hasContract: seededRandom(seed1 + 1000) > 0.5,
      hasBilling: seededRandom(seed2 + 1000) > 0.3,
      hasDocuments: seededRandom(seed3 + 1000) > 0.4
    };
  });
};

interface NewProjectsPageProps {
  hideHeader?: boolean;
  onProjectClick?: (projectNo: string) => void;
}

export default function NewProjectsPage({ 
  hideHeader = false,
  onProjectClick
}: NewProjectsPageProps = {}) {
  const router = useRouter();
  const [mockData, setMockData] = useState<ProjectTableRow[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectTableRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    data: tableData,
    paginatedData,
    filteredCount,
    totalCount,
    config,
    updateConfig,
    updateData,
    resetColumnConfig,
    resetFilters
  } = useProjectTable(mockData);

  // LCP 개선을 위한 메모화된 통계 계산
  const stats = useMemo(() => {
    if (loading) return { inProgress: 0, completed: 0, avgProgress: 0 };
    return {
      inProgress: tableData.filter(p => p.status === 'in_progress').length,
      completed: tableData.filter(p => p.status === 'completed').length,
      avgProgress: Math.round(tableData.reduce((acc, p) => acc + p.progress, 0) / tableData.length || 0)
    };
  }, [tableData, loading]);

  // 초기 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 300)); // CLS 방지를 위해 로딩 시간 단축
      const data = generateMockData();
      setMockData(data);
      updateData(data);
      setLoading(false);
    };

    loadData();
  }, []); // 컴포넌트 마운트 시에만 실행

  // 행 클릭 핸들러 - 개별 프로젝트 상세 페이지로 이동 또는 커스텀 핸들러 실행
  const handleRowClick = (project: ProjectTableRow) => {
    if (onProjectClick) {
      onProjectClick(project.no);
    } else {
      router.push(`/projects/${project.no}`);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    const newData = generateMockData();
    setMockData(newData);
    updateData(newData);
  };

  // 엑셀 내보내기 (더미 구현)
  const handleExport = () => {
    console.log('Export to Excel:', tableData);
    alert('엑셀 파일이 다운로드됩니다.');
  };

  const renderContent = () => (
    <>
      {/* 헤더 */}
      {!hideHeader && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
                <Briefcase className="w-6 h-6 text-weave-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">
                  프로젝트 관리
                </Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  {totalCount}개 프로젝트 중 {filteredCount}개 표시
                </Typography>
              </div>
            </div>
            
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
                onClick={() => router.push('/projects/new')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                새 프로젝트
              </Button>
            </div>
          </div>

          {/* 요약 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                  <div className="text-2xl font-bold text-green-600 min-w-[3rem] min-h-[2rem]">
                    {loading ? (
                      <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      stats.inProgress
                    )}
                  </div>
                  <div className="text-sm text-txt-secondary">진행중</div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-border-light p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600 min-w-[3rem] min-h-[2rem]">
                    {loading ? (
                      <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      stats.completed
                    )}
                  </div>
                  <div className="text-sm text-txt-secondary">완료</div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-blue-500" />
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
                      `${stats.avgProgress}%`
                    )}
                  </div>
                  <div className="text-sm text-txt-secondary">평균 진행률</div>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Upload className="w-5 h-5 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 고급 테이블 */}
        <AdvancedTable
          data={tableData}
          config={config}
          onConfigChange={updateConfig}
          onRowClick={handleRowClick}
          loading={loading}
        />

        {/* 디버그 패널 (개발 환경에서만) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <Typography variant="body2" className="mb-2 text-txt-secondary">
              개발 도구
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outline"
size="sm"
                onClick={resetColumnConfig}
              >
                컬럼 설정 초기화
              </Button>
              <Button
                variant="outline"
size="sm"
                onClick={resetFilters}
              >
                필터 초기화
              </Button>
            </div>
          </div>
        )}

      {/* 프로젝트 상세 모달 */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );

  // hideHeader가 true면 AppLayout과 DataPageContainer 없이 반환
  if (hideHeader) {
    return renderContent();
  }

  // 기본적으로는 AppLayout과 DataPageContainer 포함
  return (
    <AppLayout>
      <DataPageContainer>
        {renderContent()}
      </DataPageContainer>
    </AppLayout>
  );
}