'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectFullPageDetail } from '@/components/projects/ProjectFullPageDetail';
import type { ProjectTableRow } from '@/lib/types/project-table.types';
import { UNIFIED_PROJECTS } from '@/lib/data/unified-mock-data';
import { dataMapper } from '@/lib/utils/data-mapper';

export interface ProjectDetailPageProps {
  params: {
    projectId: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

/**
 * 개별 프로젝트 상세 페이지 (전체 페이지)
 * 
 * 라우트: /projects/[projectId]
 * 예시: /projects/WEAVE_001
 * 
 * 특징:
 * - 전체 페이지 레이아웃으로 프로젝트 상세 정보 표시
 * - URL의 projectId를 기반으로 해당 프로젝트 자동 선택
 * - 목록으로 돌아가기 버튼
 * - 좌우 네비게이션으로 다른 프로젝트 탐색
 * - 필터 및 검색 기능
 */
export default function ProjectDetailPage({ 
  params, 
  searchParams 
}: ProjectDetailPageProps) {
  const router = useRouter();
  const [allProjects, setAllProjects] = useState<ProjectTableRow[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectTableRow | null>(null);
  const [loading, setLoading] = useState(true);

  // 통합 데이터 사용 (기존 더미 데이터 생성 함수 대체)
  const generateMockData = (): ProjectTableRow[] => {
    // 통합 프로젝트 데이터를 기존 형식으로 변환
    return dataMapper.unifiedToProjects(UNIFIED_PROJECTS);
  };

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = generateMockData();
      setAllProjects(data);
      
      // 현재 projectId에 해당하는 프로젝트 찾기
      const currentProject = data.find(p => p.no === params.projectId);
      setSelectedProject(currentProject || null);
      setLoading(false);
    };

    loadData();
  }, [params.projectId]);

  // 프로젝트 변경 핸들러
  const handleProjectChange = (projectNo: string) => {
    router.push(`/projects/${projectNo}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-txt-secondary">로딩 중...</div>
      </div>
    );
  }

  return (
    <ProjectFullPageDetail
      project={selectedProject}
      allProjects={allProjects}
      onProjectChange={handleProjectChange}
    />
  );
}