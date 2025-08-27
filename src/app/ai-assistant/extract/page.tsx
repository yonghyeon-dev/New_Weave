'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Typography from '@/components/ui/Typography';
import { Upload } from 'lucide-react';
import DataExtractor from '@/components/ai-assistant/DataExtractor';
import { ExtractedData } from '@/types/ai-assistant';

export default function InfoExtractPage() {
  // 데이터 추출 완료 핸들러
  const handleDataExtracted = (data: ExtractedData) => {
    console.log('추출된 데이터:', data);
    // 필요한 경우 추가 처리
  };

  // 에러 핸들러
  const handleError = (error: Error) => {
    console.error('데이터 추출 오류:', error);
    // 필요한 경우 에러 처리
  };

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-weave-primary-light rounded-lg">
                <Upload className="w-6 h-6 text-weave-primary" />
              </div>
              <div>
                <Typography variant="h2" className="text-2xl mb-1">정보 추출</Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  이미지나 PDF 문서에서 핵심 정보를 자동으로 추출하세요
                </Typography>
              </div>
            </div>
          </div>

          {/* DataExtractor 컴포넌트 사용 */}
          <DataExtractor
            onDataExtracted={handleDataExtracted}
            onError={handleError}
            maxFileSize={10}
          />
        </div>
      </div>
    </AppLayout>
  );
}