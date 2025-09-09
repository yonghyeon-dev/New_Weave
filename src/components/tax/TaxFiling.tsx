'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { FileText, Calendar, AlertCircle } from 'lucide-react';

export default function TaxFiling() {
  return (
    <div className="space-y-6">
      {/* 서비스 준비중 안내 */}
      <Card className="p-12">
        <div className="text-center max-w-md mx-auto">
          <div className="p-4 bg-orange-100 rounded-full inline-flex mb-6">
            <FileText className="w-12 h-12 text-orange-600" />
          </div>
          
          <Typography variant="h2" className="text-2xl font-bold text-txt-primary mb-4">
            세무 신고 서비스 준비 중
          </Typography>
          
          <Typography variant="body1" className="text-txt-secondary mb-8">
            부가가치세, 소득세, 법인세 등 각종 세무 신고를 
            간편하게 처리할 수 있는 서비스를 준비하고 있습니다.
          </Typography>

          {/* 예정 기능 안내 */}
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-weave-primary mt-0.5" />
              <div>
                <Typography variant="body1" className="font-medium text-txt-primary">
                  자동 신고 일정 관리
                </Typography>
                <Typography variant="body2" className="text-txt-secondary">
                  세무 신고 일정을 자동으로 알려드립니다
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-weave-primary mt-0.5" />
              <div>
                <Typography variant="body1" className="font-medium text-txt-primary">
                  실시간 세금 계산
                </Typography>
                <Typography variant="body2" className="text-txt-secondary">
                  거래 입력 시 자동으로 세금을 계산합니다
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-weave-primary mt-0.5" />
              <div>
                <Typography variant="body1" className="font-medium text-txt-primary">
                  신고서 자동 생성
                </Typography>
                <Typography variant="body2" className="text-txt-secondary">
                  입력된 데이터로 신고서를 자동 생성합니다
                </Typography>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-bg-secondary rounded-lg">
            <Typography variant="body2" className="text-txt-tertiary">
              <span className="font-medium">예상 출시일:</span> 2025년 2분기
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}