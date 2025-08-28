# 🤖 AI 챗봇 시스템 설계 문서

## 📌 개요
AI Assistant 메뉴에 일반 AI 챗봇 기능을 추가합니다. 기존 Gemini API 인프라를 활용하여 실시간 대화형 챗봇을 구현합니다.

## 🎯 핵심 목표
1. **즉시 사용 가능한 MVP 구현** - 기존 인프라 최대 활용
2. **실시간 스트리밍 응답** - SSE 기반 스트림 처리
3. **대화 컨텍스트 유지** - 세션별 대화 기록 관리
4. **확장 가능한 구조** - 추후 기능 추가 고려

## 📊 아키텍처 설계

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
├─────────────────────────────────────────────────┤
│  /ai-assistant/chat/page.tsx                    │
│  ├─ ChatInterface Component                     │
│  ├─ MessageList Component                       │
│  ├─ MessageInput Component                      │
│  └─ TypingIndicator Component                   │
├─────────────────────────────────────────────────┤
│                    API Layer                     │
├─────────────────────────────────────────────────┤
│  /api/ai-assistant/chat/route.ts                │
│  ├─ POST: Send Message (SSE Stream)             │
│  ├─ GET: Get Chat History                       │
│  └─ DELETE: Clear Chat Session                  │
├─────────────────────────────────────────────────┤
│                   Services                       │
├─────────────────────────────────────────────────┤
│  /lib/services/chatService.ts                   │
│  ├─ Gemini Integration                          │
│  ├─ Session Management                          │
│  └─ Context Processing                          │
├─────────────────────────────────────────────────┤
│                   Storage                        │
├─────────────────────────────────────────────────┤
│  Browser: LocalStorage (MVP)                    │
│  Future: Supabase Database                      │
└─────────────────────────────────────────────────┘
```

## 💾 데이터 모델

```typescript
// 메시지 인터페이스
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

// 채팅 세션
interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    totalTokens: number;
    model: string;
  };
}

// 스트리밍 응답
interface StreamChunk {
  type: 'content' | 'metadata' | 'error' | 'done';
  data: any;
  timestamp: number;
}
```

## 🔄 핵심 기능 흐름

### 1. 메시지 전송 및 스트리밍
```typescript
// Client → Server (SSE)
POST /api/ai-assistant/chat
Headers: { 'Accept': 'text/event-stream' }
Body: { message: string, sessionId: string }

// Server → Client (Stream)
event: chunk
data: { type: 'content', data: 'AI 응답 텍스트...' }

event: done
data: { type: 'done', metadata: { tokens: 150 } }
```

### 2. 대화 컨텍스트 관리
```typescript
// 최근 10개 메시지 유지 (토큰 최적화)
const contextWindow = messages.slice(-10);

// 시스템 프롬프트 포함
const systemPrompt = `
당신은 도움이 되는 AI 어시스턴트입니다.
한국어로 대화하며, 정확하고 친절한 답변을 제공합니다.
`;
```

## 🎨 UI/UX 설계

### 컴포넌트 구조
```
ChatPage
├─ Header (제목, 설정 버튼)
├─ ChatContainer
│  ├─ MessageList
│  │  ├─ UserMessage
│  │  └─ AssistantMessage
│  ├─ TypingIndicator
│  └─ ScrollToBottom
└─ InputArea
   ├─ MessageInput
   ├─ SendButton
   └─ ClearButton
```

### 스타일 가이드
- 기존 UI 컴포넌트 활용 (Card, Button, Typography)
- 글로벌 CSS 변수 사용 (--bg-primary, --txt-primary 등)
- 반응형 디자인 (모바일 우선)

## 🚀 구현 단계

### Phase 1: MVP (1주)
- [x] 기본 채팅 UI 구현
- [x] Gemini API 연동 (기존 활용)
- [ ] 메시지 송수신 기능
- [ ] LocalStorage 세션 저장

### Phase 2: 스트리밍 (3일)
- [ ] SSE 스트리밍 구현
- [ ] 타이핑 인디케이터
- [ ] 응답 중단 기능

### Phase 3: 고급 기능 (1주)
- [ ] 대화 기록 관리
- [ ] 파일 업로드 지원
- [ ] Supabase 연동
- [ ] 다중 세션 관리

## 🛠️ 기술 스택

### 기존 활용 (이미 구축됨)
- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS  
- ✅ Gemini API (`gemini-2.5-flash-lite`)
- ✅ UI 컴포넌트 시스템

### 추가 필요 (최소)
```bash
# SSE 파싱을 위한 라이브러리
npm install eventsource-parser

