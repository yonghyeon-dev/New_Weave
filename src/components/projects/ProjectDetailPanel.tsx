'use client';

import React, { useState } from 'react';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import ProjectNavigation from '@/components/ui/ProjectNavigation';
import SimpleProjectNavigation from '@/components/ui/SimpleProjectNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProjectTableControls } from '@/components/ui/ProjectTableControls';
import { ProjectOverviewEnhanced } from './ProjectOverviewEnhanced';
import type { 
  ProjectTableRow,
  TableFilterState 
} from '@/lib/types/project-table.types';
import type { DetailTabType } from '@/lib/hooks/useProjectMasterDetail';
import { 
  FileText, 
  FilePlus, 
  Calculator, 
  Edit,
  Building,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  ArrowLeft
} from 'lucide-react';

export interface ProjectDetailPanelProps {
  project: ProjectTableRow | null;
  activeTab: DetailTabType;
  onTabChange: (tab: DetailTabType) => void;
  onEdit?: (project: ProjectTableRow) => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  canNavigatePrev?: boolean;
  canNavigateNext?: boolean;
  onBackToList?: () => void; // 목록으로 돌아가기 핸들러
  viewMode?: 'detail' | 'fullpage'; // 뷰 모드에 따른 렌더링 차별화
  
  // 네비게이션을 위한 추가 props
  currentProjectIndex?: number;
  totalProjectsCount?: number;
  
  // 새로운 필터 관련 props
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters?: TableFilterState;
  onFiltersChange?: (filters: TableFilterState) => void;
  onResetFilters?: () => void;
}

/**
 * 프로젝트 상세 패널 컴포넌트
 * 
 * 특징:
 * - 탭 기반 상세 정보 표시
 * - 기존 ProjectDetailModal 내용 재활용
 * - 편집 기능 통합
 * - 네비게이션 지원
 * - 빈 상태 처리
 */
export function ProjectDetailPanel({
  project,
  activeTab,
  onTabChange,
  onEdit,
  onNavigate,
  canNavigatePrev = false,
  canNavigateNext = false,
  onBackToList,
  viewMode = 'detail',
  
  // 네비게이션을 위한 추가 props
  currentProjectIndex = 0,
  totalProjectsCount = 0,
  
  // 새로운 필터 관련 props
  searchQuery = '',
  onSearchChange,
  filters,
  onFiltersChange,
  onResetFilters
}: ProjectDetailPanelProps) {
  const tabs = [
    { id: 'overview', label: '개요', icon: FileText },
    { id: 'document-management', label: '문서관리', icon: FilePlus },
    { id: 'tax-management', label: '세무관리', icon: Calculator }
  ];

  // 빈 상태 (선택된 프로젝트 없음)
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <FolderOpen className="w-16 h-16 text-txt-tertiary mb-4" />
        <Typography variant="h3" className="text-txt-secondary mb-2">
          프로젝트를 선택하세요
        </Typography>
        <Typography variant="body1" className="text-txt-tertiary">
          좌측 목록에서 프로젝트를 선택하면 상세 정보를 확인할 수 있습니다.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Detail 모드에서만 프로젝트 정보 헤더 표시 */}
      {viewMode === 'detail' && (
        <div className="flex items-center justify-between p-6 border-b border-border-light flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-weave-primary-light rounded-lg flex-shrink-0">
              <FileText className="w-5 h-5 text-weave-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <Typography variant="h3" className="text-xl font-semibold text-txt-primary truncate">
                {project.name}
              </Typography>
              <Typography variant="body2" className="text-txt-secondary">
                {project.no} • {project.client}
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 프로젝트 네비게이션 */}
            {onNavigate && totalProjectsCount > 1 && (
              <>
                <SimpleProjectNavigation
                  currentIndex={currentProjectIndex}
                  totalCount={totalProjectsCount}
                  onNavigate={onNavigate}
                  size="sm"
                  ariaLabel="프로젝트 네비게이션"
                  itemType="프로젝트"
                  showPosition={false}
                  compact={true}
                />
                
                <div className="w-px h-6 bg-border-light mx-2" />
              </>
            )}
            
            {/* 목록으로 버튼 (Detail 모드에서만) */}
            {onBackToList && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToList}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                목록으로
              </Button>
            )}
            
            {/* 편집 버튼 (Detail 모드에서만) */}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(project)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                편집
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="border-b border-border-light flex-shrink-0">
        <nav className="flex space-x-0">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as DetailTabType)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-weave-primary text-weave-primary'
                    : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6">
          {activeTab === 'overview' && (
            <ProjectOverviewEnhanced project={project} />
          )}

          {activeTab === 'document-management' && (
            <ProjectDocumentManagementTab project={project} />
          )}

          {activeTab === 'tax-management' && (
            <ProjectTaxManagementTab project={project} />
          )}
        </div>
      </div>
    </div>
  );
}


