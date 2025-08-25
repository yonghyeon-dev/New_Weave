// 테마별 상수 정의
export const THEME_CONSTANTS = {
  // 색상 팔레트
  colors: {
    // 기획서 인포그래픽 색상
    primary: {
      red: "#FF6B6B",
      teal: "#4ECDC4",
      blue: "#45B7D1",
      yellow: "#F7B801",
      darkTeal: "#1A535C",
      darkBlue: "#032D29",
    },
    // 그레이 스케일
    gray: {
      50: "#F8F9FA",
      100: "#F1F3F4",
      200: "#E9ECEF",
      300: "#DEE2E6",
      400: "#CED4DA",
      500: "#ADB5BD",
      600: "#6C757D",
      700: "#495057",
      800: "#343A40",
      900: "#212529",
    },
  },

  // 색상 팔레트 정의
  colorPalettes: [
    {
      id: "custom1",
      name: "Custom 1",
      description: "청록색 계열 그라디언트",
      colors: {
        primary: "#4ECDC4", // 청록색
        secondary: "#45B7D1", // 하늘색
        default: "#1A535C", // 진한 청록색
      },
      rgb: {
        primary: "78, 205, 196",
        secondary: "69, 183, 209",
        default: "26, 83, 92",
      },
    },
    {
      id: "custom2",
      name: "Custom 2",
      description: "파랑색 계열 그라디언트",
      colors: {
        primary: "#3B82F6", // 파랑색
        secondary: "#1D4ED8", // 진한 파랑색
        default: "#1E40AF", // 더 진한 파랑색
      },
      rgb: {
        primary: "59, 130, 246",
        secondary: "29, 78, 216",
        default: "30, 64, 175",
      },
    },
    {
      id: "custom3",
      name: "Custom 3",
      description: "분홍색 계열 그라디언트",
      colors: {
        primary: "#EC4899", // 분홍색
        secondary: "#DB2777", // 진한 분홍색
        default: "#BE185D", // 더 진한 분홍색
      },
      rgb: {
        primary: "236, 72, 153",
        secondary: "219, 39, 119",
        default: "190, 24, 93",
      },
    },
  ],

  // 간격 시스템
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
    "3xl": "3rem", // 48px
    "4xl": "4rem", // 64px
  },

  // 그림자 시스템
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },

  // 애니메이션
  transitions: {
    fast: "150ms ease-in-out",
    normal: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },

  // 반응형 브레이크포인트
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// 공통 스타일 클래스
export const COMMON_STYLES = {
  // 레이아웃
  container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-12 md:py-16 lg:py-20",

  // 카드 스타일
  card: {
    base: "bg-primary-surface rounded-xl shadow-lg border border-primary-borderSecondary",
    elevated:
      "bg-primary-surface rounded-xl shadow-xl border border-primary-borderSecondary hover:shadow-2xl transition-shadow duration-normal",
    outlined: "bg-transparent rounded-xl border-2 border-primary-border",
  },

  // 버튼 스타일
  button: {
    base: "inline-flex items-center justify-center font-medium transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    sizes: {
      sm: "px-3 py-1.5 text-xs rounded-md h-8",
      md: "px-4 py-2 text-sm rounded-lg h-10",
      lg: "px-6 py-3 text-base rounded-xl h-12",
    },
  },

  // 입력 필드 스타일
  input: {
    base: "w-full px-3 py-2 border border-primary-borderSecondary rounded-lg bg-primary-surface text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-border focus:border-transparent transition-all duration-fast",
  },

  // 타이포그래피
  typography: {
    h1: "text-4xl md:text-6xl font-black leading-tight",
    h2: "text-3xl md:text-4xl font-bold leading-tight",
    h3: "text-2xl md:text-3xl font-semibold leading-tight",
    h4: "text-xl md:text-2xl font-semibold leading-tight",
    h5: "text-lg md:text-xl font-medium leading-tight",
    h6: "text-base md:text-lg font-medium leading-tight",
    body: "text-base leading-relaxed",
    small: "text-sm leading-relaxed",
  },
} as const;

// 컴포넌트별 기본 props
export const COMPONENT_DEFAULTS = {
  button: {
    size: "md" as const,
    variant: "primary" as const,
  },
  card: {
    variant: "default" as const,
  },
  input: {
    size: "md" as const,
  },
  typography: {
    size: "base" as const,
    weight: "normal" as const,
  },
} as const;

// 유효성 검사 규칙
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9-+\s()]+$/,
  url: /^https?:\/\/.+/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
} as const;
