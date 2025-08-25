# Weave UI Components 설정 가이드

다른 프로젝트에서 Weave UI Components를 사용하기 위한 완전한 설정 가이드입니다.

## 📁 필요한 파일 복사

### 1. UI 컴포넌트 폴더 복사

```bash
# 다른 프로젝트의 src 폴더에서 실행
cp -r /path/to/weave/src/components/ui ./src/
cp -r /path/to/weave/src/lib/theme ./src/
cp /path/to/weave/src/lib/utils.ts ./src/lib/
```

### 2. 필요한 의존성 설치

```bash
# 필수 의존성
npm install clsx tailwind-merge

# 개발 의존성
npm install -D tailwindcss @tailwindcss/forms
```

## 🎨 CSS 설정

### 1. Tailwind CSS 초기화

```bash
npx tailwindcss init -p
```

### 2. tailwind.config.js 설정

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          background: "var(--primary-background)",
          surface: "var(--primary-surface)",
          border: "var(--primary-border)",
          surfaceHover: "var(--primary-surfaceHover)",
          borderSecondary: "var(--primary-borderSecondary)",
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
          progress: "var(--status-progress)",
        },
        accent: {
          yellow: "var(--accent-yellow)",
          orange: "var(--accent-orange)",
          blue: "var(--accent-blue)",
          purple: "var(--accent-purple)",
          green: "var(--accent-green)",
        },
      },
      fontFamily: {
        sans: ["Inter Variable", "system-ui", "sans-serif"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },
      borderRadius: {
        xl: "12px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
      },
    },
  },
  plugins: [],
};
```

### 3. globals.css 설정

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Weave UI Components 테마 변수 */
:root {
  /* Primary Colors */
  --primary-background: #08090a;
  --primary-surface: #262626;
  --primary-border: #e6e6e6;
  --primary-surfaceHover: #404040;
  --primary-borderSecondary: #525252;

  /* Text Colors */
  --text-primary: #f7f8f8;
  --text-secondary: #8a8f98;
  --text-tertiary: #62666d;

  /* Status Colors */
  --status-success: #68cc58;
  --status-warning: #f2994a;
  --status-error: #c52828;
  --status-info: #02b8cc;
  --status-progress: #6771c5;

  /* Accent Colors */
  --accent-yellow: #deb949;
  --accent-orange: #f2994a;
  --accent-blue: #67f1c5;
  --accent-purple: #b59aff;
  --accent-green: #68cc58;
}

/* White Theme */
[data-theme="white"] {
  --primary-background: #ffffff;
  --primary-surface: #f8f9fa;
  --primary-border: #e9ecef;
  --primary-surfaceHover: #e9ecef;
  --primary-borderSecondary: #dee2e6;

  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-tertiary: #adb5bd;
}

/* Dark Theme */
[data-theme="dark"] {
  --primary-background: #08090a;
  --primary-surface: #262626;
  --primary-border: #e6e6e6;
  --primary-surfaceHover: #404040;
  --primary-borderSecondary: #525252;

  --text-primary: #f7f8f8;
  --text-secondary: #8a8f98;
  --text-tertiary: #62666d;
}

/* Secondary 버튼 텍스트 색상 규칙 */
[data-theme="white"] button.bg-transparent {
  color: #111827;
}

[data-theme="dark"] button.bg-transparent {
  color: #ffffff;
}

/* 히어로 섹션 Secondary 버튼 텍스트 색상 규칙 */
[data-theme="white"] button.bg-transparent a {
  color: #111827;
}

[data-theme="dark"] button.bg-transparent a {
  color: #ffffff;
}

/* 기본 스타일 */
body {
  font-family: "Inter Variable", system-ui, sans-serif;
  background-color: var(--primary-background);
  color: var(--text-primary);
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--primary-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--text-tertiary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
```

## 🚀 데모 페이지 생성

### 1. 데모 페이지 컴포넌트 생성

