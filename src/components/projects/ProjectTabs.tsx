'use client';

import React, { useState } from 'react';
import { FolderOpen, Users, FileText, CreditCard, Search, DollarSign, MoreVertical, Calendar, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface ProjectTabsProps {
  projectId?: string;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

const tabs: Tab[] = [
  {
    id: 'project',
    label: '프로젝트',
    icon: <FolderOpen className="w-4 h-4" />,
    count: 1
  },
  {
    id: 'clients',
    label: '클라이언트',
    icon: <Users className="w-4 h-4" />,
    count: 12
  },
  {
    id: 'invoices',
    label: '인보이스',
    icon: <FileText className="w-4 h-4" />,
    count: 8
  },
  {
    id: 'payments',
    label: '결제관리',
    icon: <CreditCard className="w-4 h-4" />,
    count: 5
  }
];

export default function ProjectTabs({ projectId, defaultTab = 'project', onTabChange }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'project':
        return <ProjectTabContent projectId={projectId} />;
      case 'clients':
        return <ClientTabContent projectId={projectId} />;
      case 'invoices':
        return <InvoiceTabContent projectId={projectId} />;
      case 'payments':
        return <PaymentTabContent projectId={projectId} />;
      default:
        return <ProjectTabContent projectId={projectId} />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border-light">
      {/* 탭 헤더 */}
      <div className="border-b border-border-light">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-weave-primary text-weave-primary"
                  : "border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light"
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.count && (
                <span className={cn(
                  "ml-2 py-0.5 px-2 rounded-full text-xs",
                  activeTab === tab.id
                    ? "bg-weave-primary-light text-weave-primary"
                    : "bg-bg-secondary text-txt-tertiary"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 내용 */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

// 프로젝트 탭 내용
export function ProjectTabContent({ projectId }: { projectId?: string }) {
  const [projectData, setProjectData] = React.useState({
    id: 'PRJ-001',
    name: '웹사이트 리뉴얼 프로젝트',
    client: '㈜테크스타트',
    status: 'in_progress',
    progress: 65,
    startDate: '2025-07-15',
    endDate: '2025-09-30',
    budget: 15000000,
    team: [
      { id: '1', name: '김프로', role: 'PM', avatar: null },
      { id: '2', name: '이개발', role: '개발자', avatar: null },
      { id: '3', name: '박디자인', role: 'UI/UX', avatar: null },
      { id: '4', name: '최퍼블', role: '퍼블리셔', avatar: null }
    ],
    milestones: [
      { id: '1', title: '기획 및 설계', status: 'completed', dueDate: '2025-08-01', progress: 100 },
      { id: '2', title: '디자인 및 프로토타입', status: 'completed', dueDate: '2025-08-15', progress: 100 },
      { id: '3', title: '개발 및 구현', status: 'in_progress', dueDate: '2025-09-10', progress: 70 },
      { id: '4', title: '테스트 및 배포', status: 'pending', dueDate: '2025-09-25', progress: 0 }
    ],
    recentActivities: [
      { id: '1', type: 'milestone', title: '디자인 시스템 완료', date: '2025-08-25', user: '박디자인' },
      { id: '2', type: 'payment', title: '중간금 입금 확인', date: '2025-08-23', user: '김프로' },
      { id: '3', type: 'issue', title: 'API 연동 이슈 해결', date: '2025-08-22', user: '이개발' },
      { id: '4', type: 'meeting', title: '주간 진행 상황 회의', date: '2025-08-21', user: '김프로' }
    ]
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'in_progress':
        return '진행중';
      case 'pending':
        return '대기중';
      case 'delayed':
        return '지연';
      default:
        return status;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'issue':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-txt-primary">{projectData.name}</h3>
          <p className="text-sm text-txt-secondary mt-1">
            {projectData.client} • {new Date(projectData.startDate).toLocaleDateString('ko-KR')} ~ {new Date(projectData.endDate).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(projectData.status)}`}>
            {getStatusLabel(projectData.status)}
          </span>
        </div>
      </div>

      {/* 프로젝트 개요 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">진행률</p>
              <p className="text-2xl font-bold text-txt-primary">{projectData.progress}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center relative">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-200" style={{
                background: `conic-gradient(#3B82F6 0deg ${projectData.progress * 3.6}deg, transparent ${projectData.progress * 3.6}deg 360deg)`
              }} />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">예산</p>
              <p className="text-xl font-bold text-txt-primary">₩{(projectData.budget / 1000000).toFixed(0)}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">팀원</p>
              <p className="text-xl font-bold text-txt-primary">{projectData.team.length}명</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">남은 기간</p>
              <p className="text-xl font-bold text-txt-primary">
                {Math.ceil((new Date(projectData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 마일스톤 진행 상황 */}
        <div className="bg-white rounded-lg border border-border-light p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-txt-primary">마일스톤</h4>
            <button className="text-sm text-weave-primary hover:underline">
              전체 보기
            </button>
          </div>
          
          <div className="space-y-4">
            {projectData.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    milestone.status === 'completed' ? 'bg-green-100' :
                    milestone.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : milestone.status === 'in_progress' ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-txt-primary">{milestone.title}</div>
                    <div className="text-sm text-txt-tertiary">
                      {new Date(milestone.dueDate).toLocaleDateString('ko-KR')} 마감
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-txt-primary">{milestone.progress}%</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(milestone.status)}`}>
                    {getStatusLabel(milestone.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 팀원 및 최근 활동 */}
        <div className="space-y-6">
          {/* 팀원 */}
          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-txt-primary">팀원</h4>
              <button className="text-sm text-weave-primary hover:underline">
                팀 관리
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {projectData.team.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-2 bg-bg-secondary rounded-lg">
                  <div className="w-8 h-8 bg-weave-primary-light rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-weave-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-txt-primary text-sm">{member.name}</div>
                    <div className="text-xs text-txt-tertiary">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-txt-primary">최근 활동</h4>
              <button className="text-sm text-weave-primary hover:underline">
                전체 보기
              </button>
            </div>
            
            <div className="space-y-3">
              {projectData.recentActivities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-bg-secondary rounded-lg transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-txt-primary">{activity.title}</div>
                    <div className="text-xs text-txt-tertiary">
                      {activity.user} • {new Date(activity.date).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 클라이언트 탭 내용
export function ClientTabContent({ projectId }: { projectId?: string }) {
  const [clients, setClients] = React.useState([
    {
      id: '1',
      name: '㈜테크스타트',
      email: 'tech@startup.com',
      phone: '010-1234-5678',
      contact: '김대표',
      department: '경영진',
      projects: 3,
      totalRevenue: 45000000,
      status: 'active',
      lastContact: '2025-08-25',
      notes: '핵심 클라이언트, 정기 미팅 진행 중'
    },
    {
      id: '2',
      name: '디자인컴퍼니',
      email: 'contact@designco.com',
      phone: '010-2345-6789',
      contact: '이실장',
      department: '기획팀',
      projects: 2,
      totalRevenue: 28000000,
      status: 'active',
      lastContact: '2025-08-23',
      notes: '크리에이티브 프로젝트 전문'
    },
    {
      id: '3',
      name: '이커머스플러스',
      email: 'biz@ecommerce.plus',
      phone: '010-3456-7890',
      contact: '박팀장',
      department: '사업개발팀',
      projects: 1,
      totalRevenue: 50000000,
      status: 'negotiating',
      lastContact: '2025-08-20',
      notes: '대규모 ERP 프로젝트 협의 중'
    }
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'negotiating':
        return '협의중';
      case 'inactive':
        return '비활성';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-txt-primary">클라이언트 관리</h3>
          <p className="text-sm text-txt-secondary mt-1">
            프로젝트와 연결된 클라이언트 정보를 관리합니다
          </p>
        </div>
        <button className="px-4 py-2 bg-weave-primary text-white rounded-lg hover:bg-weave-primary-dark transition-colors">
          + 클라이언트 추가
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-bg-secondary rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
          <input
            type="text"
            placeholder="클라이언트명, 담당자, 이메일 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
        >
          <option value="all">모든 상태</option>
          <option value="active">활성</option>
          <option value="negotiating">협의중</option>
          <option value="inactive">비활성</option>
        </select>
      </div>

      {/* 클라이언트 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">총 클라이언트</p>
              <p className="text-2xl font-bold text-txt-primary">{clients.length}</p>
            </div>
            <Users className="w-8 h-8 text-weave-primary" />
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">활성 클라이언트</p>
              <p className="text-2xl font-bold text-txt-primary">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">총 매출</p>
              <p className="text-2xl font-bold text-txt-primary">
                {(clients.reduce((sum, c) => sum + c.totalRevenue, 0) / 1000000).toFixed(0)}M
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">평균 프로젝트</p>
              <p className="text-2xl font-bold text-txt-primary">
                {(clients.reduce((sum, c) => sum + c.projects, 0) / clients.length).toFixed(1)}
              </p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* 클라이언트 목록 */}
      <div className="bg-white rounded-lg border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary border-b border-border-light">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  클라이언트
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  담당자
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  상태
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  프로젝트
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  총 매출
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  최근 연락
                </th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id} 
                  className="hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-weave-primary-light rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-weave-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-txt-primary">{client.name}</div>
                        <div className="text-sm text-txt-tertiary">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-txt-primary">{client.contact}</div>
                      <div className="text-sm text-txt-secondary">{client.department}</div>
                      <div className="text-xs text-txt-tertiary">{client.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(client.status)}`}>
                      {getStatusLabel(client.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-txt-primary">{client.projects}개</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-txt-primary">
                      ₩{(client.totalRevenue / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-txt-primary">
                      {new Date(client.lastContact).toLocaleDateString('ko-KR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // 클라이언트 상세 보기 또는 편집
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
        
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-txt-tertiary mx-auto mb-4" />
            <p className="text-txt-secondary">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 인보이스 탭 내용
export function InvoiceTabContent({ projectId }: { projectId?: string }) {
  const [invoices, setInvoices] = React.useState([
    {
      id: 'INV-2025-001',
      number: '2025-001',
      title: '웹사이트 리뉴얼 - 계약금 (50%)',
      clientName: '㈜테크스타트',
      amount: 7500000,
      status: 'paid',
      issueDate: '2025-08-01',
      dueDate: '2025-08-15',
      paidDate: '2025-08-05',
      description: '프로젝트 착수금 50% 청구',
      taxAmount: 750000,
      netAmount: 6750000,
      vatRate: 0.1
    },
    {
      id: 'INV-2025-002',
      number: '2025-002',
      title: '웹사이트 리뉴얼 - 중간금 (30%)',
      clientName: '㈜테크스타트',
      amount: 4500000,
      status: 'pending',
      issueDate: '2025-08-15',
      dueDate: '2025-08-29',
      paidDate: null,
      description: '중간 단계 완료에 따른 중간금 청구',
      taxAmount: 450000,
      netAmount: 4050000,
      vatRate: 0.1
    },
    {
      id: 'INV-2025-003',
      number: '2025-003',
      title: '웹사이트 리뉴얼 - 잔금 (20%)',
      clientName: '㈜테크스타트',
      amount: 3000000,
      status: 'draft',
      issueDate: null,
      dueDate: '2025-09-15',
      paidDate: null,
      description: '프로젝트 완료 후 잔금 청구',
      taxAmount: 300000,
      netAmount: 2700000,
      vatRate: 0.1
    },
    {
      id: 'INV-2025-004',
      number: '2025-004',
      title: '모바일 앱 개발 - 계약금',
      clientName: '디자인컴퍼니',
      amount: 12500000,
      status: 'overdue',
      issueDate: '2025-07-20',
      dueDate: '2025-08-03',
      paidDate: null,
      description: '모바일 앱 개발 계약금',
      taxAmount: 1250000,
      netAmount: 11250000,
      vatRate: 0.1
    }
  ]);

  const [statusFilter, setStatusFilter] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  // 필터링된 인보이스
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 통계 계산
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return '결제완료';
      case 'pending':
        return '결제대기';
      case 'overdue':
        return '연체';
      case 'draft':
        return '임시저장';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-txt-primary">인보이스 관리</h3>
          <p className="text-sm text-txt-secondary mt-1">
            프로젝트 관련 인보이스를 생성하고 관리합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-border-light rounded-lg hover:bg-bg-secondary transition-colors">
            📊 리포트
          </button>
          <button className="px-4 py-2 bg-weave-primary text-white rounded-lg hover:bg-weave-primary-dark transition-colors">
            + 인보이스 생성
          </button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-bg-secondary rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
          <input
            type="text"
            placeholder="인보이스 번호, 제목, 클라이언트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
        >
          <option value="all">모든 상태</option>
          <option value="paid">결제완료</option>
          <option value="pending">결제대기</option>
          <option value="overdue">연체</option>
          <option value="draft">임시저장</option>
        </select>
      </div>

      {/* 인보이스 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">총 발행액</p>
              <p className="text-2xl font-bold text-txt-primary">₩{(totalAmount / 1000000).toFixed(1)}M</p>
            </div>
            <FileText className="w-8 h-8 text-weave-primary" />
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">수금 완료</p>
              <p className="text-2xl font-bold text-green-600">₩{(paidAmount / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">결제대기</p>
              <p className="text-2xl font-bold text-yellow-600">₩{(pendingAmount / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">연체</p>
              <p className="text-2xl font-bold text-red-600">₩{(overdueAmount / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 인보이스 목록 */}
      <div className="bg-white rounded-lg border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary border-b border-border-light">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  인보이스
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  클라이언트
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  상태
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  금액
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  발행일
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  마감일
                </th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredInvoices.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className="hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <p className="text-xs text-txt-tertiary">INV</p>
                        <p className="font-mono text-sm font-medium text-txt-primary">#{invoice.number}</p>
                      </div>
                      <div>
                        <div className="font-medium text-txt-primary">{invoice.title}</div>
                        <div className="text-sm text-txt-tertiary">{invoice.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-txt-primary">{invoice.clientName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-semibold text-txt-primary">₩{invoice.amount.toLocaleString()}</div>
                      <div className="text-xs text-txt-tertiary">세액: ₩{invoice.taxAmount.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-txt-primary">
                      {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString('ko-KR') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-txt-primary">
                      {new Date(invoice.dueDate).toLocaleDateString('ko-KR')}
                    </div>
                    {invoice.status === 'overdue' && (
                      <div className="text-xs text-red-600">
                        {Math.ceil((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))}일 연체
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // 인보이스 상세 보기 또는 편집
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
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-txt-tertiary mx-auto mb-4" />
            <p className="text-txt-secondary">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* 연체 알림 */}
      {overdueAmount > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">연체된 인보이스가 있습니다</h3>
              <p className="text-sm text-red-700 mt-1">
                총 ₩{overdueAmount.toLocaleString()}의 연체 금액이 있습니다. 클라이언트에게 연락하여 결제를 독촉하세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 결제관리 탭 내용
export function PaymentTabContent({ projectId }: { projectId?: string }) {
  const [payments, setPayments] = React.useState([
    {
      id: 'PAY-001',
      invoiceId: 'INV-2025-001',
      type: 'contract_deposit',
      title: '웹사이트 리뉴얼 - 계약금 (50%)',
      clientName: '㈜테크스타트',
      amount: 7500000,
      status: 'completed',
      scheduledDate: '2025-08-15',
      completedDate: '2025-08-02',
      paymentMethod: 'bank_transfer',
      accountInfo: '우리은행 ***-***-123456',
      description: '프로젝트 착수를 위한 계약금',
      projectPhase: 'initiation',
      percentage: 50,
      isOverdue: false
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-2025-002',
      type: 'interim_payment',
      title: '웹사이트 리뉴얼 - 중간금 (30%)',
      clientName: '㈜테크스타트',
      amount: 4500000,
      status: 'pending',
      scheduledDate: '2025-08-29',
      completedDate: null,
      paymentMethod: 'bank_transfer',
      accountInfo: '우리은행 ***-***-123456',
      description: '개발 단계 완료 후 중간금',
      projectPhase: 'development',
      percentage: 30,
      isOverdue: false
    },
    {
      id: 'PAY-003',
      invoiceId: 'INV-2025-003',
      type: 'final_payment',
      title: '웹사이트 리뉴얼 - 잔금 (20%)',
      clientName: '㈜테크스타트',
      amount: 3000000,
      status: 'scheduled',
      scheduledDate: '2025-09-15',
      completedDate: null,
      paymentMethod: 'bank_transfer',
      accountInfo: '우리은행 ***-***-123456',
      description: '프로젝트 완료 및 인도 후 잔금',
      projectPhase: 'completion',
      percentage: 20,
      isOverdue: false
    },
    {
      id: 'PAY-004',
      invoiceId: 'INV-2025-004',
      type: 'contract_deposit',
      title: '모바일 앱 개발 - 계약금',
      clientName: '디자인컴퍼니',
      amount: 12500000,
      status: 'overdue',
      scheduledDate: '2025-08-03',
      completedDate: null,
      paymentMethod: 'bank_transfer',
      accountInfo: '국민은행 ***-***-789012',
      description: '모바일 앱 개발 프로젝트 착수금',
      projectPhase: 'initiation',
      percentage: 50,
      isOverdue: true
    }
  ]);

  const [statusFilter, setStatusFilter] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  // 필터링된 결제 내역
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 통계 계산
  const totalContract = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const completedAmount = payments.filter(pay => pay.status === 'completed').reduce((sum, pay) => sum + pay.amount, 0);
  const pendingAmount = payments.filter(pay => pay.status === 'pending').reduce((sum, pay) => sum + pay.amount, 0);
  const overdueAmount = payments.filter(pay => pay.status === 'overdue').reduce((sum, pay) => sum + pay.amount, 0);
  const completionRate = Math.round((completedAmount / totalContract) * 100);

  // 캐시플로우 예측 계산
  const upcomingPayments = payments.filter(pay => pay.status === 'pending' || pay.status === 'scheduled');
  const monthlyProjection = upcomingPayments.reduce((sum, pay) => {
    const daysUntilPayment = Math.ceil((new Date(pay.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilPayment <= 30 ? sum + pay.amount : sum;
  }, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '입금완료';
      case 'pending':
        return '결제대기';
      case 'overdue':
        return '연체';
      case 'scheduled':
        return '결제예정';
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return '계좌이체';
      case 'credit_card':
        return '신용카드';
      case 'check':
        return '수표';
      default:
        return method;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-txt-primary">결제 관리</h3>
          <p className="text-sm text-txt-secondary mt-1">
            프로젝트 결제 내역과 캐시플로우를 관리합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-border-light rounded-lg hover:bg-bg-secondary transition-colors">
            📈 캐시플로우 분석
          </button>
          <button className="px-4 py-2 bg-weave-primary text-white rounded-lg hover:bg-weave-primary-dark transition-colors">
            + 결제 내역 추가
          </button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-bg-secondary rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
          <input
            type="text"
            placeholder="결제 내역, 클라이언트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
        >
          <option value="all">모든 상태</option>
          <option value="completed">입금완료</option>
          <option value="pending">결제대기</option>
          <option value="overdue">연체</option>
          <option value="scheduled">결제예정</option>
        </select>
      </div>

      {/* 결제 통계 및 캐시플로우 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">총 계약금</p>
              <p className="text-2xl font-bold text-txt-primary">₩{(totalContract / 1000000).toFixed(1)}M</p>
            </div>
            <CreditCard className="w-8 h-8 text-weave-primary" />
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">입금완료</p>
              <p className="text-2xl font-bold text-green-600">₩{(completedAmount / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">결제대기</p>
              <p className="text-2xl font-bold text-yellow-600">₩{(pendingAmount / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">이번 달 예상</p>
              <p className="text-2xl font-bold text-blue-600">₩{(monthlyProjection / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">30d</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-txt-secondary">완료율</p>
              <p className="text-2xl font-bold text-txt-primary">{completionRate}%</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">{completionRate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 결제 내역 테이블 */}
      <div className="bg-white rounded-lg border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary border-b border-border-light">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  결제 내역
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  클라이언트
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  상태
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  금액 / 비율
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  예정일
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-txt-secondary uppercase tracking-wider">
                  결제방법
                </th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredPayments.map((payment) => (
                <tr 
                  key={payment.id} 
                  className="hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.status === 'completed' ? 'bg-green-100' :
                        payment.status === 'overdue' ? 'bg-red-100' :
                        payment.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <CreditCard className={`w-5 h-5 ${
                          payment.status === 'completed' ? 'text-green-600' :
                          payment.status === 'overdue' ? 'text-red-600' :
                          payment.status === 'pending' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium text-txt-primary">{payment.title}</div>
                        <div className="text-sm text-txt-tertiary">{payment.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-txt-primary">{payment.clientName}</div>
                    <div className="text-xs text-txt-tertiary">{payment.projectPhase}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                      {getStatusLabel(payment.status)}
                    </span>
                    {payment.isOverdue && (
                      <div className="text-xs text-red-600 mt-1">
                        {Math.ceil((new Date().getTime() - new Date(payment.scheduledDate).getTime()) / (1000 * 60 * 60 * 24))}일 지연
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-semibold text-txt-primary">₩{payment.amount.toLocaleString()}</div>
                      <div className="text-xs text-txt-tertiary">계약금의 {payment.percentage}%</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-txt-primary">{new Date(payment.scheduledDate).toLocaleDateString('ko-KR')}</div>
                      {payment.completedDate && (
                        <div className="text-xs text-green-600">완료: {new Date(payment.completedDate).toLocaleDateString('ko-KR')}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-txt-primary">{getPaymentMethodLabel(payment.paymentMethod)}</div>
                      <div className="text-xs text-txt-tertiary">{payment.accountInfo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // 결제 상세 보기 또는 편집
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
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-txt-tertiary mx-auto mb-4" />
            <p className="text-txt-secondary">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* 연체 및 캐시플로우 알림 */}
      <div className="mt-6 space-y-4">
        {/* 연체 알림 */}
        {overdueAmount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">연체된 결제가 있습니다</h3>
                <p className="text-sm text-red-700 mt-1">
                  총 ₩{overdueAmount.toLocaleString()}의 연체 금액이 있습니다. 즉시 클라이언트에게 연락하세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 캐시플로우 예측 */}
        {monthlyProjection > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">30d</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">이번 달 예상 수입</h3>
                <p className="text-sm text-blue-700 mt-1">
                  앞으로 30일 내에 ₩{monthlyProjection.toLocaleString()}의 수입이 예상됩니다. 
                  {upcomingPayments.length}건의 결제가 예정되어 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}