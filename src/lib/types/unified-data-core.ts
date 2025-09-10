/**
 * 통합 데이터 모델 - YHdev + h1 브랜치 통합
 * 
 * 목적: 중앙관리 시스템(YHdev)에 세무관리(h1) 통합
 * 해결: projectId vs id 충돌, 공통 클라이언트 기반 연동
 */

// ============================================================================
// 🏗️ 중앙화된 기본 타입
// ============================================================================

/** 통합 ID 시스템 - 모든 엔터티에서 일관된 ID 사용 */
export type UnifiedId = string;

/** 공통 클라이언트 모델 - 프로젝트와 세무관리 연결점 */
export interface UnifiedClient {
  id: UnifiedId;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  businessNumber?: string;  // 세무관리와 연결용
  taxType?: 'individual' | 'corporate' | 'vat_exempt';
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 🎯 프로젝트 중심 통합 모델 (YHdev 기반)
// ============================================================================

export type UnifiedProjectStatus = 
  | 'planning' 
  | 'in_progress' 
  | 'review' 
  | 'completed' 
  | 'on_hold' 
  | 'cancelled';

export interface UnifiedProject {
  // 기본 정보 (YHdev 기반)
  id: UnifiedId;  // projectId 대신 id로 통일
  user_id: string;
  name: string;
  description?: string;
  status: UnifiedProjectStatus;
  
  // 클라이언트 연결 (공통 기반)
  client_id: UnifiedId;
  client?: UnifiedClient;  // 조인 데이터
  
  // 날짜 정보
  start_date?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  
  // 예산 정보
  budget_estimated?: number;
  budget_actual?: number;
  
  // 세무관리 연동 (h1 통합)
  tax_records?: UnifiedTaxRecord[];
  tax_summary?: ProjectTaxSummary;
  
  // 진행률 계산 (중앙관리)
  progress: number;
  payment_progress?: number;
}

// ============================================================================
// 💰 세무관리 통합 모델 (h1 기반 + 프로젝트 연동)
// ============================================================================

export interface UnifiedTaxRecord {
  // 기본 정보 (h1 기반)
  id: UnifiedId;
  user_id: string;
  year: number;
  month: number;
  
  // 금액 정보
  total_income: number;
  total_expense: number;
  vat_payable: number;
  
  // 프로젝트 연동 (YHdev 통합)
  project_id?: UnifiedId;  // 프로젝트와 연결
  client_id?: UnifiedId;   // 클라이언트와 연결
  
  // 세부 정보
  transaction_type?: 'income' | 'expense';
  category?: string;
  description?: string;
  invoice_number?: string;
  
  // 날짜 정보
  transaction_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTaxSummary {
  project_id: UnifiedId;
  total_income: number;
  total_expense: number;
  net_profit: number;
  vat_total: number;
  tax_year: number;
  last_updated: string;
}

// ============================================================================
// 📋 통합 테이블 시스템 (YHdev 기반)
// ============================================================================

export interface UnifiedProjectTableRow {
  // 기본 표시 정보
  id: UnifiedId;
  no: string;
  name: string;
  client: string;
  status: UnifiedProjectStatus;
  progress: number;
  
  // 날짜 정보
  registrationDate: string;
  dueDate: string;
  modifiedDate: string;
  
  // 재무 정보 (세무관리 통합)
  paymentProgress?: number;
  budgetEstimated?: number;
  budgetActual?: number;
  
  // 세무 요약 (h1 통합)
  taxSummary?: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    vatPayable: number;
  };
  
  // 상세 정보 (지연 로딩)
  hasContract?: boolean;
  hasBilling?: boolean;
  hasDocuments?: boolean;
  hasTaxRecords?: boolean;  // 세무 기록 존재 여부
}

// ============================================================================
// 🎯 ViewMode 시스템 (YHdev 중앙관리)
// ============================================================================

export type ViewMode = 'list' | 'detail';

export interface UnifiedViewState {
  currentView: ViewMode;
  selectedProject: UnifiedProject | null;
  selectedProjectId: UnifiedId | null;
  
  // 탭 시스템 확장 (h1 세무관리 통합)
  activeDetailTab: 'overview' | 'document-management' | 'tax-management';
}

// ============================================================================
// 🚀 플로팅 퀵메뉴 통합 (h1 기반)
// ============================================================================

export interface UnifiedQuickAction {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
  color: string;
  gradient?: string;
  
  // 컨텍스트 인식 (프로젝트 중심)
  context?: {
    requiresProject?: boolean;
    projectId?: UnifiedId;
    clientId?: UnifiedId;
  };
}

// ============================================================================
// 🔗 데이터 연결 인터페이스
// ============================================================================

/** 프로젝트-세무 연결 매핑 */
export interface ProjectTaxMapping {
  project_id: UnifiedId;
  client_id: UnifiedId;
  tax_record_ids: UnifiedId[];
  business_number?: string;
  mapping_type: 'automatic' | 'manual';
  created_at: string;
}

/** 통합 필터 시스템 */
export interface UnifiedFilterState {
  // 프로젝트 필터
  status?: UnifiedProjectStatus[];
  clients?: UnifiedId[];
  dateRange?: {
    start: string;
    end: string;
  };
  
  // 세무 필터 (h1 통합)
  taxYear?: number;
  taxMonth?: number;
  hasUnfiledTax?: boolean;
}

// ============================================================================
// 📊 통합 대시보드 데이터
// ============================================================================

export interface UnifiedDashboardData {
  projects: {
    total: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
  
  tax: {
    pendingReports: number;
    totalIncome: number;
    totalExpense: number;
    vatPayable: number;
  };
  
  financial: {
    totalBudget: number;
    actualSpent: number;
    projectedIncome: number;
  };
}