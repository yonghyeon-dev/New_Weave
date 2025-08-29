/**
 * 데이터 처리 파이프라인
 * 다양한 형식의 데이터를 처리하고 벡터 DB에 저장
 */

// PDF, DOCX, CSV 로더는 추가 패키지 설치 필요
// 임시로 주석 처리
// import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
// import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
// import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import VectorStore from './vectorStore';

/**
 * 지원 파일 타입
 */
export enum FileType {
  PDF = 'pdf',
  DOCX = 'docx',
  TXT = 'txt',
  CSV = 'csv',
  JSON = 'json',
  MARKDOWN = 'md'
}

/**
 * 처리된 문서 인터페이스
 */
export interface ProcessedDocument {
  id: string;
  fileName: string;
  fileType: FileType;
  content: string;
  metadata: {
    pageCount?: number;
    wordCount: number;
    extractedAt: Date;
    processingTime: number;
  };
  chunks: string[];
}

/**
 * 데이터 소스 인터페이스
 */
export interface DataSource {
  type: 'file' | 'url' | 'database' | 'api';
  location: string;
  credentials?: any;
  syncInterval?: number; // 분 단위
}

/**
 * 데이터 프로세서 클래스
 */
export class DataProcessor {
  private vectorStore: VectorStore;
  private dataSources: Map<string, DataSource>;

  constructor() {
    this.vectorStore = new VectorStore();
    this.dataSources = new Map();
  }

