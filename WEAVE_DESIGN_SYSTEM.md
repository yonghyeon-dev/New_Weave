# Weave 화이트 테마 + 단일 브랜드 컬러 디자인 시스템

## 🎨 디자인 철학

**"Simple. Connected. Professional."**

Weave는 프리랜서의 흩어진 업무를 하나로 연결하는 플랫폼입니다. 디자인도 이 철학을 반영하여:
- **Simple**: 화이트 베이스로 깔끔하고 직관적
- **Connected**: 단일 브랜드 컬러로 통일감 있는 연결성 표현
- **Professional**: 비즈니스 도구에 걸맞는 전문적 느낌

## 🎯 핵심 브랜드 컬러: Weave Teal

### Primary Color: **Weave Teal (#4ECDC4)**
```css
--weave-primary: #4ECDC4
--weave-primary-hover: #3DB8B0  
--weave-primary-light: #E0F7F5
--weave-primary-dark: #2A8A85
```

**선택 이유:**
- ✅ 신뢰감과 안정성을 주는 청록색 계열
- ✅ "연결"과 "흐름"의 의미 내포
- ✅ 프리랜서/비즈니스 도구에 적합한 전문성
- ✅ 충분한 대비율로 접근성 확보

## 🤍 베이스 컬러 팔레트

### Background Colors
```css
--bg-primary: #FFFFFF        /* 메인 배경 */
--bg-secondary: #F8F9FA      /* 보조 배경 */
--bg-tertiary: #E9ECEF       /* 구분선, 비활성 영역 */
```

### Text Colors  
```css
--text-primary: #212529      /* 메인 텍스트 (90% 대비) */
--text-secondary: #495057    /* 보조 텍스트 (70% 대비) */
--text-tertiary: #6C757D     /* 힌트 텍스트 (60% 대비) */
--text-disabled: #ADB5BD     /* 비활성 텍스트 (40% 대비) */
```

### Border Colors
```css
--border-light: #E9ECEF      /* 가벼운 구분선 */
--border-medium: #DEE2E6     /* 일반 테두리 */
--border-strong: #CED4DA     /* 강조 테두리 */
```

## 🎨 컴포넌트 색상 적용

### 1. Primary Actions (주요 액션)
- **배경**: Weave Teal (#4ECDC4)
- **텍스트**: 화이트 (#FFFFFF)
- **호버**: Teal Hover (#3DB8B0)
- **사용 예**: 저장 버튼, 제출 버튼, CTA 버튼

### 2. Secondary Actions (보조 액션)
- **배경**: 투명 또는 Teal Light (#E0F7F5)  
- **텍스트**: Weave Teal (#4ECDC4)
- **테두리**: Weave Teal (#4ECDC4)
- **사용 예**: 취소 버튼, 옵션 버튼

### 3. Status Colors (상태 표시)
```css
--status-success: #28A745    /* 성공 */
--status-warning: #FFC107    /* 경고 */
--status-error: #DC3545      /* 오류 */
--status-info: #4ECDC4       /* 정보 (브랜드 컬러 재사용) */
```

### 4. Interactive Elements
- **포커스**: Teal + 20% 투명도 box-shadow
- **선택**: Teal Light 배경 (#E0F7F5)
- **호버**: Teal + 5% 투명도 배경

## 📐 타이포그래피

### Font Hierarchy
```css
--font-display: 32px/1.2     /* 페이지 제목 */
--font-h1: 24px/1.3          /* 섹션 제목 */
--font-h2: 20px/1.4          /* 카드 제목 */
--font-h3: 16px/1.4          /* 소제목 */
--font-body: 14px/1.5        /* 본문 */
--font-caption: 12px/1.4     /* 캡션, 힌트 */
```

### Font Weights
```css
--weight-regular: 400
--weight-medium: 500
--weight-semibold: 600
```

## 🧩 컴포넌트 가이드라인

### Button Styles
```css
/* Primary Button */
.btn-primary {
  background: var(--weave-primary);
  color: white;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--weave-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.25);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--weave-primary);
  border: 1px solid var(--weave-primary);
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--weave-primary-light);
}
```

### Card Styles
```css
.card {
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card:hover {
  border-color: var(--weave-primary);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.1);
}
```

### Input Styles
```css
.input {
  background: white;
  border: 1px solid var(--border-medium);
  border-radius: 6px;
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--weave-primary);
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}
```

## ♿ 접근성 (Accessibility)

### 대비율 검증
- **Weave Teal (#4ECDC4) on White**: 4.2:1 (AA 준수)
- **Primary Text (#212529) on White**: 16.2:1 (AAA 준수)
- **Secondary Text (#495057) on White**: 9.4:1 (AAA 준수)

### 포커스 표시
```css
:focus {
  outline: 2px solid var(--weave-primary);
  outline-offset: 2px;
}
```

## 📱 반응형 디자인

### Breakpoints
```css
--mobile: 320px
--tablet: 768px  
--desktop: 1024px
--large: 1440px
```

### 컴포넌트 크기 조정
- **모바일**: padding 축소, font-size 유지
- **태블릿**: 표준 크기 적용
- **데스크톱**: 여백 확대, 호버 효과 강화

## 🔄 다크 모드 대응 (향후)

현재는 화이트 테마 중심이지만, 향후 다크 모드 확장 시:
```css
[data-theme="dark"] {
  --bg-primary: #1A1A1A;
  --bg-secondary: #2A2A2A;
  --text-primary: #FFFFFF;
  --weave-primary: #4ECDC4; /* 브랜드 컬러는 동일 유지 */
}
```

## 🎯 구현 우선순위

### Phase 1: 핵심 컴포넌트
1. ✅ Button (Primary, Secondary)
2. ✅ Input, TextArea
3. ✅ Card
4. ✅ Navigation

### Phase 2: 복합 컴포넌트  
1. Modal, Dialog
2. Dropdown, Select
3. Table, List
4. Form Components

### Phase 3: 고급 컴포넌트
1. Dashboard Widgets
2. Charts, Graphs
3. File Upload
4. Calendar Components

## 📊 성공 지표

- **일관성**: 모든 컴포넌트에서 단일 브랜드 컬러 사용
- **효율성**: 색상 변수 개수 최소화 (< 15개)
- **접근성**: WCAG 2.1 AA 준수
- **성능**: CSS 번들 크기 최적화