'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  BarChart3,
  Activity
} from 'lucide-react';
import Typography from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ReminderStats } from '@/lib/types/reminder';

interface IntegratedInfoPanelProps {
  stats: ReminderStats;
  onViewLogs?: () => void;
}

// 목업 데이터
const mockRecentActivity = [
  {
    id: '1',
    type: 'reminder_sent',
    clientName: '테크스타트업',
    invoiceNumber: 'INV-2024-001',
    amount: '₩1,200,000',
    status: '전달됨',
    time: '2시간 전',
    icon: Mail,
    statusColor: 'accent'
  },
  {
    id: '2',
    type: 'payment_received',
    clientName: '디지털에이전시',
    invoiceNumber: 'INV-2024-002',
    amount: '₩850,000',
    status: '결제완료',
    time: '4시간 전',
    icon: CheckCircle,
    statusColor: 'success'
  },
  {
    id: '3',
    type: 'reminder_scheduled',
    clientName: '온라인쇼핑몰',
    invoiceNumber: 'INV-2024-003',
    amount: '₩2,100,000',
    status: '예약됨',
    time: '6시간 전',
    icon: Clock,
    statusColor: 'secondary'
  }
];

const mockSentHistory = [
  {
    id: '1',
    clientName: '테크스타트업',
    invoiceNumber: 'INV-2024-001',
    reminderType: '정중한 리마인더',
    sentAt: '오늘 14:30',
    status: '전달됨',
    openRate: '읽음'
  },
  {
    id: '2',
    clientName: '디지털에이전시', 
    invoiceNumber: 'INV-2024-002',
    reminderType: '연체 통지',
    sentAt: '오늘 11:15',
    status: '전달됨',
    openRate: '읽음'
  },
  {
    id: '3',
    clientName: '스마트솔루션',
    invoiceNumber: 'INV-2024-004',
    reminderType: '최종 통지',
    sentAt: '오늘 09:45',
    status: '전달됨',
    openRate: '미읽음'
  }
];

