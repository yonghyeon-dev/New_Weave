'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Settings,
  Play,
  Pause,
  Plus
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Typography from '@/components/ui/Typography';
import Progress from '@/components/ui/Progress';
import { ReminderEngine } from '@/lib/reminder-engine';
import { ReminderStats, ReminderStatus, ReminderType } from '@/lib/types/reminder';

interface ReminderDashboardProps {
  onCreateRule?: () => void;
  onViewSettings?: () => void;
  onViewRules?: () => void;
  onViewLogs?: () => void;
}

export default function ReminderDashboard({ 
  onCreateRule, 
  onViewSettings, 
  onViewRules, 
  onViewLogs 
}: ReminderDashboardProps) {
  const [stats, setStats] = useState<ReminderStats | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessed, setLastProcessed] = useState<Date | null>(null);
  const [systemEnabled, setSystemEnabled] = useState(true);

  const reminderEngine = ReminderEngine.getInstance();

  useEffect(() => {
    loadStats();
    
    // Auto-refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const reminderStats = await reminderEngine.getStats();
      setStats(reminderStats);
    } catch (error) {
      console.error('Failed to load reminder stats:', error);
    }
  };

  const handleProcessReminders = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const logs = await reminderEngine.processScheduledReminders();
      console.log(`Processed ${logs.length} reminders`);
      setLastProcessed(new Date());
      await loadStats();
    } catch (error) {
      console.error('Failed to process reminders:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSystem = async () => {
    const settings = reminderEngine.getSettings();
    const newEnabled = !systemEnabled;
    
    reminderEngine.updateSettings({ isEnabled: newEnabled });
    setSystemEnabled(newEnabled);
  };

  const getStatusColor = (status: ReminderStatus): string => {
    switch (status) {
      case ReminderStatus.SENT:
      case ReminderStatus.DELIVERED:
        return 'text-green-600';
      case ReminderStatus.FAILED:
      case ReminderStatus.BOUNCED:
        return 'text-red-600';
      case ReminderStatus.PENDING:
        return 'text-yellow-600';
      case ReminderStatus.CLICKED:
      case ReminderStatus.REPLIED:
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: ReminderType) => {
    switch (type) {
      case ReminderType.GENTLE_REMINDER:
        return '💬';
      case ReminderType.PAYMENT_DUE:
        return '⏰';
      case ReminderType.OVERDUE_NOTICE:
        return '⚠️';
      case ReminderType.FINAL_NOTICE:
        return '🚨';
      case ReminderType.THANK_YOU:
        return '🙏';
      default:
        return '📧';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('ko-KR');
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-weave-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="mb-2">
            인보이스 리마인더 시스템
          </Typography>
          <Typography variant="body1" className="text-txt-secondary">
            자동화된 결제 리마인더로 수금 관리를 효율적으로 하세요
          </Typography>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={systemEnabled ? "accent" : "secondary"} 
            className="px-3 py-1"
          >
            {systemEnabled ? '활성화됨' : '비활성화됨'}
          </Badge>
          
          <Button
            variant="outline"
            onClick={toggleSystem}
            className={`flex items-center gap-2 ${
              systemEnabled ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {systemEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {systemEnabled ? '시스템 정지' : '시스템 시작'}
          </Button>

          <Button
            variant="secondary"
            onClick={onViewSettings}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            설정
          </Button>

          <Button
            variant="primary"
            onClick={onCreateRule}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            새 규칙
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card className={`p-6 border-l-4 ${
        systemEnabled ? 'border-l-green-500 bg-green-50' : 'border-l-gray-400 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              systemEnabled ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {systemEnabled ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div>
              <Typography variant="h4" className={
                systemEnabled ? 'text-green-800' : 'text-gray-700'
              }>
                리마인더 시스템 {systemEnabled ? '정상 작동' : '정지됨'}
              </Typography>
              <Typography variant="body2" className="text-txt-secondary">
                {lastProcessed 
                  ? `마지막 처리: ${formatDate(lastProcessed)}`
                  : '아직 처리된 리마인더가 없습니다'
                }
              </Typography>
            </div>
          </div>
          
          <Button
            variant={systemEnabled ? "primary" : "secondary"}
            onClick={handleProcessReminders}
            disabled={isProcessing || !systemEnabled}
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                처리 중...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                즉시 처리
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-txt-secondary mb-1">
                오늘 발송
              </Typography>
              <Typography variant="h2" className="text-blue-600">
                {stats.sentToday}
              </Typography>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-txt-secondary mb-1">
                예정된 리마인더
              </Typography>
              <Typography variant="h2" className="text-orange-600">
                {stats.upcomingReminders}
              </Typography>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-txt-secondary mb-1">
                성공률
              </Typography>
              <Typography variant="h2" className="text-green-600">
                {Math.round(stats.successRate)}%
              </Typography>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-txt-secondary mb-1">
                연체 인보이스
              </Typography>
              <Typography variant="h2" className="text-red-600">
                {stats.overdueInvoices}
              </Typography>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <Typography variant="h4" className="mb-4">
            상태별 리마인더 분포
          </Typography>
          <div className="space-y-3">
            {Object.entries(stats.remindersByStatus).map(([status, count]) => {
              if (count === 0) return null;
              const percentage = stats.totalReminders > 0 
                ? (count / stats.totalReminders) * 100 
                : 0;
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'sent' || status === 'delivered' ? 'bg-green-500' :
                      status === 'failed' || status === 'bounced' ? 'bg-red-500' :
                      status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <Typography variant="body2" className="capitalize">
                      {status === 'sent' ? '발송됨' :
                       status === 'delivered' ? '전달됨' :
                       status === 'failed' ? '실패' :
                       status === 'bounced' ? '반송됨' :
                       status === 'pending' ? '대기중' :
                       status === 'clicked' ? '클릭됨' : '응답함'}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={percentage} className="w-20" />
                    <Typography variant="body2" className="w-12 text-right">
                      {count}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Type Distribution */}
        <Card className="p-6">
          <Typography variant="h4" className="mb-4">
            유형별 리마인더 분포
          </Typography>
          <div className="space-y-3">
            {Object.entries(stats.remindersByType).map(([type, count]) => {
              if (count === 0) return null;
              const percentage = stats.totalReminders > 0 
                ? (count / stats.totalReminders) * 100 
                : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {getTypeIcon(type as ReminderType)}
                    </span>
                    <Typography variant="body2">
                      {type === 'gentle_reminder' ? '정중한 리마인더' :
                       type === 'payment_due' ? '결제 기한' :
                       type === 'overdue_notice' ? '연체 통지' :
                       type === 'final_notice' ? '최종 통지' :
                       type === 'thank_you' ? '감사 인사' : '사용자 정의'}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={percentage} className="w-20" />
                    <Typography variant="body2" className="w-12 text-right">
                      {count}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4">
          빠른 액션
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            onClick={onViewRules}
            className="flex items-center justify-center gap-2 py-6"
          >
            <Settings className="w-5 h-5" />
            리마인더 규칙 관리
          </Button>
          
          <Button
            variant="outline"
            onClick={onViewLogs}
            className="flex items-center justify-center gap-2 py-6"
          >
            <Clock className="w-5 h-5" />
            발송 내역 조회
          </Button>
          
          <Button
            variant="outline"
            onClick={onCreateRule}
            className="flex items-center justify-center gap-2 py-6"
          >
            <Plus className="w-5 h-5" />
            새 리마인더 규칙
          </Button>
          
          <Button
            variant="outline"
            onClick={handleProcessReminders}
            disabled={isProcessing || !systemEnabled}
            className="flex items-center justify-center gap-2 py-6"
          >
            <Play className="w-5 h-5" />
            수동 리마인더 처리
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h4">
            최근 활동
          </Typography>
          <Button variant="ghost" onClick={onViewLogs}>
            전체 보기
          </Button>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border-light last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <Typography variant="body2" className="font-medium">
                    테크스타트업에 결제 리마인더 발송
                  </Typography>
                  <Typography variant="caption" className="text-txt-secondary">
                    INV-2024-00{i} • ₩1,200,000
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="accent" size="sm">전달됨</Badge>
                <Typography variant="caption" className="block text-txt-secondary mt-1">
                  {i}시간 전
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}