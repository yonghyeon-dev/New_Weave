'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { ArrowRight, Shield } from 'lucide-react';

export default function DocumentRequestsPage() {
  const router = useRouter();

  // 3초 후 자동 리다이렉트
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/ai-assistant?tab=file-process');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleRedirect = () => {
    router.push('/ai-assistant?tab=file-process');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-bg-primary p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <Typography variant="h2" className="mb-2">기능이 통합되었습니다!</Typography>
            <Typography variant="body1" className="text-txt-secondary mb-4">
              보안 업로드 기능이 <strong>AI 업무 비서</strong>의 <strong>파일 처리 모드</strong>로 이동했습니다.
            </Typography>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg text-sm">
              <span className="text-purple-600">🔒</span>
              <span>TTL 기반 보안 업로드 링크</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm">
              <span className="text-blue-600">📋</span>
              <span>문서 요청 및 수신자 관리</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-sm">
              <span className="text-green-600">🔍</span>
              <span>즉시 파일 분석 및 처리</span>
            </div>
          </div>

          <Button 
            onClick={handleRedirect}
            variant="primary" 
            size="lg"
            className="w-full"
          >
            AI 비서에서 파일 처리하기
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Typography variant="body2" className="text-txt-tertiary mt-3">
            3초 후 자동으로 이동됩니다...
          </Typography>
        </Card>
      </div>
    </AppLayout>
  );
}