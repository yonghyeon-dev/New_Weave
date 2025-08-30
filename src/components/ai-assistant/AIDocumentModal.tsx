'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import { X, Wand2, Sparkles } from 'lucide-react';
import DocumentGeneratorV2 from '@/components/ai-assistant/DocumentGeneratorV2';
import { DocumentTemplate } from '@/templates/document-templates';

interface AIDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'quotation' | 'contract' | 'invoice' | 'report';
  projectData?: {
    id: string;
    name: string;
    clientId?: string;
    clientName?: string;
    budget?: number;
    description?: string;
  };
  clientData?: {
    id: string;
    company: string;
    contact_person?: string;
    email?: string;
    phone?: string;
  };
  onDocumentGenerated?: (document: any) => void;
}

const documentTypeLabels = {
  quotation: '견적서',
  contract: '계약서',
  invoice: '청구서',
  report: '보고서'
};

const documentTypeTemplates: Record<string, string[]> = {
  quotation: ['basic_quotation', 'detailed_quotation', 'service_quotation'],
  contract: ['service_contract', 'project_contract', 'maintenance_contract'],
  invoice: ['tax_invoice', 'simple_invoice', 'detailed_invoice'],
  report: ['progress_report', 'completion_report', 'monthly_report']
};

export default function AIDocumentModal({
  isOpen,
  onClose,
  documentType,
  projectData,
  clientData,
  onDocumentGenerated
}: AIDocumentModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);
  const [generationTime, setGenerationTime] = useState<string>('');

  // 문서 타입에 따라 추천 템플릿 자동 선택
  useEffect(() => {
    if (documentType && documentTypeTemplates[documentType]) {
      // 프로젝트 데이터가 있으면 첫 번째 템플릿 자동 선택
      if (projectData) {
        setSelectedTemplate(documentTypeTemplates[documentType][0]);
      }
    }
  }, [documentType, projectData]);

  if (!isOpen) return null;

  const handleDocumentGenerated = (doc: any) => {
    const now = new Date();
    const timeString = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    setGenerationTime(timeString);
    setGeneratedDocument({
      ...doc,
      generatedAt: now.toISOString(),
      generationTime: timeString
    });
    
    if (onDocumentGenerated) {
      onDocumentGenerated({
        ...doc,
        generatedAt: now.toISOString(),
        generationTime: timeString
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-border-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-weave-primary-light rounded-lg">
                <Wand2 className="w-5 h-5 text-weave-primary" />
              </div>
              <div>
                <Typography variant="h3" className="text-txt-primary">
                  AI {documentTypeLabels[documentType]} 생성
                </Typography>
                {projectData && (
                  <Typography variant="caption" className="text-txt-secondary">
                    {projectData.clientName} - {projectData.name}
                  </Typography>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-txt-tertiary" />
            </button>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 프로젝트/클라이언트 정보 표시 */}
          {(projectData || clientData) && (
            <div className="mb-6 p-4 bg-bg-secondary rounded-lg">
              <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 text-weave-primary mt-0.5" />
                <div className="flex-1">
                  <Typography variant="body2" className="font-medium text-txt-primary mb-2">
                    자동 연계된 정보
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {projectData && (
                      <div>
                        <span className="text-txt-tertiary">프로젝트: </span>
                        <span className="text-txt-primary">{projectData.name}</span>
                      </div>
                    )}
                    {clientData && (
                      <div>
                        <span className="text-txt-tertiary">클라이언트: </span>
                        <span className="text-txt-primary">{clientData.company}</span>
                      </div>
                    )}
                    {projectData?.budget && (
                      <div>
                        <span className="text-txt-tertiary">예산: </span>
                        <span className="text-txt-primary">
                          {(projectData.budget / 10000).toLocaleString()}만원
                        </span>
                      </div>
                    )}
                    {clientData?.contact_person && (
                      <div>
                        <span className="text-txt-tertiary">담당자: </span>
                        <span className="text-txt-primary">{clientData.contact_person}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 템플릿 선택 */}
          <div className="mb-6">
            <Typography variant="body1" className="font-medium text-txt-primary mb-3">
              템플릿 선택
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {documentTypeTemplates[documentType]?.map((template) => (
                <button
                  key={template}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedTemplate === template
                      ? 'border-weave-primary bg-weave-primary-light'
                      : 'border-border-light hover:border-weave-primary hover:bg-bg-secondary'
                  }`}
                >
                  <Typography variant="body2" className="font-medium text-txt-primary">
                    {template.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  {selectedTemplate === template && projectData && (
                    <Typography variant="caption" className="text-weave-primary mt-1">
                      추천 템플릿
                    </Typography>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* DocumentGeneratorV2 컴포넌트 임베드 - 템플릿이 선택된 경우에만 표시 */}
          {selectedTemplate && (
            <div className="border border-border-light rounded-lg p-4">
              <DocumentGeneratorV2
                preselectedTemplate={selectedTemplate}
                projectContext={projectData}
                clientContext={clientData}
                onGenerated={handleDocumentGenerated}
                hideHeader={true}
                autoGenerate={isGenerating}
              />
            </div>
          )}
          
          {/* 생성 시간 표시 */}
          {generationTime && (
            <div className="mt-4 p-3 bg-bg-secondary rounded-lg">
              <Typography variant="caption" className="text-txt-tertiary">
                생성 완료: {generationTime}
              </Typography>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-border-light bg-bg-secondary">
          <div className="flex items-center justify-between">
            <Typography variant="caption" className="text-txt-tertiary">
              AI가 프로젝트 정보를 기반으로 최적화된 문서를 생성합니다
            </Typography>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isGenerating}
              >
                취소
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsGenerating(true)}
                disabled={!selectedTemplate || isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AI 생성 시작
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}