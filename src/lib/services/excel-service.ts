/**
 * Universal Excel Service - SSR/Client 호환 API
 * 
 * 설계 패턴:
 * 1. Server-Side: API 에러 반환 또는 대안 제공
 * 2. Client-Side: 실제 Excel 기능 실행
 * 3. TypeScript: 완전한 타입 안전성
 */

import type { Transaction } from './supabase/tax-transactions.service';

export interface ExcelExportOptions {
  filename?: string;
  format?: 'xlsx' | 'csv';
  includeHeaders?: boolean;
  dateFormat?: string;
}

export interface ExcelExportResult {
  success: boolean;
  filename?: string;
  error?: string;
  downloadUrl?: string;
}

export interface MonthlyReportOptions {
  year: number;
  month: number;
  includeCharts?: boolean;
}

export interface VATReportOptions {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  includeDetails?: boolean;
}

/**
 * Universal Excel Service
 * - Server-Side: Graceful degradation
 * - Client-Side: Full functionality
 */
export class ExcelService {
  private static instance: ExcelService;
  private isClient: boolean;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  static getInstance(): ExcelService {
    if (!this.instance) {
      this.instance = new ExcelService();
    }
    return this.instance;
  }

  /**
   * 환경별 가용성 체크
   */
  isAvailable(): boolean {
    return this.isClient;
  }