// 문서관리 탭 컴포넌트
function ProjectDocumentManagementTab({ project }: { project: ProjectTableRow }) {
  const [activeSubTab, setActiveSubTab] = useState<'contract' | 'invoice' | 'report' | 'estimate' | 'etc'>('contract');

  const subTabs = [
    { id: 'contract', label: '계약서', icon: FileText },
    { id: 'invoice', label: '청구서', icon: FileText },
    { id: 'report', label: '보고서', icon: FileText },
    { id: 'estimate', label: '견적서', icon: FileText },
    { id: 'etc', label: '기타문서', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* 서브탭 네비게이션 */}
      <div className="border-b border-border-light">
        <nav className="flex space-x-0">
          {subTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeSubTab === tab.id
                    ? 'border-weave-primary text-weave-primary'
                    : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light'
                }`}
                role="tab"
                aria-selected={activeSubTab === tab.id}
                aria-controls={`subtabpanel-${tab.id}`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 서브탭 컨텐츠 */}
      <div className="min-h-[400px]">
        <UnderDevelopmentPlaceholder 
          title={subTabs.find(tab => tab.id === activeSubTab)?.label || '문서'}
          description={`${subTabs.find(tab => tab.id === activeSubTab)?.label} 생성 및 관리 기능을 제공합니다.`}
          icon={FilePlus}
        />
      </div>
    </div>
  );
}

// 세무관리 탭 컴포넌트
function ProjectTaxManagementTab({ project }: { project: ProjectTableRow }) {
  const [activeSubTab, setActiveSubTab] = useState<'tax-invoice' | 'withholding-tax' | 'vat' | 'cash-receipt' | 'card-receipt'>('tax-invoice');

  const subTabs = [
    { id: 'tax-invoice', label: '세금계산서', icon: Calculator },
    { id: 'withholding-tax', label: '원천세', icon: Calculator },
    { id: 'vat', label: '부가세', icon: Calculator },
    { id: 'cash-receipt', label: '현금영수증', icon: Calculator },
    { id: 'card-receipt', label: '카드영수증', icon: Calculator }
  ];

  return (
    <div className="space-y-6">
      {/* 서브탭 네비게이션 */}
      <div className="border-b border-border-light">
        <nav className="flex space-x-0">
          {subTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeSubTab === tab.id
                    ? 'border-weave-primary text-weave-primary'
                    : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light'
                }`}
                role="tab"
                aria-selected={activeSubTab === tab.id}
                aria-controls={`subtabpanel-${tab.id}`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 서브탭 컨텐츠 */}
      <div className="min-h-[400px]">
        <UnderDevelopmentPlaceholder 
          title={subTabs.find(tab => tab.id === activeSubTab)?.label || '세무관리'}
          description={`${subTabs.find(tab => tab.id === activeSubTab)?.label} 관리 기능을 제공합니다.`}
          icon={Calculator}
        />
      </div>
    </div>
  );
}

// 구현중 안내 컴포넌트
interface UnderDevelopmentPlaceholderProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function UnderDevelopmentPlaceholder({ title, description, icon: IconComponent }: UnderDevelopmentPlaceholderProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <IconComponent className="w-16 h-16 text-txt-tertiary mx-auto mb-4" />
        <Typography variant="h3" className="text-lg font-semibold text-txt-primary mb-2">
          {title}
        </Typography>
        <Typography variant="body1" className="text-txt-secondary mb-4">
          이 기능은 현재 구현 중입니다.
        </Typography>
        <Typography variant="body2" className="text-txt-tertiary max-w-md mx-auto">
          {description}
        </Typography>
        <div className="mt-6 p-4 bg-weave-primary-light rounded-lg inline-block">
          <Typography variant="body2" className="text-weave-primary font-medium">
            🚧 Coming Soon
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}