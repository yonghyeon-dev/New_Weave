'use client';

import React, { useState } from 'react';
import Typography from '@/components/ui/Typography';
import { StatusChartData } from './types';
import { ReminderStatus } from '@/lib/types/reminder';

interface ReminderStatusChartProps {
  data: StatusChartData[];
  totalCount: number;
  successRate: number;
}

// 목업 데이터
const mockStatusData: StatusChartData[] = [
  {
    id: 'delivered',
    status: ReminderStatus.DELIVERED,
    label: '전달됨',
    value: 147,
    percentage: 45.2,
    color: '#22c55e',
    icon: '✅',
    description: '성공적으로 전달된 리마인더'
  },
  {
    id: 'sent',
    status: ReminderStatus.SENT,
    label: '발송됨',
    value: 89,
    percentage: 27.4,
    color: '#3b82f6',
    icon: '📧',
    description: '발송되었지만 전달 확인 안됨'
  },
  {
    id: 'pending',
    status: ReminderStatus.PENDING,
    label: '대기중',
    value: 52,
    percentage: 16.0,
    color: '#eab308',
    icon: '⏳',
    description: '발송 대기 중인 리마인더'
  },
  {
    id: 'failed',
    status: ReminderStatus.FAILED,
    label: '실패',
    value: 23,
    percentage: 7.1,
    color: '#ef4444',
    icon: '❌',
    description: '발송에 실패한 리마인더'
  },
  {
    id: 'clicked',
    status: ReminderStatus.CLICKED,
    label: '클릭됨',
    value: 14,
    percentage: 4.3,
    color: '#06b6d4',
    icon: '👆',
    description: '수신자가 클릭한 리마인더'
  }
];

// DonutChart SVG Component
const DonutChart = ({ data, size = 200 }: { data: StatusChartData[], size?: number }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 80;
  const innerRadius = 50;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  let cumulativePercentage = 0;
  
  const createArcPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);
    
    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);
    
    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} z`;
  };

  return (
    <svg width={size} height={size} className="mx-auto">
      {data.map((item, index) => {
        const startAngle = cumulativePercentage * 3.6;
        const endAngle = (cumulativePercentage + item.percentage) * 3.6;
        cumulativePercentage += item.percentage;
        
        const pathData = createArcPath(startAngle, endAngle, radius, innerRadius);
        const isHovered = hoveredIndex === index;
        const currentRadius = isHovered ? radius + 5 : radius;
        const hoveredPathData = isHovered ? createArcPath(startAngle, endAngle, currentRadius, innerRadius) : pathData;
        
        return (
          <path
            key={item.id}
            d={hoveredPathData}
            fill={item.color}
            stroke="#fff"
            strokeWidth="2"
            className="transition-all duration-200 cursor-pointer"
            style={{
              filter: isHovered ? 'brightness(110%)' : undefined,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        );
      })}
    </svg>
  );
};

export default function ReminderStatusChart({ 
  data = mockStatusData, 
  totalCount = 325, 
  successRate = 87.2 
}: ReminderStatusChartProps) {
  return (
    <div className="w-full">
      {/* 도넛 차트와 중앙 통계 */}
      <div className="relative flex items-center justify-center mb-6">
        <DonutChart data={data} size={240} />
        
        {/* 중앙 통계 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Typography variant="h3" className="text-txt-primary font-bold text-2xl">
              {totalCount.toLocaleString()}
            </Typography>
            <Typography variant="caption" className="text-txt-secondary block">
              총 리마인더
            </Typography>
            <Typography variant="body2" className="text-green-600 font-semibold mt-1">
              성공률 {successRate}%
            </Typography>
          </div>
        </div>
      </div>
      
      {/* 범례 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-bg-secondary/30 transition-colors">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm">{item.icon}</span>
                <Typography variant="caption" className="text-txt-primary block truncate font-medium">
                  {item.label}
                </Typography>
              </div>
              <Typography variant="caption" className="text-txt-secondary">
                {item.value}개 ({item.percentage}%)
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}