```tsx
// src/app/components/page.tsx
"use client";

import { ClientThemeProvider } from "@/lib/theme/ClientThemeProvider";
import {
  Button,
  Badge,
  Input,
  Avatar,
  Navbar,
  Footer,
  Hero,
  Status,
  Typography,
  ColorSelector,
  ThemeSelector,
} from "@/components/ui";

export default function ComponentsPage() {
  return (
    <ClientThemeProvider>
      <div className="min-h-screen bg-primary-background text-text-primary">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Weave UI Components</h1>

          {/* 테마 선택기 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">테마 선택</h2>
            <div className="space-y-4">
              <ThemeSelector />
              <ColorSelector />
            </div>
          </section>

          {/* 버튼 컴포넌트 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">버튼 컴포넌트</h2>
            <div className="space-y-4">
              <div className="space-x-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="gradient">Gradient</Button>
              </div>
              <div className="space-x-4">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>
              <div className="space-x-4">
                <Button variant="primary" loading>
                  Loading
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </section>

          {/* 배지 컴포넌트 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">배지 컴포넌트</h2>
            <div className="space-y-4">
              <div className="space-x-4">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <div className="space-x-4">
                <Badge variant="primary" size="sm">
                  Small
                </Badge>
                <Badge variant="primary" size="md">
                  Medium
                </Badge>
                <Badge variant="primary" size="lg">
                  Large
                </Badge>
              </div>
            </div>
          </section>

          {/* 입력 필드 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">입력 필드</h2>
            <div className="space-y-4 max-w-md">
              <Input placeholder="이름을 입력하세요" />
              <Input placeholder="이메일을 입력하세요" type="email" />
              <Input placeholder="비밀번호를 입력하세요" type="password" />
              <Input placeholder="비활성화된 입력" disabled />
            </div>
          </section>

          {/* 아바타 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">아바타</h2>
            <div className="space-x-4">
              <Avatar size="sm">JD</Avatar>
              <Avatar size="md">JD</Avatar>
              <Avatar size="lg">JD</Avatar>
              <Avatar size="xl">JD</Avatar>
            </div>
          </section>

          {/* 상태 표시 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">상태 표시</h2>
            <div className="space-y-4">
              <div className="space-x-4">
                <Status type="success" variant="badge">
                  Success
                </Status>
                <Status type="warning" variant="badge">
                  Warning
                </Status>
                <Status type="error" variant="badge">
                  Error
                </Status>
                <Status type="info" variant="badge">
                  Info
                </Status>
                <Status type="progress" variant="badge">
                  Progress
                </Status>
              </div>
              <div className="space-x-4">
                <Status type="success" variant="pill">
                  Success
                </Status>
                <Status type="warning" variant="pill">
                  Warning
                </Status>
                <Status type="error" variant="pill">
                  Error
                </Status>
                <Status type="info" variant="pill">
                  Info
                </Status>
              </div>
              <div className="space-x-4">
                <Status type="success" variant="dot">
                  Online
                </Status>
                <Status type="warning" variant="dot">
                  Away
                </Status>
                <Status type="error" variant="dot">
                  Offline
                </Status>
                <Status type="info" variant="dot">
                  Busy
                </Status>
              </div>
            </div>
          </section>

          {/* 타이포그래피 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">타이포그래피</h2>
            <div className="space-y-4">
              <Typography variant="h1" size="4xl">
                큰 제목 (4XL)
              </Typography>
              <Typography variant="h2" size="3xl">
                중간 제목 (3XL)
              </Typography>
              <Typography variant="h3" size="2xl">
                작은 제목 (2XL)
              </Typography>
              <Typography variant="p" size="lg">
                본문 텍스트 (Large)
              </Typography>
              <Typography variant="p" size="base">
                기본 텍스트 (Base)
              </Typography>
              <Typography variant="p" size="sm">
                작은 텍스트 (Small)
              </Typography>
            </div>
          </section>

          {/* 히어로 섹션 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">히어로 섹션</h2>
            <Hero
              title="Weave UI Components"
              subtitle="커스터마이징 가능한 테마 시스템"
              description="다양한 UI 컴포넌트와 동적 테마 시스템을 제공합니다. 버튼, 배지, 입력 필드 등 다양한 컴포넌트를 사용하여 일관된 디자인을 구현할 수 있습니다."
              primaryAction={{
                label: "시작하기",
                href: "#",
              }}
              secondaryAction={{
                label: "문서 보기",
                href: "#",
              }}
            />
          </section>

          {/* 네비게이션 바 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">네비게이션 바</h2>
            <Navbar
              logo={{
                src: "/logo.png",
                alt: "Weave Logo",
              }}
              brandName="Weave"
              links={[
                { label: "Home", href: "#" },
                { label: "Features", href: "#" },
                { label: "Pricing", href: "#" },
                { label: "About", href: "#" },
                { label: "Contact", href: "#" },
              ]}
              actions={[
                { label: "Sign In", variant: "secondary" },
                { label: "Get Started", variant: "primary" },
              ]}
            />
          </section>

          {/* 푸터 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">푸터</h2>
            <Footer
              logo={{
                src: "/logo.png",
                alt: "Weave Logo",
              }}
              brandName="Weave"
              description="Building the future of collaborative design with powerful tools and seamless workflows."
              socialLinks={[
                { platform: "twitter", href: "#" },
                { platform: "github", href: "#" },
                { platform: "linkedin", href: "#" },
              ]}
              links={{
                product: [
                  { label: "Features", href: "#" },
                  { label: "Pricing", href: "#" },
                  { label: "Integrations", href: "#" },
                  { label: "API", href: "#" },
                ],
                company: [
                  { label: "About", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Press", href: "#" },
                ],
                support: [
                  { label: "Help Center", href: "#" },
                  { label: "Documentation", href: "#" },
                  { label: "Contact", href: "#" },
                  { label: "Status", href: "#" },
                ],
              }}
            />
          </section>
        </div>
      </div>
    </ClientThemeProvider>
  );
}
```

### 2. 레이아웃 설정

```tsx
// src/app/layout.tsx
import { ClientThemeProvider } from "@/lib/theme/ClientThemeProvider";
import "./globals.css";

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

### 3. 메인 페이지 설정

```tsx
// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-primary-background text-text-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">Weave UI Components</h1>
        <p className="text-xl text-text-secondary mb-8">
          커스터마이징 가능한 테마 시스템을 가진 React UI 컴포넌트 라이브러리
        </p>
        <Link
          href="/components"
          className="inline-block bg-primary-surface hover:bg-primary-surfaceHover text-text-primary px-8 py-4 rounded-xl font-medium transition-colors"
        >
          컴포넌트 보기
        </Link>
      </div>
    </div>
  );
}
```

## 🔧 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 메인 페이지를 확인하고, `http://localhost:3000/components`에서 데모 페이지를 확인할 수 있습니다.

## 📝 추가 설정 (선택사항)

### 1. Inter 폰트 추가

```tsx
// src/app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
```

### 2. 메타데이터 설정

```tsx
// src/app/layout.tsx
export const metadata = {
  title: "Weave UI Components",
  description:
    "커스터마이징 가능한 테마 시스템을 가진 React UI 컴포넌트 라이브러리",
};
```

이제 완전한 Weave UI Components 데모 페이지가 설정되었습니다! 🎉
