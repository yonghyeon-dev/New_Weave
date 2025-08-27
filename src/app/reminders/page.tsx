'use client';

import React, { useState } from 'react';
import { ArrowLeft, Bell, Settings, Clock, Plus, BarChart3 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import AppLayout from '@/components/layout/AppLayout';
import ReminderDashboard from '@/components/reminders/ReminderDashboard';
import ReminderRulesManager from '@/components/reminders/ReminderRulesManager';
import { ReminderRule } from '@/lib/types/reminder';

type ViewMode = 'dashboard' | 'rules' | 'settings' | 'logs' | 'create-rule' | 'edit-rule';

export default function RemindersPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedRule, setSelectedRule] = useState<ReminderRule | null>(null);

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedRule(null);
  };

  const handleCreateRule = () => {
    setCurrentView('create-rule');
  };

  const handleEditRule = (rule: ReminderRule) => {
    setSelectedRule(rule);
    setCurrentView('edit-rule');
  };

  const handleViewSettings = () => {
    setCurrentView('settings');
  };

  const handleViewRules = () => {
    setCurrentView('rules');
  };

  const handleViewLogs = () => {
    setCurrentView('logs');
  };

  const renderHeader = () => {
    const titles = {
      dashboard: '리마인더 대시보드',
      rules: '리마인더 규칙',
      settings: '리마인더 설정',
      logs: '발송 내역',
      'create-rule': '새 리마인더 규칙',
      'edit-rule': '리마인더 규칙 편집'
    };

    const icons = {
      dashboard: <BarChart3 className="w-6 h-6" />,
      rules: <Settings className="w-6 h-6" />,
      settings: <Settings className="w-6 h-6" />,
      logs: <Clock className="w-6 h-6" />,
      'create-rule': <Plus className="w-6 h-6" />,
      'edit-rule': <Settings className="w-6 h-6" />
    };

    return (
      <div className="flex items-center gap-4 mb-8">
        {currentView !== 'dashboard' && (
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            대시보드로
          </Button>
        )}
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-weave-primary-light rounded-lg">
            {icons[currentView]}
          </div>
          <div>
            <Typography variant="h2" className="text-2xl text-txt-primary">
              {titles[currentView]}
            </Typography>
            <Typography variant="body1" className="text-txt-secondary">
              {currentView === 'dashboard' && '리마인더 시스템 상태와 성과를 확인하세요'}
              {currentView === 'rules' && '자동 리마인더 규칙을 관리하세요'}
              {currentView === 'settings' && '리마인더 시스템 설정을 구성하세요'}
              {currentView === 'logs' && '발송된 리마인더 내역을 조회하세요'}
              {currentView === 'create-rule' && '새로운 리마인더 규칙을 만들어보세요'}
              {currentView === 'edit-rule' && '리마인더 규칙을 수정하세요'}
            </Typography>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <ReminderDashboard
            onCreateRule={handleCreateRule}
            onViewSettings={handleViewSettings}
            onViewRules={handleViewRules}
            onViewLogs={handleViewLogs}
          />
        );
        
      case 'rules':
        return (
          <ReminderRulesManager
            onCreateRule={handleCreateRule}
            onEditRule={handleEditRule}
          />
        );
        
      case 'settings':
        return (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg border border-border-light p-8 text-center">
              <Settings className="w-16 h-16 text-txt-disabled mx-auto mb-4" />
              <Typography variant="h3" className="mb-2">
                설정 페이지 준비 중
              </Typography>
              <Typography variant="body1" className="text-txt-secondary mb-6">
                리마인더 시스템 설정 기능을 개발 중입니다.
              </Typography>
              <Button variant="outline" onClick={handleBackToDashboard}>
                대시보드로 돌아가기
              </Button>
            </div>
          </div>
        );
        
      case 'logs':
        return (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg border border-border-light p-8 text-center">
              <Clock className="w-16 h-16 text-txt-disabled mx-auto mb-4" />
              <Typography variant="h3" className="mb-2">
                발송 내역 페이지 준비 중
              </Typography>
              <Typography variant="body1" className="text-txt-secondary mb-6">
                리마인더 발송 내역 조회 기능을 개발 중입니다.
              </Typography>
              <Button variant="outline" onClick={handleBackToDashboard}>
                대시보드로 돌아가기
              </Button>
            </div>
          </div>
        );
        
      case 'create-rule':
        return (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg border border-border-light p-8 text-center">
              <Plus className="w-16 h-16 text-txt-disabled mx-auto mb-4" />
              <Typography variant="h3" className="mb-2">
                규칙 생성 폼 준비 중
              </Typography>
              <Typography variant="body1" className="text-txt-secondary mb-6">
                새로운 리마인더 규칙 생성 폼을 개발 중입니다.
              </Typography>
              <Button variant="outline" onClick={() => setCurrentView('rules')}>
                규칙 목록으로 돌아가기
              </Button>
            </div>
          </div>
        );
        
      case 'edit-rule':
        return (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg border border-border-light p-8 text-center">
              <Settings className="w-16 h-16 text-txt-disabled mx-auto mb-4" />
              <Typography variant="h3" className="mb-2">
                규칙 편집 폼 준비 중
              </Typography>
              <Typography variant="body1" className="text-txt-secondary mb-6">
                리마인더 규칙 편집 폼을 개발 중입니다.
              </Typography>
              {selectedRule && (
                <div className="bg-bg-secondary rounded-lg p-4 mb-6">
                  <Typography variant="body2" className="text-txt-secondary mb-1">
                    편집할 규칙:
                  </Typography>
                  <Typography variant="h4">
                    {selectedRule.name}
                  </Typography>
                </div>
              )}
              <Button variant="outline" onClick={() => setCurrentView('rules')}>
                규칙 목록으로 돌아가기
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          {renderHeader()}
          {renderContent()}
        </div>
      </div>
    </AppLayout>
  );
}