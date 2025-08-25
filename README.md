# Weave UI Components

커스터마이징 가능한 테마 시스템을 가진 React UI 컴포넌트 라이브러리입니다.

## 🚀 특징

- **다양한 UI 컴포넌트**: Button, Badge, Card, Input, Avatar 등
- **동적 테마 시스템**: 다크/라이트 테마 지원
- **커스텀 색상 팔레트**: 그라디언트 기반 색상 시스템
- **TypeScript 지원**: 완전한 타입 정의
- **Tailwind CSS 기반**: 유연한 스타일링

## 📦 설치

### npm 패키지로 설치 (권장)

```bash
npm install @weave/ui-components
```

### 로컬 개발용 설치

```bash
# 현재 프로젝트를 로컬 패키지로 링크
npm link

# 다른 프로젝트에서 사용
npm link @weave/ui-components
```

## 🎨 사용법

### 기본 설정

```tsx
import { ThemeProvider, Button, Badge } from "@weave/ui-components";

function App() {
  return (
    <ThemeProvider>
      <div>
        <Button variant="primary">Primary Button</Button>
        <Badge variant="primary">Primary Badge</Badge>
      </div>
    </ThemeProvider>
  );
}
```

### 테마 시스템 사용

```tsx
import {
  ThemeProvider,
  useTheme,
  ColorSelector,
  ThemeSelector,
} from "@weave/ui-components";

function MyApp() {
  return (
    <ThemeProvider>
      <div>
        <ThemeSelector />
        <ColorSelector />
        <MyComponents />
      </div>
    </ThemeProvider>
  );
}

function MyComponents() {
  const { currentTheme, currentColors } = useTheme();

  return (
    <div>
      <p>Current Theme: {currentTheme}</p>
      <p>Primary Color: {currentColors.primary}</p>
    </div>
  );
}
```

### Next.js에서 사용

```tsx
// app/layout.tsx
import { ClientThemeProvider } from "@weave/ui-components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
```

## 🎯 사용 가능한 컴포넌트

### 기본 컴포넌트

- `Button` - 다양한 variant와 크기 지원
- `Badge` - 상태 표시용 배지
- `Card` - 카드 레이아웃
- `Input` - 입력 필드
- `Avatar` - 사용자 아바타

### 레이아웃 컴포넌트

- `Navbar` - 네비게이션 바
- `Footer` - 푸터
- `Hero` - 히어로 섹션

### 테마 컴포넌트

- `ThemeSelector` - 테마 선택 (다크/라이트)
- `ColorSelector` - 색상 팔레트 선택

### 기타 컴포넌트

- `Status` - 상태 표시
- `Typography` - 텍스트 스타일
- `Carousel` - 캐러셀

## 🎨 테마 시스템

### 기본 테마

- **Dark Theme**: 어두운 배경, 밝은 텍스트
- **Light Theme**: 밝은 배경, 어두운 텍스트

### 색상 팔레트

- **Custom 1**: 청록색 계열 그라디언트
- **Custom 2**: 파랑색 계열 그라디언트
- **Custom 3**: 분홍색 계열 그라디언트

### 커스텀 색상 추가

```tsx
import { THEME_CONSTANTS } from "@weave/ui-components";

// 새로운 색상 팔레트 추가
const customPalette = {
  id: "custom4",
  name: "Custom 4",
  description: "보라색 계열 그라디언트",
  colors: {
    primary: "#8B5CF6",
    secondary: "#7C3AED",
    default: "#6D28D9",
  },
};

// THEME_CONSTANTS.colorPalettes에 추가
```

## 🔧 개발

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 로컬 패키지로 링크
npm run link
```

### 다른 프로젝트에서 테스트

```bash
# 1단계: 현재 프로젝트를 로컬 패키지로 링크
npm run link

# 2단계: 다른 프로젝트에서 사용
cd /path/to/your-other-project
npm link @weave/ui-components

# 3단계: Tailwind CSS 설정 추가
# tailwind.config.js의 content 배열에 다음 추가:
# "./node_modules/@weave/ui-components/src/**/*.{js,ts,jsx,tsx}"
```

### 새로운 색상 팔레트 추가

```bash
# 1. src/lib/theme/constants.ts에서 색상 팔레트 추가
# 2. src/lib/theme/types.ts에서 ColorPaletteId 타입 업데이트
# 3. 개발 서버 재시작
npm run dev
```

## 📝 라이센스

MIT License

## 🤝 기여

커스텀 색상 팔레트나 새로운 컴포넌트를 추가하고 싶으시면 언제든지 기여해주세요!
