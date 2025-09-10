// Mock 데이터 서비스 - Supabase 연결 제거
import { queryCache } from './query-optimizer.service';
import { UNIFIED_TRANSACTIONS } from '@/lib/data/unified-mock-data';
import { dataMapper } from '@/lib/utils/data-mapper';

// Type definitions (Mock)
export interface Transaction {
  id: string;
  user_id: string;
  transaction_date: string;
  transaction_type: '매입' | '매출';
  supplier_name: string;
  business_number?: string;
  supply_amount: number;
  vat_amount: number;
  withholding_tax_3_3: number;
  withholding_tax_6_8: number;
  total_amount: number;
  category?: string;
  description?: string;
  project_id?: string;
  client_id?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export type TransactionInsert = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
export type TransactionUpdate = Partial<TransactionInsert>;

export interface MonthlySummary {
  id: string;
  user_id: string;
  year: number;
  month: number;
  total_sales: number;
  total_purchases: number;
  vat_payable: number;
  withholding_tax_collected: number;
  withholding_tax_paid: number;
  transaction_count: number;
  last_updated: string;
}

export interface TransactionFilters {
  dateRange?: string;
  transactionType?: 'all' | '매입' | '매출';
  projectId?: string | null;
  clientId?: string | null;
  startDate?: Date;
  endDate?: Date;
}

export interface MonthlyStats {
  year: number;
  month: number;
  totalSales: number;
  totalPurchases: number;
  vatPayable: number;
  transactionCount: number;
  withholding_tax_collected: number;
  withholding_tax_paid: number;
}

export type MonthlyStatistics = MonthlyStats;

export interface YearlyProjection {
  expectedRevenue: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  growthRate: number;
}

export interface MonthlyTrend {
  month: number;
  매출: number;
  매입: number;
}

// Mock 데이터 저장소 - 통합 데이터 사용
let mockTransactions: Transaction[] = dataMapper.unifiedToTransactions(UNIFIED_TRANSACTIONS);

let mockMonthlySummaries: MonthlySummary[] = [];

export class TaxTransactionService {
  // CRUD Operations (Mock)
  async createTransaction(data: Omit<TransactionInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...data as TransactionInsert,
      id: `trans-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockTransactions.push(newTransaction);
    queryCache.invalidate('transactions:');
    return newTransaction;
  }

  async getTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    // 캐시 키 생성
    const cacheKey = `transactions:${JSON.stringify(filters)}`;
    
    // 캐시 확인
    const cached = queryCache.get(cacheKey);
    if (cached) return cached;
    
    let result = [...mockTransactions];

    // Apply filters
    if (filters.transactionType && filters.transactionType !== 'all') {
      result = result.filter(t => t.transaction_type === filters.transactionType);
    }

    if (filters.projectId) {
      result = result.filter(t => t.project_id === filters.projectId);
    }

    if (filters.clientId) {
      result = result.filter(t => t.client_id === filters.clientId);
    }

    if (filters.startDate) {
      result = result.filter(t => new Date(t.transaction_date) >= filters.startDate!);
    }

    if (filters.endDate) {
      result = result.filter(t => new Date(t.transaction_date) <= filters.endDate!);
    }

    // Handle date range presets - Mock 데이터용 2024년 사용
    if (filters.dateRange) {
      const mockYear = 2024; // Mock 데이터가 2024년이므로
      
      switch (filters.dateRange) {
        case 'thisMonth':
          // 2024년 12월 데이터 표시
          const thisMonthStart = new Date(2024, 11, 1);  // 2024년 12월 1일
          const thisMonthEnd = new Date(2024, 11, 31);    // 2024년 12월 31일
          result = result.filter(t => {
            const date = new Date(t.transaction_date);
            return date >= thisMonthStart && date <= thisMonthEnd;
          });
          break;
        case 'lastMonth':
          // 2024년 11월 데이터 표시
          const lastMonthStart = new Date(2024, 10, 1);  // 2024년 11월 1일
          const lastMonthEnd = new Date(2024, 10, 30);   // 2024년 11월 30일
          result = result.filter(t => {
            const date = new Date(t.transaction_date);
            return date >= lastMonthStart && date <= lastMonthEnd;
          });
          break;
        case 'thisYear':
          // 2024년 전체 데이터 표시
          const yearStart = new Date(mockYear, 0, 1);   // 2024년 1월 1일
          const yearEnd = new Date(mockYear, 11, 31);   // 2024년 12월 31일
          result = result.filter(t => {
            const date = new Date(t.transaction_date);
            return date >= yearStart && date <= yearEnd;
          });
          break;
      }
    }
    
    // Sort by date descending
    result.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
    
    // 캐시 저장
    queryCache.set(cacheKey, result);
    
    return result;
  }

  async updateTransaction(id: string, data: TransactionUpdate): Promise<Transaction> {
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    mockTransactions[index] = {
      ...mockTransactions[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    // 캐시 무효화
    queryCache.invalidate('transactions:');
    
    return mockTransactions[index];
  }

  async deleteTransaction(id: string): Promise<void> {
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    mockTransactions.splice(index, 1);
    
    // 캐시 무효화
    queryCache.invalidate('transactions:');
  }

  // Project Linking
  async linkToProject(transactionId: string, projectId: string): Promise<void> {
    const transaction = mockTransactions.find(t => t.id === transactionId);
    if (transaction) {
      transaction.project_id = projectId;
      transaction.updated_at = new Date().toISOString();
      queryCache.invalidate('transactions:');
    }
  }

  async getProjectTransactions(projectId: string): Promise<Transaction[]> {
    return mockTransactions
      .filter(t => t.project_id === projectId)
      .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
  }

  // Statistics and Projections
  async getMonthlyStatistics(year: number, month: number): Promise<MonthlyStats> {
    // 캐시 확인
    const cacheKey = `monthly-stats:${year}-${month}`;
    const cached = queryCache.get(cacheKey);
    if (cached) return cached;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthTransactions = mockTransactions.filter(t => {
      const date = new Date(t.transaction_date);
      return date >= startDate && date <= endDate;
    });

    const stats: MonthlyStats = {
      year,
      month,
      totalSales: 0,
      totalPurchases: 0,
      vatPayable: 0,
      transactionCount: monthTransactions.length,
      withholding_tax_collected: 0,
      withholding_tax_paid: 0
    };

    monthTransactions.forEach(transaction => {
      if (transaction.transaction_type === '매출') {
        stats.totalSales += transaction.total_amount;
        stats.vatPayable += transaction.vat_amount;
        stats.withholding_tax_collected += transaction.withholding_tax_3_3 + transaction.withholding_tax_6_8;
      } else {
        stats.totalPurchases += transaction.total_amount;
        stats.vatPayable -= transaction.vat_amount; // 매입 부가세는 공제
        stats.withholding_tax_paid += transaction.withholding_tax_3_3 + transaction.withholding_tax_6_8;
      }
    });

    // 캐시 저장
    queryCache.set(cacheKey, stats);
    return stats;
  }

  async getYearlyProjection(year: number): Promise<YearlyProjection> {
    // 전체 월별 트렌드 데이터 가져오기
    const monthlyTrend = await this.getMonthlyTrend(2024);
    
    // 연간 총 매출 계산 (원천세 제외된 실제 입금액 기준)
    const totalRevenue = monthlyTrend.reduce((sum, month) => sum + month.매출, 0);
    
    // 12월과 11월 매출 계산
    const currentMonthRevenue = monthlyTrend[11].매출;  // 12월
    const previousMonthRevenue = monthlyTrend[10].매출;  // 11월

    // 전년도 대비 성장률 계산 (Mock: 작년 총 매출 50,000,000원으로 가정)
    const lastYearTotal = 50000000;
    const growthRate = lastYearTotal > 0 
      ? ((totalRevenue / lastYearTotal - 1) * 100) 
      : 0;

    // 연간 예상 매출 (현재까지의 평균을 기준으로 계산)
    const currentMonth = 12;  // 12월까지 데이터가 있음
    const monthlyAverage = totalRevenue / currentMonth;
    const expectedRevenue = totalRevenue;  // 이미 12개월 데이터가 있으므로 총합이 예상치

    return {
      expectedRevenue,
      currentMonthRevenue,
      previousMonthRevenue,
      growthRate
    };
  }

  async getMonthlyTrend(year: number): Promise<MonthlyTrend[]> {
    // Mock 데이터용: 2024년 데이터 사용
    const yearTransactions = mockTransactions.filter(t => {
      const date = new Date(t.transaction_date);
      return date.getFullYear() === 2024;
    });

    // 12개월 데이터 초기화
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      매출: 0,
      매입: 0
    }));

    // 실제 거래 데이터 집계
    yearTransactions.forEach(transaction => {
      const month = new Date(transaction.transaction_date).getMonth();
      if (transaction.transaction_type === '매출') {
        // 매출은 원천세를 제외한 실제 입금액으로 계산
        const actualRevenue = transaction.total_amount - transaction.withholding_tax_3_3 - transaction.withholding_tax_6_8;
        monthlyData[month].매출 += actualRevenue;
      } else {
        monthlyData[month].매입 += transaction.total_amount;
      }
    });

    // Mock 데이터 보강 - 1월부터 9월까지 임의 데이터 추가
    // 실제 데이터가 10, 11, 12월에만 있으므로 나머지 월에 샘플 데이터 추가
    const mockMonthlyTrends = [
      { month: 1, additionalRevenue: 3500000, additionalExpense: 1200000 },
      { month: 2, additionalRevenue: 4200000, additionalExpense: 1500000 },
      { month: 3, additionalRevenue: 5100000, additionalExpense: 1800000 },
      { month: 4, additionalRevenue: 4800000, additionalExpense: 2100000 },
      { month: 5, additionalRevenue: 5500000, additionalExpense: 2000000 },
      { month: 6, additionalRevenue: 6200000, additionalExpense: 2300000 },
      { month: 7, additionalRevenue: 5800000, additionalExpense: 2500000 },
      { month: 8, additionalRevenue: 6500000, additionalExpense: 2800000 },
      { month: 9, additionalRevenue: 7200000, additionalExpense: 3000000 }
    ];

    // Mock 데이터를 1-9월에 추가
    mockMonthlyTrends.forEach(trend => {
      monthlyData[trend.month - 1].매출 += trend.additionalRevenue;
      monthlyData[trend.month - 1].매입 += trend.additionalExpense;
    });

    return monthlyData;
  }

  async getTransactionsByDateRange(start: Date, end: Date): Promise<Transaction[]> {
    return mockTransactions
      .filter(t => {
        const date = new Date(t.transaction_date);
        return date >= start && date <= end;
      })
      .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
  }

  // Bulk Operations
  async bulkImportTransactions(transactions: Omit<TransactionInsert, 'id' | 'created_at' | 'updated_at'>[]): Promise<{ success: number; failed: number }> {
    const results = { success: 0, failed: 0 };
    
    for (const transaction of transactions) {
      try {
        await this.createTransaction(transaction);
        results.success++;
      } catch (error) {
        results.failed++;
        console.error('Import error:', error);
      }
    }
    
    return results;
  }

  async exportToExcel(filters: TransactionFilters): Promise<Blob> {
    const transactions = await this.getTransactions(filters);
    
    // Format data for Excel export
    const excelData = transactions.map(t => ({
      날짜: t.transaction_date,
      구분: t.transaction_type,
      거래처: t.supplier_name,
      사업자번호: t.business_number,
      공급가액: t.supply_amount,
      부가세: t.vat_amount,
      '원천세(3.3%)': t.withholding_tax_3_3,
      '원천세(6.8%)': t.withholding_tax_6_8,
      합계: t.total_amount,
      카테고리: t.category,
      설명: t.description
    }));

    // Convert to CSV (simple export format)
    const headers = Object.keys(excelData[0] || {});
    const csvContent = [
      headers.join(','),
      ...excelData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    return new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  // Real-time subscription (Mock - no-op)
  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    // Mock implementation - returns empty subscription
    return {
      unsubscribe: () => {}
    };
  }

  // 페이지네이션과 함께 거래 조회
  async fetchTransactionsWithPagination(options: {
    pageSize?: number;
    page?: number;
    filters?: Partial<TransactionFilters>;
  }): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }> {
    const { pageSize = 20, page = 1, filters = {} } = options;
    
    // 모든 거래 조회
    const allTransactions = await this.getTransactions(filters as TransactionFilters);
    
    // 페이지네이션 적용
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = allTransactions.slice(startIndex, endIndex);
    
    return {
      data,
      total: allTransactions.length,
      page,
      pageSize,
      hasMore: endIndex < allTransactions.length
    };
  }
}

// Singleton instance
export const taxTransactionService = new TaxTransactionService();

// 편의 함수 exports
export const fetchTransactionsWithPagination = (options: {
  pageSize?: number;
  page?: number;
  filters?: Partial<TransactionFilters>;
}) => taxTransactionService.fetchTransactionsWithPagination(options);