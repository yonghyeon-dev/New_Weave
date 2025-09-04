'use client';

import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { DataPageContainer } from '@/components/layout/PageContainer';
import { AdvancedTable } from '@/components/ui/AdvancedTable';
// LCP 개선을 위해 모달을 지연 로딩으로 처리
const ProjectDetailModal = lazy(() => import('@/components/ui/ProjectDetailModal').then(module => ({ default: module.ProjectDetailModal })));
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
  const supplyStatuses = ['진행률(%)', '진행중', '완료', '진행률(%)'];

  return Array.from({ length: 20 }, (_, i) => { // LCP 개선을 위해 초기 데이터 축소
    const registrationDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const dueDate = new Date(registrationDate.getTime() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000);
    const modifiedDate = new Date(registrationDate.getTime() + Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);

    return {
      id: `project-${i + 1}`,
      no: `WEAVE_${String(i + 1).padStart(3, '0')}`,
      name: `${['A개발', 'B디자인', 'C마케팅', 'D컨설팅', '카페 관리', '피시방 관리', 'A교육 강의'][i % 7]} 프로젝트`,
      registrationDate: registrationDate.toISOString(),
      client: clients[i % clients.length],
      progress: Math.floor(Math.random() * 101),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      supplyStatus: supplyStatuses[i % supplyStatuses.length],
      dueDate: dueDate.toISOString(),
      modifiedDate: modifiedDate.toISOString(),
      // 세부 정보
      contract: Math.random() > 0.5 ? {
        contractorInfo: {
          name: '홍길동',
          position: '팀부'
        },
        reportInfo: {
          type: '첨부'
        },
        estimateInfo: {
          type: '첨부'
        },
        documentIssue: {
          taxInvoice: '세금계산서',
          receipt: '원천/부가세',
          cashReceipt: '현금영수증',
          businessReceipt: '카드영수증'
        },
        other: {
          date: 'YYYY-MM-DD'
        }
      } : undefined,
      billing: Math.random() > 0.3 ? {
        totalAmount: Math.floor(Math.random() * 10000000) + 1000000,
        paidAmount: Math.floor(Math.random() * 5000000),
        remainingAmount: Math.floor(Math.random() * 3000000)
      } : undefined,
      documents: Math.random() > 0.4 ? [
        {
          id: '1',
          type: 'contract',
          name: '프로젝트 계약서.pdf',
          createdAt: new Date().toISOString(),
          status: 'completed'
        },
        {
          id: '2',
          type: 'estimate',
          name: '견적서.pdf',
          createdAt: new Date().toISOString(),
          status: 'sent'
        }
      ] : undefined
    };
  });
};

export default function NewProjectsPage() {
  const router = useRouter();
  const [mockData, setMockData] = useState<ProjectTableRow[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectTableRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // LCP 개선을 위한 메모화된 통계 계산
  const stats = useMemo(() => {
    if (loading) return { inProgress: 0, completed: 0, avgProgress: 0 };
    return {
      inProgress: filteredData.filter(p => p.status === 'in_progress').length,
      completed: filteredData.filter(p => p.status === 'completed').length,
      avgProgress: Math.round(filteredData.reduce((acc, p) => acc + p.progress, 0) / filteredData.length || 0)
    };
  }, [filteredData, loading]);

  const {
    data: filteredData,
    paginatedData,
    filteredCount,
    totalCount,
    config,
    updateConfig,
    updateData,
    resetColumnConfig,
    resetFilters
  } = useProjectTable(mockData);

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
  }, [updateData]);

  // 행 클릭 핸들러
  const handleRowClick = (project: ProjectTableRow) => {
    setSelectedProject(project);
    setIsModalOpen(true);
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
    console.log('Export to Excel:', filteredData);
    alert('엑셀 파일이 다운로드됩니다.');
  };

  return (
    <AppLayout>
      <DataPageContainer>
        {/* 헤더 */}
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

        {/* 고급 테이블 */}
        <AdvancedTable
          data={filteredData}
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

        {/* 프로젝트 상세 모달 - LCP 개선을 위해 Suspense 적용 */}
        <Suspense fallback={<div>모달 로딩 중...</div>}>
          <ProjectDetailModal
            project={selectedProject}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </Suspense>
      </DataPageContainer>
    </AppLayout>
  );
}