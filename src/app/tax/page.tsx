'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { ArrowRight, Calculator } from 'lucide-react';

export default function TaxPage() {
  const router = useRouter();

  // 3초 후 자동 리다이렉트
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/ai-assistant?tab=tax-consult');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleRedirect = () => {
    router.push('/ai-assistant?tab=tax-consult');
  };

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-weave-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-weave-primary" />
            </div>
            <Typography variant="h2" className="mb-2">기능이 통합되었습니다!</Typography>
            <Typography variant="body1" className="text-txt-secondary mb-4">
              세무 관리 기능이 <strong>AI 업무 비서</strong>의 <strong>세무 상담 모드</strong>로 이동했습니다.
            </Typography>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-bg-secondary/30 rounded-lg text-sm border border-green-200/50">
              <span className="text-green-600">🏢</span>
              <span>사업자등록번호 실시간 조회</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg-secondary/30 rounded-lg text-sm border border-blue-200/50">
              <span className="text-weave-primary">💡</span>
              <span>AI 세무 상담 및 절세 가이드</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg-secondary/30 rounded-lg text-sm border border-border-light/50">
              <span className="text-txt-tertiary">📊</span>
              <span>신고 도움 및 서류 지원</span>
            </div>
          </div>

          <Button 
            onClick={handleRedirect}
            variant="primary" 
            size="lg"
            className="w-full"
          >
            AI 비서에서 세무 상담받기
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