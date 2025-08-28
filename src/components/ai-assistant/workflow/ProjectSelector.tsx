'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Search, 
  Plus, 
  Folder,
  Calendar,
  DollarSign,
  Check,
  Circle,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Project, Client } from '@/types/document-workflow';

interface ProjectSelectorProps {
  client: Client;
  onSelectProject: (project: Project) => void;
  selectedProject?: Project | null;
}

// 샘플 프로젝트 데이터 (실제로는 API에서 클라이언트별로 가져와야 함)
const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    name: '모바일 쇼핑몰 앱 개발',
    clientId: '1',
    description: '차세대 모바일 쇼핑 플랫폼 구축',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    budget: 15000000,
    status: 'in_progress',
    type: 'development'
  },
  {
    id: '2',
    name: '브랜드 리뉴얼 프로젝트',
    clientId: '2',
    description: '기업 아이덴티티 재정립 및 디자인 시스템 구축',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    budget: 8000000,
    status: 'planning',
    type: 'design'
  },
  {
    id: '3',
    name: '디지털 전환 컨설팅',
    clientId: '3',
    description: '업무 프로세스 디지털화 전략 수립',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    budget: 12000000,
    status: 'completed',
    type: 'consulting'
  }
];

export default function ProjectSelector({ 
  client,
  onSelectProject,
  selectedProject
}: ProjectSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  
  // 해당 클라이언트의 프로젝트만 필터링 (데모를 위해 모든 프로젝트 표시)
  // 실제로는 API에서 클라이언트별 프로젝트를 가져와야 함
  const clientProjects = SAMPLE_PROJECTS; // 임시로 모든 프로젝트 표시
  
  // 검색 필터링
  const filteredProjects = clientProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProject = (project: Project) => {
    onSelectProject(project);
  };

  const getStatusBadge = (status: Project['status']) => {
    const configs = {
      planning: { variant: 'secondary' as const, icon: Circle, label: '기획중' },
      in_progress: { variant: 'primary' as const, icon: AlertCircle, label: '진행중' },
      completed: { variant: 'success' as const, icon: CheckCircle, label: '완료' },
      on_hold: { variant: 'warning' as const, icon: AlertCircle, label: '보류' }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} size="sm" className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR');
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white rounded-lg border border-border-light p-6">
        <div className="mb-6">
          <Typography variant="h3" className="text-lg font-semibold text-txt-primary mb-2">
            프로젝트 선택
          </Typography>
          <Typography variant="body2" className="text-txt-secondary">
            {client.companyName}의 프로젝트를 선택하세요
          </Typography>
        </div>

        {/* 검색 및 추가 버튼 */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="프로젝트 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-txt-tertiary" />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowNewProject(!showNewProject)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            새 프로젝트
          </Button>
        </div>

        {/* 프로젝트 목록 */}
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className={`border ${
                selectedProject?.id === project.id 
                  ? 'border-weave-primary bg-blue-50' 
                  : 'border-border-light bg-white hover:shadow-md'
              } transition-all cursor-pointer`}
              onClick={() => handleSelectProject(project)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-bg-secondary rounded-lg">
                      <Folder className="w-5 h-5 text-txt-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Typography variant="body1" className="font-semibold text-txt-primary">
                          {project.name}
                        </Typography>
                        {getStatusBadge(project.status)}
                      </div>
                      {project.description && (
                        <Typography variant="body2" className="text-txt-secondary">
                          {project.description}
                        </Typography>
                      )}
                    </div>
                  </div>
                  {selectedProject?.id === project.id && (
                    <div className="p-1 bg-weave-primary rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-11">
                  {project.startDate && project.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-txt-tertiary" />
                      <Typography variant="body2" className="text-txt-tertiary">
                        {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                      </Typography>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-txt-tertiary" />
                      <Typography variant="body2" className="text-txt-tertiary">
                        {formatCurrency(project.budget)}
                      </Typography>
                    </div>
                  )}
                  <Badge variant="outline" size="sm">
                    {project.type === 'development' && '개발'}
                    {project.type === 'consulting' && '컨설팅'}
                    {project.type === 'design' && '디자인'}
                    {project.type === 'marketing' && '마케팅'}
                    {project.type === 'other' && '기타'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-txt-tertiary" />
            </div>
            <Typography variant="body1" className="text-txt-tertiary mb-2">
              {searchQuery ? '검색 결과가 없습니다' : '프로젝트가 없습니다'}
            </Typography>
            <Typography variant="body2" className="text-txt-tertiary">
              새 프로젝트를 추가해주세요
            </Typography>
          </div>
        )}
      </Card>

      {/* 새 프로젝트 추가 폼 (추후 구현) */}
      {showNewProject && (
        <Card className="bg-white rounded-lg border border-border-light p-6">
          <Typography variant="h4" className="text-lg font-semibold text-txt-primary mb-4">
            새 프로젝트 추가
          </Typography>
          <Typography variant="body2" className="text-txt-tertiary">
            (추후 구현 예정)
          </Typography>
        </Card>
      )}
    </div>
  );
}