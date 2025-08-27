'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { WorkspacePageContainer } from '@/components/layout/PageContainer';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import Typography from '@/components/ui/Typography';
import type { DashboardInsight, QuickAction } from '@/components/dashboard/DashboardLayout';
import type { CalendarEvent } from '@/components/dashboard/DashboardCalendar';

// Mock 데이터 - 실제로는 API에서 가져올 데이터
interface DashboardData {
  overdueInvoices: {
    count: number;
    totalAmount: number;
  };
  upcomingDeadlines: {
    count: number;
    projects: Array<{
      id: string;
      name: string;
      dueDate: Date;
      daysLeft: number;
    }>;
  };
  monthlyFinancials: {
    issued: number;
    paid: number;
    difference: number;
    trend: number;
  };
  topClients: Array<{
    id: string;
    name: string;
    revenue: number;
    percentage: number;
  }>;
  calendarEvents: CalendarEvent[];
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock API 데이터 로딩
  useEffect(() => {
    const fetchDashboardData = async () => {
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: DashboardData = {
        overdueInvoices: {
          count: 3,
          totalAmount: 4500000
        },
        upcomingDeadlines: {
          count: 2,
          projects: [
            {
              id: '1',
              name: '웹사이트 리뉴얼',
              dueDate: new Date('2025-09-01'),
              daysLeft: 7
            },
            {
              id: '2', 
              name: '모바일 앱 개발',
              dueDate: new Date('2025-09-05'),
              daysLeft: 11
            }
          ]
        },
        monthlyFinancials: {
          issued: 12500000,
          paid: 8300000,
          difference: 4200000,
          trend: 15.2
        },
        topClients: [
          { id: '1', name: '㈜테크스타트', revenue: 3200000, percentage: 28.5 },
          { id: '2', name: '디자인컴퍼니', revenue: 2800000, percentage: 24.9 },
          { id: '3', name: '이커머스플러스', revenue: 1900000, percentage: 16.9 }
        ],
        calendarEvents: [
          {
            id: 'inv-001',
            title: '㈜테크스타트 인보이스 발송',
            date: '2025-08-26',
            type: 'invoice'
          },
          {
            id: 'pay-001',
            title: '디자인컴퍼니 결제 완료',
            date: '2025-08-25',
            type: 'payment'
          },
          {
            id: 'dead-001',
            title: '웹사이트 리뉴얼 마감',
            date: '2025-09-01',
            type: 'deadline'
          },
          {
            id: 'meet-001',
            title: '이커머스플러스 프로젝트 미팅',
            date: '2025-08-28',
            type: 'meeting'
          },
          {
            id: 'rem-001',
            title: '월말 정산 리마인더',
            date: '2025-08-31',
            type: 'reminder'
          },
          {
            id: 'inv-002',
            title: '신규 클라이언트 견적서 제출',
            date: '2025-08-29',
            type: 'invoice'
          },
          {
            id: 'pay-002',
            title: '프로젝트 1차 결제 예정',
            date: '2025-09-03',
            type: 'payment'
          },
          {
            id: 'dead-002',
            title: '모바일 앱 개발 마감',
            date: '2025-09-05',
            type: 'deadline'
          }
        ]
      };

      setDashboardData(mockData);
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  // 빠른 실행 버튼들
  const quickActions: QuickAction[] = [
    {
      label: '새 프로젝트',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: () => console.log('Navigate to project creation'),
      variant: 'primary'
    }
  ];

  // 로딩 중일 때 표시할 인사이트 (스켈레톤)
  const loadingInsights: DashboardInsight[] = [
    {
      id: 'R1',
      title: '결제 지연 청구서',
      value: '로딩중...',
      icon: <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />,
      isEmpty: false
    },
    {
      id: 'R2', 
      title: '마감 임박 프로젝트',
      value: '로딩중...',
      icon: <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />,
      isEmpty: false
    },
    {
      id: 'R3',
      title: '이번 달 발행 vs 입금',
      value: '로딩중...',
      icon: <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />,
      isEmpty: false
    },
    {
      id: 'R4',
      title: '상위 고객 기여도',
      value: '로딩중...',
      icon: <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />,
      isEmpty: false
    }
  ];

  // 실제 데이터를 바탕으로 한 인사이트
  const insights: DashboardInsight[] = dashboardData ? [
    {
      id: 'R1',
      title: '결제 지연 청구서',
      value: `${dashboardData.overdueInvoices.count}건`,
      subtitle: `${(dashboardData.overdueInvoices.totalAmount / 10000).toLocaleString()}만원`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      variant: dashboardData.overdueInvoices.count > 0 ? 'warning' : 'default',
      actionLabel: dashboardData.overdueInvoices.count > 0 ? '연체 내역 보기' : undefined,
      onActionClick: dashboardData.overdueInvoices.count > 0 ? () => console.log('Show overdue invoices') : undefined,
      isEmpty: dashboardData.overdueInvoices.count === 0,
      emptyMessage: '연체된 청구서가 없습니다 👍'
    },
    {
      id: 'R2',
      title: '마감 임박 프로젝트',
      value: `${dashboardData.upcomingDeadlines.count}건`,
      subtitle: dashboardData.upcomingDeadlines.count > 0 ? 
        `가장 빠른 마감: D-${Math.min(...dashboardData.upcomingDeadlines.projects.map(p => p.daysLeft))}` : 
        undefined,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      variant: dashboardData.upcomingDeadlines.count > 0 ? 'info' : 'default',
      actionLabel: dashboardData.upcomingDeadlines.count > 0 ? '프로젝트 보기' : undefined,
      onActionClick: dashboardData.upcomingDeadlines.count > 0 ? () => console.log('Show upcoming projects') : undefined,
      isEmpty: dashboardData.upcomingDeadlines.count === 0,
      emptyMessage: '마감 임박 프로젝트가 없습니다'
    },
    {
      id: 'R3',
      title: '이번 달 발행 vs 입금',
      value: `${(dashboardData.monthlyFinancials.issued / 10000).toLocaleString()}만원`,
      subtitle: `입금: ${(dashboardData.monthlyFinancials.paid / 10000).toLocaleString()}만원 (차액: ${(dashboardData.monthlyFinancials.difference / 10000).toLocaleString()}만원)`,
      trend: {
        value: dashboardData.monthlyFinancials.trend,
        label: '지난달 대비',
        isPositive: dashboardData.monthlyFinancials.trend > 0
      },
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      variant: 'success',
      actionLabel: '상세 리포트',
      onActionClick: () => console.log('Show financial report')
    },
    {
      id: 'R4',
      title: '상위 고객 기여도',
      value: dashboardData.topClients.length > 0 ? dashboardData.topClients[0].name : '데이터 없음',
      subtitle: dashboardData.topClients.length > 0 ? 
        `${(dashboardData.topClients[0].revenue / 10000).toLocaleString()}만원 (${dashboardData.topClients[0].percentage}%)` : 
        undefined,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      actionLabel: '고객 상세',
      onActionClick: () => console.log('Show client details'),
      isEmpty: dashboardData.topClients.length === 0,
      emptyMessage: '고객 데이터가 없습니다'
    }
  ] : loadingInsights;

  return (
    <AppLayout>
      <WorkspacePageContainer>
        <DashboardLayout
          insights={insights}
          quickActions={quickActions}
        >
          {/* 캘린더 및 추가 차트 */}
          <div className="grid grid-cols-1 gap-6">
            {/* 비즈니스 캘린더 */}
            <div className="mb-6">
              <DashboardCalendar 
                events={dashboardData?.calendarEvents || []}
                onDateSelect={(date) => console.log('Selected date:', date)}
                onEventClick={(event) => console.log('Clicked event:', event)}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-border-light p-6">
                <Typography variant="h4" className="mb-4">
                  최근 활동
                </Typography>
                <div className="space-y-4">
                  <div className="text-sm text-txt-tertiary">
                    실제 데이터 연동 시 최근 인보이스 발행, 결제 완료, 프로젝트 업데이트 등의 활동이 표시됩니다.
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-border-light p-6">
                <Typography variant="h4" className="mb-4">
                  월별 매출 추이
                </Typography>
                <div className="space-y-4">
                  <div className="text-sm text-txt-tertiary">
                    차트 라이브러리 연동 시 월별 매출 그래프가 표시됩니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </WorkspacePageContainer>
    </AppLayout>
  );
}