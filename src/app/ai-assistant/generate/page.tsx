'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { WorkspacePageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  Upload, 
  Sparkles,
  User as UserIcon,
  Building2,
  Folder,
  FileText as DocIcon,
  Layout,
  Check,
  ChevronRight
} from 'lucide-react';
import DocumentGeneratorV2 from '@/components/ai-assistant/DocumentGeneratorV2';
import DocumentTemplateSelector from '@/components/ai-assistant/DocumentTemplateSelector';
import ClientSelector from '@/components/ai-assistant/workflow/ClientSelector';
import ProjectSelector from '@/components/ai-assistant/workflow/ProjectSelector';
import DocumentTypeSelector from '@/components/ai-assistant/workflow/DocumentTypeSelector';
import { DocumentTemplate } from '@/templates/document-templates';
import { 
  User,
  Client,
  Project,
  DocumentType,
  DocumentWorkflow,
  WorkflowStep 
} from '@/types/document-workflow';

export default function DocumentGeneratePage() {
  const router = useRouter();
  
  // 워크플로우 상태
  const [workflow, setWorkflow] = useState<DocumentWorkflow>({
    currentStep: 1,
    user: {
      id: 'user-1',
      name: '김철수',
      email: 'kim@techstart.co.kr',
      company: '주식회사 테크스타트',
      department: '개발팀'
    }, // 자동 설정 (실제로는 로그인 정보에서 가져옴)
    client: null,
    project: null,
    documentType: null,
    templateId: null,
    steps: [
      { id: 1, title: '사용자 정보', completed: true },
      { id: 2, title: '클라이언트 선택', completed: false },
      { id: 3, title: '프로젝트 선택', completed: false },
      { id: 4, title: '문서 종류', completed: false },
      { id: 5, title: '템플릿 선택', completed: false },
      { id: 6, title: '문서 생성', completed: false }
    ]
  });

  // 단계별 핸들러
  const handleClientSelect = (client: Client) => {
    setWorkflow(prev => ({
      ...prev,
      client,
      currentStep: 3,
      steps: prev.steps.map(step => 
        step.id === 2 ? { ...step, completed: true } : step
      )
    }));
  };

  const handleProjectSelect = (project: Project) => {
    setWorkflow(prev => ({
      ...prev,
      project,
      currentStep: 4,
      steps: prev.steps.map(step => 
        step.id === 3 ? { ...step, completed: true } : step
      )
    }));
  };

  const handleDocumentTypeSelect = (documentType: DocumentType) => {
    setWorkflow(prev => ({
      ...prev,
      documentType,
      currentStep: 5,
      steps: prev.steps.map(step => 
        step.id === 4 ? { ...step, completed: true } : step
      )
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setWorkflow(prev => ({
      ...prev,
      templateId,
      currentStep: 6,
      steps: prev.steps.map(step => 
        step.id === 5 ? { ...step, completed: true } : step
      )
    }));
  };

  // 이전 단계로
  const goToPreviousStep = () => {
    if (workflow.currentStep > 2) {
      setWorkflow(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  };

  // 특정 단계로 이동
  const goToStep = (stepId: number) => {
    // 완료된 단계나 다음 단계로만 이동 가능
    const step = workflow.steps.find(s => s.id === stepId);
    if (step && (step.completed || stepId === workflow.currentStep + 1)) {
      setWorkflow(prev => ({
        ...prev,
        currentStep: stepId
      }));
    }
  };

  // 문서 내보내기 핸들러
  const handleExport = (document: string, format: string) => {
    console.log('문서 내보내기:', {
      format,
      documentLength: document.length
    });
    // PDF, DOCX 등은 서버 API 호출 필요
    // 추후 구현
  };

  // 에러 핸들러
  const handleError = (error: Error) => {
    console.error('문서 생성 오류:', error);
    // 에러 토스트 표시 등
  };
  
  // 이전 단계로 돌아가기 (문서 생성 단계에서)
  const handleBackFromGenerator = () => {
    setWorkflow(prev => ({
      ...prev,
      currentStep: 5
    }));
  };

  return (
    <AppLayout>
      <WorkspacePageContainer>
        <div className="space-y-8">
          {/* 헤더 섹션 - 대시보드/프로젝트와 동일한 형식 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 sm:p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-weave-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <Typography variant="h2" className="text-xl sm:text-2xl mb-0 sm:mb-1 text-txt-primary leading-tight flex items-center gap-2">
                    문서 생성
                    <Badge variant="primary" className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI 지원</span>
                    </Badge>
                  </Typography>
                  <Typography variant="body1" className="text-sm sm:text-base text-txt-secondary leading-tight hidden sm:block">
                    단계별로 진행하여 맞춤형 문서를 생성하세요
                  </Typography>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button 
                  variant="ghost"
                  onClick={() => router.push('/ai-assistant')}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Assistant로</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 워크플로우 스텝 인디케이터 */}
          <Card className="bg-white rounded-lg border border-border-light p-6 mb-6">
            <div className="flex items-center justify-between">
              {workflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={!step.completed && step.id !== workflow.currentStep}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      workflow.currentStep === step.id
                        ? 'bg-weave-primary text-white'
                        : step.completed
                        ? 'bg-green-50 text-green-700 cursor-pointer hover:bg-green-100'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      workflow.currentStep === step.id
                        ? 'bg-white/20'
                        : step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200'
                    }`}>
                      {step.completed ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <span className="text-xs font-semibold">{step.id}</span>
                      )}
                    </div>
                    <span className="font-medium hidden md:inline">{step.title}</span>
                  </button>
                  {index < workflow.steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 현재 단계 정보 표시 */}
          {workflow.currentStep === 1 && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/80 backdrop-blur rounded-lg shadow-sm">
                  <UserIcon className="w-6 h-6 text-weave-primary" />
                </div>
                <div className="flex-1">
                  <Typography variant="h3" className="text-lg font-semibold text-txt-primary mb-2">
                    사용자 정보 (자동 설정)
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Typography variant="body2" className="text-txt-tertiary">이름</Typography>
                      <Typography variant="body1" className="font-medium">{workflow.user?.name}</Typography>
                    </div>
                    <div>
                      <Typography variant="body2" className="text-txt-tertiary">이메일</Typography>
                      <Typography variant="body1" className="font-medium">{workflow.user?.email}</Typography>
                    </div>
                    <div>
                      <Typography variant="body2" className="text-txt-tertiary">회사</Typography>
                      <Typography variant="body1" className="font-medium">{workflow.user?.company}</Typography>
                    </div>
                    <div>
                      <Typography variant="body2" className="text-txt-tertiary">부서</Typography>
                      <Typography variant="body1" className="font-medium">{workflow.user?.department}</Typography>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="mt-4"
                    onClick={() => setWorkflow(prev => ({ ...prev, currentStep: 2 }))}
                  >
                    다음 단계로
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* 단계별 컴포넌트 렌더링 */}
          {workflow.currentStep === 2 && (
            <ClientSelector
              onSelectClient={handleClientSelect}
              selectedClient={workflow.client}
            />
          )}

          {workflow.currentStep === 3 && workflow.client && (
            <ProjectSelector
              client={workflow.client}
              onSelectProject={handleProjectSelect}
              selectedProject={workflow.project}
            />
          )}

          {workflow.currentStep === 4 && (
            <DocumentTypeSelector
              onSelectType={handleDocumentTypeSelect}
              selectedType={workflow.documentType}
              projectType={workflow.project?.type}
            />
          )}

          {workflow.currentStep === 5 && (
            <DocumentTemplateSelector
              onSelectTemplate={handleTemplateSelect}
              documentType={workflow.documentType}
            />
          )}

          {workflow.currentStep === 6 && workflow.templateId && (
            <DocumentGeneratorV2
              workflow={workflow}
              onBack={handleBackFromGenerator}
              onExport={handleExport}
              onError={handleError}
            />
          )}

          {/* 네비게이션 버튼 */}
          {workflow.currentStep > 1 && workflow.currentStep < 6 && (
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                이전 단계
              </Button>
              
              {/* 선택 완료 후 다음 버튼 표시 */}
              {((workflow.currentStep === 2 && workflow.client) ||
                (workflow.currentStep === 3 && workflow.project) ||
                (workflow.currentStep === 4 && workflow.documentType) ||
                (workflow.currentStep === 5 && workflow.templateId)) && (
                <Button
                  variant="primary"
                  onClick={() => goToStep(workflow.currentStep + 1)}
                  className="flex items-center gap-2"
                >
                  다음 단계
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </WorkspacePageContainer>
    </AppLayout>
  );
}