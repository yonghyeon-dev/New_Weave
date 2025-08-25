# Weave UI Components 설치 및 사용 가이드

다른 프로젝트에서 Weave UI Components를 설치하고 사용하는 방법을 설명합니다.

## 📦 설치 방법

### 1. 로컬 패키지로 설치 (개발 중)

현재 Weave UI Components가 개발 중이라면 로컬 패키지로 설치할 수 있습니다.

#### 1단계: Weave UI Components 프로젝트에서 링크 생성

```bash
# Weave UI Components 프로젝트 디렉토리에서
cd /path/to/weave-ui-components
npm link
```

#### 2단계: 다른 프로젝트에서 링크 설치

```bash
# 다른 프로젝트 디렉토리에서
cd /path/to/your-project
npm link @weave/ui-components
```

#### 3단계: 의존성 설치

```bash
# Tailwind CSS가 필요합니다
npm install tailwindcss @tailwindcss/forms
```

### 2. npm 패키지로 설치 (배포 후)

```bash
npm install @weave/ui-components
```

## 🎨 기본 설정

### Tailwind CSS 설정

`tailwind.config.js` 파일에 Weave UI Components의 스타일을 포함시킵니다:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@weave/ui-components/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Weave UI Components의 테마 설정
      colors: {
        primary: {
          background: "var(--primary-background)",
          surface: "var(--primary-surface)",
          border: "var(--primary-border)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          error: "var(--status-error)",
          info: "var(--status-info)",
        },
      },
    },
  },
  plugins: [],
};
```

### CSS 파일에 테마 변수 추가

`globals.css` 또는 메인 CSS 파일에 다음을 추가합니다:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Weave UI Components 테마 변수 */
:root {
  --primary-background: #08090a;
  --primary-surface: #262626;
  --primary-border: #e6e6e6;
  --text-primary: #f7f8f8;
  --text-secondary: #8a8f98;
  --text-tertiary: #62666d;
  --status-success: #68cc58;
  --status-warning: #f2994a;
  --status-error: #c52828;
  --status-info: #02b8cc;
}

[data-theme="white"] {
  --primary-background: #ffffff;
  --primary-surface: #f8f9fa;
  --primary-border: #e9ecef;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-tertiary: #adb5bd;
}
```

## 🚀 사용법

### 기본 사용

```tsx
import React from "react";
import { ThemeProvider, Button, Badge } from "@weave/ui-components";

function App() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <h1>Weave UI Components 사용 예제</h1>

        <div className="space-x-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Badge variant="primary">Primary Badge</Badge>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### Next.js에서 사용

#### app/layout.tsx (App Router)

```tsx
import { ClientThemeProvider } from "@weave/ui-components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
```

#### pages/\_app.tsx (Pages Router)

```tsx
import { ThemeProvider } from "@weave/ui-components";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

### 테마 시스템 사용

```tsx
import { useTheme, ThemeSelector, ColorSelector } from "@weave/ui-components";

function ThemeExample() {
  const { currentTheme, currentColors, setTheme, setSelectedPaletteId } =
    useTheme();

  return (
    <div className="p-8">
      <h2>테마 시스템</h2>

      {/* 테마 선택기 */}
      <div className="mb-4">
        <ThemeSelector />
        <ColorSelector />
      </div>

      {/* 현재 테마 정보 */}
      <div className="mb-4">
        <p>현재 테마: {currentTheme}</p>
        <p>Primary 색상: {currentColors.primary}</p>
        <p>Secondary 색상: {currentColors.secondary}</p>
      </div>

      {/* 프로그래밍 방식으로 테마 변경 */}
      <div className="space-x-2">
        <button onClick={() => setTheme("dark")}>다크 테마</button>
        <button onClick={() => setTheme("white")}>라이트 테마</button>
        <button onClick={() => setSelectedPaletteId("custom1")}>
          Custom 1
        </button>
        <button onClick={() => setSelectedPaletteId("custom2")}>
          Custom 2
        </button>
        <button onClick={() => setSelectedPaletteId("custom3")}>
          Custom 3
        </button>
      </div>
    </div>
  );
}
```

