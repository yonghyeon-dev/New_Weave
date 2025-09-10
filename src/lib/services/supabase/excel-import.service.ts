/**
 * Excel Import Service - New Architecture
 * 
 * 새로운 설계:
 * 1. 브라우저 전용 모듈 사용
 * 2. SSR 호환성 보장
 * 3. CDN 기반 동적 로딩
 */

import type { Transaction } from './tax-transactions.service';

export interface ExcelColumn {
  index: number;
  header: string;
  sample: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
}

export interface ColumnMapping {
  excelColumn: string;
  dbField: keyof Transaction;
  transform?: (value: any) => any;
}

export interface ImportPreview {
  columns: ExcelColumn[];
  rows: any[];
  totalRows: number;
  errors: string[];
  warnings: string[];
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: ImportError[];
  transactions?: Transaction[];
}

export interface ImportError {
  row: number;
  field?: string;
  value?: any;
  message: string;
}

/**
 * 엑셀 파일 파싱 (브라우저 전용)
 */
export function parseExcelFile(file: File): Promise<ImportPreview> {
  return new Promise(async (resolve, reject) => {
    // 브라우저 환경 체크
    if (typeof window === 'undefined') {
      reject(new Error('Excel parsing is only available in browser environment'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // 브라우저 전용 Excel 모듈 로드
        const { browserExcel } = await import('@/lib/browser-modules/excel-module');
        
        const data = e.target?.result;
        const workbook = await browserExcel.execute(async (excel) => {
          return excel.read(data, { type: 'binary', cellDates: true });
        });
        
        // 첫 번째 시트 선택
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // JSON으로 변환
        const jsonData = await browserExcel.execute(async (excel) => {
          return excel.utils.sheet_to_json(worksheet, { 
            header: 1,
            raw: false,
            dateNF: 'yyyy-mm-dd'
          });
        });
        
        if (jsonData.length === 0) {
          throw new Error('엑셀 파일에 데이터가 없습니다.');
        }
        
        // 헤더 추출
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        
        // 컬럼 정보 생성
        const columns: ExcelColumn[] = headers.map((header, index) => {
          const sampleValues = rows.slice(0, 5)
            .map(row => row[index])
            .filter(val => val !== null && val !== undefined);
          
          const sample = sampleValues[0]?.toString() || '';
          const dataType = detectDataType(sampleValues);
          
          return {
            index,
            header: header?.toString() || `Column ${index + 1}`,
            sample,
            dataType
          };
        });
        
        // 데이터 검증
        const errors: string[] = [];
        const warnings: string[] = [];
        
        if (rows.length === 0) {
          warnings.push('데이터 행이 없습니다.');
        }
        
        if (rows.length > 10000) {
          warnings.push(`대량 데이터 (${rows.length}행) - 처리 시간이 오래 걸릴 수 있습니다.`);
        }
        
        // 빈 행 체크
        const emptyRows = rows.filter(row => 
          Array.isArray(row) && row.every(cell => cell === null || cell === undefined || cell === '')
        ).length;
        
        if (emptyRows > 0) {
          warnings.push(`${emptyRows}개의 빈 행이 발견되었습니다.`);
        }
        
        resolve({
          columns,
          rows: rows.slice(0, 100), // 미리보기는 100행까지만
          totalRows: rows.length,
          errors,
          warnings
        });
      } catch (error) {
        reject(new Error(`엑셀 파일 파싱 실패: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };
    
    reader.readAsBinaryString(file);
  });
}

/**
 * 템플릿 엑셀 파일 생성 (브라우저 전용)
 */
export async function generateImportTemplate(): Promise<Blob> {
  // 브라우저 환경 체크
  if (typeof window === 'undefined') {
    throw new Error('Excel template generation is only available in browser environment');
  }

  try {
    const { browserExcel } = await import('@/lib/browser-modules/excel-module');
    
    return await browserExcel.execute(async (excel) => {
      const headers = [
        '거래일',
        '거래구분',
        '거래처명',
        '사업자번호',
        '공급가액',
        '부가세',
        '합계',
        '설명',
        '문서번호',
        '결제상태',
        '결제일'
      ];
      
      const sampleData = [
        [
          '2025-01-01',
          '매입',
          '(주)테스트기업',
          '123-45-67890',
          '1000000',
          '100000',
          '1100000',
          '사무용품 구매',
          'INV-2025-001',
          '완료',
          '2025-01-05'
        ],
        [
          '2025-01-02',
          '매출',
          '(주)고객사',
          '987-65-43210',
          '2000000',
          '200000',
          '2200000',
          '서비스 제공',
          'INV-2025-002',
          '대기',
          ''
        ]
      ];
      
      const worksheet = excel.utils.aoa_to_sheet([headers, ...sampleData]);
      const workbook = excel.utils.book_new();
      excel.utils.book_append_sheet(workbook, worksheet, '거래내역');
      
      // 컬럼 너비 설정
      worksheet['!cols'] = headers.map(() => ({ wch: 15 }));
      
      // Blob 생성
      const wbout = excel.write(workbook, { bookType: 'xlsx', type: 'binary' });
      const buf = new ArrayBuffer(wbout.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < wbout.length; i++) {
        view[i] = wbout.charCodeAt(i) & 0xFF;
      }
      
      return new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    });
  } catch (error) {
    throw new Error(`Template generation failed: ${error}`);
  }
}

/**
 * 데이터 타입 감지
 */
function detectDataType(values: any[]): ExcelColumn['dataType'] {
  if (values.length === 0) return 'string';
  
  const types = values.map(val => {
    if (val === null || val === undefined) return 'null';
    if (typeof val === 'boolean') return 'boolean';
    if (val instanceof Date) return 'date';
    if (!isNaN(Number(val))) return 'number';
    
    // 날짜 패턴 체크
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (datePattern.test(val.toString())) return 'date';
    
    return 'string';
  }).filter(t => t !== 'null');
  
  // 가장 많은 타입 반환
  const typeCount = types.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const maxType = Object.entries(typeCount).reduce((a, b) => 
    typeCount[a[0]] > typeCount[b[0]] ? a : b
  );
  
  return maxType[0] as ExcelColumn['dataType'];
}

/**
 * 기본 컬럼 매핑 제안
 */
export function suggestColumnMappings(columns: ExcelColumn[]): ColumnMapping[] {
  const mappings: ColumnMapping[] = [];
  
  // 매핑 규칙
  const mappingRules: Record<string, keyof Transaction> = {
    // 날짜
    '거래일': 'transaction_date',
    '거래일자': 'transaction_date',
    '일자': 'transaction_date',
    'date': 'transaction_date',
    
    // 거래처
    '거래처': 'supplier_name',
    '거래처명': 'supplier_name',
    '업체명': 'supplier_name',
    '공급자': 'supplier_name',
    'supplier': 'supplier_name',
    'vendor': 'supplier_name',
    
    // 사업자번호
    '사업자번호': 'business_number',
    '사업자등록번호': 'business_number',
    'business_number': 'business_number',
    
    // 거래 유형
    '구분': 'transaction_type',
    '거래구분': 'transaction_type',
    '유형': 'transaction_type',
    'type': 'transaction_type',
    
    // 금액
    '공급가액': 'supply_amount',
    '공급가': 'supply_amount',
    'amount': 'supply_amount',
    
    '부가세': 'vat_amount',
    'vat': 'vat_amount',
    'tax': 'vat_amount',
    
    '합계': 'total_amount',
    '총액': 'total_amount',
    '합계액': 'total_amount',
    'total': 'total_amount',
    
    // 설명
    '비고': 'description',
    '설명': 'description',
    '내용': 'description',
    'memo': 'description',
    'description': 'description',
    
    // 상태
    '결제상태': 'status',
    '결제': 'status',
    '상태': 'status',
    'payment': 'status',
    'status': 'status'
  };
  
  columns.forEach(column => {
    const headerLower = column.header.toLowerCase().trim();
    
    // 직접 매칭
    for (const [pattern, field] of Object.entries(mappingRules)) {
      if (headerLower.includes(pattern) || pattern.includes(headerLower)) {
        mappings.push({
          excelColumn: column.header,
          dbField: field,
          transform: getDefaultTransform(field, column.dataType)
        });
        break;
      }
    }
  });
  
  return mappings;
}

/**
 * 기본 변환 함수
 */
function getDefaultTransform(field: keyof Transaction, dataType: ExcelColumn['dataType']) {
  switch (field) {
    case 'transaction_date':
      return (value: any) => {
        if (!value) return null;
        if (value instanceof Date) return value.toISOString().split('T')[0];
        
        const dateStr = value.toString().trim();
        const patterns = [
          /^(\d{4})-(\d{2})-(\d{2})$/,
          /^(\d{4})\/(\d{2})\/(\d{2})$/,
          /^(\d{2})-(\d{2})-(\d{4})$/,
          /^(\d{2})\/(\d{2})\/(\d{4})$/,
        ];
        
        for (const pattern of patterns) {
          const match = dateStr.match(pattern);
          if (match) {
            if (match[1].length === 4) {
              return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
            } else {
              return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
            }
          }
        }
        
        return dateStr;
      };
    
    case 'transaction_type':
      return (value: any) => {
        const val = value?.toString().toLowerCase() || '';
        if (val.includes('매출') || val.includes('sale') || val.includes('수입')) {
          return 'sale';
        }
        if (val.includes('매입') || val.includes('purchase') || val.includes('지출')) {
          return 'purchase';
        }
        return 'purchase';
      };
    
    case 'supply_amount':
    case 'vat_amount':
    case 'total_amount':
      return (value: any) => {
        if (!value) return 0;
        const cleaned = value.toString().replace(/[^0-9.-]/g, '');
        return parseFloat(cleaned) || 0;
      };
    
    case 'status':
      return (value: any) => {
        const val = value?.toString().toLowerCase() || '';
        if (val.includes('완료') || val.includes('paid') || val.includes('완납')) {
          return 'paid';
        }
        if (val.includes('부분') || val.includes('partial')) {
          return 'partial';
        }
        return 'pending';
      };
    
    default:
      return (value: any) => value?.toString() || '';
  }
}

/**
 * 데이터 검증
 */
export function validateImportData(
  rows: any[],
  mappings: ColumnMapping[]
): ImportError[] {
  const errors: ImportError[] = [];
  
  rows.forEach((row, rowIndex) => {
    const requiredFields: (keyof Transaction)[] = [
      'transaction_date',
      'supplier_name',
      'transaction_type',
      'total_amount'
    ];
    
    requiredFields.forEach(field => {
      const mapping = mappings.find(m => m.dbField === field);
      if (!mapping) {
        errors.push({
          row: rowIndex + 2,
          field,
          message: `필수 필드 '${field}' 매핑이 없습니다.`
        });
      } else {
        const columnIndex = getColumnIndex(mapping.excelColumn);
        const value = row[columnIndex];
        
        if (!value || value === '') {
          errors.push({
            row: rowIndex + 2,
            field,
            value,
            message: `필수 필드 '${field}'가 비어있습니다.`
          });
        }
      }
    });
  });
  
  return errors;
}

/**
 * 엑셀 데이터를 거래 데이터로 변환
 */
export function transformToTransactions(
  rows: any[],
  mappings: ColumnMapping[],
  columns: ExcelColumn[]
): Transaction[] {
  const transactions: Transaction[] = [];
  
  rows.forEach((row, rowIndex) => {
    const transaction: Partial<Transaction> = {
      id: '',
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mappings.forEach(mapping => {
      const column = columns.find(c => c.header === mapping.excelColumn);
      if (column) {
        const value = row[column.index];
        if (value !== null && value !== undefined) {
          const transformed = mapping.transform ? mapping.transform(value) : value;
          (transaction as any)[mapping.dbField] = transformed;
        }
      }
    });
    
    // 기본값 설정
    if (!transaction.transaction_type) {
      transaction.transaction_type = '매입';
    }
    
    if (!transaction.status) {
      transaction.status = 'pending';
    }
    
    // VAT 자동 계산
    if (transaction.supply_amount && !transaction.vat_amount) {
      transaction.vat_amount = transaction.supply_amount * 0.1;
    }
    
    if (transaction.supply_amount && transaction.vat_amount && !transaction.total_amount) {
      transaction.total_amount = transaction.supply_amount + transaction.vat_amount;
    }
    
    transactions.push(transaction as Transaction);
  });
  
  return transactions;
}

/**
 * 거래 데이터 임포트 (Mock)
 */
export async function importTransactions(
  transactions: Transaction[]
): Promise<ImportResult> {
  const errors: ImportError[] = [];
  const imported: Transaction[] = [];
  let successCount = 0;
  let failCount = 0;
  
  try {
    const processedTransactions = transactions.map((transaction, index) => ({
      ...transaction,
      id: `mock-tx-${Date.now()}-${index}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    successCount = processedTransactions.length;
    imported.push(...processedTransactions);
    
  } catch (error) {
    failCount = transactions.length;
    errors.push({
      row: 1,
      message: `Mock 임포트 오류: ${error}`
    });
  }
  
  return {
    success: failCount === 0,
    imported: successCount,
    failed: failCount,
    errors,
    transactions: imported
  };
}

function getColumnIndex(header: string): number {
  return 0;
}