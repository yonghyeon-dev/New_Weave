'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { ProjectTabContent, ClientTabContent, InvoiceTabContent, PaymentTabContent } from '@/components/projects/ProjectTabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  TrendingUp,
  FolderOpen,
  MoreVertical,
  CheckCircle,
  XCircle,
  PauseCircle,
  BarChart3
} from 'lucide-react';
import Typography from '@/components/ui/Typography';
import type { ProjectSummary, ProjectStatistics } from '@/lib/types/project';

// Mock 데이터
const mockProjects: ProjectSummary[] = [
  {
    id: '1',
    name: '웹사이트 리뉴얼 프로젝트',
    clientName: '㈜테크스타트',
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    dueDate: '2025-09-01',
    budget: {
      estimated: 15000000,
      spent: 9750000
    },
    teamSize: 4,
    taskCount: {
      total: 24,
      completed: 16
    }
  },
  {
    id: '2',
    name: '모바일 앱 개발',
    clientName: '디자인컴퍼니',
    status: 'in_progress',
    priority: 'medium',
    progress: 40,
    dueDate: '2025-09-15',
    budget: {
      estimated: 25000000,
      spent: 10000000
    },
    teamSize: 6,
    taskCount: {
      total: 36,
      completed: 14
    }
  },
  {
    id: '3',
    name: 'ERP 시스템 구축',
    clientName: '이커머스플러스',
    status: 'planning',
    priority: 'low',
    progress: 10,
    dueDate: '2025-10-30',
    budget: {
      estimated: 50000000,
      spent: 5000000
    },
    teamSize: 8,
    taskCount: {
      total: 48,
      completed: 5
    }
  },
  {
    id: '4',
    name: '브랜드 리뉴얼',
    clientName: '㈜크리에이티브',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    dueDate: '2025-07-31',
    budget: {
      estimated: 8000000,
      spent: 7500000
    },
    teamSize: 3,
    taskCount: {
      total: 15,
      completed: 15
    }
  },
  {
    id: '5',
    name: '마케팅 캠페인',
    clientName: '마케팅플러스',
    status: 'review',
    priority: 'high',
    progress: 90,
    dueDate: '2025-08-31',
    budget: {
      estimated: 12000000,
      spent: 10800000
    },
    teamSize: 5,
    taskCount: {
      total: 20,
      completed: 18
    }
  }
];

const mockStatistics: ProjectStatistics = {
  totalProjects: 12,
  activeProjects: 5,
  completedProjects: 6,
  totalRevenue: 185000000,
  averageProgress: 61,
  upcomingDeadlines: 3,
  overdueProjects: 1,
  teamUtilization: 78
};

