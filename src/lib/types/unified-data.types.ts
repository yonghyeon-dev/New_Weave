// 통합 데이터 아키텍처 - 클라이언트 중심 설계
// projectId 기준으로 프로젝트와 세무관리 모듈 통합

// 통합 클라이언트 정의
export interface UnifiedClient {
  id: string;                    // 클라이언트 고유 ID
  name: string;                  // 클라이언트명
  businessNumber?: string;       // 사업자번호
  email?: string;                // 이메일
  phone?: string;                // 연락처
  address?: string;              // 주소
  type: 'company' | 'individual' | 'freelancer';  // 클라이언트 유형
  createdAt: string;
  updatedAt: string;
}

// 통합 프로젝트 정의 (기존 ProjectTableRow 확장)
export interface UnifiedProject {
  // 기본 식별자
  id: string;                    // 프로젝트 고유 ID (WEAVE_001 형식)
  no: string;                    // 프로젝트 번호 (id와 동일)
  
  // 프로젝트 정보
  name: string;                  // 프로젝트명
  description?: string;          // 프로젝트 설명
  
  // 클라이언트 연결
  clientId: string;              // 통합 클라이언트 ID
  clientName: string;            // 클라이언트명 (캐시용)
  
  // 프로젝트 상태
  status: ProjectStatus;
  progress: number;              // 작업 진행률 (0-100)
  paymentProgress?: number;      // 결제 진행률 (0-100)
  
  // 일정 관리
  startDate?: string;            // 시작일
  dueDate: string;               // 마감일
  registrationDate: string;      // 등록일
  modifiedDate: string;          // 수정일
  
  // 재무 정보
  totalAmount?: number;          // 총 프로젝트 금액
  paidAmount?: number;           // 입금된 금액
  remainingAmount?: number;      // 잔여 금액
  
  // 문서 및 계약 정보
  hasContract?: boolean;
  hasBilling?: boolean;
  hasDocuments?: boolean;
  documentStatus?: ProjectDocumentStatus;
  
  // 관련 데이터 (지연 로딩)
  contract?: ContractInfo;
  estimate?: EstimateInfo;
  billing?: BillingInfo;
  documents?: DocumentInfo[];
  transactions?: UnifiedTransaction[];  // 관련 세무 거래 내역
}

// 통합 거래 내역 (기존 Transaction 확장)
export interface UnifiedTransaction {
  // 기본 식별자
  id: string;
  userId: string;
  
  // 거래 정보
  transactionDate: string;       // transaction_date -> transactionDate (카멜케이스)
  transactionType: '매입' | '매출';
  
  // 거래처 정보 (클라이언트 통합)
  supplierName: string;          // supplier_name -> supplierName
  businessNumber?: string;       // business_number -> businessNumber
  clientId?: string;             // 통합 클라이언트 ID
  
  // 프로젝트 연결
  projectId?: string;            // 프로젝트 ID (WEAVE_001 형식과 일치)
  projectName?: string;          // 프로젝트명 (캐시용)
  
  // 금액 정보
  supplyAmount: number;          // supply_amount -> supplyAmount
  vatAmount: number;             // vat_amount -> vatAmount
  withholdingTax33: number;      // withholding_tax_3_3 -> withholdingTax33
  withholdingTax68: number;      // withholding_tax_6_8 -> withholdingTax68
  totalAmount: number;           // total_amount -> totalAmount
  
  // 분류 및 설명
  category?: string;
  description?: string;
  status?: string;
  
  // 메타데이터
  createdAt: string;             // created_at -> createdAt
  updatedAt: string;             // updated_at -> updatedAt
}

// 기존 타입들 재사용
export type ProjectStatus = 
  | 'planning' 
  | 'in_progress' 
  | 'review' 
  | 'completed' 
  | 'on_hold' 
  | 'cancelled';

export interface ContractInfo {
  totalAmount?: number;
  content?: string;
  contractorInfo: {
    name: string;
    position: string;
  };
  reportInfo: {
    type: string;
  };
  estimateInfo: {
    type: string;
  };
  documentIssue: {
    taxInvoice: string;
    receipt: string;
    cashReceipt: string;
    businessReceipt: string;
  };
  other: {
    date: string;
  };
}

export interface EstimateInfo {
  totalAmount?: number;
  content?: string;
  createdAt?: string;
  validUntil?: string;
  status?: 'draft' | 'sent' | 'approved' | 'rejected';
}

export interface BillingInfo {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  contractAmount: number;
  interimAmount: number;
  finalAmount: number;
  contractPaid: number;
  interimPaid: number;
  finalPaid: number;
}

export interface DocumentInfo {
  id: string;
  type: 'contract' | 'invoice' | 'report' | 'estimate' | 'etc';
  name: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'approved' | 'completed';
}

export interface ProjectDocumentStatus {
  contract: DocumentStatus;
  invoice: DocumentStatus;
  report: DocumentStatus;
  estimate: DocumentStatus;
  etc: DocumentStatus;
}

export interface DocumentStatus {
  exists: boolean;
  status: 'none' | 'draft' | 'completed' | 'approved' | 'sent';
  lastUpdated?: string;
  count?: number;
}

// 데이터 변환 유틸리티 타입
export interface DataMapper {
  // 기존 ProjectTableRow를 UnifiedProject로 변환
  projectToUnified(project: any, client?: UnifiedClient): UnifiedProject;
  
  // 기존 Transaction을 UnifiedTransaction으로 변환
  transactionToUnified(transaction: any, project?: UnifiedProject, client?: UnifiedClient): UnifiedTransaction;
  
  // UnifiedProject를 기존 ProjectTableRow로 변환 (호환성)
  unifiedToProject(unified: UnifiedProject): any;
  
  // UnifiedTransaction을 기존 Transaction으로 변환 (호환성)
  unifiedToTransaction(unified: UnifiedTransaction): any;
}

// 통합 필터 타입
export interface UnifiedFilters {
  // 공통 필터
  clientId?: string;
  projectId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  
  // 프로젝트 필터
  status?: ProjectStatus | 'all';
  progressRange?: {
    min: number;
    max: number;
  };
  
  // 거래 필터
  transactionType?: 'all' | '매입' | '매출';
  amountRange?: {
    min: number;
    max: number;
  };
  
  // 검색
  searchQuery?: string;
}

// 통합 조회 결과
export interface UnifiedQueryResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  aggregates?: {
    totalAmount?: number;
    count?: number;
    [key: string]: any;
  };
}