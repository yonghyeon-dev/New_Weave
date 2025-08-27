'use client';

import React from 'react';
import InsightCard from './InsightCard';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

// 대시보드 룰 R1-R4에 해당하는 인사이트 데이터 타입
export interface DashboardInsight {
  id: 'R1' | 'R2' | 'R3' | 'R4';
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  icon: React.ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
  variant?: 'default' | 'warning' | 'success' | 'info';
  isEmpty?: boolean;
  emptyMessage?: string;
}

export interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface DashboardLayoutProps {
  insights: DashboardInsight[];
  quickActions?: QuickAction[];
  className?: string;
  children?: React.ReactNode;
}

export default function DashboardLayout({
  insights,
  quickActions = [],
  className = '',
  children
}: DashboardLayoutProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="text-2xl mb-1">대시보드</Typography>
          <Typography variant="body1" className="text-txt-secondary">
            비즈니스 현황을 한눈에 확인하세요
          </Typography>
        </div>
        
        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <div className="flex space-x-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                onClick={action.onClick}
                className="flex items-center space-x-2"
              >
                {action.icon}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            value={insight.value}
            subtitle={insight.subtitle}
            trend={insight.trend}
            icon={insight.icon}
            actionLabel={insight.actionLabel}
            onActionClick={insight.onActionClick}
            variant={insight.variant}
            isEmpty={insight.isEmpty}
            emptyMessage={insight.emptyMessage}
          />
        ))}
      </div>

      {/* Additional Content */}
      {children && (
        <div className="mt-8">
          {children}
        </div>
      )}
    </div>
  );
}