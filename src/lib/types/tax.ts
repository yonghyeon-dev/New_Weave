/**
 * Tax Export Types
 * 세무 변환 및 국세청 양식 관련 타입 정의
 */

export interface TaxInvoice {
  // 공급자 정보
  supplier: {
    businessNumber: string;      // 사업자등록번호
    name: string;               // 상호
    representative: string;      // 대표자
    address: string;            // 주소
    businessType: string;       // 업태
    businessItem: string;       // 종목
    email?: string;
    phone?: string;
  };
  
  // 공급받는자 정보
  buyer: {
    businessNumber: string;      // 사업자등록번호
    name: string;               // 상호
    representative?: string;     // 대표자
    address?: string;           // 주소
    businessType?: string;      // 업태
    businessItem?: string;      // 종목
    email?: string;
  };
  
  // 거래 정보
  issueDate: string;            // 작성일자 (YYYY-MM-DD)
  supplyDate: string;           // 공급일자 (YYYY-MM-DD)
  
  // 금액 정보
  items: TaxInvoiceItem[];
  totalSupplyAmount: number;    // 공급가액 합계
  totalTaxAmount: number;       // 세액 합계
  totalAmount: number;          // 총 금액
  
  // 비고
  remarks?: string;
  
  // 전자세금계산서 정보
  electronicInvoiceId?: string; // 전자세금계산서 번호
  issueType: 'normal' | 'revised'; // 정발행/수정발행
}

export interface TaxInvoiceItem {
  date: string;                 // 월/일 (MM-DD)
  item: string;                 // 품목
  specification?: string;       // 규격
  quantity?: number;            // 수량
  unitPrice?: number;          // 단가
  supplyAmount: number;        // 공급가액
  taxAmount: number;           // 세액
  remarks?: string;            // 비고
}

// 국세청 전자신고 양식
export interface NTSExportFormat {
  // 사업자 기본 정보
  businessInfo: {
    taxOfficeCode: string;      // 세무서 코드
    businessNumber: string;      // 사업자등록번호
    businessName: string;        // 상호
    representative: string;      // 대표자명
    reportPeriod: string;       // 신고기간 (YYYY-MM)
  };
  
  // 매출 내역
  salesRecords: NTSSalesRecord[];
  
  // 매입 내역
  purchaseRecords: NTSPurchaseRecord[];
  
  // 집계
  summary: {
    totalSalesAmount: number;   // 총 매출액
    totalSalesTax: number;      // 총 매출세액
    totalPurchaseAmount: number; // 총 매입액
    totalPurchaseTax: number;   // 총 매입세액
    totalPayableTax: number;    // 납부세액
  };
}

export interface NTSSalesRecord {
  transactionDate: string;      // 거래일자 (YYYYMMDD)
  customerBusinessNumber: string; // 거래처 사업자번호
  customerName: string;         // 거래처명
  invoiceCount: number;         // 세금계산서 매수
  supplyAmount: number;         // 공급가액
  taxAmount: number;            // 세액
  invoiceType: '01' | '02' | '03'; // 세금계산서 종류
  remarks?: string;
}

export interface NTSPurchaseRecord {
  transactionDate: string;      // 거래일자 (YYYYMMDD)
  supplierBusinessNumber: string; // 거래처 사업자번호
  supplierName: string;         // 거래처명
  invoiceCount: number;         // 세금계산서 매수
  supplyAmount: number;         // 공급가액
  taxAmount: number;            // 세액
  deductible: boolean;          // 공제 여부
  invoiceType: '01' | '02' | '03'; // 세금계산서 종류
}

// 부가세 신고서 양식
export interface VATReturn {
  // 과세표준 및 매출세액
  taxBase: {
    taxableSales: number;       // 과세 매출
    zeroRatedSales: number;     // 영세율 매출
    exemptSales: number;        // 면세 매출
    totalSales: number;         // 합계
  };
  
  // 매입세액
  inputTax: {
    taxInvoices: number;        // 세금계산서 매입세액
    creditCards: number;        // 신용카드 매입세액
    cashReceipts: number;       // 현금영수증 매입세액
    totalInputTax: number;      // 합계
  };
  
  // 납부(환급)세액
  payableTax: number;           // 납부세액
  refundableTax: number;        // 환급세액
}

// 세무 패키지 (세무사 전달용)
export interface TaxPackage {
  period: string;               // 신고 기간 (YYYY-MM)
  businessInfo: any;            // 사업자 정보
  invoices: TaxInvoice[];       // 세금계산서 목록
  vatReturn: VATReturn;         // 부가세 신고서
  ntsExport: NTSExportFormat;   // 국세청 전자신고 데이터
  documents: string[];          // 첨부 문서 경로
  generatedAt: Date;            // 생성일시
}