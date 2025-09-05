// 프로젝트 테이블 시스템 중앙화된 타입 정의

export interface ProjectTableColumn {
  id: string;
  key: keyof ProjectTableRow;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  visible: boolean;
  order: number;
  type: 'text' | 'date' | 'number' | 'status' | 'progress' | 'currency' | 'payment_progress';
}

export interface ProjectTableRow {
  id: string;
  no: string;
  name: string;
  registrationDate: string;
  client: string;
  progress: number;
  status: ProjectStatus;
  dueDate: string;
  modifiedDate: string;
  paymentProgress?: number;   // 수급현황 진행률 (총금액 대비 입금액 비율)
  // 지연 로딩 최적화를 위한 플래그
  hasContract?: boolean;
  hasBilling?: boolean;
  hasDocuments?: boolean;
  // 세부정보용 추가 필드 (필요시 지연 로딩)
  contract?: ContractInfo;
  billing?: BillingInfo;
  documents?: DocumentInfo[];
}

export type ProjectStatus = 
  | 'planning' 
  | 'in_progress' 
  | 'review' 
  | 'completed' 
  | 'on_hold' 
  | 'cancelled';

export interface ContractInfo {
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

export interface BillingInfo {
  // 청구/정산 관련 정보
  totalAmount: number;        // 총 프로젝트 금액
  paidAmount: number;         // 총 입금액 (계약금 + 중도금 + 잔금)
  remainingAmount: number;    // 미수금
  // 수금 단계별 세부 정보
  contractAmount: number;     // 계약금 (선수금)
  interimAmount: number;      // 중도금
  finalAmount: number;        // 잔금
  // 실제 입금 현황
  contractPaid: number;       // 계약금 입금액
  interimPaid: number;        // 중도금 입금액
  finalPaid: number;          // 잔금 입금액
}

export interface DocumentInfo {
  id: string;
  type: 'contract' | 'invoice' | 'report' | 'estimate';
  name: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'approved' | 'completed';
}

export interface TableFilterState {
  searchQuery: string;
  statusFilter: ProjectStatus | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
  customFilters: Record<string, any>;
}

export interface TableSortState {
  column: string;
  direction: 'asc' | 'desc';
}

export interface ProjectTableConfig {
  columns: ProjectTableColumn[];
  filters: TableFilterState;
  sort: TableSortState;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}