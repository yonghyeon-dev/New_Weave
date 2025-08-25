# 커스텀 색상 팔레트 추가 가이드

Weave UI Components에서 새로운 색상 팔레트를 추가하는 방법을 설명합니다.

## 🎨 색상 팔레트 구조

각 색상 팔레트는 다음과 같은 구조를 가집니다:

```typescript
interface ColorPalette {
  id: string; // 고유 식별자
  name: string; // 표시될 이름
  description: string; // 설명
  colors: {
    primary: string; // 주 색상 (HEX 코드)
    secondary: string; // 보조 색상 (HEX 코드)
    default: string; // 기본 색상 (HEX 코드)
  };
}
```

## 📝 새로운 색상 팔레트 추가하기

### 1단계: 색상 팔레트 정의

`src/lib/theme/constants.ts` 파일에서 새로운 색상 팔레트를 추가합니다:

```typescript
// src/lib/theme/constants.ts

export const THEME_CONSTANTS = {
  colorPalettes: [
    // 기존 팔레트들...
    {
      id: "custom1",
      name: "Custom 1",
      description: "청록색 계열 그라디언트",
      colors: {
        primary: "#4ECDC4",
        secondary: "#45B7D1",
        default: "#1A535C",
      },
    },
    // 새로운 팔레트 추가
    {
      id: "custom4",
      name: "Custom 4",
      description: "보라색 계열 그라디언트",
      colors: {
        primary: "#8B5CF6",
        secondary: "#7C3AED",
        default: "#6D28D9",
      },
    },
    {
      id: "custom5",
      name: "Custom 5",
      description: "주황색 계열 그라디언트",
      colors: {
        primary: "#F97316",
        secondary: "#EA580C",
        default: "#C2410C",
      },
    },
  ],
  // ... 기타 상수들
};
```

### 2단계: 색상 팔레트 타입 업데이트

`src/lib/theme/types.ts` 파일에서 색상 팔레트 ID 타입을 업데이트합니다:

```typescript
// src/lib/theme/types.ts

export type ColorPaletteId =
  | "custom1"
  | "custom2"
  | "custom3"
  | "custom4" // 새로 추가
  | "custom5"; // 새로 추가
```

### 3단계: 기본 색상 팔레트 설정 (선택사항)

새로 추가한 색상 팔레트를 기본값으로 설정하려면:

```typescript
// src/lib/theme/ThemeContext.tsx

const [selectedPaletteId, setSelectedPaletteId] =
  useState<ColorPaletteId>("custom4"); // 기본값 변경
```

## 🎯 색상 팔레트 예제

### 보라색 계열

```typescript
{
  id: "purple-gradient",
  name: "Purple Gradient",
  description: "보라색 계열 그라디언트",
  colors: {
    primary: "#8B5CF6",
    secondary: "#7C3AED",
    default: "#6D28D9",
  },
}
```

### 녹색 계열

```typescript
{
  id: "green-gradient",
  name: "Green Gradient",
  description: "녹색 계열 그라디언트",
  colors: {
    primary: "#10B981",
    secondary: "#059669",
    default: "#047857",
  },
}
```

### 빨간색 계열

```typescript
{
  id: "red-gradient",
  name: "Red Gradient",
  description: "빨간색 계열 그라디언트",
  colors: {
    primary: "#EF4444",
    secondary: "#DC2626",
    default: "#B91C1C",
  },
}
```

### 노란색 계열

```typescript
{
  id: "yellow-gradient",
  name: "Yellow Gradient",
  description: "노란색 계열 그라디언트",
  colors: {
    primary: "#F59E0B",
    secondary: "#D97706",
    default: "#B45309",
  },
}
```

## 🔧 색상 팔레트 테스트

새로운 색상 팔레트를 추가한 후 테스트하는 방법:

1. 개발 서버 실행: `npm run dev`
2. 컴포넌트 페이지 방문: `http://localhost:3001/components`
3. 색상 선택기에서 새로운 팔레트 확인
4. 버튼, 배지 등에서 색상이 올바르게 적용되는지 확인

## 🎨 색상 팔레트 디자인 팁

### 그라디언트 효과를 위한 색상 선택

- **Primary**: 가장 밝은 색상 (버튼 배경)
- **Secondary**: 중간 밝기 색상 (그라디언트 중간)
- **Default**: 가장 어두운 색상 (그라디언트 끝)

### 접근성 고려사항

- 색상 대비가 충분한지 확인
- 색맹 사용자를 위한 대안 제공
- 텍스트 가독성 보장

### 브랜드 일관성

- 브랜드 가이드라인에 맞는 색상 선택
- 일관된 색상 톤 유지
- 감정적 연관성 고려

## 📚 추가 리소스

- [Color Theory Guide](https://www.smashingmagazine.com/2010/02/color-theory-for-designers-part-1-the-meaning-of-color/)
- [Accessible Color Combinations](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Color Tools](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors)
