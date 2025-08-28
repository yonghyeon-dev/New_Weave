'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { WorkspacePageContainer } from '@/components/layout/PageContainer';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import { Upload, ArrowLeft, FileText } from 'lucide-react';
import DataExtractor from '@/components/ai-assistant/DataExtractor';
import { ExtractedData } from '@/types/ai-assistant';

export default function InfoExtractPage() {
  const router = useRouter();
  
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
      <WorkspacePageContainer>
        {/* 헤더 섹션 - 대시보드/프로젝트와 동일한 형식 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 sm:p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-weave-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="h2" className="text-xl sm:text-2xl mb-0 sm:mb-1 text-txt-primary leading-tight">정보 추출</Typography>
                <Typography variant="body1" className="text-sm sm:text-base text-txt-secondary leading-tight hidden sm:block">
                  이미지나 PDF 문서에서 핵심 정보를 자동으로 추출하세요
                </Typography>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3 flex-shrink-0">
              <Button 
                variant="ghost"
                onClick={() => router.push('/ai-assistant')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">돌아가기</span>
              </Button>
              <Button 
                variant="secondary"
                onClick={() => router.push('/ai-assistant/generate')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">문서 생성</span>
              </Button>
            </div>
          </div>
        </div>

        {/* DataExtractor 컴포넌트 사용 */}
        <DataExtractor
          onDataExtracted={handleDataExtracted}
          onError={handleError}
          maxFileSize={10}
        />
      </WorkspacePageContainer>
    </AppLayout>
  );
}