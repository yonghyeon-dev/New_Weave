'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Typography from '@/components/ui/Typography';
import { FileText } from 'lucide-react';
import DocumentGenerator from '@/components/ai-assistant/DocumentGenerator';
import { DocumentTemplate } from '@/templates/document-templates';

export default function DocumentGeneratePage() {
  // 문서 생성 완료 핸들러
  const handleDocumentGenerated = (document: string, template: DocumentTemplate) => {
    console.log('문서 생성 완료:', {
      templateName: template.name,
      documentLength: document.length
    });
    // 필요한 경우 추가 처리
  };

  // 문서 내보내기 핸들러
  const handleExport = (document: string, format: string) => {
    console.log('문서 내보내기:', {
      format,
      documentLength: document.length
    });
    // 필요한 경우 추가 처리
  };

  // 에러 핸들러
  const handleError = (error: Error) => {
    console.error('문서 생성 오류:', error);
    // 필요한 경우 에러 처리
  };

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-weave-primary-light rounded-lg">
                <FileText className="w-6 h-6 text-weave-primary" />
              </div>
              <div>
                <Typography variant="h2" className="text-2xl mb-1">문서 생성</Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  템플릿을 기반으로 전문적인 비즈니스 문서를 자동으로 생성하세요
                </Typography>
              </div>
            </div>
          </div>

          {/* DocumentGenerator 컴포넌트 사용 */}
          <DocumentGenerator
            onDocumentGenerated={handleDocumentGenerated}
            onExport={handleExport}
            onError={handleError}
            enableAIGeneration={false} // 현재는 템플릿 치환만 사용
            allowTemplateCustomization={true}
            exportFormats={['markdown', 'pdf', 'docx', 'html']}
          />
        </div>
      </div>
    </AppLayout>
  );
}