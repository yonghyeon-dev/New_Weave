'use client';

import React from 'react';
import { Mail, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Typography from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface CompactRecentActivityProps {
  onViewAll?: () => void;
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

export default function CompactRecentActivity({ onViewAll }: CompactRecentActivityProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4" className="text-txt-primary">
          최근 활동
        </Typography>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs"
        >
          전체보기
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
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
      </div>
      
      {/* 활동 요약 */}
      <div className="mt-4 pt-3 border-t border-border-light">
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
      </div>
    </Card>
  );
}