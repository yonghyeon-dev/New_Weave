/**
 * Invoice Domain Types
 * 인보이스 관련 타입 정의
 */

export type InvoiceStatus = 
  | 'draft'      // 작성중
  | 'issued'     // 발행됨
  | 'overdue'    // 연체
  | 'paid'       // 결제완료
  | 'cancelled'; // 취소됨

export type PaymentStatus =
  | 'completed'     // 결제완료
  | 'pending'       // 대기중
  | 'failed'        // 실패
  | 'refunded';     // 환불

export type PaymentMethod = 
  | 'bank_transfer'  // 계좌이체
  | 'credit_card'    // 신용카드  
  | 'cash'          // 현금
  | 'check'         // 수표
  | 'other';        // 기타

export interface Invoice {
  id: string;
  invoiceNumber: string;        // 인보이스 번호
  tenantId: string;             // 사용자 ID
  clientId: string;             // 고객 ID
  projectId?: string;           // 프로젝트 ID (선택)
  
  // 날짜 정보
  issueDate: Date;              // 발행일
  dueDate: Date;                // 만기일
  paidDate?: Date;              // 결제일
  
  // 금액 정보
  subtotal: number;             // 공급가액
  tax: number;                  // 세액
  total: number;                // 총액
  currency: string;             // 통화 (기본 KRW)
  
  // 상태
  status: InvoiceStatus;
  
  // 상세 항목
  items: InvoiceItem[];
  
  // 메모
  notes?: string;               // 비고
  terms?: string;               // 거래 조건
  
  // 메타 정보
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;          // 항목 설명
  quantity: number;             // 수량
  unitPrice: number;            // 단가
  amount: number;               // 금액 (quantity * unitPrice)
  taxRate?: number;             // 세율 (기본 10%)
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;               // 결제 금액
  method: PaymentMethod;        // 결제 방법
  status: PaymentStatus;        // 결제 상태
  date: Date;                   // 결제일시
  notes?: string;               // 메모
  createdAt: Date;
}

export interface InvoiceReminder {
  id: string;
  invoiceId: string;
  scheduledAt: Date;            // 예정 발송 시간
  sentAt?: Date;                // 실제 발송 시간
  status: 'pending' | 'sent' | 'failed';
  retryCount: number;
  createdAt: Date;
}

// 대시보드용 집계 타입
export interface InvoiceSummary {
  totalIssued: number;          // 총 발행액
  totalPaid: number;            // 총 입금액
  totalOverdue: number;         // 총 연체액
  overdueCount: number;         // 연체 건수
  averagePaymentDays: number;   // 평균 결제일
}