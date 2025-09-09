/**
 * 프로젝트 개요 데이터 관리 훅
 * 리스트뷰 칼럼 설정과 연동하여 일관성 있는 개요 데이터 제공
 */

import { useMemo } from 'react';
import type { ProjectTableRow } from '@/lib/types/project-table.types';
import { 
  PROJECT_COLUMNS, 
  OVERVIEW_COLUMNS, 
  getColumnsBySection, 
  createOverviewData,
  formatColumnValue,
  type EnhancedProjectTableColumn 
} from '@/lib/config/project-columns';

export interface OverviewDataItem {
  column: EnhancedProjectTableColumn;
  value: any;
  formattedValue: string;
}

export interface OverviewSectionData {
  basic: OverviewDataItem[];
  schedule: OverviewDataItem[];
  progress: OverviewDataItem[];
  metadata: OverviewDataItem[];
}

/**
 * 프로젝트 개요 데이터 관리 훅
 */
export function useProjectOverview(project: ProjectTableRow | null) {
  // 개요용 칼럼 설정
  const overviewColumns = useMemo(() => OVERVIEW_COLUMNS, []);

  // 전체 개요 데이터
  const overviewData = useMemo(() => {
    if (!project) return [];
    return createOverviewData(project, overviewColumns);
  }, [project, overviewColumns]);

  // 섹션별 데이터 분류
  const sectionData = useMemo((): OverviewSectionData => {
    if (!project) {
      return {
        basic: [],
        schedule: [],
        progress: [],
        metadata: []
      };
    }

    return {
      basic: createOverviewData(project, getColumnsBySection('basic')),
      schedule: createOverviewData(project, getColumnsBySection('schedule')),
      progress: createOverviewData(project, getColumnsBySection('progress')),
      metadata: createOverviewData(project, getColumnsBySection('metadata'))
    };
  }, [project]);

  // 핵심 지표 (progress 섹션의 card 타입 항목들)
  const keyMetrics = useMemo(() => {
    return sectionData.progress.filter(item => 
      item.column.overviewConfig?.displayFormat === 'card'
    );
  }, [sectionData.progress]);

  // 차트 표시 항목 (progress 섹션의 chart 타입 항목들)
  const chartMetrics = useMemo(() => {
    return sectionData.progress.filter(item => 
      item.column.overviewConfig?.displayFormat === 'chart'
    );
  }, [sectionData.progress]);

  // 상세 정보 항목 (detail 타입 항목들)
  const detailInfo = useMemo(() => {
    return [
      ...sectionData.basic,
      ...sectionData.schedule
    ].filter(item => 
      item.column.overviewConfig?.displayFormat === 'detail'
    );
  }, [sectionData.basic, sectionData.schedule]);

  // 특정 칼럼 값 조회 함수
  const getColumnValue = useMemo(() => {
    return (columnId: string) => {
      if (!project) return null;
      
      const column = PROJECT_COLUMNS.find(col => col.id === columnId);
      if (!column) return null;

      const value = project[column.key];
      return {
        raw: value,
        formatted: formatColumnValue(value, column.type),
        column
      };
    };
  }, [project]);

  // 진행률 관련 계산
  const progressStats = useMemo(() => {
    if (!project) {
      return {
        progress: 0,
        paymentProgress: 0,
        progressDiff: 0
      };
    }

    const progress = project.progress || 0;
    const paymentProgress = project.paymentProgress || 0;
    const progressDiff = progress - paymentProgress;

    return {
      progress,
      paymentProgress,
      progressDiff
    };
  }, [project]);

  // 일정 관련 계산
  const scheduleStats = useMemo(() => {
    if (!project) {
      return {
        daysFromRegistration: 0,
        daysToDue: 0,
        isOverdue: false,
        daysSinceModified: 0
      };
    }

    const now = new Date();
    const registrationDate = new Date(project.registrationDate);
    const dueDate = new Date(project.dueDate);
    const modifiedDate = new Date(project.modifiedDate);

    const daysFromRegistration = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysToDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysToDue < 0;
    const daysSinceModified = Math.floor((now.getTime() - modifiedDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      daysFromRegistration,
      daysToDue,
      isOverdue,
      daysSinceModified
    };
  }, [project]);

  return {
    // 원본 데이터
    project,
    
    // 칼럼 설정
    columnConfig: PROJECT_COLUMNS,
    overviewColumns,
    
    // 개요 데이터
    overviewData,
    sectionData,
    
    // 섹션별 분류
    keyMetrics,
    chartMetrics,
    detailInfo,
    
    // 유틸리티 함수
    getColumnValue,
    
    // 계산된 통계
    progressStats,
    scheduleStats
  };
}