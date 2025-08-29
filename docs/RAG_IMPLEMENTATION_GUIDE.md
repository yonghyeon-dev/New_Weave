# RAG 기반 챗봇 구현 가이드

## 📋 개요

사용자의 데이터를 기반으로 컨텍스트를 이해하고 답변하는 RAG (Retrieval-Augmented Generation) 챗봇 시스템 구현 가이드입니다.

## 🏗️ 시스템 아키텍처

### 핵심 구성 요소

1. **벡터 데이터베이스 (Vector Store)**
   - Supabase pgvector 사용
   - 768차원 임베딩 벡터 저장
   - 코사인 유사도 기반 검색

2. **RAG 파이프라인**
   - 문서 검색 → 컨텍스트 구성 → 응답 생성
   - 하이브리드 검색 (벡터 + 키워드)
   - 스트리밍 응답 지원

3. **데이터 프로세서**
   - 다양한 파일 형식 지원 (PDF, DOCX, TXT, CSV, JSON)
   - 자동 청킹 및 임베딩 생성
   - 메타데이터 관리

## 📦 필수 패키지 설치

```bash
# 기본 패키지
npm install @supabase/supabase-js @google/generative-ai

# 문서 처리 패키지
npm install langchain @langchain/community pdf-parse mammoth csv-parse

# 타입 정의
npm install --save-dev @types/pdf-parse
```

## 🔧 환경 변수 설정

`.env.local` 파일에 추가:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

## 🗄️ 데이터베이스 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속
2. 새 프로젝트 생성
3. SQL Editor에서 마이그레이션 실행

### 2. pgvector 설정

```sql
-- pgvector 확장 활성화
CREATE EXTENSION IF NOT EXISTS vector;

-- 임베딩 테이블 생성 (migrations/002_vector_embeddings.sql 참조)
```

## 💻 구현 단계

### 1단계: 벡터 스토어 초기화

```typescript
import VectorStore from '@/lib/rag/vectorStore';

const vectorStore = new VectorStore();
```

### 2단계: 문서 업로드 및 인덱싱

```typescript
import DataProcessor from '@/lib/rag/dataProcessor';

const processor = new DataProcessor();

// 파일 업로드
const handleFileUpload = async (file: File) => {
  const processed = await processor.processFile(
    file,
    userId,
    projectId,
    category
  );
  
  console.log(`처리 완료: ${processed.chunks.length}개 청크 생성`);
};
```

### 3단계: RAG 챗봇 통합

```typescript
import RAGPipeline from '@/lib/rag/ragPipeline';

const ragPipeline = new RAGPipeline({
  maxContextChunks: 5,
  minSimilarityScore: 0.7,
  useHybridSearch: true
});

// 응답 생성
const response = await ragPipeline.generateResponse(
  userQuery,
  userId,
  chatHistory
);
```

### 4단계: 프론트엔드 통합

```typescript
// 챗봇 컴포넌트에서 사용
const sendMessage = async (message: string) => {
  const response = await fetch('/api/ai-assistant/rag-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, messages, sessionId })
  });

  // SSE 스트림 처리
  const reader = response.body?.getReader();
  // ... 스트림 처리 로직
};
```

## 🎯 주요 기능

### 1. 문서 업로드

```typescript
// API 엔드포인트: PUT /api/ai-assistant/rag-chat
const formData = new FormData();
formData.append('file', file);
formData.append('category', 'technical');
formData.append('projectId', projectId);

const response = await fetch('/api/ai-assistant/rag-chat', {
  method: 'PUT',
  body: formData
});
```

### 2. 컨텍스트 기반 대화

```typescript
// API 엔드포인트: POST /api/ai-assistant/rag-chat
const response = await fetch('/api/ai-assistant/rag-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "프로젝트 진행 상황은 어떤가요?",
    messages: previousMessages,
    sessionId: currentSessionId
  })
});
```

### 3. 문서 관리

```typescript
// 문서 목록 조회
const documents = await fetch('/api/ai-assistant/rag-chat', {
  method: 'GET'
});

// 문서 삭제
const deleteDoc = await fetch('/api/ai-assistant/rag-chat', {
  method: 'DELETE',
  body: JSON.stringify({ documentId })
});
```

## 🚀 성능 최적화

### 1. 청킹 전략

- **청크 크기**: 500-1000 토큰 권장
- **오버랩**: 50-100 토큰으로 컨텍스트 연속성 유지
- **메타데이터**: 소스, 페이지, 섹션 정보 포함

### 2. 검색 최적화

- **하이브리드 검색**: 벡터 + 키워드 조합
- **재순위화**: 관련도 스코어 기반 정렬
- **캐싱**: 자주 검색되는 쿼리 결과 캐싱

### 3. 응답 품질

- **프롬프트 엔지니어링**: 명확한 지시사항
- **컨텍스트 윈도우**: 4000 토큰 이내 유지
- **신뢰도 점수**: 응답 신뢰도 표시

## 📊 모니터링

### 메트릭 추적

```typescript
// 성능 메트릭
{
  processingTime: number,    // 처리 시간
  tokenCount: number,        // 토큰 사용량
  chunkCount: number,        // 검색된 청크 수
  confidence: number,        // 응답 신뢰도
  cacheHit: boolean         // 캐시 적중 여부
}
```

## 🔒 보안 고려사항

1. **데이터 격리**: 사용자별 데이터 분리
2. **접근 제어**: RLS (Row Level Security) 적용
3. **입력 검증**: 파일 크기 및 형식 제한
4. **암호화**: 민감한 데이터 암호화 저장

## 🐛 트러블슈팅

### 일반적인 문제 해결

1. **임베딩 생성 실패**
   - Gemini API 키 확인
   - 네트워크 연결 확인
   - 토큰 제한 확인

2. **검색 결과 없음**
   - 임베딩 차원 일치 확인
   - 유사도 임계값 조정
   - 인덱스 재구축

3. **응답 품질 저하**
   - 청크 크기 조정
   - 컨텍스트 윈도우 확대
   - 프롬프트 개선

## 📚 참고 자료

- [Supabase Vector](https://supabase.com/docs/guides/ai/vector-columns)
- [Gemini API](https://ai.google.dev/gemini-api/docs)
- [LangChain Documentation](https://js.langchain.com/docs)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)

## 🎯 다음 단계

1. **UI 개선**: 파일 업로드 인터페이스 추가
2. **멀티모달**: 이미지 처리 지원
3. **실시간 동기화**: 외부 데이터 소스 연동
4. **분석 대시보드**: 사용 통계 및 인사이트
5. **팀 협업**: 문서 공유 및 권한 관리