'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  User,
  Building,
  Briefcase,
  RefreshCw,
  Eye,
  Edit3,
  Save
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import Alert from '@/components/ui/Alert';
import { 
  DocumentGeneratorProps, 
  GenerationState, 
  TemplateSelectionState,
  DataSourceState,
  ExportFormat,
  PreviewState
} from './types';
import { 
  documentTemplates, 
  DocumentTemplate,
  applyDataToTemplate 
} from '@/templates/document-templates';
import {
  getCurrentUser,
  getClients,
  getProjects,
  UserInfo,
  ClientInfo,
  ProjectInfo
} from '@/services/mock/data.service';
import { generateDocumentWithGemini } from '@/services/ai/gemini.service';

// 기본 내보내기 형식
const DEFAULT_EXPORT_FORMATS: ExportFormat[] = ['markdown', 'pdf', 'docx', 'html'];

export default function DocumentGenerator({
  onDocumentGenerated,
  onExport,
  onError,
  defaultTemplate,
  enableAIGeneration = false,
  allowTemplateCustomization = true,
  exportFormats = DEFAULT_EXPORT_FORMATS,
  className = ''
}: DocumentGeneratorProps) {
  // 데이터 소스 상태
  const [dataSource, setDataSource] = useState<DataSourceState>({
    user: null,
    clients: [],
    projects: [],
    selectedClient: null,
    selectedProject: null,
    isLoading: false,
    error: null
  });

  // 템플릿 선택 상태
  const [templateSelection, setTemplateSelection] = useState<TemplateSelectionState>({
    selectedTemplate: null,
    templateData: {},
    isDataComplete: false
  });

  // 문서 생성 상태
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    generatedDocument: null,
    error: null
  });

  // 미리보기 상태
  const [preview, setPreview] = useState<PreviewState>({
    isPreviewMode: false,
    previewContent: '',
    previewFormat: 'markdown',
    zoom: 100
  });

  // 복사 상태
  const [isCopied, setIsCopied] = useState(false);

  // 편집 모드
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  // 기본 템플릿 설정
  useEffect(() => {
    if (defaultTemplate && !templateSelection.selectedTemplate) {
      const template = documentTemplates.find(t => t.id === defaultTemplate);
      if (template) {
        setTemplateSelection(prev => ({
          ...prev,
          selectedTemplate: template
        }));
      }
    }
  }, [defaultTemplate, templateSelection.selectedTemplate]);

  // 초기 데이터 로드
  const loadInitialData = async () => {
    setDataSource(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const [user, clients, projects] = await Promise.all([
        getCurrentUser(),
        getClients(),
        getProjects()
      ]);

      setDataSource({
        user,
        clients,
        projects,
        selectedClient: null,
        selectedProject: null,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('데이터 로드 실패');
      setDataSource(prev => ({
        ...prev,
        isLoading: false,
        error: err
      }));
      onError?.(err);
    }
  };

  // 템플릿 선택
  const handleSelectTemplate = (template: DocumentTemplate) => {
    setTemplateSelection({
      selectedTemplate: template,
      templateData: {},
      isDataComplete: false
    });
    setGenerationState({
      isGenerating: false,
      generatedDocument: null,
      error: null
    });
  };

  // 클라이언트 선택
  const handleSelectClient = (client: ClientInfo) => {
    setDataSource(prev => ({
      ...prev,
      selectedClient: client
    }));
    
    // 클라이언트의 프로젝트만 필터링
    const clientProjects = dataSource.projects.filter(p => p.clientId === client.id);
    if (clientProjects.length === 1) {
      setDataSource(prev => ({
        ...prev,
        selectedProject: clientProjects[0]
      }));
    }
  };

  // 프로젝트 선택
  const handleSelectProject = (project: ProjectInfo) => {
    setDataSource(prev => ({
      ...prev,
      selectedProject: project
    }));
    
    // 프로젝트의 클라이언트 자동 선택
    const client = dataSource.clients.find(c => c.id === project.clientId);
    if (client) {
      setDataSource(prev => ({
        ...prev,
        selectedClient: client
      }));
    }
  };

  // 템플릿 데이터 준비
  const prepareTemplateData = (): Record<string, any> => {
    const { user, selectedClient, selectedProject } = dataSource;
    const today = new Date().toISOString().split('T')[0];
    
    const data: Record<string, any> = {
      // 날짜
      date: today,
      contractDate: today,
      quotationDate: today,
      reportDate: today,
      createdDate: today,
      lastModified: today,
      
      // 사용자 정보
      userName: user?.name || '',
      userEmail: user?.email || '',
      userPhone: user?.phone || '',
      companyName: user?.company || '',
      supplierCompany: user?.company || '',
      supplierRepresentative: user?.representative || '',
      supplierBusinessNumber: user?.businessNumber || '',
      supplierAddress: user?.address || '',
      supplierPhone: user?.phone || '',
      supplierEmail: user?.email || '',
      
      // 클라이언트 정보
      clientName: selectedClient?.name || '',
      clientCompany: selectedClient?.company || '',
      clientEmail: selectedClient?.email || '',
      clientPhone: selectedClient?.phone || '',
      buyerCompany: selectedClient?.company || '',
      buyerRepresentative: selectedClient?.representative || '',
      buyerBusinessNumber: selectedClient?.businessNumber || '',
      buyerAddress: selectedClient?.address || '',
      
      // 프로젝트 정보
      projectName: selectedProject?.name || '',
      startDate: selectedProject?.startDate || '',
      endDate: selectedProject?.endDate || '',
      projectDescription: selectedProject?.description || '',
      deliverables: selectedProject?.deliverables?.join('\n- ') || '',
      paymentTerms: selectedProject?.paymentTerms || '',
      totalAmount: selectedProject?.budget || 0,
      
      // 계산된 값
      duration: selectedProject ? calculateDuration(selectedProject.startDate, selectedProject.endDate) : '',
      subtotal: selectedProject?.budget ? Math.round(selectedProject.budget / 1.1) : 0,
      tax: selectedProject?.budget ? Math.round(selectedProject.budget / 11) : 0,
      total: selectedProject?.budget || 0,
      
      // 기본값
      version: '1.0',
      author: user?.name || '',
      contactPerson: user?.name || '',
      contactPhone: user?.phone || '',
      contactEmail: user?.email || '',
      accountHolder: user?.company || '',
      warrantyPeriod: '1년',
      jurisdiction: '서울중앙지방법원',
      intellectualPropertyOwner: '수요자'
    };
    
    return data;
  };

  // 기간 계산
  const calculateDuration = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.round(diffDays / 30);
    
    if (diffMonths > 0) {
      return `${diffMonths}개월`;
    } else {
      return `${diffDays}일`;
    }
  };

  // 문서 생성
  const handleGenerateDocument = async () => {
    if (!templateSelection.selectedTemplate) return;
    
    setGenerationState({
      isGenerating: true,
      generatedDocument: null,
      error: null
    });
    
    try {
      const templateData = prepareTemplateData();
      let generatedContent: string;
      
      if (enableAIGeneration) {
        // AI를 사용한 문서 생성
        const response = await generateDocumentWithGemini(
          templateSelection.selectedTemplate.template,
          templateData
        );
        
        if (!response.success || !response.data) {
          throw new Error(response.error?.message || '문서 생성 실패');
        }
        
        generatedContent = response.data;
      } else {
        // 단순 템플릿 치환
        generatedContent = applyDataToTemplate(
          templateSelection.selectedTemplate.template,
          templateData
        );
      }
      
      setGenerationState({
        isGenerating: false,
        generatedDocument: generatedContent,
        error: null
      });
      
      setEditedContent(generatedContent);
      
      // 콜백 호출
      onDocumentGenerated?.(generatedContent, templateSelection.selectedTemplate);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('문서 생성 실패');
      setGenerationState({
        isGenerating: false,
        generatedDocument: null,
        error: err
      });
      onError?.(err);
    }
  };

  // 문서 복사
  const handleCopyDocument = async () => {
    const content = isEditMode ? editedContent : generationState.generatedDocument;
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  // 문서 내보내기
  const handleExportDocument = (format: ExportFormat) => {
    const content = isEditMode ? editedContent : generationState.generatedDocument;
    if (!content) return;
    
    // 현재는 마크다운만 지원 (추후 PDF, DOCX 변환 추가)
    if (format === 'markdown') {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateSelection.selectedTemplate?.name || 'document'}-${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    onExport?.(content, format);
  };

  // 미리보기 토글
  const togglePreview = () => {
    if (!generationState.generatedDocument) return;
    
    setPreview(prev => ({
      ...prev,
      isPreviewMode: !prev.isPreviewMode,
      previewContent: generationState.generatedDocument || ''
    }));
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    if (!generationState.generatedDocument) return;
    
    if (isEditMode) {
      // 편집 내용 저장
      setGenerationState(prev => ({
        ...prev,
        generatedDocument: editedContent
      }));
    }
    
    setIsEditMode(!isEditMode);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 데이터 소스 선택 */}
      <Card className="p-6">
        <Typography variant="h3" className="mb-4">데이터 소스</Typography>
        
        {dataSource.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-txt-tertiary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* 사용자 정보 */}
            <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
              <User className="w-5 h-5 text-txt-tertiary" />
              <div className="flex-1">
                <Typography variant="body2" className="text-txt-secondary">사용자</Typography>
                <Typography variant="body1">{dataSource.user?.name || '로딩 중...'}</Typography>
              </div>
            </div>
            
            {/* 클라이언트 선택 */}
            <div>
              <Typography variant="body2" className="text-txt-secondary mb-2">클라이언트 선택</Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {dataSource.clients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                      ${dataSource.selectedClient?.id === client.id
                        ? 'border-weave-primary bg-weave-primary-light/10'
                        : 'border-border-light hover:border-weave-primary hover:bg-bg-secondary'
                      }
                    `}
                  >
                    <Building className="w-5 h-5 text-txt-tertiary" />
                    <div className="flex-1 min-w-0">
                      <Typography variant="body1" className="font-medium truncate">
                        {client.company}
                      </Typography>
                      <Typography variant="body2" className="text-txt-secondary truncate">
                        {client.name}
                      </Typography>
                    </div>
                    {dataSource.selectedClient?.id === client.id && (
                      <CheckCircle className="w-4 h-4 text-weave-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 프로젝트 선택 */}
            <div>
              <Typography variant="body2" className="text-txt-secondary mb-2">프로젝트 선택</Typography>
              <div className="space-y-2">
                {dataSource.projects
                  .filter(p => !dataSource.selectedClient || p.clientId === dataSource.selectedClient.id)
                  .map(project => (
                    <button
                      key={project.id}
                      onClick={() => handleSelectProject(project)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border transition-all text-left w-full
                        ${dataSource.selectedProject?.id === project.id
                          ? 'border-weave-primary bg-weave-primary-light/10'
                          : 'border-border-light hover:border-weave-primary hover:bg-bg-secondary'
                        }
                      `}
                    >
                      <Briefcase className="w-5 h-5 text-txt-tertiary" />
                      <div className="flex-1 min-w-0">
                        <Typography variant="body1" className="font-medium truncate">
                          {project.name}
                        </Typography>
                        <Typography variant="body2" className="text-txt-secondary">
                          {project.clientName} · {project.status === 'in_progress' ? '진행중' : 
                           project.status === 'completed' ? '완료' : 
                           project.status === 'planning' ? '계획중' : '취소'}
                        </Typography>
                      </div>
                      {dataSource.selectedProject?.id === project.id && (
                        <CheckCircle className="w-4 h-4 text-weave-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
              </div>
            </div>
            
            {/* 데이터 새로고침 */}
            <Button
              variant="outline"
              onClick={loadInitialData}
              className="w-full"
              disabled={dataSource.isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              데이터 새로고침
            </Button>
          </div>
        )}
      </Card>
      
      {/* 템플릿 선택 */}
      <Card className="p-6">
        <Typography variant="h3" className="mb-4">문서 템플릿</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documentTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`
                p-4 rounded-lg border text-left transition-all
                ${templateSelection.selectedTemplate?.id === template.id
                  ? 'border-weave-primary bg-weave-primary-light/10'
                  : 'border-border-light hover:border-weave-primary hover:bg-bg-secondary'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Typography variant="body1" className="font-medium mb-1">
                    {template.name}
                  </Typography>
                  <Typography variant="body2" className="text-txt-secondary">
                    {template.description}
                  </Typography>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-bg-tertiary rounded text-xs text-txt-secondary">
                      {template.category === 'proposal' ? '제안서' :
                       template.category === 'contract' ? '계약서' :
                       template.category === 'invoice' ? '견적서' :
                       template.category === 'report' ? '보고서' : '명세서'}
                    </span>
                  </div>
                </div>
                {templateSelection.selectedTemplate?.id === template.id && (
                  <CheckCircle className="w-5 h-5 text-weave-primary flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          ))}
        </div>
        
        {/* 문서 생성 버튼 */}
        {templateSelection.selectedTemplate && (
          <div className="mt-4 pt-4 border-t border-border-light">
            <Button
              onClick={handleGenerateDocument}
              disabled={generationState.isGenerating || !dataSource.selectedClient}
              className="w-full"
            >
              {generationState.isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  문서 생성 중...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  문서 생성
                </>
              )}
            </Button>
            {!dataSource.selectedClient && (
              <Typography variant="body2" className="text-red-500 mt-2 text-center">
                클라이언트를 선택해주세요
              </Typography>
            )}
          </div>
        )}
      </Card>
      
      {/* 에러 메시지 */}
      {generationState.error && (
        <Alert variant="error" title="오류">
          {generationState.error.message}
        </Alert>
      )}
      
      {/* 생성된 문서 */}
      {generationState.generatedDocument && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <Typography variant="h3">생성된 문서</Typography>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={togglePreview}
                className="text-sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                미리보기
              </Button>
              <Button
                variant="outline"
                onClick={toggleEditMode}
                className="text-sm"
              >
                {isEditMode ? (
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
                onClick={handleCopyDocument}
                className="text-sm"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
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
                onClick={() => handleExportDocument('markdown')}
                className="text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                다운로드
              </Button>
            </div>
          </div>
          
          {/* 문서 내용 */}
          <div className="bg-bg-secondary rounded-lg p-4 max-h-96 overflow-y-auto">
            {isEditMode ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-80 p-2 bg-transparent border-none outline-none resize-none font-mono text-sm"
              />
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-txt-primary font-mono">
                {generationState.generatedDocument}
              </pre>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}