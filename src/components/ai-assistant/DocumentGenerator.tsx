'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import Badge from '@/components/ui/Badge';
import { documentsService } from '@/lib/services/supabase/documents.service';
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
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Search,
  Database,
  Loader2
} from 'lucide-react';
import { DocumentTemplate } from '@/templates/document-templates';
import { documentTemplates } from '@/templates/document-templates';

interface DocumentGeneratorProps {
  selectedTemplateId?: string | null;
  onDocumentGenerated?: (document: string, template: DocumentTemplate) => void;
  onExport?: (document: string, format: string) => void;
  onError?: (error: Error) => void;
  enableAIGeneration?: boolean;
  allowTemplateCustomization?: boolean;
  exportFormats?: string[];
  projectId?: string; // 프로젝트 ID로 문서 연결
  enableRAGSearch?: boolean; // RAG 검색 활성화
}

interface TemplateVariable {
  name: string;
  value: string;
  description?: string;
}

export default function DocumentGenerator({
  selectedTemplateId,
  onDocumentGenerated,
  onExport,
  onError,
  enableAIGeneration = false,
  allowTemplateCustomization = true,
  exportFormats = ['markdown', 'pdf', 'docx', 'html'],
  projectId,
  enableRAGSearch = true
}: DocumentGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templateVariables, setTemplateVariables] = useState<TemplateVariable[]>([]);
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // selectedTemplateId가 전달되면 해당 템플릿 자동 선택
  useEffect(() => {
    if (selectedTemplateId) {
      const template = documentTemplates.find(t => t.id === selectedTemplateId);
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [selectedTemplateId]);

  // 템플릿 선택 시 변수 초기화
  useEffect(() => {
    if (selectedTemplate) {
      const variables = extractVariables(selectedTemplate.template);
      const initialVariables = variables.map(name => ({
        name,
        value: '',
        description: getVariableDescription(name)
      }));
      setTemplateVariables(initialVariables);
      setGeneratedDocument('');
      setEditedDocument('');
      setIsEditing(false);
    }
  }, [selectedTemplate]);

  // 템플릿에서 변수 추출
  const extractVariables = (template: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = new Set<string>();
    let match;
    while ((match = regex.exec(template)) !== null) {
      variables.add(match[1]);
    }
    return Array.from(variables);
  };

  // 변수 설명 가져오기
  const getVariableDescription = (name: string): string => {
    const descriptions: { [key: string]: string } = {
      projectName: '프로젝트 명칭',
      date: '날짜 (YYYY-MM-DD)',
      companyName: '회사명',
      userName: '담당자 이름',
      clientCompany: '고객사명',
      clientName: '고객 담당자',
      clientPhone: '고객 연락처',
      clientEmail: '고객 이메일',
      projectBackground: '프로젝트 배경',
      projectPurpose: '프로젝트 목적',
      projectScope: '프로젝트 범위',
      deliverables: '산출물',
      timeline: '일정',
      budget: '예산',
      invoiceNumber: '청구서 번호',
      amount: '금액',
      dueDate: '마감일',
      reportTitle: '보고서 제목',
      summary: '요약',
      findings: '발견 사항',
      recommendations: '권장 사항'
    };
    return descriptions[name] || name;
  };

  // 변수 값 업데이트
  const updateVariable = (name: string, value: string) => {
    setTemplateVariables(prev => 
      prev.map(v => v.name === name ? { ...v, value } : v)
    );
  };

  // 문서 생성
  const generateDocument = useCallback(async () => {
    if (!selectedTemplate) {
      onError?.(new Error('템플릿을 선택해주세요.'));
      return;
    }

    // 모든 필수 변수가 입력되었는지 확인
    const emptyVariables = templateVariables.filter(v => !v.value.trim());
    if (emptyVariables.length > 0) {
      onError?.(new Error(`다음 항목을 입력해주세요: ${emptyVariables.map(v => v.description || v.name).join(', ')}`));
      return;
    }

    setIsGenerating(true);

    try {
      // 템플릿에 변수 값 치환
      let document = selectedTemplate.template;
      templateVariables.forEach(variable => {
        const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
        document = document.replace(regex, variable.value);
      });

      // AI 생성이 활성화된 경우 (향후 구현)
      if (enableAIGeneration) {
        // API 호출하여 AI로 문서 개선
        // const enhanced = await enhanceWithAI(document);
        // document = enhanced;
      }

      setGeneratedDocument(document);
      setEditedDocument(document);
      onDocumentGenerated?.(document, selectedTemplate);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('문서 생성 중 오류가 발생했습니다.');
      onError?.(err);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTemplate, templateVariables, enableAIGeneration, onDocumentGenerated, onError]);

  // RAG 시스템에서 관련 문서 검색
  const searchRAGDocuments = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);
    try {
      // TODO: Implement searchSimilar or use searchDocumentsByText
      const results = await documentsService.searchDocumentsByText('system', searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('RAG search failed:', err);
      onError?.(new Error('관련 문서 검색에 실패했습니다.'));
    } finally {
      setIsSearching(false);
    }
  };

  // 검색 결과를 템플릿 변수에 적용
  const applySearchResult = (result: any) => {
    // 검색 결과의 내용을 현재 편집 중인 문서에 추가
    const content = result.content || '';
    const metadata = result.metadata || {};
    
    // 메타데이터에서 유용한 정보 추출
    const extractedInfo = [];
    if (metadata.businessNumber) extractedInfo.push(`사업자번호: ${metadata.businessNumber}`);
    if (metadata.companyName) extractedInfo.push(`회사명: ${metadata.companyName}`);
    if (metadata.representativeName) extractedInfo.push(`대표자: ${metadata.representativeName}`);
    if (metadata.businessAddress) extractedInfo.push(`주소: ${metadata.businessAddress}`);
    
    const infoText = extractedInfo.length > 0 
      ? `\n\n**참조 정보:**\n${extractedInfo.join('\n')}`
      : '';
    
    if (isEditing) {
      setEditedDocument(prev => prev + '\n\n' + content + infoText);
    } else {
      setGeneratedDocument(prev => prev + '\n\n' + content + infoText);
    }
    
    setShowSearchResults(false);
  };

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

  // 문서를 RAG 시스템에 저장
  const saveToRAGSystem = async () => {
    const documentToSave = isEditing ? editedDocument : generatedDocument;
    if (!documentToSave || !selectedTemplate) return;

    try {
      // TODO: Implement document creation for text content
      // Need to either use uploadDocument with File or create new method
      console.log('Saving document to RAG:', {
        title: selectedTemplate.name,
        content: documentToSave,
        type: 'generated',
        project_id: projectId || null,
        metadata: {
          template_id: selectedTemplate.id,
          template_name: selectedTemplate.name,
          generated_at: new Date().toISOString(),
          variables: templateVariables.reduce((acc, v) => ({
            ...acc,
            [v.name]: v.value
          }), {})
        },
        tags: ['generated', 'document', selectedTemplate.category]
      });
      
      // 성공 메시지 표시 (임시)
      alert('문서가 RAG 시스템에 저장되었습니다.');
    } catch (err) {
      console.error('Failed to save to RAG system:', err);
      onError?.(new Error('문서 저장에 실패했습니다.'));
    }
  };

  // 문서 내보내기
  const handleExport = async (format: string) => {
    const documentToExport = isEditing ? editedDocument : generatedDocument;
    if (!documentToExport) return;

    if (format === 'markdown') {
      // 마크다운 다운로드
      const blob = new Blob([documentToExport], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate?.name || 'document'}_${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'html') {
      // 마크다운을 HTML로 변환 (간단한 구현)
      const html = convertMarkdownToHTML(documentToExport);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate?.name || 'document'}_${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // PDF, DOCX는 서버 API 호출 필요
      onExport?.(documentToExport, format);
    }
  };

  // 간단한 마크다운 → HTML 변환
  const convertMarkdownToHTML = (markdown: string): string => {
    let html = markdown;
    // 제목 변환
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    // 굵은 글씨
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // 줄바꿈
    html = html.replace(/\n/g, '<br>\n');
    // HTML 템플릿
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${selectedTemplate?.name || 'Document'}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  };

  // 섹션 토글
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 템플릿 카테고리별 그룹핑
  const templatesByCategory = documentTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as { [key: string]: DocumentTemplate[] });

  const categoryLabels: { [key: string]: string } = {
    proposal: '제안서',
    contract: '계약서',
    invoice: '청구서',
    report: '보고서',
    specification: '명세서'
  };

  return (
    <div className="space-y-6">
      {/* 템플릿 선택 */}
      <Card className="bg-white rounded-lg border border-border-light p-6">
        <Typography variant="h3" className="text-lg font-semibold mb-4">
          템플릿 선택
        </Typography>
        
        <div className="space-y-4">
          {Object.entries(templatesByCategory).map(([category, templates]) => (
            <div key={category}>
              <button
                onClick={() => toggleSection(category)}
                className="w-full flex items-center justify-between p-3 bg-bg-secondary rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-weave-primary" />
                  <Typography variant="body1" className="font-medium">
                    {categoryLabels[category]}
                  </Typography>
                  <Badge variant="secondary">{templates.length}</Badge>
                </div>
                {expandedSections[category] ? (
                  <ChevronUp className="w-5 h-5 text-txt-tertiary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-txt-tertiary" />
                )}
              </button>
              
              {expandedSections[category] && (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-3 text-left rounded-lg border transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-weave-primary bg-blue-50'
                          : 'border-border-light hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Typography variant="body2" className="font-medium text-txt-primary">
                        {template.name}
                      </Typography>
                      <Typography variant="body2" className="text-txt-tertiary text-sm mt-1">
                        {template.description}
                      </Typography>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 변수 입력 */}
      {selectedTemplate && (
        <Card className="bg-white rounded-lg border border-border-light p-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h3" className="text-lg font-semibold">
              정보 입력
            </Typography>
            {enableAIGeneration && (
              <Badge variant="primary">
                <Sparkles className="w-3 h-3 mr-1" />
                AI 지원
              </Badge>
            )}
          </div>

          {/* RAG 검색 섹션 */}
          {enableRAGSearch && (
            <div className="mb-6 p-4 bg-bg-secondary rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-weave-primary" />
                <Typography variant="body2" className="font-medium text-txt-primary">
                  관련 문서 검색 (RAG)
                </Typography>
              </div>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어를 입력하세요..."
                  onKeyPress={(e) => e.key === 'Enter' && searchRAGDocuments()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={searchRAGDocuments}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {/* 검색 결과 표시 */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="mt-3 space-y-2">
                  <Typography variant="body2" className="text-txt-secondary">
                    검색 결과: {searchResults.length}개
                  </Typography>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {searchResults.map((result, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-white rounded border border-border-light hover:border-weave-primary cursor-pointer transition-colors"
                        onClick={() => applySearchResult(result)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Typography variant="body2" className="font-medium text-txt-primary">
                              {result.title || `문서 ${idx + 1}`}
                            </Typography>
                            <Typography variant="body2" className="text-txt-secondary text-sm mt-1 line-clamp-2">
                              {result.content?.substring(0, 100)}...
                            </Typography>
                            {result.similarity_score && (
                              <Badge variant="secondary" className="mt-1">
                                유사도: {(result.similarity_score * 100).toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              applySearchResult(result);
                            }}
                          >
                            적용
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {showSearchResults && searchResults.length === 0 && !isSearching && (
                <Typography variant="body2" className="text-txt-tertiary mt-3">
                  검색 결과가 없습니다.
                </Typography>
              )}
            </div>
          )}

          <div className="space-y-4">
            {templateVariables.map((variable, index) => (
              <div key={variable.name}>
                <label className="block mb-1">
                  <Typography variant="body2" className="font-medium text-txt-primary">
                    {variable.description || variable.name}
                  </Typography>
                </label>
                {variable.name.includes('Background') || 
                 variable.name.includes('Purpose') || 
                 variable.name.includes('Scope') ||
                 variable.name.includes('findings') ||
                 variable.name.includes('recommendations') ? (
                  <textarea
                    value={variable.value}
                    onChange={(e) => updateVariable(variable.name, e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary"
                    rows={4}
                    placeholder={`${variable.description || variable.name}을(를) 입력하세요`}
                  />
                ) : (
                  <Input
                    value={variable.value}
                    onChange={(e) => updateVariable(variable.name, e.target.value)}
                    placeholder={`${variable.description || variable.name}을(를) 입력하세요`}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            onClick={generateDocument}
            disabled={isGenerating || templateVariables.some(v => !v.value.trim())}
            className="w-full mt-6"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                문서 생성 중...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                문서 생성
              </>
            )}
          </Button>
        </Card>
      )}

      {/* 생성된 문서 */}
      {generatedDocument && (
        <Card className="bg-white rounded-lg border border-border-light p-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h3" className="text-lg font-semibold">
              생성된 문서
            </Typography>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    미리보기 숨기기
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    미리보기 표시
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (!isEditing) {
                    setEditedDocument(generatedDocument);
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
            </div>
          </div>

          {showPreview && (
            <div className="mb-4">
              {isEditing ? (
                <textarea
                  ref={textareaRef}
                  value={editedDocument}
                  onChange={(e) => setEditedDocument(e.target.value)}
                  className="w-full h-96 px-4 py-3 border border-border-light rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-weave-primary"
                />
              ) : (
                <div className="bg-bg-secondary p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-txt-primary">
                    {generatedDocument}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* 내보내기 옵션 */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border-light">
            <Typography variant="body2" className="text-txt-secondary mr-2 my-auto">
              내보내기:
            </Typography>
            {exportFormats.map(format => (
              <Button
                key={format}
                variant="outline"
                size="sm"
                onClick={() => handleExport(format)}
                className="uppercase"
              >
                <Download className="w-4 h-4 mr-1" />
                {format}
              </Button>
            ))}
            {enableRAGSearch && (
              <Button
                variant="outline"
                size="sm"
                onClick={saveToRAGSystem}
                className="ml-auto"
              >
                <Database className="w-4 h-4 mr-1" />
                RAG 시스템에 저장
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}