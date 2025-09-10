// Mock 모드: Supabase 클라이언트 제거

// Mock 타입 정의
interface TaxRecord {
  id: string;
  user_id: string;
  year: number;
  month: number;
  total_income: number;
  total_expense: number;
  vat_payable: number;
  created_at: string;
  updated_at: string;
}

type TaxRecordInsert = Omit<TaxRecord, 'id' | 'created_at' | 'updated_at'>;
type TaxRecordUpdate = Partial<TaxRecordInsert>;

// Mock 데이터
const mockTaxRecords: TaxRecord[] = [
  {
    id: 'tax-record-1',
    user_id: 'mock-user',
    year: 2025,
    month: 1,
    total_income: 15000000,
    total_expense: 8000000,
    vat_payable: 700000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class TaxService {
  // 세무 기록 생성 (Mock)
  async createTaxRecord(record: TaxRecordInsert): Promise<TaxRecord> {
    const newRecord: TaxRecord = {
      ...record,
      id: `tax-record-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockTaxRecords.push(newRecord);
    return newRecord;
  }

  // 세무 기록 목록 조회 (Mock)
  async getTaxRecords(userId: string, year?: number, month?: number): Promise<TaxRecord[]> {
    let filtered = mockTaxRecords.filter(record => record.user_id === userId);
    
    if (year) {
      filtered = filtered.filter(record => record.year === year);
    }
    
    if (month) {
      filtered = filtered.filter(record => record.month === month);
    }
    
    return filtered.sort((a, b) => b.year - a.year || b.month - a.month);
  }

  // 특정 세무 기록 조회 (Mock)
  async getTaxRecordById(id: string): Promise<TaxRecord | null> {
    return mockTaxRecords.find(record => record.id === id) || null;
  }

  // 세무 기록 업데이트 (Mock)
  async updateTaxRecord(id: string, updates: TaxRecordUpdate): Promise<TaxRecord> {
    const index = mockTaxRecords.findIndex(record => record.id === id);
    if (index === -1) throw new Error('Record not found');
    
    mockTaxRecords[index] = {
      ...mockTaxRecords[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    return mockTaxRecords[index];
  }

  // 세무 기록 삭제 (Mock)
  async deleteTaxRecord(id: string): Promise<boolean> {
    const index = mockTaxRecords.findIndex(record => record.id === id);
    if (index === -1) throw new Error('Record not found');
    
    mockTaxRecords.splice(index, 1);
    return true;
  }

  // 사업자번호별 세무 기록 조회 (Mock) - 기본 Mock에서는 단순 반환
  async getTaxRecordsByBusinessNumber(businessNumber: string, userId: string): Promise<TaxRecord[]> {
    return mockTaxRecords.filter(record => record.user_id === userId);
  }

  // 클라이언트별 세무 기록 조회 (Mock) - 기본 Mock에서는 단순 반환
  async getTaxRecordsByClient(clientId: string): Promise<TaxRecord[]> {
    return mockTaxRecords.slice(0, 2); // Mock 반환
  }

  // 마감일 임박 세무 신고 조회 (Mock)
  async getUpcomingTaxDeadlines(userId: string, days: number = 30): Promise<TaxRecord[]> {
    // Mock: 빈 배열 반환 (임박한 마감일 없음)
    return [];
  }

  // 연도별 세무 통계 (Mock)
  async getTaxStatsByYear(userId: string, year: number) {
    const stats = {
      year,
      total: 12,
      totalAmount: 180000000,
      byMonth: {} as Record<number, { count: number; amount: number }>,
      totalIncome: 180000000,
      totalExpense: 96000000,
      totalVatPayable: 8400000
    }

    return stats;
  }

  // 세무 달력 데이터 조회 (Mock)
  async getTaxCalendar(userId: string, year: number, month: number): Promise<TaxRecord[]> {
    // Mock: 해당 월의 세무 기록들 반환
    return mockTaxRecords.filter(record => 
      record.user_id === userId && 
      record.year === year && 
      record.month === month
    );
  }

  // 세무 신고 상태 업데이트 (Mock)
  async updateTaxStatus(id: string, status: string, filedDate?: string): Promise<TaxRecord> {
    const record = await this.updateTaxRecord(id, { 
      // status: status (Mock에서는 status 필드가 없으므로 생략)
    });
    return record;
  }

  // 실시간 구독 설정 (Mock)
  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    // Mock: 실제 구독 없이 빈 객체 반환
    return {
      unsubscribe: () => {}
    };
  }
}

// 싱글톤 인스턴스
export const taxService = new TaxService()