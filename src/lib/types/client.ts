/**
 * Client & Project Domain Types
 * 고객 및 프로젝트 관련 타입 정의
 */

export interface Client {
  id: string;
  tenantId: string;              // 사용자 ID
  
  // 기본 정보
  name: string;                  // 회사명/이름
  businessNumber?: string;       // 사업자등록번호
  representative?: string;       // 대표자명
  
  // 연락처
  email?: string;
  phone?: string;
  address?: string;
  
  // 담당자 정보
  contactPerson?: string;        // 담당자명
  contactEmail?: string;         // 담당자 이메일
  contactPhone?: string;         // 담당자 연락처
  
  // 거래 정보
  paymentTerms?: number;         // 결제 조건 (일)
  taxType?: 'taxable' | 'tax_free'; // 과세 구분
  
  // 메모
  notes?: string;
  
  // 메타 정보
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 
  | 'planning'    // 기획중
  | 'active'      // 진행중
  | 'on_hold'     // 보류
  | 'completed'   // 완료
  | 'cancelled';  // 취소

export interface Project {
  id: string;
  tenantId: string;
  clientId: string;              // 고객 ID
  
  // 기본 정보
  name: string;                  // 프로젝트명
  description?: string;          // 설명
  status: ProjectStatus;
  
  // 일정
  startDate?: Date;              // 시작일
  endDate?: Date;                // 종료일
  dueDate?: Date;                // 마감일
  
  // 예산
  budget?: number;               // 예산
  currency: string;              // 통화 (기본 KRW)
  
  // 진행률
  progress?: number;             // 진행률 (0-100)
  
  // 관련 문서
  invoiceIds?: string[];         // 관련 인보이스
  documentIds?: string[];        // 관련 문서
  
  // 메타 정보
  createdAt: Date;
  updatedAt: Date;
}

// 대시보드용 집계 타입
export interface ClientSummary {
  id: string;
  name: string;
  totalRevenue: number;          // 총 매출
  invoiceCount: number;          // 인보이스 수
  projectCount: number;          // 프로젝트 수
  lastTransactionDate?: Date;    // 마지막 거래일
}

export interface ProjectSummary {
  activeCount: number;           // 진행중 프로젝트
  upcomingDeadlines: Project[];  // 마감 임박 프로젝트
  completedThisMonth: number;    // 이번달 완료
  totalBudget: number;          // 총 예산
}