// DocumentGenerator 컴포넌트 타입 정의

import { DocumentTemplate } from '@/templates/document-templates';
import { UserInfo, ClientInfo, ProjectInfo } from '@/services/mock/data.service';

// 문서 생성 상태
export interface GenerationState {
  isGenerating: boolean;
  generatedDocument: string | null;
  error: Error | null;
}

// 템플릿 선택 상태
export interface TemplateSelectionState {
  selectedTemplate: DocumentTemplate | null;
  templateData: Record<string, any>;
  isDataComplete: boolean;
}

// 데이터 소스 상태
export interface DataSourceState {
  user: UserInfo | null;
  clients: ClientInfo[];
  projects: ProjectInfo[];
  selectedClient: ClientInfo | null;
  selectedProject: ProjectInfo | null;
  isLoading: boolean;
  error: Error | null;
}

// 문서 내보내기 옵션
export type ExportFormat = 'markdown' | 'pdf' | 'docx' | 'html';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  includeWatermark?: boolean;
  pageSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
}

// 컴포넌트 Props
export interface DocumentGeneratorProps {
  // 콜백 함수
  onDocumentGenerated?: (document: string, template: DocumentTemplate) => void;
  onExport?: (document: string, format: ExportFormat) => void;
  onError?: (error: Error) => void;
  
  // 설정
  defaultTemplate?: string; // 템플릿 ID
  enableAIGeneration?: boolean; // AI 생성 기능 사용 여부
  allowTemplateCustomization?: boolean; // 템플릿 커스터마이징 허용
  exportFormats?: ExportFormat[]; // 허용된 내보내기 형식
  
  // 스타일
  className?: string;
}

// 템플릿 변수 정보
export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>; // select 타입일 때
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// 템플릿 폼 상태
export interface TemplateFormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

// 에디터 설정
export interface EditorConfig {
  theme: 'light' | 'dark';
  readOnly: boolean;
  showLineNumbers: boolean;
  showPreview: boolean;
  splitView: boolean;
  autoSave: boolean;
  autoSaveInterval: number; // ms
}

// 문서 미리보기 상태
export interface PreviewState {
  isPreviewMode: boolean;
  previewContent: string;
  previewFormat: 'markdown' | 'html';
  zoom: number; // 50 ~ 200
}

// 문서 히스토리 (버전 관리)
export interface DocumentHistory {
  id: string;
  timestamp: Date;
  template: DocumentTemplate;
  content: string;
  author: string;
  changes?: string; // 변경 사항 설명
}

// AI 생성 옵션
export interface AIGenerationOptions {
  tone: 'formal' | 'casual' | 'professional';
  language: 'ko' | 'en';
  length: 'brief' | 'standard' | 'detailed';
  includeExamples: boolean;
  customPrompt?: string;
}

// 템플릿 카테고리 정보
export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

// 문서 메타데이터
export interface DocumentMetadata {
  id: string;
  title: string;
  template: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  version: string;
  tags: string[];
  status: 'draft' | 'review' | 'approved' | 'final';
}

// 템플릿 검색/필터 옵션
export interface TemplateFilterOptions {
  category?: string;
  searchQuery?: string;
  sortBy?: 'name' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// 자동 완성 제안
export interface AutocompleteData {
  projectNames: string[];
  clientNames: string[];
  commonPhrases: Record<string, string[]>;
}

// 유효성 검사 규칙
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

// 템플릿 필드 매핑
export interface FieldMapping {
  templateVariable: string;
  dataSource: 'user' | 'client' | 'project' | 'custom';
  dataField: string;
  transform?: (value: any) => any;
}