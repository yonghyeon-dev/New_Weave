// Mock 모드: Supabase 클라이언트 제거
import type { Transaction } from './tax-transactions.service';

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: {
    transaction_type?: 'sales' | 'purchase';
    payment_status?: string;
    start_date?: string;
    end_date?: string;
    supplier_name?: string;
    min_amount?: number;
    max_amount?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * 페이지네이션을 사용한 거래 내역 조회
 */
export async function fetchTransactionsWithPagination(
  options: PaginationOptions = {}
): Promise<PaginatedResponse<Transaction>> {
  const {
    page = 1,
    pageSize = 20,
    sortField = 'transaction_date',
    sortOrder = 'desc',
    filters = {}
  } = options;

  // Mock 모드: 모의 데이터 생성
  const mockData = generateMockPaginatedTransactions(page, pageSize, filters);
  
  return {
    data: mockData.transactions,
    page,
    pageSize,
    totalCount: mockData.totalCount,
    totalPages: Math.ceil(mockData.totalCount / pageSize),
    hasMore: page < Math.ceil(mockData.totalCount / pageSize)
  };
}

/**
 * 커서 기반 무한 스크롤용 거래 내역 조회
 */
export async function fetchTransactionsWithCursor(
  cursor?: string,
  limit: number = 20,
  filters?: PaginationOptions['filters']
): Promise<{
  data: Transaction[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  // Mock 모드: 커서 기반 모의 데이터 생성
  const mockData = generateMockCursorTransactions(cursor, limit, filters);
  
  return {
    data: mockData.transactions,
    nextCursor: mockData.nextCursor,
    hasMore: mockData.hasMore
  };
}

/**
 * 무한 스크롤 헬퍼 클래스
 */
export class InfiniteScrollManager {
  private cursor: string | null = null;
  private isLoading = false;
  private hasMore = true;
  private data: Transaction[] = [];
  private filters?: PaginationOptions['filters'];

  constructor(private limit: number = 20) {}

  /**
   * 필터 설정
   */
  setFilters(filters: PaginationOptions['filters']) {
    this.filters = filters;
    this.reset();
  }

  /**
   * 초기화
   */
  reset() {
    this.cursor = null;
    this.hasMore = true;
    this.data = [];
  }

  /**
   * 다음 페이지 로드
   */
  async loadMore(): Promise<Transaction[]> {
    if (this.isLoading || !this.hasMore) {
      return [];
    }

    this.isLoading = true;

    try {
      const result = await fetchTransactionsWithCursor(
        this.cursor || undefined,
        this.limit,
        this.filters
      );

      this.cursor = result.nextCursor;
      this.hasMore = result.hasMore;
      this.data = [...this.data, ...result.data];

      return result.data;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 현재 데이터 가져오기
   */
  getData(): Transaction[] {
    return this.data;
  }

  /**
   * 로딩 상태 확인
   */
  getIsLoading(): boolean {
    return this.isLoading;
  }

  /**
   * 더 많은 데이터 존재 여부
   */
  getHasMore(): boolean {
    return this.hasMore;
  }
}

/**
 * 거래 내역 집계 데이터 조회
 */
export async function fetchTransactionAggregates(
  filters?: PaginationOptions['filters']
): Promise<{
  totalSales: number;
  totalPurchases: number;
  totalVat: number;
  transactionCount: number;
}> {
  // Mock 모드: 집계 데이터 시뮬레이션
  return {
    totalSales: 15750000,
    totalPurchases: 8320000,
    totalVat: 2407000,
    transactionCount: 145
  };
}

/**
 * 페이지네이션용 모의 데이터 생성
 */
function generateMockPaginatedTransactions(
  page: number,
  pageSize: number,
  filters?: PaginationOptions['filters']
) {
  const totalCount = 150; // 전체 데이터 개수
  const transactions: Transaction[] = [];
  
  // 시작 인덱스 계산
  const startIndex = (page - 1) * pageSize;
  
  for (let i = 0; i < pageSize; i++) {
    const index = startIndex + i;
    if (index >= totalCount) break;
    
    const date = new Date();
    date.setDate(date.getDate() - index);
    
    const isSale = Math.random() > 0.4;
    const supplyAmount = Math.floor(Math.random() * 500000) + 50000;
    const vatAmount = Math.floor(supplyAmount * 0.1);
    
    transactions.push({
      id: `mock-${index}`,
      user_id: 'mock-user',
      transaction_date: date.toISOString().split('T')[0],
      transaction_type: isSale ? '매출' : '매입',
      supplier_name: isSale ? `고객사 ${index % 10 + 1}` : `공급업체 ${index % 8 + 1}`,
      business_number: `${123 + index % 900}-${45 + index % 55}-${String(10000 + index % 90000).padStart(5, '0')}`,
      supply_amount: supplyAmount,
      vat_amount: vatAmount,
      withholding_tax_3_3: 0,
      withholding_tax_6_8: 0,
      total_amount: supplyAmount + vatAmount,
      category: isSale ? '용역매출' : '사무용품',
      description: `${isSale ? '컨설팅 서비스' : '사무용품 구매'} ${index}`,
      project_id: Math.random() > 0.5 ? `project-${index % 5 + 1}` : undefined,
      client_id: Math.random() > 0.3 ? `client-${index % 3 + 1}` : undefined,
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return {
    transactions,
    totalCount
  };
}

/**
 * 커서 기반 모의 데이터 생성
 */
function generateMockCursorTransactions(
  cursor?: string,
  limit: number = 20,
  filters?: PaginationOptions['filters']
) {
  const transactions: Transaction[] = [];
  let startIndex = 0;
  
  if (cursor) {
    const [date, id] = cursor.split('_');
    startIndex = parseInt(id.replace('mock-', '')) + 1;
  }
  
  const maxItems = Math.min(limit, 50 - startIndex); // 최대 50개 항목
  const hasMore = startIndex + maxItems < 50;
  
  for (let i = 0; i < maxItems; i++) {
    const index = startIndex + i;
    const date = new Date();
    date.setDate(date.getDate() - index);
    
    const isSale = Math.random() > 0.4;
    const supplyAmount = Math.floor(Math.random() * 500000) + 50000;
    const vatAmount = Math.floor(supplyAmount * 0.1);
    
    transactions.push({
      id: `mock-${index}`,
      user_id: 'mock-user',
      transaction_date: date.toISOString().split('T')[0],
      transaction_type: isSale ? '매출' : '매입',
      supplier_name: isSale ? `고객사 ${index % 10 + 1}` : `공급업체 ${index % 8 + 1}`,
      business_number: `${123 + index % 900}-${45 + index % 55}-${String(10000 + index % 90000).padStart(5, '0')}`,
      supply_amount: supplyAmount,
      vat_amount: vatAmount,
      withholding_tax_3_3: 0,
      withholding_tax_6_8: 0,
      total_amount: supplyAmount + vatAmount,
      category: isSale ? '용역매출' : '사무용품',
      description: `${isSale ? '컨설팅 서비스' : '사무용품 구매'} ${index}`,
      project_id: Math.random() > 0.5 ? `project-${index % 5 + 1}` : undefined,
      client_id: Math.random() > 0.3 ? `client-${index % 3 + 1}` : undefined,
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  const nextCursor = transactions.length > 0 && hasMore 
    ? `${transactions[transactions.length - 1].transaction_date}_${transactions[transactions.length - 1].id}`
    : null;
  
  return {
    transactions,
    nextCursor,
    hasMore
  };
}