export default function ProjectsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [projects] = useState<ProjectSummary[]>(mockProjects);
  const [statistics] = useState<ProjectStatistics>(mockStatistics);
  const [activeTab, setActiveTab] = useState<'project' | 'clients' | 'invoices' | 'payments'>('project');

  // 상태별 색상 매핑
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'on_hold': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // 우선순위별 색상 매핑
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  // 상태 한글 변환
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return '기획';
      case 'in_progress': return '진행중';
      case 'review': return '검토';
      case 'completed': return '완료';
      case 'on_hold': return '보류';
      case 'cancelled': return '취소';
      default: return status;
    }
  };

  // 필터링된 프로젝트
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="bg-bg-primary">
        {/* 헤더 */}
        <div className="bg-white border-b border-border-light px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Typography variant="h2" className="text-2xl text-txt-primary">프로젝트 관리</Typography>
                <p className="text-sm text-txt-secondary mt-1">
                  모든 프로젝트를 한눈에 관리하고 추적하세요
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/projects/new')}
                  className="flex items-center gap-2 px-4 py-2 bg-weave-primary text-white rounded-lg hover:bg-weave-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  새 프로젝트
                </button>
              </div>
            </div>
            
            {/* 4개 탭 네비게이션 */}
            <div className="border-t border-border-light">
              <nav className="flex space-x-8 px-0" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('project')}
                  className={`flex items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'project'
                      ? 'border-weave-primary text-weave-primary'
                      : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  프로젝트
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === 'project'
                      ? 'bg-weave-primary-light text-weave-primary'
                      : 'bg-bg-secondary text-txt-tertiary'
                  }`}>
                    1
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`flex items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'clients'
                      ? 'border-weave-primary text-weave-primary'
                      : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  클라이언트
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === 'clients'
                      ? 'bg-weave-primary-light text-weave-primary'
                      : 'bg-bg-secondary text-txt-tertiary'
                  }`}>
                    12
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`flex items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'invoices'
                      ? 'border-weave-primary text-weave-primary'
                      : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  인보이스
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === 'invoices'
                      ? 'bg-weave-primary-light text-weave-primary'
                      : 'bg-bg-secondary text-txt-tertiary'
                  }`}>
                    8
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`flex items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'payments'
                      ? 'border-weave-primary text-weave-primary'
                      : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  결제관리
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === 'payments'
                      ? 'bg-weave-primary-light text-weave-primary'
                      : 'bg-bg-secondary text-txt-tertiary'
                  }`}>
                    5
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* 탭에 따른 컨텐츠 렌더링 */}
          {activeTab === 'project' ? (
            <>
              {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-border-light p-4">
              <div className="flex items-center justify-between mb-2">
                <FolderOpen className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-txt-tertiary">전체</span>
              </div>
              <div className="text-2xl font-bold text-txt-primary">
                {statistics.totalProjects}
              </div>
              <div className="text-sm text-txt-secondary">총 프로젝트</div>
            </div>

            <div className="bg-white rounded-lg border border-border-light p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-xs text-green-600">진행중</span>
              </div>
              <div className="text-2xl font-bold text-txt-primary">
                {statistics.activeProjects}
              </div>
              <div className="text-sm text-txt-secondary">활성 프로젝트</div>
            </div>

            <div className="bg-white rounded-lg border border-border-light p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-purple-500" />
                <span className="text-xs text-txt-tertiary">수익</span>
              </div>
              <div className="text-2xl font-bold text-txt-primary">
                {(statistics.totalRevenue / 1000000).toFixed(0)}M
              </div>
              <div className="text-sm text-txt-secondary">총 매출액</div>
            </div>

            <div className="bg-white rounded-lg border border-border-light p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span className="text-xs text-txt-tertiary">{statistics.teamUtilization}%</span>
              </div>
              <div className="text-2xl font-bold text-txt-primary">
                {statistics.averageProgress}%
              </div>
              <div className="text-sm text-txt-secondary">평균 진행률</div>
            </div>
          </div>

          {/* 필터 및 검색 */}
          <div className="bg-white rounded-lg border border-border-light p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
                <input
                  type="text"
                  placeholder="프로젝트명 또는 클라이언트명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
                >
                  <option value="all">모든 상태</option>
                  <option value="planning">기획</option>
                  <option value="in_progress">진행중</option>
                  <option value="review">검토</option>
                  <option value="completed">완료</option>
                  <option value="on_hold">보류</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-2 border border-border-light rounded-lg hover:bg-bg-secondary transition-colors">
                  <Filter className="w-4 h-4" />
                  필터
                </button>
              </div>
            </div>
          </div>

          {/* 프로젝트 목록 */}
          <div className="bg-white rounded-lg border border-border-light overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary border-b border-border-light">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                      프로젝트
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                      클라이언트
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                      상태
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                      진행률
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                      예산
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                      마감일
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                      팀
                    </th>
                    <th className="text-right px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {filteredProjects.map((project) => (
                    <tr 
                      key={project.id} 
                      className="hover:bg-bg-secondary transition-colors cursor-pointer"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${getPriorityColor(project.priority)}`} />
                          <div>
                            <div className="text-sm font-medium text-txt-primary">
                              {project.name}
                            </div>
                            <div className="text-xs text-txt-tertiary">
                              {project.taskCount.completed}/{project.taskCount.total} 작업 완료
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-txt-primary">{project.clientName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-1 mr-3">
                            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-weave-primary transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-txt-secondary">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-txt-primary">
                            ₩{(project.budget.spent / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-txt-tertiary">
                            / ₩{(project.budget.estimated / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-txt-primary">
                          <Calendar className="w-4 h-4 mr-1 text-txt-tertiary" />
                          {new Date(project.dueDate).toLocaleDateString('ko-KR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-txt-tertiary" />
                          <span className="text-sm text-txt-primary">{project.teamSize}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // 더보기 메뉴 처리
                          }}
                          className="p-1 hover:bg-bg-secondary rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-txt-tertiary" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-txt-tertiary mx-auto mb-4" />
                <p className="text-txt-secondary">프로젝트가 없습니다</p>
                <button
                  onClick={() => router.push('/projects/new')}
                  className="mt-4 text-weave-primary hover:text-weave-primary-dark"
                >
                  새 프로젝트 만들기
                </button>
              </div>
            )}
          </div>

              {/* 긴급 알림 */}
              {statistics.overdueProjects > 0 && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">주의가 필요한 프로젝트</h3>
                      <p className="text-sm text-red-700 mt-1">
                        {statistics.overdueProjects}개의 프로젝트가 마감일을 초과했습니다.
                        {statistics.upcomingDeadlines > 0 && ` ${statistics.upcomingDeadlines}개의 프로젝트가 곧 마감됩니다.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : activeTab === 'clients' ? (
            <ClientTabContent projectId="current" />
          ) : activeTab === 'invoices' ? (
            <InvoiceTabContent projectId="current" />
          ) : activeTab === 'payments' ? (
            <PaymentTabContent projectId="current" />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}