'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { FileText, ArrowLeft, Upload, Sparkles } from 'lucide-react';
import DocumentGenerator from '@/components/ai-assistant/DocumentGenerator';
import DocumentTemplateSelector from '@/components/ai-assistant/DocumentTemplateSelector';
import { DocumentTemplate } from '@/templates/document-templates';

export default function DocumentGeneratePage() {
  const router = useRouter();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  
  // 템플릿 선택 핸들러
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowTemplateSelector(false);
  };

  // 템플릿 선택기로 돌아가기
  const handleBackToSelector = () => {
    setShowTemplateSelector(true);
    setSelectedTemplateId(null);
  };
  
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <Typography variant="h2" className="text-2xl mb-1 flex items-center">
                    문서 생성
                    <Badge variant="primary" className="ml-3">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI 지원
                    </Badge>
                  </Typography>
                  <Typography variant="body1" className="text-txt-secondary">
                    {showTemplateSelector 
                      ? 'AI가 템플릿을 기반으로 맞춤형 문서를 생성합니다'
                      : '선택한 템플릿을 기반으로 문서를 작성하세요'}
                  </Typography>
                </div>
              </div>
              <div className="flex space-x-3">
                {!showTemplateSelector && (
                  <Button 
                    variant="outline"
                    onClick={handleBackToSelector}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>템플릿 다시 선택</span>
                  </Button>
                )}
                <Button 
                  variant="ghost"
                  onClick={() => router.push('/ai-assistant')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>AI Assistant로</span>
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => router.push('/ai-assistant/extract')}
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>데이터 추출</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 템플릿 선택기 또는 문서 생성기 */}
          {showTemplateSelector ? (
            <DocumentTemplateSelector
              onSelectTemplate={handleTemplateSelect}
            />
          ) : (
            <DocumentGenerator
              selectedTemplateId={selectedTemplateId}
              onDocumentGenerated={handleDocumentGenerated}
              onExport={handleExport}
              onError={handleError}
              enableAIGeneration={true} // Gemini AI 활성화
              allowTemplateCustomization={true}
              exportFormats={['markdown', 'pdf', 'docx', 'html']}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}