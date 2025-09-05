'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';
import type { ProjectTableRow } from '@/lib/types/project-table.types';
import { Building, Calendar } from 'lucide-react';

export interface ProjectListItemProps {
  project: ProjectTableRow;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * 프로젝트 목록 아이템 컴포넌트
 * 
 * 특징:
 * - 간소화된 정보만 표시 (No, 프로젝트명, 클라이언트)
 * - 선택 상태에 따른 시각적 피드백
 * - 호버 효과 및 접근성 지원
 * - 상태에 따른 색상 구분
 */
export function ProjectListItem({ 
  project, 
  isSelected, 
  onClick 
}: ProjectListItemProps) {
  // 상태에 따른 스타일 클래스
  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-gray-100 text-gray-700 border-gray-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      on_hold: 'bg-orange-100 text-orange-700 border-orange-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.planning;
  };

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
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg border transition-all duration-200
        hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-weave-primary focus:ring-offset-1
        ${isSelected 
          ? 'bg-weave-primary-light border-weave-primary shadow-sm ring-1 ring-weave-primary' 
          : 'bg-white border-border-light hover:border-border-dark hover:bg-bg-secondary'
        }
      `}
      aria-label={`${project.name} 프로젝트 선택`}
      aria-pressed={isSelected}
    >
      <div className="space-y-2">
        {/* 프로젝트 번호 */}
        <div className="flex items-center justify-between">
          <Typography 
            variant="body2" 
            className={`font-mono text-xs px-2 py-1 rounded ${
              isSelected ? 'bg-weave-primary text-white' : 'bg-bg-secondary text-txt-tertiary'
            }`}
          >
            {project.no}
          </Typography>
          
          {/* 상태 배지 */}
          <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(project.status)}`}>
            {getStatusLabel(project.status)}
          </span>
        </div>

        {/* 프로젝트명 */}
        <div>
          <Typography 
            variant="body1" 
            className={`font-medium leading-tight ${
              isSelected ? 'text-weave-primary' : 'text-txt-primary'
            }`}
            title={project.name}
          >
            {project.name.length > 30 ? `${project.name.substring(0, 30)}...` : project.name}
          </Typography>
        </div>

        {/* 클라이언트 정보 */}
        <div className="flex items-center gap-2">
          <Building className={`w-3 h-3 ${isSelected ? 'text-weave-primary' : 'text-txt-tertiary'}`} />
          <Typography 
            variant="body2" 
            className={isSelected ? 'text-weave-primary' : 'text-txt-secondary'}
          >
            {project.client}
          </Typography>
        </div>

        {/* 추가 정보 (진행률) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className={`w-3 h-3 ${isSelected ? 'text-weave-primary' : 'text-txt-tertiary'}`} />
            <Typography 
              variant="body2" 
              className={`text-xs ${isSelected ? 'text-weave-primary' : 'text-txt-tertiary'}`}
            >
              {new Date(project.registrationDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
            </Typography>
          </div>
          
          {/* 진행률 */}
          <Typography 
            variant="body2" 
            className={`text-xs font-medium ${
              isSelected ? 'text-weave-primary' : 'text-txt-secondary'
            }`}
          >
            {project.progress}%
          </Typography>
        </div>

        {/* 진행률 바 */}
        <div className="mt-2">
          <div className={`h-1 rounded-full overflow-hidden ${
            isSelected ? 'bg-weave-primary/20' : 'bg-bg-tertiary'
          }`}>
            <div 
              className={`h-full transition-all duration-300 ${
                isSelected ? 'bg-weave-primary' : 'bg-weave-primary/60'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}