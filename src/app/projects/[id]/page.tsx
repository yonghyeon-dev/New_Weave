'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { 
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  Upload,
  Plus,
  Edit,
  MoreVertical,
  MessageSquare,
  Target,
  CreditCard,
  Briefcase
} from 'lucide-react';
import type { Project } from '@/lib/types/project';

// Mock 프로젝트 상세 데이터
const mockProject: Project = {
  id: '1',
  name: '웹사이트 리뉴얼 프로젝트',
  description: '회사 웹사이트를 최신 기술 스택으로 전면 리뉴얼하는 프로젝트입니다. 반응형 디자인, 성능 최적화, SEO 개선이 주요 목표입니다.',
  clientId: 'client-1',
  clientName: '㈜테크스타트',
  status: 'in_progress',
  priority: 'high',
  startDate: '2025-07-01',
  dueDate: '2025-09-01',
  
  budget: {
    estimated: 15000000,
    spent: 9750000,
    remaining: 5250000,
    currency: 'KRW'
  },
  
  totalRevenue: 15000000,
  totalExpenses: 9750000,
  profitMargin: 35,
  progress: 65,
  
  milestones: [
    {
      id: 'm1',
      title: '기획 및 디자인',
      description: 'UI/UX 디자인 및 와이어프레임 작성',
      dueDate: '2025-07-15',
      completedDate: '2025-07-14',
      isCompleted: true,
      progress: 100
    },
    {
      id: 'm2',
      title: '프론트엔드 개발',
      description: 'React 기반 프론트엔드 구현',
      dueDate: '2025-08-15',
      isCompleted: false,
      progress: 75
    },
    {
      id: 'm3',
      title: '백엔드 통합',
      description: 'API 연동 및 데이터베이스 구축',
      dueDate: '2025-08-25',
      isCompleted: false,
      progress: 40
    },
    {
      id: 'm4',
      title: '테스트 및 배포',
      description: 'QA 테스트 및 프로덕션 배포',
      dueDate: '2025-09-01',
      isCompleted: false,
      progress: 0
    }
  ],
  
  team: [
    {
      id: 't1',
      name: '김개발',
      role: '프로젝트 매니저',
      email: 'kim@example.com',
      joinedDate: '2025-07-01'
    },
    {
      id: 't2',
      name: '이디자인',
      role: 'UI/UX 디자이너',
      email: 'lee@example.com',
      joinedDate: '2025-07-01'
    },
    {
      id: 't3',
      name: '박프론트',
      role: '프론트엔드 개발자',
      email: 'park@example.com',
      joinedDate: '2025-07-10'
    },
    {
      id: 't4',
      name: '최백엔드',
      role: '백엔드 개발자',
      email: 'choi@example.com',
      joinedDate: '2025-07-10'
    }
  ],
  
  documents: [
    {
      id: 'd1',
      name: '프로젝트 제안서.pdf',
      type: 'proposal',
      url: '#',
      uploadedDate: '2025-06-25',
      uploadedBy: '김개발',
      size: 2500000
    },
    {
      id: 'd2',
      name: '계약서_최종.pdf',
      type: 'contract',
      url: '#',
      uploadedDate: '2025-06-30',
      uploadedBy: '김개발',
      size: 1200000
    },
    {
      id: 'd3',
      name: '1차 인보이스.pdf',
      type: 'invoice',
      url: '#',
      uploadedDate: '2025-07-15',
      uploadedBy: '시스템',
      size: 450000
    }
  ],
  
  tasks: [
    {
      id: 'task1',
      title: '홈페이지 디자인 완료',
      assignedTo: '이디자인',
      dueDate: '2025-08-10',
      status: 'done',
      priority: 'high',
      createdAt: '2025-07-20',
      completedAt: '2025-08-08'
    },
    {
      id: 'task2',
      title: '상품 목록 페이지 구현',
      assignedTo: '박프론트',
      dueDate: '2025-08-20',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2025-08-01'
    },
    {
      id: 'task3',
      title: 'API 엔드포인트 개발',
      assignedTo: '최백엔드',
      dueDate: '2025-08-25',
      status: 'in_progress',
      priority: 'high',
      createdAt: '2025-08-05'
    },
    {
      id: 'task4',
      title: '결제 시스템 연동',
      assignedTo: '최백엔드',
      dueDate: '2025-08-30',
      status: 'todo',
      priority: 'urgent',
      createdAt: '2025-08-10'
    }
  ],
  
  invoices: [
    {
      id: 'inv1',
      invoiceNumber: 'INV-2025-001',
      amount: 5000000,
      issuedDate: '2025-07-15',
      dueDate: '2025-07-30',
      status: 'paid',
      paidDate: '2025-07-28'
    },
    {
      id: 'inv2',
      invoiceNumber: 'INV-2025-002',
      amount: 5000000,
      issuedDate: '2025-08-15',
      dueDate: '2025-08-30',
      status: 'sent'
    },
    {
      id: 'inv3',
      invoiceNumber: 'INV-2025-003',
      amount: 5000000,
      issuedDate: '2025-09-01',
      dueDate: '2025-09-15',
      status: 'draft'
    }
  ],
  
  payments: [
    {
      id: 'pay1',
      amount: 5000000,
      date: '2025-07-28',
      method: 'bank_transfer',
      status: 'completed',
      description: '1차 대금 결제',
      invoiceId: 'inv1'
    }
  ],
  
  tags: ['웹개발', 'React', 'Node.js', '리뉴얼'],
  category: '웹 개발',
  
  createdAt: '2025-06-25',
  updatedAt: '2025-08-26',
  createdBy: '김개발'
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [project] = useState<Project>(mockProject);

  // 탭 메뉴
  const tabs = [
    { id: 'overview', label: '개요', icon: Briefcase },
    { id: 'tasks', label: '작업', icon: CheckCircle },
    { id: 'invoices', label: '인보이스', icon: FileText },
    { id: 'team', label: '팀', icon: Users },
    { id: 'documents', label: '문서', icon: FileText },
    { id: 'timeline', label: '타임라인', icon: Clock }
  ];

  // 상태별 색상
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

  return (
    <AppLayout>
      <div className="min-h-screen bg-bg-primary">
        {/* 헤더 */}
        <div className="bg-white border-b border-border-light">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/projects')}
                  className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-txt-primary">{project.name}</h1>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-txt-secondary">{project.clientName}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-txt-secondary hover:text-txt-primary border border-border-light rounded-lg hover:bg-bg-secondary transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 text-txt-secondary hover:text-txt-primary border border-border-light rounded-lg hover:bg-bg-secondary transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 주요 지표 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-txt-tertiary" />
                <div>
                  <div className="text-xs text-txt-tertiary">마감일</div>
                  <div className="text-sm font-medium text-txt-primary">
                    {new Date(project.dueDate).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-txt-tertiary" />
                <div>
                  <div className="text-xs text-txt-tertiary">진행률</div>
                  <div className="text-sm font-medium text-txt-primary">{project.progress}%</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-txt-tertiary" />
                <div>
                  <div className="text-xs text-txt-tertiary">예산</div>
                  <div className="text-sm font-medium text-txt-primary">
                    ₩{(project.budget.spent / 1000000).toFixed(1)}M / {(project.budget.estimated / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-txt-tertiary" />
                <div>
                  <div className="text-xs text-txt-tertiary">팀원</div>
                  <div className="text-sm font-medium text-txt-primary">{project.team.length}명</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-txt-tertiary" />
                <div>
                  <div className="text-xs text-txt-tertiary">마진</div>
                  <div className="text-sm font-medium text-txt-primary">{project.profitMargin}%</div>
                </div>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex items-center gap-1 mt-6 border-t border-border-light pt-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-weave-primary text-white'
                      : 'text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="max-w-7xl mx-auto p-6">
          {/* 개요 탭 */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 왼쪽 영역 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 프로젝트 설명 */}
                <div className="bg-white rounded-lg border border-border-light p-6">
                  <h3 className="text-lg font-semibold text-txt-primary mb-4">프로젝트 설명</h3>
                  <p className="text-txt-secondary">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-bg-secondary text-txt-secondary rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 마일스톤 */}
                <div className="bg-white rounded-lg border border-border-light p-6">
                  <h3 className="text-lg font-semibold text-txt-primary mb-4">마일스톤</h3>
                  <div className="space-y-4">
                    {project.milestones.map(milestone => (
                      <div key={milestone.id} className="border-l-4 border-weave-primary pl-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-txt-primary">{milestone.title}</h4>
                              {milestone.isCompleted && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-txt-tertiary mt-1">{milestone.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-txt-secondary">
                              {new Date(milestone.dueDate).toLocaleDateString('ko-KR')}
                            </div>
                            <div className="text-xs text-txt-tertiary">{milestone.progress}% 완료</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-weave-primary transition-all duration-300"
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 최근 활동 */}
                <div className="bg-white rounded-lg border border-border-light p-6">
                  <h3 className="text-lg font-semibold text-txt-primary mb-4">최근 활동</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-txt-primary">인보이스 발행</p>
                        <p className="text-xs text-txt-tertiary">2차 대금 청구서가 발행되었습니다</p>
                        <p className="text-xs text-txt-tertiary mt-1">2일 전</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-txt-primary">작업 완료</p>
                        <p className="text-xs text-txt-tertiary">홈페이지 디자인이 완료되었습니다</p>
                        <p className="text-xs text-txt-tertiary mt-1">3일 전</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽 사이드바 */}
              <div className="space-y-6">
                {/* 재무 요약 */}
                <div className="bg-white rounded-lg border border-border-light p-6">
                  <h3 className="text-lg font-semibold text-txt-primary mb-4">재무 현황</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-txt-secondary">예산 사용</span>
                        <span className="text-txt-primary font-medium">
                          {((project.budget.spent / project.budget.estimated) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${(project.budget.spent / project.budget.estimated) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-txt-tertiary mt-1">
                        <span>₩{(project.budget.spent / 1000000).toFixed(1)}M</span>
                        <span>₩{(project.budget.estimated / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border-light space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-secondary">총 수익</span>
                        <span className="text-txt-primary font-medium">
                          ₩{(project.totalRevenue / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-secondary">총 비용</span>
                        <span className="text-txt-primary font-medium">
                          ₩{(project.totalExpenses / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-border-light">
                        <span className="text-txt-secondary">예상 마진</span>
                        <span className="text-green-600 font-semibold">
                          {project.profitMargin}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 팀 요약 */}
                <div className="bg-white rounded-lg border border-border-light p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-txt-primary">팀원</h3>
                    <button className="text-weave-primary hover:text-weave-primary-dark">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {project.team.slice(0, 3).map(member => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-weave-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {member.name[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-txt-primary truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-txt-tertiary truncate">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <button className="text-sm text-weave-primary hover:text-weave-primary-dark">
                        +{project.team.length - 3}명 더보기
                      </button>
                    )}
                  </div>
                </div>

                {/* 빠른 작업 */}
                <div className="bg-white rounded-lg border border-border-light p-6">
                  <h3 className="text-lg font-semibold text-txt-primary mb-4">빠른 작업</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => router.push('/invoices/new')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>인보이스 생성</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary rounded-lg transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>문서 업로드</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-txt-secondary hover:text-txt-primary hover:bg-bg-secondary rounded-lg transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>메시지 보내기</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 작업 탭 */}
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-lg border border-border-light p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-txt-primary">작업 목록</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-weave-primary text-white rounded-lg hover:bg-weave-primary-dark transition-colors">
                  <Plus className="w-4 h-4" />
                  새 작업
                </button>
              </div>
              
              <div className="space-y-3">
                {project.tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 border border-border-light rounded-lg hover:bg-bg-secondary transition-colors">
                    <div className="flex items-center gap-4">
                      <input type="checkbox" checked={task.status === 'done'} className="w-4 h-4" />
                      <div>
                        <h4 className="font-medium text-txt-primary">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-txt-tertiary">담당: {task.assignedTo}</span>
                          <span className="text-xs text-txt-tertiary">마감: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.priority === 'urgent' ? '긴급' :
                       task.priority === 'high' ? '높음' :
                       task.priority === 'medium' ? '보통' : '낮음'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 인보이스 탭 */}
          {activeTab === 'invoices' && (
            <div className="bg-white rounded-lg border border-border-light p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-txt-primary">인보이스</h3>
                <button 
                  onClick={() => router.push('/invoices/new')}
                  className="flex items-center gap-2 px-4 py-2 bg-weave-primary text-white rounded-lg hover:bg-weave-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  새 인보이스
                </button>
              </div>
              
              <div className="space-y-3">
                {project.invoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border border-border-light rounded-lg hover:bg-bg-secondary transition-colors">
                    <div>
                      <h4 className="font-medium text-txt-primary">{invoice.invoiceNumber}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-txt-tertiary">
                          발행일: {new Date(invoice.issuedDate).toLocaleDateString('ko-KR')}
                        </span>
                        <span className="text-xs text-txt-tertiary">
                          만기일: {new Date(invoice.dueDate).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-txt-primary">
                        ₩{(invoice.amount / 1000000).toFixed(1)}M
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {invoice.status === 'paid' ? '결제완료' :
                         invoice.status === 'sent' ? '발송됨' :
                         invoice.status === 'overdue' ? '연체' :
                         invoice.status === 'draft' ? '임시저장' : invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 다른 탭들도 필요에 따라 구현 */}
        </div>
      </div>
    </AppLayout>
  );
}