export default function IntegratedInfoPanel({ stats, onViewLogs }: IntegratedInfoPanelProps) {
  const [activeTab, setActiveTab] = useState<'activity' | 'history'>('activity');

  const statItems = [
    {
      id: 'sent',
      label: '오늘 발송',
      value: stats.sentToday,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: Mail,
      trend: '+12%'
    },
    {
      id: 'upcoming',
      label: '예정된 리마인더',
      value: stats.upcomingReminders,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: Calendar,
      trend: '+5%'
    },
    {
      id: 'success',
      label: '성공률',
      value: `${Math.round(stats.successRate)}%`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: TrendingUp,
      trend: '+2.3%'
    },
    {
      id: 'overdue',
      label: '연체 인보이스',
      value: stats.overdueInvoices,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: AlertCircle,
      trend: '-8%'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 주요 지표 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-weave-primary" />
          <Typography variant="h4" className="text-txt-primary">
            주요 지표
          </Typography>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {statItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <div key={item.id} className="flex items-center gap-2">
                <div className={`p-2 ${item.bgColor} rounded-lg flex-shrink-0`}>
                  <IconComponent className={`w-4 h-4 ${item.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Typography variant="caption" className="text-txt-secondary block truncate">
                    {item.label}
                  </Typography>
                  <div className="flex items-center gap-1">
                    <Typography variant="body2" className={`${item.color} font-bold`}>
                      {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      className={`text-xs px-1 rounded ${
                        item.trend.startsWith('+') ? 'text-status-success bg-bg-success' : 
                        item.trend.startsWith('-') ? 'text-status-error bg-bg-error' : 
                        'text-txt-tertiary bg-bg-secondary'
                      }`}
                    >
                      {item.trend}
                    </Typography>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 활동 & 발송내역 통합 */}
      <div className="lg:col-span-2">
        <Card className="p-4">
          {/* 탭 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-weave-primary" />
              <Typography variant="h4" className="text-txt-primary">
                활동 현황
              </Typography>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onViewLogs}
              className="flex items-center gap-1 text-xs"
            >
              전체보기
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>

          {/* WEAVE 표준 탭 네비게이션 */}
          <div className="border-b border-border-light mb-4">
            <nav className="-mb-px flex space-x-8" aria-label="활동 탭">
              <button
                onClick={() => setActiveTab('activity')}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === 'activity'
                    ? 'border-weave-primary text-weave-primary' 
                    : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-medium'
                  }
                `}
                aria-current={activeTab === 'activity' ? 'page' : undefined}
              >
                최근 활동
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === 'history'
                    ? 'border-weave-primary text-weave-primary' 
                    : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-medium'
                  }
                `}
                aria-current={activeTab === 'history' ? 'page' : undefined}
              >
                발송 내역
              </button>
            </nav>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="space-y-3">
            {activeTab === 'activity' && (
              <>
                {mockRecentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  
                  return (
                    <div key={activity.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-bg-secondary/30 transition-colors">
                      <div className="p-2 bg-weave-primary-light rounded-lg flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-weave-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Typography variant="body2" className="font-medium text-txt-primary truncate">
                            {activity.clientName}
                          </Typography>
                          <Badge 
                            variant={activity.statusColor as any} 
                            size="sm"
                            className="flex-shrink-0"
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Typography variant="caption" className="text-txt-secondary">
                            {activity.invoiceNumber} • {activity.amount}
                          </Typography>
                          <Typography variant="caption" className="text-txt-tertiary flex-shrink-0">
                            {activity.time}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {activeTab === 'history' && (
              <>
                {mockSentHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-bg-secondary/30 transition-colors">
                    <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Typography variant="body2" className="font-medium text-txt-primary truncate">
                          {item.clientName}
                        </Typography>
                        <Badge variant="outline" size="sm" className="flex-shrink-0">
                          {item.reminderType}
                        </Badge>
                        <Badge 
                          variant={item.openRate === '읽음' ? 'positive' : 'secondary'} 
                          size="sm"
                          className="flex-shrink-0"
                        >
                          {item.openRate}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Typography variant="caption" className="text-txt-secondary">
                          {item.invoiceNumber} • {item.status}
                        </Typography>
                        <Typography variant="caption" className="text-txt-tertiary flex-shrink-0">
                          {item.sentAt}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* 하단 요약 통계 */}
          <div className="mt-4 pt-3 border-t border-border-light">
            {activeTab === 'activity' && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Typography variant="h4" className="text-blue-600 font-bold">
                    12
                  </Typography>
                  <Typography variant="caption" className="text-txt-secondary">
                    오늘 활동
                  </Typography>
                </div>
                <div>
                  <Typography variant="h4" className="text-green-600 font-bold">
                    5
                  </Typography>
                  <Typography variant="caption" className="text-txt-secondary">
                    결제 완료
                  </Typography>
                </div>
                <div>
                  <Typography variant="h4" className="text-orange-600 font-bold">
                    7
                  </Typography>
                  <Typography variant="caption" className="text-txt-secondary">
                    발송 예정
                  </Typography>
                </div>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Typography variant="h4" className="text-blue-600 font-bold">
                    {stats.sentToday}
                  </Typography>
                  <Typography variant="caption" className="text-txt-secondary">
                    오늘 발송
                  </Typography>
                </div>
                <div>
                  <Typography variant="h4" className="text-green-600 font-bold">
                    {Math.round(stats.successRate)}%
                  </Typography>
                  <Typography variant="caption" className="text-txt-secondary">
                    전달율
                  </Typography>
                </div>
                <div>
                  <Typography variant="h4" className="text-purple-600 font-bold">
                    85%
                  </Typography>
                  <Typography variant="caption" className="text-txt-secondary">
                    읽음율
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}