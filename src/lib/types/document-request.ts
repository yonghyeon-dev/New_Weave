/**
 * DocumentRequest Types
 * 보안 업로드 시스템 관련 타입 정의
 */

export type DocumentRequestStatus = 
  | 'active'     // 활성 상태
  | 'expired'    // 만료됨
  | 'completed'  // 업로드 완료
  | 'cancelled'; // 취소됨

export type DocumentRequestType = 
  | 'single'   // 단일 파일
  | 'multiple' // 복수 파일
  | 'batch';   // 일괄 업로드

export interface DocumentRequest {
  id: string;
  tenantId: string;
  
  // 연관 엔티티
  clientId?: string;
  projectId?: string;
  invoiceId?: string;
  
  // 기본 정보
  title: string;
  description?: string;
  type: DocumentRequestType;
  status: DocumentRequestStatus;
  
  // 보안 설정
  token: string;              // 고유 토큰
  ttl: number;                // Time To Live (초)
  oneTimeUse: boolean;        // 1회용 링크 여부
  passwordProtected: boolean; // 비밀번호 보호 여부
  password?: string;          // 비밀번호 (해시됨)
  
  // 제한 설정
  maxFiles: number;           // 최대 파일 수
  maxFileSize: number;        // 최대 파일 크기 (bytes)
  allowedTypes: string[];     // 허용된 파일 타입
  
  // 메타데이터
  expiresAt: Date;            // 만료 시간
  createdAt: Date;
  updatedAt: Date;
  
  // 업로드된 파일
  uploadedFiles?: DocumentRequestFile[];
  
  // 감사 로그
  auditLogs?: DocumentRequestAuditLog[];
}

export interface DocumentRequestFile {
  id: string;
  requestId: string;
  
  // 파일 정보
  originalName: string;
  fileName: string;           // 저장된 파일명
  filePath: string;          // 저장 경로
  fileSize: number;          // 파일 크기
  mimeType: string;          // MIME 타입
  
  // 업로드 정보
  uploadedAt: Date;
  uploadedBy?: string;       // 업로더 정보 (선택적)
  
  // 보안 정보
  checksum: string;          // 파일 체크섬
  virusScanned: boolean;     // 바이러스 검사 여부
  scanResult?: 'clean' | 'infected' | 'unknown';
}

export type AuditAction = 
  | 'created'      // 링크 생성
  | 'accessed'     // 링크 접근
  | 'uploaded'     // 파일 업로드
  | 'downloaded'   // 파일 다운로드
  | 'expired'      // 링크 만료
  | 'cancelled';   // 링크 취소

export interface DocumentRequestAuditLog {
  id: string;
  requestId: string;
  
  // 액션 정보
  action: AuditAction;
  description: string;
  
  // 컨텍스트 정보
  ip: string;
  userAgent: string;
  referer?: string;
  
  // 파일 관련 (업로드/다운로드 시)
  fileId?: string;
  fileName?: string;
  
  // 타임스탬프
  timestamp: Date;
  
  // 추가 메타데이터
  metadata?: Record<string, any>;
}

// 생성 요청 타입
export interface CreateDocumentRequestInput {
  title: string;
  description?: string;
  type: DocumentRequestType;
  clientId?: string;
  projectId?: string;
  invoiceId?: string;
  
  // 보안 설정
  ttlHours?: number;          // TTL (시간 단위, 기본 7일 = 168시간)
  oneTimeUse?: boolean;       // 기본 false
  passwordProtected?: boolean; // 기본 false
  password?: string;
  
  // 제한 설정
  maxFiles?: number;          // 기본 5
  maxFileSize?: number;       // 기본 50MB
  allowedTypes?: string[];    // 기본 ['pdf', 'doc', 'docx', 'jpg', 'png']
}

// 업로드 응답 타입
export interface DocumentRequestUploadResponse {
  success: boolean;
  requestId: string;
  uploadedFiles: {
    id: string;
    originalName: string;
    size: number;
    url?: string; // 다운로드 URL (선택적)
  }[];
  remainingSlots: number;
  message?: string;
  error?: string;
}

// 링크 정보 조회 응답
export interface DocumentRequestInfo {
  id: string;
  title: string;
  description?: string;
  type: DocumentRequestType;
  status: DocumentRequestStatus;
  
  // 제한 정보
  maxFiles: number;
  maxFileSize: number;
  allowedTypes: string[];
  
  // 상태 정보
  uploadedCount: number;
  remainingSlots: number;
  expiresAt: Date;
  isExpired: boolean;
  
  // 클라이언트/프로젝트 정보
  clientName?: string;
  projectName?: string;
  
  // 업로드된 파일 목록 (소유자만)
  files?: DocumentRequestFile[];
}

// 보안 검증 관련
export interface SecurityValidation {
  tokenValid: boolean;
  notExpired: boolean;
  notExceededLimit: boolean;
  passwordCorrect?: boolean;
  ipAllowed?: boolean;
  rateLimitOk: boolean;
}