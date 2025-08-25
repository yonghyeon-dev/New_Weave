'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import { FileText, Download, Copy, Wand2 } from 'lucide-react';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'contract',
    name: '계약서',
    description: '업무 계약서 및 용역 계약서',
    category: '계약'
  },
  {
    id: 'proposal',
    name: '제안서',
    description: '프로젝트 제안서 및 사업 제안서',
    category: '제안'
  },
  {
    id: 'invoice',
    name: '세금계산서',
    description: '세금계산서 및 계산서',
    category: '세무'
  },
  {
    id: 'report',
    name: '보고서',
    description: '업무 보고서 및 진행 보고서',
    category: '보고'
  }
];

export default function DocumentGeneratePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    amount: '',
    description: ''
  });

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    
    // 모의 문서 생성
    setTimeout(() => {
      const mockContent = `
# ${selectedTemplate.name}

## 기본 정보
- 클라이언트: ${formData.client || '[클라이언트명]'}
- 프로젝트: ${formData.project || '[프로젝트명]'}
- 금액: ${formData.amount || '[금액]'}원

## 상세 내용
${formData.description || '[상세 내용]'}

## 조건
1. 계약 기간: [계약 기간]
2. 납기일: [납기일]
3. 결제 조건: [결제 조건]

---
본 문서는 AI에 의해 생성된 초안입니다. 실제 사용 전 검토가 필요합니다.
      `.trim();
      
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-bg-primary p-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-weave-primary-light rounded-lg">
                <FileText className="w-6 h-6 text-weave-primary" />
              </div>
              <div>
                <Typography variant="h1" className="mb-1">문서 생성</Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  AI로 계약서, 제안서 등 업무 문서를 자동 생성하세요
                </Typography>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 템플릿 선택 및 입력 */}
            <div className="space-y-6">
              {/* 템플릿 선택 */}
              <Card className="p-6">
                <Typography variant="h3" className="mb-4">문서 템플릿</Typography>
                <div className="grid grid-cols-1 gap-3">
                  {documentTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 text-left rounded-lg border transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'border-weave-primary bg-weave-primary-light/20'
                          : 'border-border-light hover:bg-bg-secondary'
                      }`}
                    >
                      <Typography variant="h4" className="mb-1">{template.name}</Typography>
                      <Typography variant="body2" className="text-txt-secondary">
                        {template.description}
                      </Typography>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {template.category}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* 입력 폼 */}
              {selectedTemplate && (
                <Card className="p-6">
                  <Typography variant="h3" className="mb-4">문서 정보</Typography>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-txt-primary mb-2">
                        클라이언트명
                      </label>
                      <Input
                        value={formData.client}
                        onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                        placeholder="클라이언트명을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-txt-primary mb-2">
                        프로젝트명
                      </label>
                      <Input
                        value={formData.project}
                        onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                        placeholder="프로젝트명을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-txt-primary mb-2">
                        금액
                      </label>
                      <Input
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="금액을 입력하세요"
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-txt-primary mb-2">
                        상세 설명
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="프로젝트나 업무에 대한 상세 설명을 입력하세요"
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-weave-primary focus:border-transparent resize-none"
                        rows={4}
                      />
                    </div>
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          생성 중...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          문서 생성
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* 생성된 문서 */}
            <div>
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h3">생성된 문서</Typography>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {generatedContent ? (
                  <div className="bg-bg-secondary p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-txt-primary font-mono">
                      {generatedContent}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <FileText className="w-12 h-12 text-txt-tertiary mb-4" />
                    <Typography variant="h4" className="mb-2">문서를 생성해보세요</Typography>
                    <Typography variant="body2" className="text-txt-secondary">
                      왼쪽에서 템플릿을 선택하고 정보를 입력한 후 문서를 생성하세요
                    </Typography>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}