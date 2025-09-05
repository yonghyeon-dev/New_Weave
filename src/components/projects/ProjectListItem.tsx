'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';
import StatusBadge from '@/components/ui/StatusBadge';
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
  // 프로젝트 상태를 StatusBadge의 ProjectStatus로 직접 매핑
  const mapProjectStatus = (status: string): 'planning' | 'review' | 'in_progress' | 'on_hold' | 'cancelled' | 'completed' => {
    // 프로젝트 상태 타입이 이미 일치하므로 직접 반환
    const validStatuses = ['planning', 'review', 'in_progress', 'on_hold', 'cancelled', 'completed'] as const;
    return validStatuses.includes(status as any) ? (status as any) : 'planning';
  };

  // 디버깅을 위한 클릭 핸들러
  const handleClick = () => {
    console.log('🖱️ ProjectListItem clicked:', {
      projectNo: project.no,
      projectId: project.id,
      projectName: project.name,
      isCurrentlySelected: isSelected
    });
    onClick();
  };

  return (
    <button
      onClick={handleClick}
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
          
          {/* 상태 배지 - 프로젝트 전용 StatusBadge 컴포넌트 사용 */}
          <StatusBadge 
            status={mapProjectStatus(project.status)}
            type="project"
            size="sm"
            showIcon={false}
          />
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