/**
 * 향상된 프로젝트 개요 컴포넌트
 * 중앙화된 칼럼 설정 시스템과 연동하여 일관된 정보 표시
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { ProjectTableRow, DocumentStatus } from '@/lib/types/project-table.types';
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
  File,
  Save,
  Banknote
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

  // 프로젝트 상세 정보 상태
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'advance' | 'advance_final' | 'advance_interim_final'>('advance');
  const [projectContent, setProjectContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // 총 금액 우선순위 로직 (1.계약서, 2.견적서, 3.직접입력)
  const getTotalAmountWithPriority = () => {
    // 계약서에 금액이 있는 경우 우선 표시
    if (project.contract?.totalAmount) {
      return {
        amount: project.contract.totalAmount.toLocaleString(),
        source: '계약서'
      };
    }
    // 견적서에 금액이 있는 경우
    if (project.estimate?.totalAmount) {
      return {
        amount: project.estimate.totalAmount.toLocaleString(),
        source: '견적서'
      };
    }
    // 직접 입력된 금액
    if (totalAmount) {
      return {
        amount: totalAmount,
        source: '직접입력'
      };
    }
    return {
      amount: '미설정',
      source: '없음'
    };
  };

  // 내용 통합 로직 (견적서/계약서 내용 통합)
  const getIntegratedContent = () => {
    const contents = [];
    if (project.contract?.content) {
      contents.push(`[계약서] ${project.contract.content}`);
    }
    if (project.estimate?.content) {
      contents.push(`[견적서] ${project.estimate.content}`);
    }
    if (projectContent) {
      contents.push(`[추가내용] ${projectContent}`);
    }
    return contents.length > 0 ? contents.join('\n\n') : '내용 없음';
  };

  const handleSave = () => {
    // 저장 로직 (향후 구현)
    console.log('저장:', { totalAmount, paymentMethod, projectContent });
    setIsEditing(false);
  };

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

  // 상태별 색상 클래스 반환 함수
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'in_progress':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'review':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'on_hold':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
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
              const isStatusField = item.column.id === 'status';
              
              return (
                <div key={item.column.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-txt-tertiary" />
                    <span className="text-txt-secondary">{item.column.label}</span>
                  </div>
                  {isStatusField ? (
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {item.formattedValue}
                      </div>
                    </div>
                  ) : (
                    <span className="text-txt-primary font-medium">{item.formattedValue}</span>
                  )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 계약서 */}
            <DocumentStatusCard
              type="contract"
              label="계약서"
              documentStatus={project.documentStatus?.contract}
            />

            {/* 청구서 */}
            <DocumentStatusCard
              type="invoice"
              label="청구서"
              documentStatus={project.documentStatus?.invoice}
            />

            {/* 보고서 */}
            <DocumentStatusCard
              type="report"
              label="보고서"
              documentStatus={project.documentStatus?.report}
            />

            {/* 견적서 */}
            <DocumentStatusCard
              type="estimate"
              label="견적서"
              documentStatus={project.documentStatus?.estimate}
            />

            {/* 기타문서 */}
            <DocumentStatusCard
              type="etc"
              label="기타문서"
              documentStatus={project.documentStatus?.etc}
            />
          </div>
        </CardContent>
      </Card>

      {/* 프로젝트 상세 정보 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              프로젝트 상세 정보
            </CardTitle>
            <Button
              variant={isEditing ? "primary" : "outline"}
              size="sm"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  저장
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  편집
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 총 금액 섹션 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-txt-secondary font-medium">
                총 금액
              </Typography>
              {!isEditing && (
                <span className="text-xs text-txt-tertiary">
                  출처: {getTotalAmountWithPriority().source}
                </span>
              )}
            </div>
            {isEditing ? (
              <Input
                type="text"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="금액을 입력하세요 (예: 1,000,000)"
                className="w-full"
              />
            ) : (
              <div className="text-lg font-semibold text-txt-primary">
                {getTotalAmountWithPriority().amount} 원
              </div>
            )}
          </div>

          {/* 정산방식 섹션 */}
          <div className="space-y-3">
            <Typography variant="body2" className="text-txt-secondary font-medium">
              정산방식
            </Typography>
            {isEditing ? (
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="advance"
                    checked={paymentMethod === 'advance'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4 text-weave-primary"
                  />
                  <span className="text-sm text-txt-primary">선금</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="advance_final"
                    checked={paymentMethod === 'advance_final'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4 text-weave-primary"
                  />
                  <span className="text-sm text-txt-primary">선금 + 잔금</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="advance_interim_final"
                    checked={paymentMethod === 'advance_interim_final'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4 text-weave-primary"
                  />
                  <span className="text-sm text-txt-primary">선금 + 중도금 + 잔금</span>
                </label>
              </div>
            ) : (
              <div className="text-txt-primary">
                {paymentMethod === 'advance' && '선금'}
                {paymentMethod === 'advance_final' && '선금 + 잔금'}
                {paymentMethod === 'advance_interim_final' && '선금 + 중도금 + 잔금'}
              </div>
            )}
          </div>

          {/* 내용 섹션 */}
          <div className="space-y-3">
            <Typography variant="body2" className="text-txt-secondary font-medium">
              프로젝트 내용
            </Typography>
            {isEditing ? (
              <textarea
                value={projectContent}
                onChange={(e) => setProjectContent(e.target.value)}
                placeholder="추가 내용을 입력하세요..."
                className="w-full min-h-[100px] p-3 border border-border-light rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
              />
            ) : (
              <div className="bg-bg-secondary p-3 rounded-lg">
                <pre className="text-sm text-txt-primary whitespace-pre-wrap font-sans">
                  {getIntegratedContent()}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 문서 상태 카드 컴포넌트
interface DocumentStatusCardProps {
  type: 'contract' | 'invoice' | 'report' | 'estimate' | 'etc';
  label: string;
  documentStatus?: DocumentStatus;
}

function DocumentStatusCard({ type, label, documentStatus }: DocumentStatusCardProps) {
  // 상태별 아이콘과 색상 결정
  const getStatusDisplay = () => {
    if (!documentStatus || !documentStatus.exists) {
      return {
        icon: <FileX className="w-4 h-4 text-red-500" />,
        text: '미보유',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50 border-red-100'
      };
    }

    switch (documentStatus.status) {
      case 'completed':
      case 'approved':
        return {
          icon: <FileCheck className="w-4 h-4 text-green-500" />,
          text: '완료',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50 border-green-100'
        };
      case 'sent':
        return {
          icon: <FileText className="w-4 h-4 text-blue-500" />,
          text: '발송',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-100'
        };
      case 'draft':
        return {
          icon: <Edit className="w-4 h-4 text-yellow-500" />,
          text: '작성중',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-100'
        };
      default:
        return {
          icon: <File className="w-4 h-4 text-gray-500" />,
          text: '준비중',
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-100'
        };
    }
  };

  const statusDisplay = getStatusDisplay();
  
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${statusDisplay.bgColor}`}>
      <div className="flex items-center gap-2 mb-2">
        {statusDisplay.icon}
        <span className="text-sm font-medium text-txt-secondary">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-xs font-medium ${statusDisplay.textColor}`}>
          {statusDisplay.text}
        </span>
        {documentStatus?.count && documentStatus.count > 1 && (
          <span className={`text-xs ${statusDisplay.textColor} ml-1`}>
            ({documentStatus.count})
          </span>
        )}
      </div>
      {documentStatus?.lastUpdated && (
        <span className="text-xs text-txt-tertiary mt-1">
          {new Date(documentStatus.lastUpdated).toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
          })}
        </span>
      )}
    </div>
  );
}