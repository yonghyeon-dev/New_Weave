'use client';

import React, { useState } from 'react';
import Typography from '@/components/ui/Typography';
import { TypeChartData } from './types';
import { ReminderType } from '@/lib/types/reminder';

interface ReminderTypeChartProps {
  data: TypeChartData[];
  totalCount: number;
}

// 목업 데이터
const mockTypeData: TypeChartData[] = [
  {
    id: 'gentle_reminder',
    type: ReminderType.GENTLE_REMINDER,
    label: '정중한 리마인더',
    value: 156,
    percentage: 48.0,
    color: '#3b82f6',
    icon: '💬',
    description: '결제 기한 전후의 정중한 알림'
  },
  {
    id: 'payment_due',
    type: ReminderType.PAYMENT_DUE,
    label: '결제 기한',
    value: 78,
    percentage: 24.0,
    color: '#f59e0b',
    icon: '⏰',
    description: '결제 기한 당일 알림'
  },
  {
    id: 'overdue_notice',
    type: ReminderType.OVERDUE_NOTICE,
    label: '연체 통지',
    value: 67,
    percentage: 20.6,
    color: '#ef4444',
    icon: '⚠️',
    description: '결제 기한 초과 시 발송되는 연체 알림'
  },
  {
    id: 'final_notice',
    type: ReminderType.FINAL_NOTICE,
    label: '최종 통지',
    value: 18,
    percentage: 5.5,
    color: '#dc2626',
    icon: '🚨',
    description: '최종 경고 단계의 강력한 알림'
  },
  {
    id: 'thank_you',
    type: ReminderType.THANK_YOU,
    label: '감사 인사',
    value: 6,
    percentage: 1.9,
    color: '#10b981',
    icon: '🙏',
    description: '결제 완료 후 감사 메시지'
  }
];

// 수평 바 차트 컴포넌트
const HorizontalBarChart = ({ data, maxValue }: { data: TypeChartData[], maxValue: number }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const widthPercentage = (item.value / maxValue) * 100;
        const isHovered = hoveredIndex === index;
        
        return (
          <div
            key={item.id}
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <Typography variant="body2" className="font-medium text-txt-primary">
                  {item.label}
                </Typography>
              </div>
              <div className="text-right">
                <Typography variant="body2" className="font-medium text-txt-primary">
                  {item.value}개
                </Typography>
                <Typography variant="caption" className="text-txt-secondary">
                  {item.percentage}%
                </Typography>
              </div>
            </div>
            
            <div className="relative">
              {/* 배경 바 */}
              <div className="w-full h-6 bg-bg-secondary rounded-full overflow-hidden">
                {/* 진행률 바 */}
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{
                    width: `${widthPercentage}%`,
                    background: `linear-gradient(90deg, ${item.color}CC, ${item.color})`,
                    transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)',
                  }}
                >
                  {/* 그라데이션 효과 */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)`,
                    }}
                  />
                </div>
              </div>
              
              {/* 호버 시 툴팁 */}
              {isHovered && (
                <div className="absolute top-8 left-4 z-10 bg-white border border-border-light rounded-lg p-3 shadow-lg max-w-xs">
                  <Typography variant="caption" className="text-txt-secondary">
                    {item.description}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function ReminderTypeChart({ 
  data = mockTypeData, 
  totalCount = 325 
}: ReminderTypeChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  const mostUsedType = data.reduce((prev, current) => (prev.value > current.value) ? prev : current);

  return (
    <div className="w-full">
      {/* 차트 상단 통계 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography variant="body2" className="text-txt-secondary">
            총 {totalCount.toLocaleString()}개의 리마인더
          </Typography>
        </div>
        <div className="text-right">
          <Typography variant="body2" className="text-txt-secondary">
            가장 많이 사용됨
          </Typography>
          <div className="flex items-center gap-1">
            <span>{mostUsedType.icon}</span>
            <Typography variant="body2" className="font-medium text-weave-primary">
              {mostUsedType.label}
            </Typography>
          </div>
        </div>
      </div>
      
      {/* 수평 바 차트 */}
      <div className="mb-6">
        <HorizontalBarChart data={data} maxValue={maxValue} />
      </div>
      
      {/* 상세 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-border-light">
                <span className="text-sm">{item.icon}</span>
              </div>
              <div>
                <Typography variant="body2" className="font-medium text-txt-primary">
                  {item.label}
                </Typography>
                <Typography variant="caption" className="text-txt-secondary truncate max-w-[120px]">
                  {item.description}
                </Typography>
              </div>
            </div>
            
            <div className="text-right">
              <Typography variant="body2" className="font-medium text-txt-primary">
                {item.value}개
              </Typography>
              <Typography variant="caption" className="text-txt-secondary">
                {item.percentage}%
              </Typography>
            </div>
          </div>
        ))}
      </div>
      
      {data.length > 4 && (
        <div className="mt-3 text-center">
          <Typography variant="caption" className="text-txt-secondary">
            그 외 {data.length - 4}개 유형 더 보기
          </Typography>
        </div>
      )}
    </div>
  );
}