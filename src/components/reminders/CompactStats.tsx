'use client';

import React from 'react';
import { Mail, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import Typography from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { ReminderStats } from '@/lib/types/reminder';

interface CompactStatsProps {
  stats: ReminderStats;
}

export default function CompactStats({ stats }: CompactStatsProps) {
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
    <Card className="p-4">
      <Typography variant="h4" className="mb-4 text-txt-primary">
        주요 지표
      </Typography>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className={`p-2 ${item.bgColor} rounded-lg flex-shrink-0`}>
                <IconComponent className={`w-4 h-4 ${item.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <Typography variant="caption" className="text-txt-secondary block truncate">
                  {item.label}
                </Typography>
                <div className="flex items-center gap-2">
                  <Typography variant="h4" className={`${item.color} font-bold`}>
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    className={`text-xs px-1 py-0.5 rounded ${
                      item.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 
                      item.trend.startsWith('-') ? 'text-red-600 bg-red-50' : 
                      'text-gray-600 bg-gray-50'
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
  );
}