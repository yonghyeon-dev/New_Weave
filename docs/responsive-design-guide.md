# 반응형 디자인 가이드라인

WEAVE 프로젝트의 반응형 디자인 표준 및 브레이크포인트 가이드입니다.

## 브레이크포인트 정의

### 주요 브레이크포인트
```css
/* 모바일 최소 크기 */
xs: 320px

/* 모바일 가로/작은 태블릿 */  
sm: 640px

/* 태블릿 */
md: 768px

/* 작은 데스크톱 */
lg: 1024px

/* 데스크톱 */
xl: 1280px

/* 큰 데스크톱 */
2xl: 1440px
```

### 전용 브레이크포인트
```css
/* 최대 컨테이너 너비 */
container: 1024px

/* 텍스트 콘텐츠 최적 너비 */
prose: 768px
```

## 반응형 규칙

### 카드 레이아웃 전환 기준
- **320px - 639px (모바일)**: 1열 레이아웃
- **640px - 767px (모바일 가로)**: 2열 레이아웃
- **768px - 1023px (태블릿)**: 2-3열 레이아웃
- **1024px+ (데스크톱)**: 3-4열 레이아웃

### 그리드 시스템
```tailwind
<!-- 반응형 그리드 예시 -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <!-- 카드 컴포넌트들 -->
</div>
```

### 텍스트 및 간격 조정
```tailwind
<!-- 반응형 텍스트 크기 -->
<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl">제목</h1>

<!-- 반응형 간격 -->
<div class="p-4 sm:p-6 md:p-8 lg:p-12">
  <!-- 콘텐츠 -->
</div>
```

### 네비게이션 및 메뉴
- **320px - 767px**: 햄버거 메뉴 또는 하단 탭바
- **768px+**: 수평 네비게이션 바

### 폼 레이아웃
```tailwind
<!-- 반응형 폼 필드 -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input class="w-full" />
  <input class="w-full" />
</div>
```

## 컴포넌트별 반응형 가이드

### 버튼
- **모바일**: `w-full` (전체 너비)
- **태블릿+**: `w-auto` (내용에 맞는 너비)

### 모달/다이얼로그
- **모바일**: 전체 화면 또는 하단에서 올라오는 시트
- **태블릿+**: 중앙 정렬된 모달

### 테이블
- **모바일**: 카드 형태로 변환 또는 수평 스크롤
- **태블릿+**: 표준 테이블 레이아웃

## 테스트 기준

### 필수 테스트 해상도
1. **320px** - 최소 모바일 크기
2. **375px** - iPhone SE/8 크기
3. **414px** - iPhone Plus/XR 크기
4. **768px** - iPad 세로 모드
5. **1024px** - iPad 가로 모드 / 작은 노트북
6. **1440px** - 일반 데스크톱 모니터

### 반응형 검증 체크리스트
- [ ] 모든 요소가 최소 너비(320px)에서 깨지지 않음
- [ ] 터치 타겟이 44px 이상 (모바일)
- [ ] 텍스트가 모든 크기에서 읽기 가능
- [ ] 이미지와 미디어가 적절히 조정됨
- [ ] 네비게이션이 모든 화면에서 접근 가능
- [ ] 폼이 모바일에서 사용하기 편함

## Tailwind CSS 유틸리티 예시

### 간격 조정
```tailwind
<!-- 반응형 마진/패딩 -->
<div class="m-2 sm:m-4 md:m-6 lg:m-8">
  <div class="p-3 sm:p-4 md:p-6 lg:p-8">
    <!-- 콘텐츠 -->
  </div>
</div>
```

### 플렉스 레이아웃
```tailwind
<!-- 반응형 플렉스 방향 -->
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/3">사이드바</div>
  <div class="w-full md:w-2/3">메인 콘텐츠</div>
</div>
```

### 가시성 제어
```tailwind
<!-- 화면 크기별 요소 숨김/보임 -->
<div class="block md:hidden">모바일에서만 보임</div>
<div class="hidden md:block">데스크톱에서만 보임</div>
```

## 성능 최적화

### 이미지 최적화
```jsx
// Next.js Image 컴포넌트 사용 예시
<Image
  src="/image.jpg"
  alt="설명"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority
/>
```

### 조건부 렌더링
```jsx
// 화면 크기에 따른 조건부 렌더링
{isDesktop ? <DesktopComponent /> : <MobileComponent />}
```

## 접근성 고려사항

### 터치 타겟
- 최소 44x44px 크기 보장
- 인터랙티브 요소 간 충분한 간격

### 키보드 네비게이션
- 탭 순서가 시각적 순서와 일치
- 포커스 표시가 모든 화면에서 명확히 보임

### 텍스트 가독성
- 최소 16px 폰트 크기 (모바일)
- 충분한 대비비 (WCAG AA 기준)

이 가이드라인을 따라 일관되고 접근 가능한 반응형 디자인을 구현하세요.