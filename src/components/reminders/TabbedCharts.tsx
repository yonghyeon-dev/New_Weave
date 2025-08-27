'use client';

import React, { useState } from 'react';
import { PieChart, BarChart3 } from 'lucide-react';
import Typography from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { ReminderStats } from '@/lib/types/reminder';
import ReminderStatusChart from './charts/ReminderStatusChart';
import ReminderTypeChart from './charts/ReminderTypeChart';

interface TabbedChartsProps {
  stats: ReminderStats;
}

export default function TabbedCharts({ stats }: TabbedChartsProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'type'>('status');

  const tabs = [
    {
      id: 'status' as const,
      label: '상태별 분포',
      icon: PieChart,
      description: '리마인더 상태별 현황을 시각적으로 확인'
    },
    {
      id: 'type' as const,
      label: '유형별 분포',
      icon: BarChart3,
      description: '리마인더 유형별 사용 현황을 확인'
    }
  ];

  return (
    <Card className="p-6">
      {/* 탭 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h4" className="text-txt-primary">
          리마인더 분포 분석
        </Typography>
        
        {/* 활성 탭 설명 */}
        <div className="text-right">
          <Typography variant="body2" className="text-txt-secondary">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </Typography>
        </div>
      </div>

      {/* WEAVE 표준 탭 네비게이션 */}
      <div className="border-b border-border-light mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-weave-primary text-weave-primary' 
                    : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-medium'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="relative min-h-[400px]">
        {activeTab === 'status' && (
          <div className="animate-in fade-in duration-200">
            <ReminderStatusChart
              data={[]} // Uses mock data
              totalCount={stats.totalReminders}
              successRate={stats.successRate}
            />
          </div>
        )}

        {activeTab === 'type' && (
          <div className="animate-in fade-in duration-200">
            <ReminderTypeChart
              data={[]} // Uses mock data
              totalCount={stats.totalReminders}
            />
          </div>
        )}
      </div>

      {/* 차트 하단 인사이트 */}
      <div className="mt-6 pt-6 border-t border-border-light">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTab === 'status' && (
            <>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Typography variant="h4" className="text-green-600 font-bold mb-1">
                  {Math.round(stats.successRate)}%
                </Typography>
                <Typography variant="caption" className="text-green-700">
                  전체 성공률
                </Typography>
                <Typography variant="caption" className="text-txt-secondary block">
                  전달+클릭 기준
                </Typography>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Typography variant="h4" className="text-blue-600 font-bold mb-1">
                  147
                </Typography>
                <Typography variant="caption" className="text-blue-700">
                  성공적 전달
                </Typography>
                <Typography variant="caption" className="text-txt-secondary block">
                  오늘 기준
                </Typography>
              </div>
              
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Typography variant="h4" className="text-orange-600 font-bold mb-1">
                  52
                </Typography>
                <Typography variant="caption" className="text-orange-700">
                  대기중인 작업
                </Typography>
                <Typography variant="caption" className="text-txt-secondary block">
                  처리 예정
                </Typography>
              </div>
            </>
          )}

          {activeTab === 'type' && (
            <>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Typography variant="h4" className="text-blue-600 font-bold mb-1">
                  48%
                </Typography>
                <Typography variant="caption" className="text-blue-700">
                  정중한 리마인더
                </Typography>
                <Typography variant="caption" className="text-txt-secondary block">
                  가장 많이 사용됨
                </Typography>
              </div>
              
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <Typography variant="h4" className="text-red-600 font-bold mb-1">
                  26%
                </Typography>
                <Typography variant="caption" className="text-red-700">
                  연체 관련 알림
                </Typography>
                <Typography variant="caption" className="text-txt-secondary block">
                  연체+최종 통지
                </Typography>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Typography variant="h4" className="text-green-600 font-bold mb-1">
                  92%
                </Typography>
                <Typography variant="caption" className="text-green-700">
                  감사 메시지 응답률
                </Typography>
                <Typography variant="caption" className="text-txt-secondary block">
                  고객 만족도 지표
                </Typography>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}