# 마크다운 렌더링 (옵션)
npm install react-markdown
```

## 📁 파일 구조

```
src/
├── app/
│   ├── ai-assistant/
│   │   ├── chat/
│   │   │   └── page.tsx          # 채팅 페이지
│   │   └── page.tsx               # AI Assistant 허브 (수정)
│   └── api/
│       └── ai-assistant/
│           ├── chat/
│           │   └── route.ts       # 채팅 API
│           └── route.ts           # 기존 API
├── components/
│   └── chat/
│       ├── ChatInterface.tsx      # 채팅 인터페이스
│       ├── MessageList.tsx        # 메시지 목록
│       ├── MessageBubble.tsx      # 메시지 버블
│       └── MessageInput.tsx       # 입력 컴포넌트
└── lib/
    └── services/
        └── chatService.ts          # 채팅 서비스 로직
```

## ⚡ 성능 최적화

### 토큰 관리
- 컨텍스트 윈도우: 최대 10개 메시지
- 요약 기능: 긴 대화 자동 요약
- 모델 선택: `gemini-2.5-flash-lite` (빠른 응답)

### 스트리밍 최적화
- 청크 크기: 100-200자 단위
- 버퍼링: 50ms 디바운싱
- 에러 복구: 자동 재연결

## 🔒 보안 고려사항

### API 보안
- Rate limiting: 분당 20 요청
- API key 환경변수 관리
- CORS 설정

### 데이터 보호
- 민감정보 필터링
- 세션 자동 만료 (30분)
- XSS 방지

## 📈 확장 계획

### 단기 (2-4주)
- RAG 구현 (문서 기반 답변)
- 멀티모달 지원 (이미지 입력)
- 대화 내보내기 기능

### 중기 (1-2개월)
- 세무 전문 챗봇 모드
- Function calling
- 다국어 지원

### 장기 (3-6개월)
- 음성 대화 지원
- 실시간 협업 채팅
- AI 에이전트 통합

## 🎯 성공 지표

### 기술 지표
- 응답 시간: < 2초 (첫 토큰)
- 정확도: > 90%
- 가용성: 99.9%

### 사용자 지표
- 일일 활성 사용자
- 평균 대화 길이
- 사용자 만족도

## 📝 구현 체크리스트

### 필수 기능
- [ ] 기본 채팅 UI
- [ ] 메시지 송수신
- [ ] 스트리밍 응답
- [ ] 대화 기록 저장
- [ ] 에러 처리

### 추가 기능
- [ ] 파일 업로드
- [ ] 마크다운 렌더링
- [ ] 코드 하이라이팅
- [ ] 이모지 지원
- [ ] 대화 검색

## 💡 주요 결정 사항

1. **SSE vs WebSocket**: SSE 선택 (단방향 스트림 충분)
2. **LocalStorage vs DB**: MVP는 LocalStorage, 추후 Supabase
3. **모델 선택**: gemini-2.5-flash-lite (속도/비용 균형)
4. **UI 프레임워크**: 기존 컴포넌트 시스템 활용

---

## 🔧 기술 상세

### Gemini API 설정
```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash-lite',
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  }
});
```

### SSE 스트리밍 구현
```typescript
// 서버 측
const stream = new ReadableStream({
  async start(controller) {
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      controller.enqueue(`data: ${JSON.stringify({ type: 'content', data: text })}\n\n`);
    }
    controller.enqueue(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    controller.close();
  }
});

// 클라이언트 측
const eventSource = new EventSource('/api/ai-assistant/chat');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'content') {
    setMessage(prev => prev + data.data);
  }
};
```

---

*최종 업데이트: 2025-08-28*
*작성: AI Assistant Design System*