  /**
   * 거래 데이터 Excel 내보내기
   */
  async exportTransactions(
    transactions: Transaction[],
    options: ExcelExportOptions = {}
  ): Promise<ExcelExportResult> {
    if (!this.isClient) {
      return {
        success: false,
        error: 'Excel export is only available in browser environment. Please try from the client side.'
      };
    }

    try {
      // 동적 import로 브라우저 전용 모듈 로드
      const { browserExcel } = await import('@/lib/browser-modules/excel-module');
      
      return await browserExcel.execute(async (excel) => {
        const data = this.prepareTransactionData(transactions);
        
        const ws = excel.utils.json_to_sheet(data);
        const wb = excel.utils.book_new();
        excel.utils.book_append_sheet(wb, ws, '거래내역');

        // 컬럼 너비 설정
        ws['!cols'] = this.getTransactionColumnWidths();

        const filename = options.filename || this.generateFilename('거래내역');
        excel.writeFile(wb, filename);

        return {
          success: true,
          filename
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Excel export failed: ${error}`
      };
    }
  }

  /**
   * 월별 요약 보고서 생성
   */
  async exportMonthlySummary(
    transactions: Transaction[],
    options: MonthlyReportOptions
  ): Promise<ExcelExportResult> {
    if (!this.isClient) {
      return {
        success: false,
        error: 'Monthly report generation is only available in browser environment.'
      };
    }

    try {
      const { browserExcel } = await import('@/lib/browser-modules/excel-module');
      
      return await browserExcel.execute(async (excel) => {
        const monthlyData = this.filterMonthlyTransactions(transactions, options.year, options.month);
        const summary = this.calculateMonthlySummary(monthlyData);

        const wb = excel.utils.book_new();

        // 요약 시트
        const summarySheet = excel.utils.aoa_to_sheet(this.prepareSummaryData(summary, options));
        excel.utils.book_append_sheet(wb, summarySheet, '요약');

        // 상세 거래 시트
        const detailSheet = excel.utils.json_to_sheet(this.prepareTransactionData(monthlyData));
        excel.utils.book_append_sheet(wb, detailSheet, '상세내역');

        const filename = `세무보고서_${options.year}년${options.month}월_${this.getCurrentDateString()}.xlsx`;
        excel.writeFile(wb, filename);

        return {
          success: true,
          filename
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Monthly report generation failed: ${error}`
      };
    }
  }

  /**
   * 부가세 신고서 생성
   */
  async exportVATReport(
    transactions: Transaction[],
    options: VATReportOptions
  ): Promise<ExcelExportResult> {
    if (!this.isClient) {
      return {
        success: false,
        error: 'VAT report generation is only available in browser environment.'
      };
    }

    try {
      const { browserExcel } = await import('@/lib/browser-modules/excel-module');
      
      return await browserExcel.execute(async (excel) => {
        const quarterData = this.filterQuarterlyTransactions(transactions, options.year, options.quarter);
        const vatData = this.calculateVATData(quarterData);

        const wb = excel.utils.book_new();

        // 요약 시트
        const summarySheet = excel.utils.aoa_to_sheet(this.prepareVATSummaryData(vatData, options));
        excel.utils.book_append_sheet(wb, summarySheet, '요약');

        // 매출/매입 시트 (옵션에 따라)
        if (options.includeDetails) {
          const salesSheet = excel.utils.json_to_sheet(this.prepareSalesData(quarterData));
          excel.utils.book_append_sheet(wb, salesSheet, '매출');

          const purchaseSheet = excel.utils.json_to_sheet(this.preparePurchaseData(quarterData));
          excel.utils.book_append_sheet(wb, purchaseSheet, '매입');
        }

        const filename = `부가세신고_${options.year}년${options.quarter}분기_${this.getCurrentDateString()}.xlsx`;
        excel.writeFile(wb, filename);

        return {
          success: true,
          filename
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `VAT report generation failed: ${error}`
      };
    }
  }

  /**
   * CSV 내보내기 (브라우저 네이티브 기능 사용)
   */
  async exportToCSV(
    transactions: Transaction[],
    options: ExcelExportOptions = {}
  ): Promise<ExcelExportResult> {
    if (!this.isClient) {
      return {
        success: false,
        error: 'CSV export is only available in browser environment.'
      };
    }

    try {
      const data = this.prepareTransactionData(transactions);
      const csv = this.convertToCSV(data);
      
      // BOM 추가로 한글 깨짐 방지
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
      
      const filename = options.filename || this.generateFilename('거래내역', 'csv');
      this.downloadBlob(blob, filename);

      return {
        success: true,
        filename
      };
    } catch (error) {
      return {
        success: false,
        error: `CSV export failed: ${error}`
      };
    }
  }

  // Private helper methods
  private prepareTransactionData(transactions: Transaction[]) {
    return transactions.map(t => ({
      '거래일': this.formatDate(t.transaction_date),
      '구분': t.transaction_type === '매출' ? '매출' : '매입',
      '거래처명': t.supplier_name,
      '사업자번호': t.business_number || '',
      '공급가액': Number(t.supply_amount),
      '부가세': Number(t.vat_amount),
      '합계': Number(t.total_amount),
      '결제상태': this.getPaymentStatusLabel(t.status),
      '프로젝트': t.project_id || '',
      '메모': t.description || ''
    }));
  }

  private getTransactionColumnWidths() {
    return [
      { wch: 12 }, { wch: 8 }, { wch: 20 }, { wch: 15 },
      { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 10 },
      { wch: 15 }, { wch: 30 }
    ];
  }

  private filterMonthlyTransactions(transactions: Transaction[], year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    return transactions.filter(t => {
      const date = new Date(t.transaction_date);
      return date >= startDate && date <= endDate;
    });
  }

  private filterQuarterlyTransactions(transactions: Transaction[], year: number, quarter: number) {
    const startMonth = (quarter - 1) * 3;
    const endMonth = quarter * 3 - 1;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, endMonth + 1, 0);

    return transactions.filter(t => {
      const date = new Date(t.transaction_date);
      return date >= startDate && date <= endDate;
    });
  }

  private calculateMonthlySummary(transactions: Transaction[]) {
    return {
      totalSales: transactions.filter(t => t.transaction_type === '매출').reduce((sum, t) => sum + Number(t.total_amount), 0),
      totalPurchases: transactions.filter(t => t.transaction_type === '매입').reduce((sum, t) => sum + Number(t.total_amount), 0),
      totalVat: transactions.reduce((sum, t) => sum + Number(t.vat_amount), 0),
      transactionCount: transactions.length
    };
  }

  private calculateVATData(transactions: Transaction[]) {
    const sales = transactions.filter(t => t.transaction_type === '매출');
    const purchases = transactions.filter(t => t.transaction_type === '매입');

    return {
      sales: {
        count: sales.length,
        supplyAmount: sales.reduce((sum, t) => sum + Number(t.supply_amount), 0),
        vatAmount: sales.reduce((sum, t) => sum + Number(t.vat_amount), 0),
        totalAmount: sales.reduce((sum, t) => sum + Number(t.total_amount), 0)
      },
      purchases: {
        count: purchases.length,
        supplyAmount: purchases.reduce((sum, t) => sum + Number(t.supply_amount), 0),
        vatAmount: purchases.reduce((sum, t) => sum + Number(t.vat_amount), 0),
        totalAmount: purchases.reduce((sum, t) => sum + Number(t.total_amount), 0)
      }
    };
  }

  private prepareSummaryData(summary: any, options: MonthlyReportOptions) {
    return [
      ['월별 세무 요약 보고서'],
      [''],
      ['기간', `${options.year}년 ${options.month}월`],
      [''],
      ['구분', '금액'],
      ['총 매출', summary.totalSales],
      ['총 매입', summary.totalPurchases],
      ['순이익', summary.totalSales - summary.totalPurchases],
      ['총 부가세', summary.totalVat],
      ['거래 건수', summary.transactionCount]
    ];
  }

  private prepareVATSummaryData(vatData: any, options: VATReportOptions) {
    return [
      ['부가가치세 신고 자료'],
      [''],
      ['신고 기간', `${options.year}년 ${options.quarter}분기`],
      [''],
      ['구분', '건수', '공급가액', '부가세', '합계'],
      ['매출', vatData.sales.count, vatData.sales.supplyAmount, vatData.sales.vatAmount, vatData.sales.totalAmount],
      ['매입', vatData.purchases.count, vatData.purchases.supplyAmount, vatData.purchases.vatAmount, vatData.purchases.totalAmount],
      [''],
      ['납부세액', '', '', vatData.sales.vatAmount - vatData.purchases.vatAmount, '']
    ];
  }

  private prepareSalesData(transactions: Transaction[]) {
    return transactions.filter(t => t.transaction_type === '매출').map(t => ({
      '거래일': this.formatDate(t.transaction_date),
      '거래처': t.supplier_name,
      '사업자번호': t.business_number || '',
      '공급가액': Number(t.supply_amount),
      '부가세': Number(t.vat_amount),
      '합계': Number(t.total_amount)
    }));
  }

  private preparePurchaseData(transactions: Transaction[]) {
    return transactions.filter(t => t.transaction_type === '매입').map(t => ({
      '거래일': this.formatDate(t.transaction_date),
      '거래처': t.supplier_name,
      '사업자번호': t.business_number || '',
      '공급가액': Number(t.supply_amount),
      '부가세': Number(t.vat_amount),
      '합계': Number(t.total_amount)
    }));
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
      headers.map(header => {
        const value = row[header]?.toString() || '';
        return value.includes(',') || value.includes('\n') ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }

  private downloadBlob(blob: Blob, filename: string) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  private generateFilename(prefix: string, extension: string = 'xlsx'): string {
    return `${prefix}_${this.getCurrentDateString()}.${extension}`;
  }

  private getCurrentDateString(): string {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }

  private formatDate(dateStr: string): string {
    return new Date(dateStr).toISOString().slice(0, 10);
  }

  private getPaymentStatusLabel(status?: string): string {
    switch (status) {
      case 'paid': return '완료';
      case 'pending': return '대기';
      case 'overdue': return '연체';
      default: return '대기';
    }
  }
}

// 싱글톤 인스턴스 export
export const excelService = ExcelService.getInstance();