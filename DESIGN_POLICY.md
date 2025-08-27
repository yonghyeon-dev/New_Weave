# 📋 WEAVE 시스템 디자인 정책

## 🎯 핵심 원칙

### 1. 중앙화 (Centralization)
- **단일 진실의 원천(Single Source of Truth)**
- **재사용 가능한 컴포넌트 우선**
- **중복 코드 제거**

### 2. 시스템화 (Systematization)  
- **일관된 패턴 적용**
- **예측 가능한 구조**
- **명확한 책임 분리**

### 3. 표준 준수 (Standards Compliance)
- **기존 UI 컴포넌트 사용 필수**
- **글로벌 CSS 변수 활용**
- **Tailwind 디자인 시스템 준수**

---

## 🏗️ 아키텍처 규칙

### 컴포넌트 계층 구조

```
src/
├── components/
│   ├── ui/              # 재사용 가능한 기본 UI 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   ├── dashboard/       # 대시보드 전용 컴포넌트
│   └── [feature]/       # 기능별 전용 컴포넌트
├── app/                 # Next.js App Router 페이지
└── lib/                 # 유틸리티 및 헬퍼 함수
```

### 컴포넌트 사용 우선순위

1. **기존 UI 컴포넌트 사용** (`src/components/ui/`)
   - Card, Button, Input, Typography 등
2. **기존 컴포넌트 확장**
   - 필요시 props 추가로 확장
3. **새 컴포넌트 생성** (사용자 승인 필요)
   - 기존 컴포넌트로 불가능한 경우만
   - 반드시 사용자 확인 후 진행

---

## 🎨 스타일링 규칙

### 필수 사용 요소

#### 1. Typography 컴포넌트
```tsx
// ✅ 올바른 사용
<Typography variant="h1">제목</Typography>
<Typography variant="body1">본문</Typography>

// ❌ 잘못된 사용
<h1 className="text-2xl font-bold">제목</h1>
<p className="text-sm">본문</p>
```

#### 2. Card 컴포넌트
```tsx
// ✅ 올바른 사용
<Card className="p-6">
  컨텐츠
</Card>

// ❌ 잘못된 사용
<div className="bg-white rounded-lg shadow-sm p-6">
  컨텐츠
</div>
```

#### 3. Button 컴포넌트
```tsx
// ✅ 올바른 사용
<Button variant="primary">확인</Button>
<Button variant="outline">취소</Button>

// ❌ 잘못된 사용
<button className="px-4 py-2 bg-blue-600 text-white rounded">
  확인
</button>
```

### 색상 시스템

#### 글로벌 CSS 변수 (필수 사용)
```css
/* 배경 색상 */
--bg-primary: 기본 배경
--bg-secondary: 보조 배경
--bg-tertiary: 3차 배경

/* 텍스트 색상 */
--txt-primary: 기본 텍스트
--txt-secondary: 보조 텍스트
--txt-tertiary: 3차 텍스트

/* 브랜드 색상 */
--weave-primary: 메인 브랜드 색상
--weave-primary-light: 밝은 브랜드 색상
--weave-secondary: 보조 브랜드 색상

/* 테두리 색상 */
--border-light: 밝은 테두리
--border-dark: 어두운 테두리
```

#### Tailwind 클래스 사용법
```tsx
// ✅ 올바른 사용 - CSS 변수 활용
<div className="bg-bg-primary text-txt-primary border-border-light">

// ❌ 잘못된 사용 - 하드코딩된 색상
<div className="bg-gray-50 text-gray-900 border-gray-200">
```

---

## 📝 코드 작성 규칙

### 1. 중복 선언 금지

```tsx
// ❌ 잘못된 예시 - 중복 스타일 정의
const customButtonStyle = "px-4 py-2 bg-blue-600 text-white rounded";
<button className={customButtonStyle}>확인</button>

// ✅ 올바른 예시 - 기존 컴포넌트 사용
<Button>확인</Button>
```

### 2. 하드코딩 금지

```tsx
// ❌ 잘못된 예시 - 하드코딩된 값
<div style={{ padding: '24px', marginBottom: '16px' }}>

// ✅ 올바른 예시 - Tailwind 클래스 사용
<div className="p-6 mb-4">
```

### 3. 인라인 스타일 금지

```tsx
// ❌ 잘못된 예시
<div style={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}>

// ✅ 올바른 예시
<Card>
```

---

## 🔄 개발 프로세스

### 1. 기능 구현 전 체크리스트

- [ ] 기존 UI 컴포넌트 확인
- [ ] 글로벌 스타일 변수 확인
- [ ] 유사 기능 패턴 확인
- [ ] 재사용 가능성 검토

### 2. 새 컴포넌트 생성 프로세스

1. **필요성 검증**
   - 기존 컴포넌트로 불가능함을 증명
   - 3개 이상의 위치에서 재사용 예정

2. **사용자 승인**
   ```
   "새로운 [컴포넌트명] 컴포넌트가 필요합니다.
   이유: [구체적 이유]
   사용 예정 위치: [최소 3곳 명시]
   승인하시겠습니까?"
   ```

3. **컴포넌트 생성**
   - `/src/components/ui/` 디렉토리에 생성
   - Props 타입 정의 필수
   - 기본값 설정 필수

### 3. 스타일 수정 프로세스

1. **CSS 변수 우선 사용**
2. **Tailwind 유틸리티 클래스 사용**
3. **컴포넌트 props 확장** (필요시)
4. **새 CSS 변수 추가** (사용자 승인 필요)

---

## 🚫 금지 사항

### 절대 금지
1. ❌ 인라인 스타일 사용
2. ❌ 하드코딩된 색상값 사용
3. ❌ 중복 컴포넌트 생성
4. ❌ 글로벌 스타일 무시
5. ❌ 무단 컴포넌트 생성

### 예외 처리
- 불가피한 경우 반드시 사용자 승인 필요
- 승인 시 이유를 코드 주석으로 명시

---

## 📊 품질 관리

### 코드 리뷰 체크포인트

- [ ] UI 컴포넌트 재사용
- [ ] CSS 변수 활용
- [ ] 중복 코드 제거
- [ ] 일관된 패턴 적용
- [ ] 접근성 고려
- [ ] 반응형 디자인

### 성능 최적화

- [ ] 컴포넌트 lazy loading
- [ ] 이미지 최적화
- [ ] 번들 크기 최소화
- [ ] 불필요한 리렌더링 방지

---

## 🔧 도구 및 유틸리티

### 필수 사용 유틸리티

#### cn() 함수 (클래스 병합)
```tsx
import { cn } from '@/lib/utils';

// 조건부 클래스 적용
<div className={cn(
  "base-class",
  condition && "conditional-class",
  variant === 'primary' && "primary-class"
)}>
```

### 타입 정의 규칙
```tsx
// 컴포넌트 Props 타입 정의
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}
```

---

## 📚 참고 문서

- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React TypeScript](https://react.dev/learn/typescript)

---

## 🔄 정책 업데이트

이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.
변경 사항은 팀원 전체 동의 후 반영됩니다.

**최종 수정일**: 2025-08-26
**버전**: 1.0.0