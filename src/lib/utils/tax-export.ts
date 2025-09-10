/**
 * Tax Export Utilities - New Architecture
 * 
 * 새로운 설계:
 * 1. Universal API 사용
 * 2. SSR 호환성 보장
 * 3. 타입 안전성 유지
 */

import { excelService } from '@/lib/services/excel-service';
import type { Transaction } from '@/lib/services/supabase/tax-transactions.service';

/**
 * 거래 데이터를 Excel 파일로 내보내기
 */
export async function exportTransactionsToExcel(
  transactions: Transaction[],
  filename?: string
): Promise<void> {
  const result = await excelService.exportTransactions(transactions, { filename });
  
  if (!result.success) {
    throw new Error(result.error || 'Excel export failed');
  }
}

/**
 * 거래 데이터를 CSV 파일로 내보내기
 */
export async function exportTransactionsToCSV(
  transactions: Transaction[],
  filename?: string
): Promise<void> {
  const result = await excelService.exportToCSV(transactions, { filename });
  
  if (!result.success) {
    throw new Error(result.error || 'CSV export failed');
  }
}

/**
 * 월별 요약 보고서 Excel 내보내기
 */
export async function exportMonthlySummaryToExcel(
  transactions: Transaction[],
  year: number,
  month: number
): Promise<void> {
  const result = await excelService.exportMonthlySummary(transactions, { year, month });
  
  if (!result.success) {
    throw new Error(result.error || 'Monthly summary export failed');
  }
}

/**
 * 부가세 신고용 데이터 내보내기
 */
export async function exportVATReport(
  transactions: Transaction[],
  year: number,
  quarter: 1 | 2 | 3 | 4
): Promise<void> {
  const result = await excelService.exportVATReport(transactions, { year, quarter, includeDetails: true });
  
  if (!result.success) {
    throw new Error(result.error || 'VAT report export failed');
  }
}

/**
 * Excel 기능 가용성 체크
 */
export function isExcelAvailable(): boolean {
  return excelService.isAvailable();
}

/**
 * Excel 기능이 사용 불가능할 때의 대안 제시
 */
export function getExcelUnavailableMessage(): string {
  return 'Excel 기능은 브라우저에서만 사용할 수 있습니다. 클라이언트 사이드에서 다시 시도해주세요.';
}