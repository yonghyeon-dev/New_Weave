'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import Badge from '@/components/ui/Badge';
import { 
  FileText, 
  Download, 
  Copy, 
  Check,
  Edit3,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Sparkles,
  FileDown,
  Code,
  Type,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { DocumentWorkflow } from '@/types/document-workflow';
import { documentTemplates, DocumentTemplate } from '@/templates/document-templates';
import { exportToWord, printDocument } from '@/utils/document-export';

interface DocumentGeneratorV2Props {
  workflow?: DocumentWorkflow;
  preselectedTemplate?: string | null;
  projectContext?: any;
  clientContext?: any;
  onGenerated?: (doc: any) => void;
  onBack?: () => void;
  onExport?: (document: string, format: string) => void;
  onError?: (error: Error) => void;
}

export default function DocumentGeneratorV2({
  workflow,
  preselectedTemplate,
  projectContext,
  clientContext,
  onGenerated,
  onBack,
  onExport,
  onError
}: DocumentGeneratorV2Props) {
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [editedDocument, setEditedDocument] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [viewMode, setViewMode] = useState<'markdown' | 'preview'>('preview');
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // 템플릿 가져오기
  useEffect(() => {
    const templateId = workflow?.templateId || preselectedTemplate;
    console.log('Looking for template with ID:', templateId);
    console.log('Available templates:', documentTemplates.map(t => t.id));
    
    if (templateId) {
      const template = documentTemplates.find(t => t.id === templateId);
      console.log('Found template:', template);
      if (template) {
        setSelectedTemplate(template);
      } else {
        console.error('Template not found for ID:', templateId);
      }
    }
  }, [workflow?.templateId, preselectedTemplate]);

  // AI로 문서 생성
  const generateDocumentWithAI = async () => {
    const client = workflow?.client || clientContext;
    const project = workflow?.project || projectContext;
    
    console.log('generateDocumentWithAI called', {
      selectedTemplate,
      client,
      project
    });
    
    if (!selectedTemplate || !client || !project) {
      const errorMsg = `필요한 정보가 누락되었습니다. Template: ${!!selectedTemplate}, Client: ${!!client}, Project: ${!!project}`;
      console.error(errorMsg);
      onError?.(new Error(errorMsg));
      return;
    }

    setIsGenerating(true);
    setRemainingTime(15); // 예상 시간 15초
    
    // 카운트다운 시작
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      // 컨텍스트 정보 준비
      const user = workflow?.user || { name: '사용자', company: '회사명', email: 'user@example.com' };
      const context = {
        user,
        client,
        project,
        documentType: workflow?.documentType || 'contract',
        template: selectedTemplate.template,
        date: new Date().toLocaleDateString('ko-KR'),
      };
      
      console.log('Sending context to API:', context);

      // API 호출
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          template: selectedTemplate.template,
          context: {
            companyName: user?.company,
            userName: user?.name,
            userEmail: user?.email,
            clientCompany: client.companyName || client.company || client.name,
            clientName: client.contactPerson || client.contact_person || client.name,
            clientPhone: client.phone,
            clientEmail: client.email,
            projectName: project.name,
            projectDescription: project.description,
            projectStartDate: project.startDate,
            projectEndDate: project.endDate || project.dueDate,
            projectBudget: project.budget,
            date: context.date
          }
        }),
      });

      if (!response.ok) {
        throw new Error('문서 생성에 실패했습니다.');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success && data.data?.generated) {
        console.log('Document generated successfully');
        setGeneratedDocument(data.data.generated);
        setEditedDocument(data.data.generated);
        // 생성 완료 콜백 호출
        if (onGenerated) {
          onGenerated({
            content: data.data.generated,
            template: selectedTemplate,
            client,
            project
          });
        }
      } else {
        console.error('Generation failed:', data.error);
        throw new Error(data.error || '문서 생성에 실패했습니다.');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('문서 생성 중 오류가 발생했습니다.');
      onError?.(err);
      
      // 폴백: 템플릿에 기본 정보만 채워서 표시
      generateFallbackDocument();
    } finally {
      clearInterval(timer);
      setIsGenerating(false);
      setRemainingTime(0);
    }
  };

  // 폴백 문서 생성 (AI 실패시)
  const generateFallbackDocument = () => {
    const client = workflow?.client || clientContext;
    const project = workflow?.project || projectContext;
    const user = workflow?.user || { name: '사용자', company: '회사명', email: 'user@example.com' };
    
    if (!selectedTemplate || !client || !project) return;
    
    let document = selectedTemplate.template;
    
    // 기본 변수 치환
    const replacements: { [key: string]: string } = {
      '{{companyName}}': user?.company || '',
      '{{userName}}': user?.name || '',
      '{{userEmail}}': user?.email || '',
      '{{clientCompany}}': client.companyName || client.company || client.name,
      '{{clientName}}': client.contactPerson || client.contact_person || client.name || '',
      '{{clientPhone}}': client.phone || '',
      '{{clientEmail}}': client.email || '',
      '{{projectName}}': project.name,
      '{{projectDescription}}': project.description || '',
      '{{projectStartDate}}': project.startDate || '',
      '{{projectEndDate}}': project.endDate || project.dueDate || '',
      '{{projectBudget}}': project.budget?.toLocaleString() || '',
      '{{date}}': new Date().toLocaleDateString('ko-KR'),
      '{{invoiceNumber}}': `INV-${Date.now()}`,
      '{{amount}}': project.budget?.toLocaleString() || '',
      '{{dueDate}}': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
    };

    Object.entries(replacements).forEach(([key, value]) => {
      document = document.replace(new RegExp(key, 'g'), value);
    });

    setGeneratedDocument(document);
    setEditedDocument(document);
  };

  // 컴포넌트 마운트시 자동 생성
  useEffect(() => {
    console.log('useEffect triggered:', {
      selectedTemplate: !!selectedTemplate,
      client: !!workflow.client,
      project: !!workflow.project,
      generatedDocument: !!generatedDocument
    });
    
    if (selectedTemplate && workflow.client && workflow.project && !generatedDocument) {
      console.log('Calling generateDocumentWithAI from useEffect');
      generateDocumentWithAI();
    }
  }, [selectedTemplate?.id, workflow.client?.id, workflow.project?.id]); // ID로 의존성 체크

  // 문서 복사
  const copyToClipboard = async () => {
    const documentToCopy = isEditing ? editedDocument : generatedDocument;
    if (!documentToCopy) return;

    try {
      await navigator.clipboard.writeText(documentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      onError?.(new Error('클립보드 복사에 실패했습니다.'));
    }
  };

  // 문서 내보내기
  const handleExport = async (format: string) => {
    const documentToExport = isEditing ? editedDocument : generatedDocument;
    if (!documentToExport) return;

    const filename = `${workflow.project?.name || 'document'}_${Date.now()}`;
    const documentTitle = workflow.documentType?.name || '문서';

    try {
      if (format === 'markdown') {
        const blob = new Blob([documentToExport], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'docx') {
        await exportToWord(documentToExport, filename, documentTitle);
      } else {
        onExport?.(documentToExport, format);
      }
    } catch (error) {
      console.error(`${format.toUpperCase()} 내보내기 실패:`, error);
      onError?.(new Error(`${format.toUpperCase()} 내보내기에 실패했습니다.`));
    }
  };

  // 마크다운을 HTML로 변환 (간단한 구현)
  const renderMarkdownPreview = (markdown: string): string => {
    let html = markdown;
    
    // 헤더 변환
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 mt-6">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-8">$1</h1>');
    
    // 리스트 변환
    html = html.replace(/^\* (.+)$/gim, '<li class="ml-4">• $1</li>');
    html = html.replace(/^\- (.+)$/gim, '<li class="ml-4">• $1</li>');
    html = html.replace(/^\d+\. (.+)$/gim, '<li class="ml-4">$&</li>');
    
    // 굵은 글씨와 이탤릭
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    
    // 코드 블록
    html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto"><code>$2</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');
    
    // 인용구
    html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 my-2 italic">$1</blockquote>');
    
    // 수평선
    html = html.replace(/^---$/gim, '<hr class="my-4 border-gray-300">');
    
    // 줄바꿈
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = `<p class="mb-4">${html}</p>`;
    
    // 링크
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
    
    return html;
  };

  return (
    <div className="space-y-6">
      {/* 프로젝트 정보 요약 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Typography variant="h3" className="text-lg font-semibold text-txt-primary mb-2">
              문서 정보
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Typography variant="body2" className="text-txt-tertiary">클라이언트</Typography>
                <Typography variant="body1" className="font-medium">{workflow.client?.companyName || '선택되지 않음'}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">프로젝트</Typography>
                <Typography variant="body1" className="font-medium">{workflow.project?.name || '선택되지 않음'}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">문서 종류</Typography>
                <Typography variant="body1" className="font-medium">{workflow.documentType?.name || '선택되지 않음'}</Typography>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!generatedDocument && !isGenerating && (
              <Button variant="primary" size="sm" onClick={generateDocumentWithAI}>
                <Sparkles className="w-4 h-4 mr-1" />
                문서 생성 시작
              </Button>
            )}
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                이전 단계
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 문서 편집/미리보기 영역 */}
      <Card className="bg-white rounded-lg border border-border-light">
        {/* 툴바 */}
        <div className="border-b border-border-light p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Typography variant="h3" className="text-lg font-semibold">
                생성된 문서
              </Typography>
              {isGenerating && (
                <Badge variant="primary" className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI 생성 중... {remainingTime > 0 && `(약 ${remainingTime}초 남음)`}
                </Badge>
              )}
              {!isGenerating && generatedDocument && (
                <Badge variant="positive" className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  생성 완료
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* 문서 내보내기 버튼들 */}
              {generatedDocument && !isGenerating && (
                <div className="flex gap-2 mr-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const documentTitle = workflow?.documentType?.name || '문서';
                      printDocument(isEditing ? editedDocument : generatedDocument, documentTitle);
                    }}
                  >
                    <FileDown className="w-4 h-4 mr-1" />
                    인쇄/PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('docx')}
                  >
                    <FileDown className="w-4 h-4 mr-1" />
                    Word
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('markdown')}
                  >
                    <FileDown className="w-4 h-4 mr-1" />
                    MD
                  </Button>
                </div>
              )}
              
              {/* 보기 모드 전환 */}
              <div className="flex bg-bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 rounded flex items-center gap-1 transition-all ${
                    viewMode === 'preview' 
                      ? 'bg-white text-txt-primary shadow-sm' 
                      : 'text-txt-tertiary hover:text-txt-primary'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  미리보기
                </button>
                <button
                  onClick={() => setViewMode('markdown')}
                  className={`px-3 py-1 rounded flex items-center gap-1 transition-all ${
                    viewMode === 'markdown' 
                      ? 'bg-white text-txt-primary shadow-sm' 
                      : 'text-txt-tertiary hover:text-txt-primary'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  마크다운
                </button>
              </div>

              {/* 액션 버튼들 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (!isEditing) {
                    setViewMode('markdown');
                  }
                }}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    저장
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-1" />
                    편집
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-600" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    복사
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={generateDocumentWithAI}
                disabled={isGenerating}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                재생성
              </Button>
            </div>
          </div>
        </div>

        {/* 문서 내용 영역 */}
        <div className="p-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-bg-secondary rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-weave-primary animate-pulse" />
              </div>
              <Typography variant="body1" className="text-txt-primary mb-2">
                AI가 문서를 생성하고 있습니다...
              </Typography>
              <Typography variant="body2" className="text-txt-tertiary mb-3">
                프로젝트 정보를 기반으로 맞춤형 문서를 작성 중입니다
              </Typography>
              {remainingTime > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-weave-primary transition-all duration-1000"
                      style={{ width: `${((15 - remainingTime) / 15) * 100}%` }}
                    />
                  </div>
                  <Typography variant="body2" className="text-txt-tertiary font-medium">
                    약 {remainingTime}초 남음
                  </Typography>
                </div>
              )}
            </div>
          ) : (
            <>
              {isEditing ? (
                <textarea
                  value={editedDocument}
                  onChange={(e) => setEditedDocument(e.target.value)}
                  className="w-full h-[600px] px-4 py-3 border border-border-light rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-weave-primary resize-none"
                  placeholder="문서 내용을 입력하세요..."
                />
              ) : (
                <div className="min-h-[600px]">
                  {viewMode === 'preview' ? (
                    <div 
                      className="prose prose-lg max-w-none text-txt-primary"
                      dangerouslySetInnerHTML={{ 
                        __html: renderMarkdownPreview(editedDocument || generatedDocument) 
                      }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-bg-secondary p-4 rounded-lg overflow-x-auto">
                      {editedDocument || generatedDocument}
                    </pre>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* AI 안내 */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 p-5">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-white/80 backdrop-blur rounded-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <Typography variant="body1" className="font-semibold text-txt-primary mb-2">
              AI 문서 생성 기능
            </Typography>
            <div className="space-y-1">
              <Typography variant="body2" className="text-txt-secondary">
                • Gemini AI가 프로젝트 정보를 분석하여 맞춤형 문서를 생성합니다
              </Typography>
              <Typography variant="body2" className="text-txt-secondary">
                • 생성된 문서는 자유롭게 편집 가능합니다
              </Typography>
              <Typography variant="body2" className="text-txt-secondary">
                • 마크다운과 미리보기 모드를 전환하며 작업할 수 있습니다
              </Typography>
              <Typography variant="body2" className="text-txt-secondary">
                • 다양한 형식(PDF, Word, HTML)으로 내보낼 수 있습니다
              </Typography>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}