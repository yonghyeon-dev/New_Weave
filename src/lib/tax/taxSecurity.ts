/**
 * 세무 데이터 보안 및 컴플라이언스
 * 개인정보보호법 및 전자금융거래법 준수
 */

import crypto from 'crypto';

/**
 * 암호화 서비스
 */
export class TaxDataEncryption {
  private algorithm = 'aes-256-gcm';
  private secretKey: Buffer;
  private saltLength = 32;

  constructor() {
    const key = process.env.TAX_ENCRYPTION_KEY || 'default-encryption-key-change-in-production';
    this.secretKey = crypto.scryptSync(key, 'salt', 32);
  }

  /**
   * 민감 정보 암호화
   */
  encrypt(text: string): {
    encrypted: string;
    iv: string;
    authTag: string;
  } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = (cipher as any).getAuthTag ? (cipher as any).getAuthTag() : Buffer.from('');

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * 복호화
   */
  decrypt(encryptedData: {
    encrypted: string;
    iv: string;
    authTag: string;
  }): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    if ((decipher as any).setAuthTag) {
      (decipher as any).setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    }
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * 해시 생성 (비가역)
   */
  hash(text: string): string {
    return crypto
      .createHash('sha256')
      .update(text)
      .digest('hex');
  }

  /**
   * 마스킹 처리
   */
  mask(text: string, type: 'ssn' | 'business' | 'phone' | 'email'): string {
    switch (type) {
      case 'ssn': // 주민등록번호
        return text.replace(/(\d{6})-?(\d{7})/, '$1-*******');
      
      case 'business': // 사업자등록번호
        return text.replace(/(\d{3})-?(\d{2})-?(\d{5})/, '$1-**-*****');
      
      case 'phone': // 전화번호
        return text.replace(/(\d{3})-?(\d{4})-?(\d{4})/, '$1-****-$3');
      
      case 'email': // 이메일
        const [local, domain] = text.split('@');
        const maskedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
        return `${maskedLocal}@${domain}`;
      
      default:
        return text;
    }
  }
}

/**
 * 감사 로그
 */
export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId?: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export enum AuditAction {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CALCULATE = 'CALCULATE',
  EXPORT = 'EXPORT',
  SHARE = 'SHARE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT'
}

export enum ResourceType {
  TAX_CALCULATION = 'TAX_CALCULATION',
  TAX_DOCUMENT = 'TAX_DOCUMENT',
  TAX_CONSULTATION = 'TAX_CONSULTATION',
  USER_DATA = 'USER_DATA',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG'
}

/**
 * 감사 로거
 */
export class AuditLogger {
  private logs: AuditLog[] = [];

  /**
   * 감사 로그 기록
   */
  log(params: {
    userId: string;
    action: AuditAction;
    resourceType: ResourceType;
    resourceId?: string;
    metadata?: Record<string, any>;
    request: Request;
  }): AuditLog {
    const log: AuditLog = {
      id: crypto.randomUUID(),
      userId: params.userId,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      metadata: params.metadata || {},
      ipAddress: this.getClientIP(params.request),
      userAgent: params.request.headers.get('user-agent') || 'unknown',
      timestamp: new Date()
    };

    this.logs.push(log);
    
    // 실제 구현에서는 DB에 저장
    this.persistLog(log);
    
    return log;
  }

  /**
   * 클라이언트 IP 추출
   */
  private getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    return request.headers.get('x-real-ip') || 'unknown';
  }

  /**
   * 로그 영구 저장
   */
  private async persistLog(log: AuditLog): Promise<void> {
    // TODO: Supabase 또는 다른 DB에 저장
    console.log('Audit log:', log);
  }

  /**
   * 로그 조회
   */
  getLogsByUser(userId: string, limit: number = 100): AuditLog[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(-limit);
  }

  /**
   * 특정 리소스 로그 조회
   */
  getLogsByResource(
    resourceType: ResourceType,
    resourceId: string
  ): AuditLog[] {
    return this.logs.filter(
      log => log.resourceType === resourceType && log.resourceId === resourceId
    );
  }
}

/**
 * 데이터 보존 정책
 */
