'use client';

import React from 'react';
import { ProjectMasterDetailPage } from '@/components/projects/ProjectMasterDetailPage';

export interface ProjectDetailPageProps {
  params: {
    projectId: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

/**
 * 개별 프로젝트 상세 페이지
 * 
 * 라우트: /projects/[projectId]
 * 예시: /projects/WEAVE_001
 * 
 * 특징:
 * - 마스터-디테일 레이아웃으로 프로젝트 상세 정보 표시
 * - URL의 projectId를 기반으로 해당 프로젝트 자동 선택
 * - 목록에서 다른 프로젝트 탐색 가능
 * - 브레드크럼으로 목록 페이지 복귀 가능
 */
export default function ProjectDetailPage({ 
  params, 
  searchParams 
}: ProjectDetailPageProps) {
  return (
    <ProjectMasterDetailPage 
      initialProjectId={params.projectId}
    />
  );
}