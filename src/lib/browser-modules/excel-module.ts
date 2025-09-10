'use client';

/**
 * 브라우저 전용 Excel 모듈 - SSR에서 완전히 격리
 * 
 * 설계 원칙:
 * 1. 서버 번들에서 완전 제외
 * 2. 클라이언트에서만 동적 로드
 * 3. 타입 안전성 유지
 */

export interface ExcelModule {
  utils: {
    book_new(): any;
    book_append_sheet(workbook: any, worksheet: any, name: string): void;
    json_to_sheet(data: any[]): any;
    aoa_to_sheet(data: any[][]): any;
    sheet_to_json(sheet: any, options?: any): any[];
  };
  read(data: any, options?: any): any;
  write(workbook: any, options?: any): any;
  writeFile(workbook: any, filename: string, options?: any): void;
}

export class BrowserExcelModule {
  private static instance: BrowserExcelModule;
  private xlsxModule: ExcelModule | null = null;
  private loadPromise: Promise<ExcelModule> | null = null;

  private constructor() {}

  static getInstance(): BrowserExcelModule {
    if (!this.instance) {
      this.instance = new BrowserExcelModule();
    }
    return this.instance;
  }

  /**
   * 브라우저 환경 체크
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  /**
   * Excel 모듈 로드 (CDN 기반)
   */
  async load(): Promise<ExcelModule> {
    if (!this.isAvailable()) {
      throw new Error('[Browser-Only] Excel module is only available in browser environment');
    }

    // 이미 로드된 경우
    if (this.xlsxModule) {
      return this.xlsxModule;
    }

    // 로딩 중인 경우
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // 새로운 로딩 시작
    this.loadPromise = this.loadFromCDN();
    this.xlsxModule = await this.loadPromise;
    return this.xlsxModule;
  }

  /**
   * CDN에서 동적 로드
   */
  private async loadFromCDN(): Promise<ExcelModule> {
    return new Promise((resolve, reject) => {
      // 이미 글로벌에 로드된 경우
      if ((window as any).XLSX) {
        resolve(this.wrapXLSXModule((window as any).XLSX));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.integrity = 'sha512-r22gChDnGvBylk90+2e/ycr3RVrDi8DIOkIGNhJlKfuyQM4tIRAI062MaV8sfjQKYVGjOBaZBOA87z+IhZE9DA==';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        if ((window as any).XLSX) {
          resolve(this.wrapXLSXModule((window as any).XLSX));
        } else {
          reject(new Error('Failed to load XLSX: module not found on window'));
        }
      };

      script.onerror = (error) => {
        reject(new Error(`Failed to load XLSX from CDN: ${error}`));
      };

      // 타임아웃 설정 (10초)
      const timeout = setTimeout(() => {
        reject(new Error('XLSX loading timeout'));
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
        if ((window as any).XLSX) {
          resolve(this.wrapXLSXModule((window as any).XLSX));
        } else {
          reject(new Error('Failed to load XLSX: module not found on window'));
        }
      };

      document.head.appendChild(script);
    });
  }

  /**
   * XLSX 모듈을 타입 안전한 래퍼로 감싸기
   */
  private wrapXLSXModule(xlsx: any): ExcelModule {
    return {
      utils: {
        book_new: () => xlsx.utils.book_new(),
        book_append_sheet: (wb: any, ws: any, name: string) => xlsx.utils.book_append_sheet(wb, ws, name),
        json_to_sheet: (data: any[]) => xlsx.utils.json_to_sheet(data),
        aoa_to_sheet: (data: any[][]) => xlsx.utils.aoa_to_sheet(data),
        sheet_to_json: (sheet: any, options?: any) => xlsx.utils.sheet_to_json(sheet, options),
      },
      read: (data: any, options?: any) => xlsx.read(data, options),
      write: (workbook: any, options?: any) => xlsx.write(workbook, options),
      writeFile: (workbook: any, filename: string, options?: any) => xlsx.writeFile(workbook, filename, options),
    };
  }

  /**
   * Excel 기능 실행 (안전한 래퍼)
   */
  async execute<T>(operation: (excel: ExcelModule) => T): Promise<T> {
    const excel = await this.load();
    return operation(excel);
  }

  /**
   * 서버 사이드에서 안전한 fallback
   */
  getServerFallback(): ExcelModule {
    const notAvailable = () => {
      throw new Error('[SSR] Excel operations are not available on the server side');
    };

    return {
      utils: {
        book_new: notAvailable,
        book_append_sheet: notAvailable,
        json_to_sheet: notAvailable,
        aoa_to_sheet: notAvailable,
        sheet_to_json: notAvailable,
      },
      read: notAvailable,
      write: notAvailable,
      writeFile: notAvailable,
    };
  }
}

// 싱글톤 인스턴스 export
export const browserExcel = BrowserExcelModule.getInstance();