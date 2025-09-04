'use client';

import React from 'react';
import { SystemMonitor } from '@/components/admin/SystemMonitor';
import { WorkspacePageContainer } from '@/components/layout/PageContainer';
import { Shield } from 'lucide-react';
import Typography from '@/components/ui/Typography';

export default function SystemAdminPage() {
  return (
    <WorkspacePageContainer>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 rounded-lg">
          <Shield className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">
            시스템 관리
          </Typography>
          <Typography variant="body1" className="text-txt-secondary">
            시스템 안정성 모니터링 및 기능 제어
          </Typography>
        </div>
      </div>

      <SystemMonitor />
    </WorkspacePageContainer>
  );
}