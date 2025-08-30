# 📊 WEAVE ERP - Supabase 데이터베이스 설정 가이드

## 🚀 빠른 시작

### 1. Supabase 프로젝트 접속
1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. WEAVE 프로젝트 선택
3. SQL Editor 페이지로 이동

### 2. 마이그레이션 실행 순서

⚠️ **중요**: 반드시 순서대로 실행해야 합니다!

```sql
-- 1단계: 기본 스키마 생성
-- 001_initial_schema.sql

-- 2단계: RLS 정책
-- 002_rls_policies.sql

-- 3단계: 벡터 임베딩 (RAG 시스템용)
-- 002_vector_embeddings.sql

-- 4단계: 채팅 히스토리
-- 003_chat_history_fixed.sql

-- 5단계: 누락 테이블 및 테스트 데이터
-- 004_create_missing_tables_and_seed.sql

-- 6단계: 안전한 RLS 정책 (기존 정책 삭제 후 재생성)
-- 005_rls_policies_safe.sql
```

## 📝 새 마이그레이션 실행 방법

### 옵션 1: Supabase Dashboard에서 직접 실행

1. SQL Editor 열기
2. `004_create_missing_tables_and_seed.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기
4. "Run" 버튼 클릭
5. 동일한 방법으로 `005_rls_policies_safe.sql` 실행

### 옵션 2: Supabase CLI 사용

```bash
# Supabase CLI 설치 (처음 한 번만)
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

## 🧪 테스트 계정 정보

```yaml
Email: test@example.com
Password: test123456
User ID: cbccf201-63f3-4859-8839-4dee8ea20ebf
Company: 테크스타트업 주식회사
```

## 📊 삽입된 테스트 데이터

### 데이터 현황
- **클라이언트**: 10개 회사 (삼성전자, LG전자, 네이버, 카카오 등)
- **프로젝트**: 15개 (진행중 8개, 완료 3개, 계획 2개)
- **인보이스**: 20개 (총 금액: 약 6억원)
- **문서**: 10개 (계약서, 제안서, 기술문서 등)
- **채팅 세션**: 3개 (일반, 세무, RAG)
- **리마인더**: 5개 (프로젝트 마감, 세금 신고 등)
- **알림**: 5개 (최근 활동 알림)

### 주요 프로젝트 예시

1. **삼성전자 스마트팩토리** (1.5억원)
   - 상태: 진행중 (35%)
   - 기간: 2025.08 ~ 2025.12

2. **LG전자 IoT 플랫폼** (1.2억원)
   - 상태: 진행중 (50%)
   - 기간: 2025.07 ~ 2025.11

3. **네이버 AI 챗봇** (8천만원)
   - 상태: 완료
   - 기간: 2025.03 ~ 2025.07

## 🔒 보안 설정

### RLS (Row Level Security) 정책

모든 테이블에 RLS가 적용되어 있습니다:
- 사용자는 자신의 데이터만 접근 가능
- auth.uid()를 기반으로 데이터 격리
- 서비스 역할은 전체 접근 가능 (옵션)

### 정책 확인 방법

```sql
-- RLS 활성화 상태 확인
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 특정 테이블의 정책 확인
SELECT * FROM pg_policies 
WHERE tablename = 'clients';
```

## 🛠️ 문제 해결

### 권한 오류 발생 시

```sql
-- RLS 임시 비활성화 (개발용)
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;

-- 다시 활성화
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

### 데이터 초기화

```sql
-- 테스트 데이터 삭제 (주의!)
DELETE FROM chat_messages;
DELETE FROM chat_sessions;
DELETE FROM reminders;
DELETE FROM reminder_rules;
DELETE FROM notifications;
DELETE FROM tax_records;
DELETE FROM documents;
DELETE FROM invoices;
DELETE FROM projects;
DELETE FROM clients;
-- profiles는 auth.users와 연결되어 있으므로 삭제 주의

-- 테스트 데이터 재삽입
-- 004_create_missing_tables_and_seed.sql 다시 실행
```

## 📋 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] 기본 스키마 생성 (001_initial_schema.sql)
- [ ] RLS 정책 적용 (002_rls_policies.sql)
- [ ] 벡터 임베딩 설정 (002_vector_embeddings.sql)
- [ ] 채팅 기능 테이블 (003_chat_history_fixed.sql)
- [ ] 누락 테이블 및 테스트 데이터 (004_create_missing_tables_and_seed.sql)
- [ ] 안전한 RLS 정책 (005_rls_policies_safe.sql)
- [ ] 테스트 계정으로 로그인 확인
- [ ] 데이터 조회 테스트

## 🔍 데이터 확인 쿼리

```sql
-- 각 테이블의 데이터 수 확인
SELECT 
    'clients' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'reminders', COUNT(*) FROM reminders;

-- 프로젝트 현황 요약
SELECT 
    status, 
    COUNT(*) as count,
    SUM(budget_estimated) as total_budget
FROM projects
GROUP BY status;

-- 인보이스 현황
SELECT 
    status,
    COUNT(*) as count,
    SUM(total) as total_amount
FROM invoices
GROUP BY status;
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. Supabase 대시보드의 Logs 섹션
2. SQL Editor에서 에러 메시지
3. RLS 정책 설정 확인
4. 테이블 권한 설정