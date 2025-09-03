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
  type: 'text' | 'date' | 'number' | 'status' | 'progress' | 'currency';
}

export interface ProjectTableRow {
  id: string;
  no: string;
  name: string;
  registrationDate: string;
  client: string;
  progress: number;
  status: ProjectStatus;
  supplyStatus: string;
  dueDate: string;
  modifiedDate: string;
  // 세부정보용 추가 필드
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
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
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