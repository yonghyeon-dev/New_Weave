# CLAUDE.md

이 파일은 이 저장소에서 코드 작업을 할 때 Claude Code에게 지침을 제공합니다.

## 🌐 언어 및 작업 지침

**언어**: 사용자와 상호작용할 때 항상 한국어로 의사소통하세요.

**작업 원칙**:

- 요청된 작업만 수행하세요 (그 이상도 그 이하도 아님)
- 목표 달성에 절대적으로 필요한 경우가 아니라면 파일을 생성하지 마세요
- 항상 새 파일보다 기존 파일 편집을 우선하세요
- 사용자가 명시적으로 요청하지 않는 한 문서 파일 생성 금지

## 📋 버전 관리 규칙

**버전 구조**:

- **배포 버전**: `V{Major}.{Minor}.{Patch}_{YYMMDD}`
- **개발 버전**: `V{Major}.{Minor}.{Patch}_{YYMMDD}_REV{순차번호}`

**버전 업데이트 기준**:

- **Major**: 대규모 구조 변경, 호환성 깨짐, 아키텍처 재설계
- **Minor**: 새 기능 추가, 기존 기능 개선
- **Patch**: 버그 수정, 마이너 개선
- **REV**: 동일 버전 내 개발 진행 상황 (배포 후 001로 초기화)

## 🤖 자동 커밋 워크플로우

**자동 커밋 트리거**: 기능 구현, 버그 수정, 리팩토링, 문서화, 설정 변경 완료 시

**커밋 메시지 형식**:

```
[type]: [간단한 설명]

[상세 변경 내용]

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

## 🔧 Context7 MCP 사용 정책

**사용 승인 필요**: Context7 MCP는 사용자의 명시적 허가가 있을 때만 사용합니다.

**사용 조건**:

1. **빌드 오류 발생 시**: 컴파일 실패, 타입스크립트 오류, 라이브러리 호환성 문제
2. **사용자 명시적 허가**: "--c7" 플래그 또는 직접적인 MCP 사용 요청
3. **시스템적 해결 우선**: 내장 도구와 시스템적 접근법을 먼저 시도

**시스템화 중심 문제 해결**:

- 공식 문서 참조보다 **아키텍처적 해결책** 우선
- 근본적 시스템 설계 개선을 통한 **장기적 안정성** 확보
- 임시방편보다 **구조적 개선**을 통한 문제 해결

## 📋 이슈 추적 시스템

**이슈 번호 체계**: `ISSUE-{카테고리}-{번호}` (예: ISSUE-UI-001, ISSUE-BUILD-002)

**카테고리**: UI, ACC(접근성), PERF(성능), SEC(보안), API, BUILD

**심각도**: 🚨 Critical (시스템 중단) | ⚠️ Medium (기능 장애) | 🎨 Minor (개선사항)

### 이슈 문서화 필수 요소

1. **문제 분석** (4단계): 원인→배경→시스템영향→사용자영향
2. **해결 방안**: 시스템적 접근법 우선
3. **기술 상세**: 실제 코드 변경사항
4. **검증 완료**: 구체적 테스트 결과
5. **배포 영향**: 긴급도 및 영향 범위

### 릴리즈노트 구조 (example.md 기반)

**기본 구조**: 주요개선사항 → 이슈트래킹로그 → 통계 → 품질검증

**이슈별 5단계 분석**:

1. 🔍 **문제 분석** (4단계 세분화)
2. 🎯 **해결 방안** (시스템적 접근)
3. ✅ **검증 완료** (구체적 결과)
4. 💻 **기술 상세** (코드 변경사항)
5. 🚀 **배포 영향** (긴급도/범위/성능)

## 🔄 지속적 개선 프로세스

### 6단계 이슈 처리 절차

1. **즉시 기록**: RELEASE_NOTES.md에 이슈 추가
2. **4단계 분석**: 원인→배경→시스템영향→사용자영향
3. **시스템적 해결**: 구조적 개선 우선, 임시방편 병행
4. **회귀 테스트**: 동일 이슈 재발 방지
5. **적절한 버전**: Semantic versioning 준수
6. **의미있는 커밋**: Conventional Commits 형식

### 품질 게이트 체크리스트

**릴리즈 필수 확인**:

- [ ] Critical 이슈 완전 해결
- [ ] 회귀 테스트 통과
- [ ] 성능 지표 측정
- [ ] 접근성 테스트 (UI 변경 시)
- [ ] 크로스 브라우저 호환성

## 📝 커밋 메시지 가이드라인

**Context7 MCP 검증**: Conventional Commits 표준 기반

### 기본 구조

```
type(scope): description

[optional body]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 커밋 타입 (Types)

- **`fix`**: 버그 수정 (ISSUE-XXX 해결)
- **`feat`**: 새 기능 추가
- **`refactor`**: 리팩토링 (기능 변경 없는 코드 개선)
- **`test`**: 테스트 추가/수정
- **`docs`**: 문서 수정
- **`style`**: 코드 포맷팅 (세미콜론, 들여쓰기 등)
- **`perf`**: 성능 개선
- **`ci`**: CI/CD 설정 변경
- **`chore`**: 빌드 스크립트, 패키지 매니저 등

