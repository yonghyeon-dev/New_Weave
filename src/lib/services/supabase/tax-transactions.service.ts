// Mock 데이터 서비스 - Supabase 연결 제거
import { queryCache } from './query-optimizer.service';

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

// Mock 데이터 저장소 - 풍부한 데이터 추가
let mockTransactions: Transaction[] = [
  // 2024년 12월 데이터
  {
    id: '1',
    user_id: 'mock-user',
    transaction_date: '2024-12-01',
    transaction_type: '매출',
    supplier_name: '테크스타트',
    business_number: '123-45-67890',
    supply_amount: 1000000,
    vat_amount: 100000,
    withholding_tax_3_3: 33000,
    withholding_tax_6_8: 0,
    total_amount: 1067000,
    category: '서비스',
    description: '웹사이트 개발',
    project_id: 'proj-1',
    client_id: 'client-1',
    status: 'completed',
    created_at: '2024-12-01T09:00:00Z',
    updated_at: '2024-12-01T09:00:00Z'
  },
  {
    id: '2',
    user_id: 'mock-user',
    transaction_date: '2024-12-05',
    transaction_type: '매입',
    supplier_name: '클라우드서비스',
    business_number: '987-65-43210',
    supply_amount: 300000,
    vat_amount: 30000,
    withholding_tax_3_3: 0,
    withholding_tax_6_8: 0,
    total_amount: 330000,
    category: 'IT서비스',
    description: '서버 호스팅',
    status: 'pending',
    created_at: '2024-12-05T10:00:00Z',
    updated_at: '2024-12-05T10:00:00Z'
  },
  {
    id: '3',
    user_id: 'mock-user',
    transaction_date: '2024-12-10',
    transaction_type: '매출',
    supplier_name: '디자인컴퍼니',
    business_number: '456-78-90123',
    supply_amount: 2000000,
    vat_amount: 200000,
    withholding_tax_3_3: 66000,
    withholding_tax_6_8: 0,
    total_amount: 2134000,
    category: '디자인',
    description: 'UI/UX 디자인',
    project_id: 'proj-2',
    client_id: 'client-2',
    status: 'completed',
    created_at: '2024-12-10T14:00:00Z',
    updated_at: '2024-12-10T14:00:00Z'
  },
  {
    id: '6',
    user_id: 'mock-user',
    transaction_date: '2024-12-12',
    transaction_type: '매입',
    supplier_name: '구글코리아',
    business_number: '105-81-51510',
    supply_amount: 150000,
    vat_amount: 15000,
    withholding_tax_3_3: 0,
    withholding_tax_6_8: 0,
    total_amount: 165000,
    category: 'IT서비스',
    description: 'Google Workspace 구독',
    status: 'completed',
    created_at: '2024-12-12T10:00:00Z',
    updated_at: '2024-12-12T10:00:00Z'
  },
  {
    id: '7',
    user_id: 'mock-user',
    transaction_date: '2024-12-15',
    transaction_type: '매출',
    supplier_name: '스타트업A',
    business_number: '678-90-12345',
    supply_amount: 3500000,
    vat_amount: 350000,
    withholding_tax_3_3: 115500,
    withholding_tax_6_8: 0,
    total_amount: 3734500,
    category: '컨설팅',
    description: 'IT 컨설팅 서비스',
    status: 'completed',
    created_at: '2024-12-15T11:00:00Z',
    updated_at: '2024-12-15T11:00:00Z'
  },
  {
    id: '8',
    user_id: 'mock-user',
    transaction_date: '2024-12-18',
    transaction_type: '매입',
    supplier_name: '아마존웹서비스',
    business_number: '120-87-65281',
    supply_amount: 450000,
    vat_amount: 45000,
    withholding_tax_3_3: 0,
    withholding_tax_6_8: 0,
    total_amount: 495000,
    category: 'IT서비스',
    description: 'AWS 클라우드 서비스',
    status: 'completed',
    created_at: '2024-12-18T09:00:00Z',
    updated_at: '2024-12-18T09:00:00Z'
  },
  
  // 2024년 11월 데이터
  {
    id: '4',
    user_id: 'mock-user',
    transaction_date: '2024-11-15',
    transaction_type: '매출',
    supplier_name: '이커머스플러스',
    business_number: '234-56-78901',
    supply_amount: 1500000,
    vat_amount: 150000,
    withholding_tax_3_3: 49500,
    withholding_tax_6_8: 0,
    total_amount: 1600500,
    category: '개발',
    description: '쇼핑몰 구축',
    project_id: 'proj-3',
    client_id: 'client-3',
    status: 'completed',
    created_at: '2024-11-15T11:00:00Z',
    updated_at: '2024-11-15T11:00:00Z'
  },
  {
    id: '5',
    user_id: 'mock-user',
    transaction_date: '2024-11-20',
    transaction_type: '매입',
    supplier_name: '오피스렌탈',
    business_number: '345-67-89012',
    supply_amount: 500000,
    vat_amount: 50000,
    withholding_tax_3_3: 0,
    withholding_tax_6_8: 0,
    total_amount: 550000,
    category: '임대료',
    description: '사무실 임대',
    status: 'completed',
    created_at: '2024-11-20T09:00:00Z',
    updated_at: '2024-11-20T09:00:00Z'
  },
  {
    id: '9',
    user_id: 'mock-user',
    transaction_date: '2024-11-05',
    transaction_type: '매출',
    supplier_name: '금융회사B',
    business_number: '890-12-34567',
    supply_amount: 5000000,
    vat_amount: 500000,
    withholding_tax_3_3: 165000,
    withholding_tax_6_8: 0,
    total_amount: 5335000,
    category: '개발',
    description: '금융 시스템 개발',
    status: 'completed',
    created_at: '2024-11-05T10:00:00Z',
    updated_at: '2024-11-05T10:00:00Z'
  },
  {
    id: '10',
    user_id: 'mock-user',
    transaction_date: '2024-11-10',
    transaction_type: '매입',
    supplier_name: '노션코리아',
    business_number: '208-81-45678',
    supply_amount: 120000,
    vat_amount: 12000,
    withholding_tax_3_3: 0,
    withholding_tax_6_8: 0,
    total_amount: 132000,
    category: 'IT서비스',
    description: 'Notion 팀 플랜',
    status: 'completed',
    created_at: '2024-11-10T11:00:00Z',
    updated_at: '2024-11-10T11:00:00Z'
  },
  
  // 2024년 10월 데이터
  {
    id: '11',
    user_id: 'mock-user',
    transaction_date: '2024-10-03',
    transaction_type: '매출',
    supplier_name: '제조회사C',
    business_number: '567-89-01234',
    supply_amount: 2800000,
    vat_amount: 280000,
    withholding_tax_3_3: 92400,
    withholding_tax_6_8: 0,
    total_amount: 2987600,
    category: '컨설팅',
    description: 'ERP 시스템 컨설팅',
    status: 'completed',
    created_at: '2024-10-03T09:00:00Z',
    updated_at: '2024-10-03T09:00:00Z'
  },
  {
    id: '12',
    user_id: 'mock-user',
    transaction_date: '2024-10-10',
    transaction_type: '매입',
    supplier_name: '피그마인터내셔널',
    business_number: '542-88-00123',
    supply_amount: 180000,
    vat_amount: 18000,
    withholding_tax_3_3: 0,
    withholding_tax_6_8: 0,
    total_amount: 198000,
    category: '디자인툴',
    description: 'Figma 프로페셔널 플랜',
    status: 'completed',
    created_at: '2024-10-10T14:00:00Z',
    updated_at: '2024-10-10T14:00:00Z'
  },
  {
    id: '13',
    user_id: 'mock-user',
    transaction_date: '2024-10-20',
    transaction_type: '매출',
    supplier_name: '교육기관D',
    business_number: '901-23-45678',
    supply_amount: 4200000,
    vat_amount: 420000,
    withholding_tax_3_3: 138600,
    withholding_tax_6_8: 0,
    total_amount: 4481400,
    category: '교육',
    description: '온라인 교육 플랫폼 구축',
    status: 'completed',
    created_at: '2024-10-20T10:00:00Z',
    updated_at: '2024-10-20T10:00:00Z'
  },
  {
    id: '14',
    user_id: 'mock-user',
    transaction_date: '2024-10-25',
    transaction_type: '매입',
    supplier_name: '통신사E',
    business_number: '106-81-23456',
    supply_amount: 88000,
    vat_amount: 8800,
    withholding_tax_3_3: 0,
    withholding_tax_6_8: 0,
    total_amount: 96800,
    category: '통신비',
    description: '인터넷 회선 비용',
    status: 'completed',
    created_at: '2024-10-25T15:00:00Z',
    updated_at: '2024-10-25T15:00:00Z'
  }
];

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
    // Mock 데이터용: 2024년 데이터 사용
    const yearTransactions = mockTransactions.filter(t => {
      const date = new Date(t.transaction_date);
      return date.getFullYear() === 2024 && t.transaction_type === '매출';
    });

    // Mock: 3개월 데이터 기준으로 연간 예측
    const currentMonth = 3;  // 10, 11, 12월 데이터가 있으므로 3개월
    const totalRevenue = yearTransactions.reduce((sum, t) => sum + t.total_amount, 0);
    const monthlyAverage = currentMonth > 0 ? totalRevenue / currentMonth : 0;
    const expectedRevenue = monthlyAverage * 12;

    // Get current and previous month revenue (Mock: 12월과 11월 데이터)
    const currentMonthRevenue = yearTransactions
      .filter(t => new Date(t.transaction_date).getMonth() === 11)  // 12월 (월은 0부터 시작)
      .reduce((sum, t) => sum + t.total_amount, 0);

    const previousMonthRevenue = yearTransactions
      .filter(t => new Date(t.transaction_date).getMonth() === 10)  // 11월
      .reduce((sum, t) => sum + t.total_amount, 0);

    // Calculate growth rate (mock data)
    const lastYearTotal = 15000000; // Mock last year total
    const growthRate = lastYearTotal > 0 
      ? ((expectedRevenue / lastYearTotal - 1) * 100) 
      : 0;

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

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      매출: 0,
      매입: 0
    }));

    yearTransactions.forEach(transaction => {
      const month = new Date(transaction.transaction_date).getMonth();
      if (transaction.transaction_type === '매출') {
        monthlyData[month].매출 += transaction.total_amount;
      } else {
        monthlyData[month].매입 += transaction.total_amount;
      }
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
}

// Singleton instance
export const taxTransactionService = new TaxTransactionService();