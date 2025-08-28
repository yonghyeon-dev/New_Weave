# AI 챗봇 구현 가이드

## 목차
1. [일반 AI 챗봇 구현](#1-일반-ai-챗봇-구현)
2. [세무 전문 챗봇 구현](#2-세무-전문-챗봇-구현)
3. [구현 로드맵](#3-구현-로드맵)

---

## 1. 일반 AI 챗봇 구현

### 1.1 필요한 기술 스택

#### **AI 모델 (LLM)**
- **Google Gemini** (현재 프로젝트 사용 중)
  - `gemini-2.5-flash-lite` - 빠른 응답, 비용 효율적
  - `gemini-2.5-pro` - 고급 추론, 복잡한 작업
- **대안 옵션**
  - OpenAI GPT-4/GPT-3.5
  - Claude API (Anthropic)
  - Llama 2 (오픈소스)

#### **실시간 통신**
```typescript
// WebSocket - 양방향 실시간 통신
npm install socket.io socket.io-client

// Server-Sent Events (SSE) - 서버→클라이언트 스트리밍
// Long Polling - 간단한 구현
```

#### **백엔드 인프라**
```typescript
// 필수 패키지
- next.js API Routes      // API 엔드포인트 (현재 사용)
- @google/generative-ai    // Gemini API (현재 사용)
- socket.io-server        // 실시간 통신
- redis/upstash           // 세션 관리
- prisma                  // ORM, 대화 기록 저장
```

#### **프론트엔드 컴포넌트**
- 채팅 인터페이스
- 메시지 버블 (사용자/AI 구분)
- 입력창 & 전송 버튼
- 타이핑 인디케이터
- 파일 업로드 (이미지, PDF 등)
- 메시지 히스토리 스크롤

### 1.2 핵심 기능

#### **필수 기능**
1. **메시지 스트리밍**: 실시간 응답 표시
2. **컨텍스트 유지**: 대화 기록 관리
3. **타이핑 표시**: AI 응답 생성 중 표시
4. **에러 핸들링**: 네트워크 오류, API 한계 처리
5. **레이트 리미팅**: API 사용량 제한

#### **고급 기능 (선택)**
- **RAG (Retrieval Augmented Generation)**
  ```typescript
  npm install langchain              // RAG 프레임워크
  npm install @pinecone-database/pinecone  // 벡터 DB
  ```
- **Function Calling**: 외부 도구 실행
- **Multi-turn 대화**: 문맥 유지
- **다국어 지원**: 자동 번역

### 1.3 데이터 저장 구조

#### **대화 기록 관리**
```typescript
interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  context: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    tokens?: number;
    model?: string;
    attachments?: string[];
  };
}
```

#### **저장소 옵션**
- **대화 기록**: PostgreSQL/MySQL (Supabase)
- **세션 관리**: Redis/Upstash
- **벡터 DB**: Pinecone/Weaviate (RAG 구현 시)
- **파일 저장**: Supabase Storage/S3

### 1.4 현재 프로젝트 기반 구현 방안

#### **이미 구축된 것들**
- ✅ Gemini API 연동
- ✅ 파일 처리 (DataExtractor)
- ✅ UI 컴포넌트 (Card, Button, Typography)
- ✅ Next.js API Routes
- ✅ Supabase 연동

#### **추가 필요한 최소 요구사항**
```bash
# 필수 패키지 설치
npm install socket.io socket.io-client

# 선택 패키지 (스트리밍)
npm install eventsource-parser
```

---

## 2. 세무 전문 챗봇 구현

### 2.1 추가 기술 스택

#### **데이터베이스 설계**

##### **PostgreSQL 스키마 (Supabase)**
```sql
-- 사용자 정보
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  business_number VARCHAR(20), -- 암호화 저장
  user_type VARCHAR(20), -- individual, business, tax_accountant
  created_at TIMESTAMP DEFAULT NOW()
);

-- 세무 상담 기록
CREATE TABLE tax_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  consultation_type VARCHAR(50), -- 종합소득세, 부가세, 법인세 등
  messages JSONB[], -- 암호화된 대화 내용
  tax_year INTEGER,
  status VARCHAR(20), -- ongoing, completed, pending
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 세금 계산 기록
CREATE TABLE tax_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES tax_consultations(id),
  calculation_type VARCHAR(50),
  input_data JSONB, -- 암호화된 입력 데이터
  result JSONB, -- 암호화된 계산 결과
  formula_used TEXT,
  verified_by UUID, -- 검증한 세무사 ID
  created_at TIMESTAMP DEFAULT NOW()
);

-- 증빙 서류
CREATE TABLE tax_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  document_type VARCHAR(50), -- 영수증, 세금계산서, 신고서 등
  file_path TEXT, -- Supabase Storage 경로
  extracted_data JSONB, -- OCR 추출 데이터
  tax_year INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 감사 로그 (컴플라이언스)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **보안 & 암호화**

##### **필수 보안 패키지**
```bash
npm install bcryptjs              # 비밀번호 해싱
npm install crypto-js              # AES 암호화
npm install jsonwebtoken           # JWT 토큰
npm install helmet                 # 보안 헤더
npm install express-rate-limit     # API 제한
npm install speakeasy              # 2FA/OTP
```

##### **민감 정보 암호화 구현**
```typescript
import CryptoJS from 'crypto-js';

class EncryptionService {
  private secretKey: string;
  
  constructor() {
    this.secretKey = process.env.ENCRYPTION_KEY!;
  }
  
  // 주민번호, 사업자번호 등 암호화
  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }
  
  decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
```

### 2.2 세무 특화 기능

#### **RAG (세무 지식 기반)**
```typescript
// 세무 지식 임베딩 및 검색
npm install langchain
npm install @pinecone-database/pinecone
npm install pdf-parse  // 세법 PDF 파싱

// 지식 저장소 구조
interface TaxKnowledge {
  id: string;
  category: string;      // 세법, 판례, 해석, FAQ
  title: string;
  content: string;
  embedding: number[];   // 벡터 임베딩
  metadata: {
    law_code?: string;   // 법조문 번호
    effective_date?: Date;
    source?: string;
  };
}
```

#### **세금 계산 엔진**
```typescript
npm install decimal.js      # 정확한 소수점 계산
npm install moment-timezone  # 시간대별 세금 기준
npm install xlsx            # 엑셀 import/export

// 계산 예시
class TaxCalculator {
  // 부가세 계산
  calculateVAT(amount: Decimal): {
    supplyValue: Decimal;
    vat: Decimal;
    total: Decimal;
  } {
    const supplyValue = amount.div(1.1).round(0);
    const vat = amount.sub(supplyValue);
    return { supplyValue, vat, total: amount };
  }
  
  // 종합소득세 계산
  calculateIncomeTax(income: Decimal, deductions: Decimal): Decimal {
    // 과세표준 = 수입 - 공제
    // 세율 적용 (누진세)
    // ...
  }
}
```

#### **OCR & 문서 처리**
```typescript
// 이미 구현된 것
- Gemini Vision API (멀티모달)

// 추가 고려사항
- tesseract.js     // 한글 OCR 백업
- pdf-lib          // PDF 생성
- sharp            // 이미지 전처리
```

### 2.3 컴플라이언스 & 규정 준수

#### **필수 준수사항**
1. **개인정보보호법**
   - 주민번호 암호화 저장
   - 개인정보 처리 동의서
   - 데이터 보존 기간 (5년)
   - 파기 절차

2. **전자금융거래법**
   - 거래 기록 보존
   - 접근 권한 관리
   - 보안 감사

3. **세무 관련 규정**
   - 세무대리 금지 (세무사만 가능)
   - 단순 정보 제공만 허용
   - 면책 조항 명시

#### **감사 로그 시스템**
```typescript
interface AuditLog {
  userId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

enum AuditAction {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CALCULATE = 'CALCULATE',
  EXPORT = 'EXPORT'
}

enum ResourceType {
  CONSULTATION = 'CONSULTATION',
  CALCULATION = 'CALCULATION',
  DOCUMENT = 'DOCUMENT',
  USER_DATA = 'USER_DATA'
}
```

#### **권한 관리 시스템**
```typescript
enum UserRole {
  CLIENT = 'client',              // 일반 납세자
  BUSINESS = 'business',          // 사업자
  TAX_ACCOUNTANT = 'accountant', // 세무사
  ADMIN = 'admin',               // 시스템 관리자
  AUDITOR = 'auditor'            // 감사인
}

// Row Level Security (RLS) 정책
-- Supabase RLS 예시
CREATE POLICY "Users can only see own data" ON tax_consultations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Tax accountants can see client data" ON tax_consultations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_clients
      WHERE accountant_id = auth.uid()
      AND client_id = tax_consultations.user_id
    )
  );
```

### 2.4 외부 API 연동

#### **세무 관련 API**
```typescript
// 사업자등록 조회
interface BusinessVerificationAPI {
  verify(businessNumber: string): Promise<{
    valid: boolean;
    companyName?: string;
    status?: string; // 계속사업자, 휴업, 폐업
  }>;
}

// 홈택스 연동 (스크래핑)
interface HometaxAPI {
  // 주의: 공식 API 아님, 법적 검토 필요
  fetchTaxReturns(year: number): Promise<TaxReturn[]>;
  fetchInvoices(period: DateRange): Promise<Invoice[]>;
}

// 카드사/은행 거래내역
interface TransactionAPI {
  fetchTransactions(
    accountId: string,
    period: DateRange
  ): Promise<Transaction[]>;
}
```

---

## 3. 구현 로드맵

### 3.1 일반 챗봇 구현 단계

#### **Phase 1: MVP (1-2주)**
- [x] 기본 채팅 UI 구현
- [x] Gemini API 연동
- [ ] 메시지 송수신 기능
- [ ] 로컬 스토리지 대화 저장

#### **Phase 2: 실시간 기능 (1주)**
- [ ] SSE/WebSocket 스트리밍
- [ ] 타이핑 인디케이터
- [ ] 메시지 중단 기능

#### **Phase 3: 고급 기능 (2주)**
- [ ] 파일 업로드 (이미지/PDF)
- [ ] 대화 기록 DB 저장
- [ ] 멀티 세션 관리
- [ ] 사용자 인증

### 3.2 세무 챗봇 구현 단계

#### **Phase 1: 기본 구조 (2주)**
- [ ] Supabase 테이블 설계
- [ ] 암호화 시스템 구축
- [ ] 기본 CRUD API
- [ ] 권한 시스템

#### **Phase 2: 세무 기능 (3주)**
- [ ] 세금 계산 엔진
- [ ] OCR 문서 처리
- [ ] 세무 지식 RAG
- [ ] 증빙 서류 관리

#### **Phase 3: 컴플라이언스 (2주)**
- [ ] 감사 로그 시스템
- [ ] 개인정보 보호 기능
- [ ] 보안 강화
- [ ] 법적 검토 및 면책조항

#### **Phase 4: 통합 테스트 (1주)**
- [ ] 보안 테스트
- [ ] 성능 테스트
- [ ] 사용성 테스트
- [ ] 컴플라이언스 검증

### 3.3 예상 비용

#### **개발 비용**
- 일반 챗봇: 2-4주 (1-2명)
- 세무 챗봇: 8-10주 (2-3명)

#### **운영 비용 (월)**
- Gemini API: $50-500 (사용량 기준)
- Supabase: $25-99 (Pro 플랜)
- Vercel: $20 (Pro 플랜)
- 벡터 DB (Pinecone): $70-700

### 3.4 주의사항

#### **법적 고려사항**
1. **세무 상담 제한**
   - 세무사법상 세무대리 금지
   - 정보 제공만 가능
   - 면책 조항 필수

2. **개인정보 보호**
   - GDPR/개인정보보호법 준수
   - 데이터 최소 수집 원칙
   - 암호화 필수

3. **금융 규제**
   - 전자금융거래법 준수
   - 금융 데이터 보안 기준
   - 감사 추적 의무

#### **기술적 고려사항**
1. **확장성**
   - 마이크로서비스 아키텍처 고려
   - 캐싱 전략 수립
   - 로드 밸런싱

2. **안정성**
   - 에러 핸들링 강화
   - 백업 및 복구 전략
   - 모니터링 시스템

3. **성능**
   - 응답 시간 최적화
   - 토큰 사용량 최적화
   - 데이터베이스 인덱싱

---

## 부록

### A. 참고 자료
- [Google Gemini API 문서](https://ai.google.dev/docs)
- [Supabase 문서](https://supabase.com/docs)
- [LangChain 문서](https://python.langchain.com/docs/get_started/introduction)
- [개인정보보호법](https://www.law.go.kr/법령/개인정보보호법)

### B. 도구 및 라이브러리 링크
- [Socket.io](https://socket.io/)
- [Pinecone](https://www.pinecone.io/)
- [Prisma ORM](https://www.prisma.io/)
- [React Query](https://tanstack.com/query)

### C. 보안 체크리스트
- [ ] HTTPS 적용
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] CSRF 토큰
- [ ] Rate Limiting
- [ ] 입력 검증
- [ ] 출력 인코딩
- [ ] 세션 관리
- [ ] 암호화 키 관리
- [ ] 보안 감사

---

*최종 업데이트: 2024년 12월*
*작성: AI Assistant (Claude)*