export class DataRetentionPolicy {
  private retentionPeriods: Record<string, number> = {
    TAX_CALCULATION: 5 * 365, // 5년
    TAX_DOCUMENT: 5 * 365,
    TAX_CONSULTATION: 3 * 365, // 3년
    AUDIT_LOG: 10 * 365, // 10년
    USER_DATA: 365 // 1년 (탈퇴 후)
  };

  /**
   * 보존 기간 확인
   */
  getRetentionPeriod(dataType: string): number {
    return this.retentionPeriods[dataType] || 365;
  }

  /**
   * 만료 데이터 확인
   */
  isExpired(createdAt: Date, dataType: string): boolean {
    const retentionDays = this.getRetentionPeriod(dataType);
    const expiryDate = new Date(createdAt);
    expiryDate.setDate(expiryDate.getDate() + retentionDays);
    
    return new Date() > expiryDate;
  }

  /**
   * 데이터 파기 마킹
   */
  markForDeletion(dataType: string, dataId: string): {
    dataType: string;
    dataId: string;
    scheduledDeletion: Date;
  } {
    const retentionDays = this.getRetentionPeriod(dataType);
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + retentionDays);

    return {
      dataType,
      dataId,
      scheduledDeletion: deletionDate
    };
  }
}

/**
 * 접근 제어
 */
export class AccessControl {
  private permissions: Map<string, Set<string>> = new Map();

  constructor() {
    this.initializeDefaultPermissions();
  }

  /**
   * 기본 권한 설정
   */
  private initializeDefaultPermissions() {
    // 일반 사용자
    this.permissions.set('user', new Set([
      'view_own_data',
      'create_calculation',
      'view_consultation',
      'export_own_data'
    ]));

    // 세무사
    this.permissions.set('tax_accountant', new Set([
      'view_client_data',
      'create_calculation',
      'view_consultation',
      'create_consultation',
      'export_client_data',
      'verify_calculation'
    ]));

    // 관리자
    this.permissions.set('admin', new Set([
      'view_all_data',
      'manage_users',
      'view_audit_logs',
      'manage_system',
      'export_all_data'
    ]));
  }

  /**
   * 권한 확인
   */
  hasPermission(role: string, permission: string): boolean {
    const rolePermissions = this.permissions.get(role);
    return rolePermissions ? rolePermissions.has(permission) : false;
  }

  /**
   * 다중 권한 확인
   */
  hasAnyPermission(role: string, permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(role, permission));
  }

  /**
   * 권한 추가
   */
  grantPermission(role: string, permission: string): void {
    if (!this.permissions.has(role)) {
      this.permissions.set(role, new Set());
    }
    this.permissions.get(role)!.add(permission);
  }

  /**
   * 권한 제거
   */
  revokePermission(role: string, permission: string): void {
    this.permissions.get(role)?.delete(permission);
  }
}

/**
 * 입력 검증
 */
export class InputValidator {
  /**
   * 사업자등록번호 검증
   */
  static validateBusinessNumber(number: string): boolean {
    const cleaned = number.replace(/-/g, '');
    if (!/^\d{10}$/.test(cleaned)) return false;

    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * weights[i];
    }

    sum += Math.floor((parseInt(cleaned[8]) * 5) / 10);
    const checkDigit = (10 - (sum % 10)) % 10;

    return checkDigit === parseInt(cleaned[9]);
  }

  /**
   * 주민등록번호 검증 (부분)
   */
  static validateSSNFormat(ssn: string): boolean {
    const cleaned = ssn.replace(/-/g, '');
    return /^\d{13}$/.test(cleaned);
  }

  /**
   * 금액 검증
   */
  static validateAmount(amount: number): boolean {
    return !isNaN(amount) && amount >= 0 && amount <= 999999999999;
  }

  /**
   * SQL 인젝션 방지
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/['"`;\\]/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
      .trim();
  }

  /**
   * XSS 방지
   */
  static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

/**
 * 레이트 리미터
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * 요청 허용 여부 확인
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // 만료된 요청 제거
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  /**
   * 남은 요청 수
   */
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

const taxSecurity = {
  TaxDataEncryption,
  AuditLogger,
  DataRetentionPolicy,
  AccessControl,
  InputValidator,
  RateLimiter
};

export default taxSecurity;