  /**
   * 파일 타입 감지
   */
  private detectFileType(fileName: string): FileType {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return FileType.PDF;
      case 'docx': return FileType.DOCX;
      case 'txt': return FileType.TXT;
      case 'csv': return FileType.CSV;
      case 'json': return FileType.JSON;
      case 'md': return FileType.MARKDOWN;
      default: return FileType.TXT;
    }
  }

  /**
   * PDF 파일 처리
   */
  private async processPDF(file: File): Promise<string> {
    // PDF 처리는 추가 패키지 설치 필요
    // 임시로 텍스트로 처리
    console.warn('PDF 처리는 현재 지원되지 않습니다. 텍스트로 변환합니다.');
    return await file.text();
  }

  /**
   * DOCX 파일 처리
   */
  private async processDOCX(file: File): Promise<string> {
    // DOCX 처리는 추가 패키지 설치 필요
    // 임시로 텍스트로 처리
    console.warn('DOCX 처리는 현재 지원되지 않습니다. 텍스트로 변환합니다.');
    return await file.text();
  }

  /**
   * 텍스트 파일 처리
   */
  private async processText(file: File): Promise<string> {
    return await file.text();
  }

  /**
   * CSV 파일 처리
   */
  private async processCSV(file: File): Promise<string> {
    // CSV 처리는 추가 패키지 설치 필요
    // 임시로 텍스트로 처리
    console.warn('CSV 처리는 현재 지원되지 않습니다. 텍스트로 변환합니다.');
    return await file.text();
  }

  /**
   * JSON 파일 처리
   */
  private async processJSON(file: File): Promise<string> {
    const text = await file.text();
    const json = JSON.parse(text);
    return this.jsonToText(json);
  }

  /**
   * JSON을 텍스트로 변환
   */
  private jsonToText(obj: any, prefix: string = ''): string {
    let result = '';
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          result += `${fullKey}: ${value.join(', ')}\n`;
        } else {
          result += this.jsonToText(value, fullKey);
        }
      } else {
        result += `${fullKey}: ${value}\n`;
      }
    }
    
    return result;
  }

  /**
   * 파일 처리 메인 함수
   */
  async processFile(
    file: File,
    userId: string,
    projectId?: string,
    category?: string
  ): Promise<ProcessedDocument> {
    const startTime = Date.now();
    const fileType = this.detectFileType(file.name);
    let content = '';

    // 파일 타입별 처리
    switch (fileType) {
      case FileType.PDF:
        content = await this.processPDF(file);
        break;
      case FileType.DOCX:
        content = await this.processDOCX(file);
        break;
      case FileType.CSV:
        content = await this.processCSV(file);
        break;
      case FileType.JSON:
        content = await this.processJSON(file);
        break;
      case FileType.TXT:
      case FileType.MARKDOWN:
      default:
        content = await this.processText(file);
    }

    // 청크 생성
    const chunks = this.vectorStore.splitDocument(content);

    // 벡터 DB에 저장
    const chunkIds = await this.vectorStore.indexDocument(content, {
      source: file.name,
      category: category || 'general',
      userId,
      projectId,
      timestamp: new Date()
    });

    // 결과 반환
    return {
      id: crypto.randomUUID(),
      fileName: file.name,
      fileType,
      content,
      metadata: {
        wordCount: content.split(/\s+/).length,
        extractedAt: new Date(),
        processingTime: Date.now() - startTime
      },
      chunks
    };
  }

  /**
   * URL에서 데이터 가져오기
   */
  async processURL(
    url: string,
    userId: string,
    projectId?: string
  ): Promise<ProcessedDocument> {
    const startTime = Date.now();

    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      let content = '';

      if (contentType?.includes('application/json')) {
        const json = await response.json();
        content = this.jsonToText(json);
      } else {
        content = await response.text();
      }

      // HTML 태그 제거 (간단한 처리)
      if (contentType?.includes('text/html')) {
        content = content.replace(/<[^>]*>/g, '');
      }

      // 청크 생성 및 저장
      const chunks = this.vectorStore.splitDocument(content);
      await this.vectorStore.indexDocument(content, {
        source: url,
        category: 'web',
        userId,
        projectId,
        timestamp: new Date()
      });

      return {
        id: crypto.randomUUID(),
        fileName: new URL(url).hostname,
        fileType: FileType.TXT,
        content,
        metadata: {
          wordCount: content.split(/\s+/).length,
          extractedAt: new Date(),
          processingTime: Date.now() - startTime
        },
        chunks
      };

    } catch (error) {
      console.error('URL 처리 실패:', error);
      throw error;
    }
  }

  /**
   * 데이터베이스 연결 및 동기화
   */
  async syncDatabase(
    connectionString: string,
    query: string,
    userId: string,
    projectId?: string
  ): Promise<ProcessedDocument[]> {
    // 데이터베이스 연결 로직 (예시)
    // 실제 구현 시 적절한 DB 드라이버 사용
    const results: ProcessedDocument[] = [];
    
    // TODO: 실제 DB 연결 및 쿼리 실행
    
    return results;
  }

  /**
   * 데이터 소스 등록
   */
  registerDataSource(
    id: string,
    source: DataSource
  ): void {
    this.dataSources.set(id, source);
    
    // 주기적 동기화 설정
    if (source.syncInterval) {
      setInterval(() => {
        this.syncDataSource(id);
      }, source.syncInterval * 60 * 1000);
    }
  }

  /**
   * 데이터 소스 동기화
   */
  private async syncDataSource(sourceId: string): Promise<void> {
    const source = this.dataSources.get(sourceId);
    if (!source) return;

    console.log(`동기화 시작: ${sourceId}`);
    
    switch (source.type) {
      case 'url':
        // URL 재크롤링
        break;
      case 'database':
        // DB 재쿼리
        break;
      case 'api':
        // API 재호출
        break;
    }
  }

  /**
   * 대량 파일 처리
   */
  async processBatch(
    files: File[],
    userId: string,
    projectId?: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<ProcessedDocument[]> {
    const results: ProcessedDocument[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const processed = await this.processFile(
          files[i],
          userId,
          projectId
        );
        results.push(processed);
        
        if (onProgress) {
          onProgress(i + 1, files.length);
        }
      } catch (error) {
        console.error(`파일 처리 실패: ${files[i].name}`, error);
      }
    }
    
    return results;
  }

  /**
   * 텍스트 전처리
   */
  preprocessText(text: string): string {
    // 불필요한 공백 제거
    text = text.replace(/\s+/g, ' ').trim();
    
    // 특수문자 정규화
    text = text.replace(/[""]/g, '"');
    text = text.replace(/['']/g, "'");
    
    // 이메일, URL 마스킹 (개인정보 보호)
    text = text.replace(/\S+@\S+\.\S+/g, '[EMAIL]');
    text = text.replace(/https?:\/\/\S+/g, '[URL]');
    
    return text;
  }
}

export default DataProcessor;