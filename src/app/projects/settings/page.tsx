'use client';

import React from 'react';
import { FormPageContainer } from '@/components/layout/PageContainer';
import { Typography, Card } from '@/components/ui';
import { Settings, Bell, Calendar, Users, FileText } from 'lucide-react';
import ReminderRulesManager from '@/components/reminders/ReminderRulesManager';

export default function ProjectSettingsPage() {
  return (
    <FormPageContainer>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-weave-primary-light rounded-lg">
          <Settings className="w-6 h-6 text-weave-primary" />
        </div>
        <div>
          <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">
            프로젝트 설정
          </Typography>
          <Typography variant="body1" className="text-txt-secondary">
            프로젝트 관리 설정 및 리마인더 규칙을 관리합니다
          </Typography>
        </div>
      </div>

      <div className="space-y-6">
        {/* 리마인더 설정 섹션 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-weave-primary" />
            <Typography variant="h3" className="text-txt-primary">
              리마인더 규칙
            </Typography>
          </div>
          <Typography variant="body2" className="text-txt-secondary mb-6">
            프로젝트별 자동 리마인더 규칙을 설정하여 중요한 일정을 놓치지 마세요
          </Typography>
          <ReminderRulesManager />
        </Card>

        {/* 기본 설정 섹션 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-weave-primary" />
            <Typography variant="h3" className="text-txt-primary">
              일정 관리 설정
            </Typography>
          </div>
          <div className="space-y-4">
            <div>
              <Typography variant="body2" className="text-txt-primary mb-2">
                기본 프로젝트 기간
              </Typography>
              <select className="w-full px-3 py-2 bg-bg-secondary rounded-lg border border-border-light">
                <option>1개월</option>
                <option>3개월</option>
                <option>6개월</option>
                <option>1년</option>
              </select>
            </div>
            <div>
              <Typography variant="body2" className="text-txt-primary mb-2">
                작업일 설정
              </Typography>
              <div className="flex gap-2">
                {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                  <button
                    key={day}
                    className="px-3 py-1.5 bg-bg-secondary rounded border border-border-light hover:bg-weave-primary-light hover:text-weave-primary transition-colors"
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 템플릿 설정 섹션 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-weave-primary" />
            <Typography variant="h3" className="text-txt-primary">
              문서 템플릿 설정
            </Typography>
          </div>
          <Typography variant="body2" className="text-txt-secondary mb-4">
            프로젝트에서 사용할 기본 문서 템플릿을 설정합니다
          </Typography>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <Typography variant="body2">계약서 템플릿 자동 생성</Typography>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <Typography variant="body2">견적서 템플릿 자동 생성</Typography>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <Typography variant="body2">보고서 템플릿 자동 생성</Typography>
            </label>
          </div>
        </Card>

        {/* 팀 설정 섹션 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-weave-primary" />
            <Typography variant="h3" className="text-txt-primary">
              팀 관리 설정
            </Typography>
          </div>
          <Typography variant="body2" className="text-txt-secondary mb-4">
            프로젝트 팀원 권한 및 알림 설정을 관리합니다
          </Typography>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <Typography variant="body2">새 프로젝트 생성 시 팀원 자동 초대</Typography>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <Typography variant="body2">프로젝트 상태 변경 시 팀원 알림</Typography>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <Typography variant="body2">일일 프로젝트 요약 이메일 발송</Typography>
            </label>
          </div>
        </Card>
      </div>
    </FormPageContainer>
  );
}