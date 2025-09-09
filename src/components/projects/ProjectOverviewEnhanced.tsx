/**
 * 향상된 프로젝트 개요 컴포넌트
 * 중앙화된 칼럼 설정 시스템과 연동하여 일관된 정보 표시
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import type { ProjectTableRow } from '@/lib/types/project-table.types';
import { useProjectOverview } from '@/lib/hooks/useProjectOverview';
import { 
  Hash,
  FileText, 
  Building, 
  Calendar, 
  Clock, 
  Edit,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Timer,
  FileCheck,
  FileX,
  File
} from 'lucide-react';

export interface ProjectOverviewEnhancedProps {
  project: ProjectTableRow;
}

/**
 * 향상된 프로젝트 개요 컴포넌트
 */
export function ProjectOverviewEnhanced({ project }: ProjectOverviewEnhancedProps) {
  const {
    sectionData,
    keyMetrics,
    chartMetrics,
    detailInfo,
    progressStats,
    scheduleStats,
    getColumnValue
  } = useProjectOverview(project);

  // 아이콘 매핑
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Hash,
    FileText,
    Building,
    Calendar,
    Clock,
    Edit,
    TrendingUp,
    DollarSign,
    Activity
  };

  return (
    <div className="space-y-6">
      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {keyMetrics.map((metric) => {
          const IconComponent = iconMap[metric.column.overviewConfig?.icon || 'Activity'];
          
          return (
            <Card key={metric.column.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-txt-primary">
                      {metric.formattedValue}
                    </div>
                    <div className="text-sm text-txt-secondary">
                      {metric.column.label}
                    </div>
                  </div>
                  <div className="p-2 bg-weave-primary-light rounded-lg">
                    <IconComponent className="w-5 h-5 text-weave-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 진행률 차트 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartMetrics.map((metric) => {
          const IconComponent = iconMap[metric.column.overviewConfig?.icon || 'TrendingUp'];
          const progressValue = typeof metric.value === 'number' ? metric.value : 0;
          
          return (
            <Card key={metric.column.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {metric.column.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-txt-secondary mb-2">현재 진행률</div>
                  <div className="h-2 bg-bg-secondary rounded-full overflow-hidden mb-1.5">
                    <div 
                      className="h-full bg-gradient-to-r from-weave-primary to-weave-primary-dark transition-all duration-300"
                      style={{ width: `${Math.min(progressValue, 100)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-txt-primary font-medium">
                      {metric.formattedValue}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 기본 정보 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">프로젝트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sectionData.basic.map((item) => {
              const IconComponent = iconMap[item.column.overviewConfig?.icon || 'FileText'];
              
              return (
                <div key={item.column.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-txt-tertiary" />
                    <span className="text-txt-secondary">{item.column.label}</span>
                  </div>
                  <span className="text-txt-primary font-medium">{item.formattedValue}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">일정 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sectionData.schedule.map((item) => {
              const IconComponent = iconMap[item.column.overviewConfig?.icon || 'Calendar'];
              
              return (
                <div key={item.column.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-txt-tertiary" />
                    <span className="text-txt-secondary">{item.column.label}</span>
                  </div>
                  <span className="text-txt-primary">{item.formattedValue}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 일정 및 진행률 분석 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">프로젝트 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 일정 현황 */}
            <div className="text-center p-4 bg-bg-secondary rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {scheduleStats.isOverdue ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : scheduleStats.daysToDue <= 7 ? (
                  <Timer className="w-5 h-5 text-orange-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="text-lg font-semibold text-txt-primary">
                {scheduleStats.isOverdue 
                  ? `${Math.abs(scheduleStats.daysToDue)}일 지연`
                  : `${scheduleStats.daysToDue}일 남음`
                }
              </div>
              <div className="text-sm text-txt-secondary">마감일까지</div>
            </div>

            {/* 진행률 차이 */}
            <div className="text-center p-4 bg-bg-secondary rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {progressStats.progressDiff > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : progressStats.progressDiff < 0 ? (
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="text-lg font-semibold text-txt-primary">
                {progressStats.progressDiff > 0 && '+'}
                {progressStats.progressDiff}%
              </div>
              <div className="text-sm text-txt-secondary">진행률 vs 수급률</div>
            </div>

            {/* 프로젝트 기간 */}
            <div className="text-center p-4 bg-bg-secondary rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-lg font-semibold text-txt-primary">
                {scheduleStats.daysFromRegistration}일
              </div>
              <div className="text-sm text-txt-secondary">진행 기간</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프로젝트 자료 현황 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">프로젝트 자료 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
              <div className="flex items-center gap-2">
                {project.hasContract ? (
                  <FileCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <FileX className="w-4 h-4 text-red-500" />
                )}
                <span className="text-txt-secondary">계약서</span>
              </div>
              <span className={`text-sm font-medium ${project.hasContract ? 'text-green-600' : 'text-red-600'}`}>
                {project.hasContract ? '보유' : '미보유'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
              <div className="flex items-center gap-2">
                {project.hasBilling ? (
                  <FileCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <FileX className="w-4 h-4 text-red-500" />
                )}
                <span className="text-txt-secondary">청구서</span>
              </div>
              <span className={`text-sm font-medium ${project.hasBilling ? 'text-green-600' : 'text-red-600'}`}>
                {project.hasBilling ? '발행완료' : '미발행'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
              <div className="flex items-center gap-2">
                {project.hasDocuments ? (
                  <FileCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <File className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-txt-secondary">문서</span>
              </div>
              <span className={`text-sm font-medium ${project.hasDocuments ? 'text-green-600' : 'text-gray-600'}`}>
                {project.hasDocuments ? '보유' : '없음'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}