## 🎯 컴포넌트별 사용 예제

### Button 컴포넌트

```tsx
import { Button } from "@weave/ui-components";

function ButtonExample() {
  return (
    <div className="space-x-4">
      <Button variant="primary" size="sm">
        Small Primary
      </Button>
      <Button variant="secondary" size="md">
        Medium Secondary
      </Button>
      <Button variant="ghost" size="lg">
        Large Ghost
      </Button>
      <Button variant="danger">Danger Button</Button>
      <Button variant="gradient">Gradient Button</Button>
      <Button loading>Loading Button</Button>
      <Button disabled>Disabled Button</Button>
    </div>
  );
}
```

### Badge 컴포넌트

```tsx
import { Badge } from "@weave/ui-components";

function BadgeExample() {
  return (
    <div className="space-x-4">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}
```

### Input 컴포넌트

```tsx
import { Input } from "@weave/ui-components";

function InputExample() {
  return (
    <div className="space-y-4 max-w-md">
      <Input placeholder="이름을 입력하세요" />
      <Input placeholder="이메일을 입력하세요" type="email" />
      <Input placeholder="비밀번호를 입력하세요" type="password" />
      <Input placeholder="비활성화된 입력" disabled />
    </div>
  );
}
```

### Hero 컴포넌트

```tsx
import { Hero } from "@weave/ui-components";

function HeroExample() {
  return (
    <Hero
      title="Weave UI Components"
      subtitle="커스터마이징 가능한 테마 시스템"
      description="다양한 UI 컴포넌트와 동적 테마 시스템을 제공합니다."
      primaryAction={{
        label: "시작하기",
        href: "/get-started",
      }}
      secondaryAction={{
        label: "문서 보기",
        href: "/docs",
      }}
    />
  );
}
```

## 🔧 커스터마이징

### 커스텀 색상 팔레트 추가

```tsx
import { THEME_CONSTANTS } from "@weave/ui-components";

// 새로운 색상 팔레트 정의
const customPalette = {
  id: "my-custom-palette",
  name: "My Custom Palette",
  description: "내가 만든 커스텀 색상",
  colors: {
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    default: "#45B7D1",
  },
};

// THEME_CONSTANTS.colorPalettes에 추가
THEME_CONSTANTS.colorPalettes.push(customPalette);
```

### 컴포넌트 스타일 오버라이드

```tsx
import { Button } from "@weave/ui-components";

function CustomButton() {
  return (
    <Button
      variant="primary"
      className="bg-red-500 hover:bg-red-600 text-white"
    >
      커스텀 스타일 버튼
    </Button>
  );
}
```

## 🐛 문제 해결

### 컴포넌트가 렌더링되지 않는 경우

1. **ThemeProvider 확인**: 모든 컴포넌트가 ThemeProvider로 감싸져 있는지 확인
2. **Tailwind CSS 설정 확인**: content 배열에 @weave/ui-components 경로가 포함되어 있는지 확인
3. **의존성 확인**: React와 React-DOM이 올바른 버전으로 설치되어 있는지 확인

### 스타일이 적용되지 않는 경우

1. **CSS 변수 확인**: globals.css에 테마 변수가 정의되어 있는지 확인
2. **Tailwind CSS 빌드**: `npm run build` 또는 개발 서버 재시작
3. **브라우저 캐시**: 브라우저 캐시 삭제 후 새로고침

### TypeScript 오류가 발생하는 경우

1. **타입 정의 확인**: @types/react가 설치되어 있는지 확인
2. **tsconfig.json 설정**: moduleResolution이 "node"로 설정되어 있는지 확인

## 📚 추가 리소스

- [Weave UI Components GitHub](https://github.com/your-username/weave-ui-components)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [React 문서](https://react.dev/)
- [Next.js 문서](https://nextjs.org/docs)
