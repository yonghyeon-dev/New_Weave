'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import ChartContainer from './charts/ChartContainer';
import ReminderStatusChart from './charts/ReminderStatusChart';
import ReminderTypeChart from './charts/ReminderTypeChart';
import CompactStats from './CompactStats';
import CompactRecentActivity from './CompactRecentActivity';
import IntegratedInfoPanel from './IntegratedInfoPanel';
import TabbedCharts from './TabbedCharts';

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

  const loadStats = useCallback(async () => {
    try {
      const reminderStats = await reminderEngine.getStats();
      setStats(reminderStats);
    } catch (error) {
      console.error('Failed to load reminder stats:', error);
    }
  }, [reminderEngine]);

  useEffect(() => {
    loadStats();
    
    // Auto-refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [loadStats]);

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
      {/* Control Panel */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Badge 
            variant={systemEnabled ? "positive" : "neutral"} 
            size="sm"
          >
            {systemEnabled ? '활성화됨' : '비활성화됨'}
          </Badge>
          
          <Button
            variant="outline"
            onClick={toggleSystem}
            className={`flex items-center gap-2 ${
              systemEnabled ? 'text-red-600 hover:bg-bg-secondary' : 'text-green-600 hover:bg-bg-secondary'
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
        systemEnabled ? 'border-l-green-500 bg-bg-secondary/30' : 'border-l-gray-400 bg-bg-secondary/20'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              systemEnabled ? 'bg-weave-primary-light' : 'bg-bg-secondary'
            }`}>
              {systemEnabled ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-txt-tertiary" />
              )}
            </div>
            <div>
              <Typography variant="h4" className={
                systemEnabled ? 'text-txt-primary' : 'text-txt-tertiary'
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

      {/* 통합 정보 패널 (주요지표 + 최근활동 + 발송내역) */}
      <IntegratedInfoPanel 
        stats={stats} 
        onViewLogs={onViewLogs} 
      />

      {/* 탭형 분포 차트 */}
      <TabbedCharts stats={stats} />
    </div>
  );
}