### 스코프 (Scope) 가이드

- **`ui`**: UI 컴포넌트 관련
- **`auth`**: 인증/권한 관련
- **`api`**: API 및 백엔드 관련
- **`db`**: 데이터베이스 관련
- **`config`**: 설정 파일 관련
- **`deps`**: 의존성 관련
- **`accessibility`**: 접근성 관련

### 이슈 연동 규칙

**ISSUE 해결 시 필수 포함**:

```
fix(ui): resolve component page runtime error

- Add 'use client' directive to fix Server Component serialization
- Resolves ISSUE-UI-001: Event handlers cannot be passed to Client Component props
- Ensure Next.js App Router architecture compliance

Closes #ISSUE-UI-001

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 커밋 메시지 최적화 팁

1. **제목 50자 이내**: 간결하고 명확하게
2. **현재형 사용**: "Fixed" 대신 "Fix"
3. **첫 글자 소문자**: "fix:" 이후 소문자로 시작
4. **명령형 어조**: "Add feature" 형태
5. **이슈 번호 포함**: ISSUE-XXX 형식으로 추적 가능하게

### 좋은 커밋 메시지 예시

```
feat(auth): implement Google OAuth single sign-on

- Replace email/password authentication with Google OAuth
- Add GoogleSignInButton component with Supabase integration
- Update authentication flow for better user experience
- Remove deprecated email verification system

Resolves ISSUE-AUTH-001

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**자동 커밋 후 안내:**

```
✅ 개발 완료 및 커밋되었습니다!
```

## 📋 WEAVE 시스템 디자인 정책

### 🎯 핵심 원칙

#### 1. 중앙화 (Centralization)
- **단일 진실의 원천(Single Source of Truth)**
- **재사용 가능한 컴포넌트 우선**
- **중복 코드 제거**

#### 2. 시스템화 (Systematization)  
- **일관된 패턴 적용**
- **예측 가능한 구조**
- **명확한 책임 분리**

#### 3. 표준 준수 (Standards Compliance)
- **기존 UI 컴포넌트 사용 필수**
- **글로벌 CSS 변수 활용**
- **Tailwind 디자인 시스템 준수**

### 🏗️ 아키텍처 규칙

#### 컴포넌트 계층 구조

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

#### 컴포넌트 사용 우선순위

1. **기존 UI 컴포넌트 사용** (`src/components/ui/`)
   - Card, Button, Input, Typography 등
2. **기존 컴포넌트 확장**
   - 필요시 props 추가로 확장
3. **새 컴포넌트 생성** (사용자 승인 필요)
   - 기존 컴포넌트로 불가능한 경우만
   - 반드시 사용자 확인 후 진행

### 🎨 스타일링 규칙

#### 필수 사용 요소

**Typography 컴포넌트**
```tsx
// ✅ 올바른 사용
<Typography variant="h1">제목</Typography>
<Typography variant="body1">본문</Typography>

// ❌ 잘못된 사용
<h1 className="text-2xl font-bold">제목</h1>
<p className="text-sm">본문</p>
```

**Card 컴포넌트**
```tsx
// ✅ 올바른 사용
<Card className="p-6">컨텐츠</Card>

// ❌ 잘못된 사용
<div className="bg-white rounded-lg shadow-sm p-6">컨텐츠</div>
```

**Button 컴포넌트**
```tsx
// ✅ 올바른 사용
<Button variant="primary">확인</Button>
<Button variant="outline">취소</Button>

// ❌ 잘못된 사용
<button className="px-4 py-2 bg-blue-600 text-white rounded">확인</button>
```

#### 색상 시스템

**글로벌 CSS 변수 (필수 사용)**
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

**Tailwind 클래스 사용법**
```tsx
// ✅ 올바른 사용 - CSS 변수 활용
<div className="bg-bg-primary text-txt-primary border-border-light">

// ❌ 잘못된 사용 - 하드코딩된 색상
<div className="bg-gray-50 text-gray-900 border-gray-200">
```

### 🚫 금지 사항

#### 절대 금지
1. ❌ 인라인 스타일 사용
2. ❌ 하드코딩된 색상값 사용
3. ❌ 중복 컴포넌트 생성
4. ❌ 글로벌 스타일 무시
5. ❌ 무단 컴포넌트 생성

#### 예외 처리
- 불가피한 경우 반드시 사용자 승인 필요
- 승인 시 이유를 코드 주석으로 명시

### 🔄 개발 프로세스

#### 기능 구현 전 체크리스트

- [ ] 기존 UI 컴포넌트 확인
- [ ] 글로벌 스타일 변수 확인
- [ ] 유사 기능 패턴 확인
- [ ] 재사용 가능성 검토

#### 새 컴포넌트 생성 프로세스

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
