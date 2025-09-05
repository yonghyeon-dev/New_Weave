'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import { ProjectListItem } from './ProjectListItem';
import type { ProjectTableRow } from '@/lib/types/project-table.types';
import { FileX, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProjectListProps {
  projects: ProjectTableRow[];
  selectedProject: ProjectTableRow | null;
  onProjectSelect: (project: ProjectTableRow) => void;
  loading?: boolean;
  searchQuery?: string;
  // 페이지네이션 props 추가
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
}

/**
 * 프로젝트 목록 컴포넌트
 * 
 * 특징:
 * - 간소화된 카드 형태 표시 (No, 프로젝트명, 클라이언트)
 * - 가상화를 통한 성능 최적화
 * - 선택 상태 시각화
 * - 로딩 상태 지원
 * - 빈 상태 처리
 */
export function ProjectList({
  projects,
  selectedProject,
  onProjectSelect,
  loading = false,
  searchQuery = '',
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange
}: ProjectListProps) {
  // 로딩 상태
  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-bg-secondary rounded-lg p-3 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 빈 상태
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
        <FileX className="w-12 h-12 text-txt-tertiary mb-4" />
        <Typography variant="h4" className="text-txt-secondary mb-2">
          {searchQuery ? '검색 결과 없음' : '프로젝트가 없습니다'}
        </Typography>
        <Typography variant="body2" className="text-txt-tertiary">
          {searchQuery 
            ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
            : '새 프로젝트를 생성하여 시작하세요.'
          }
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-2">
        {projects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            isSelected={selectedProject?.id === project.id}
            onClick={() => onProjectSelect(project)}
          />
        ))}
      </div>
      
      {/* 페이지네이션 및 목록 하단 정보 */}
      <div className="mt-4 pt-3 border-t border-border-light">
        {totalPages > 1 && onPageChange ? (
          <div className="flex flex-col items-center space-y-4">
            {/* 페이지네이션 컨트롤 */}
            <div className="flex items-center justify-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </Button>
              
              {/* 페이지 번호 */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      className="min-w-[32px] px-2"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* 페이지 정보 */}
            <Typography variant="body2" className="text-txt-tertiary text-center">
              {projects.length}개 표시 중 (전체 {totalCount}개, {currentPage}/{totalPages} 페이지)
            </Typography>
          </div>
        ) : (
          <Typography variant="body2" className="text-txt-tertiary text-center">
            {projects.length}개 프로젝트 표시됨
          </Typography>
        )}
      </div>
    </div>
  );
}