import { THEME_CONSTANTS } from "./constants";

// 테마별 색상 유틸리티
export const themeUtils = {
  // 색상 변환
  hexToRgb: (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  // 색상 밝기 계산
  getBrightness: (hex: string) => {
    const rgb = themeUtils.hexToRgb(hex);
    if (!rgb) return 0;
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  },

  // 대비 색상 결정
  getContrastColor: (hex: string) => {
    const brightness = themeUtils.getBrightness(hex);
    return brightness > 128 ? "#000000" : "#ffffff";
  },

  // 색상 투명도 추가
  addOpacity: (hex: string, opacity: number) => {
    const rgb = themeUtils.hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  },

  // 그라데이션 생성
  createGradient: (
    from: string,
    to: string,
    direction:
      | "to-r"
      | "to-l"
      | "to-t"
      | "to-b"
      | "to-tr"
      | "to-tl"
      | "to-br"
      | "to-bl" = "to-r"
  ) => {
    return `bg-gradient-${direction} from-[${from}] to-[${to}]`;
  },

  // 기획서 색상 가져오기
  getWeaveColor: (colorName: keyof typeof THEME_CONSTANTS.colors.primary) => {
    return THEME_CONSTANTS.colors.primary[colorName];
  },

  // 그레이 색상 가져오기
  getGrayColor: (level: keyof typeof THEME_CONSTANTS.colors.gray) => {
    return THEME_CONSTANTS.colors.gray[level];
  },
};

// 반응형 유틸리티
export const responsiveUtils = {
  // 브레이크포인트 체크
  isMobile: () => typeof window !== "undefined" && window.innerWidth < 768,
  isTablet: () =>
    typeof window !== "undefined" &&
    window.innerWidth >= 768 &&
    window.innerWidth < 1024,
  isDesktop: () => typeof window !== "undefined" && window.innerWidth >= 1024,

  // 반응형 클래스 생성
  getResponsiveClass: (
    baseClass: string,
    responsive: Record<string, string>
  ) => {
    return Object.entries(responsive).reduce((acc, [breakpoint, className]) => {
      return `${acc} ${breakpoint}:${className}`;
    }, baseClass);
  },

  // 숨김/표시 클래스
  hidden: {
    sm: "hidden sm:block",
    md: "hidden md:block",
    lg: "hidden lg:block",
    xl: "hidden xl:block",
  },
  visible: {
    sm: "block sm:hidden",
    md: "block md:hidden",
    lg: "block lg:hidden",
    xl: "block xl:hidden",
  },
  text: {
    sm: "text-sm md:text-base",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
    xl: "text-xl md:text-2xl",
  },
};

// 애니메이션 유틸리티
export const animationUtils = {
  // 애니메이션 지연 시간 계산
  getDelay: (index: number, baseDelay: number = 100) => {
    return index * baseDelay;
  },

  // 스태거 애니메이션 클래스 생성
  getStaggerClass: (index: number, baseDelay: number = 100) => {
    return `animate-delay-${animationUtils.getDelay(index, baseDelay)}`;
  },

  // 애니메이션 타입별 클래스
  types: {
    fade: "animate-fade-in",
    slide: "animate-slide-in",
    scale: "animate-scale-in",
    bounce: "animate-bounce-in",
  },

  // 애니메이션 지속시간
  durations: {
    fast: "duration-150",
    normal: "duration-300",
    slow: "duration-500",
  },
};

// 레이아웃 유틸리티
export const layoutUtils = {
  // 그리드 컬럼 계산
  getGridCols: (items: number, maxCols: number = 4) => {
    const cols = Math.min(items, maxCols);
    return {
      sm: Math.min(cols, 1),
      md: Math.min(cols, 2),
      lg: Math.min(cols, 3),
      xl: cols,
    };
  },

  // 간격 계산
  getSpacing: (multiplier: number = 1) => {
    return `gap-${multiplier * 4}`;
  },

  // 컨테이너 클래스
  container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-12 md:py-16 lg:py-20",

  // 그리드 클래스
  grid: {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-6 md:grid-cols-12",
  },

  // 플렉스 클래스
  flex: {
    row: "flex-row",
    col: "flex-col",
    center: "items-center justify-center",
    between: "justify-between",
    start: "justify-start",
    end: "justify-end",
  },
};

// 접근성 유틸리티
export const accessibilityUtils = {
  // ARIA 라벨 생성
  generateAriaLabel: (element: string, context?: string) => {
    return context ? `${element} ${context}` : element;
  },

  // 포커스 관리
  focusFirstElement: (containerRef: React.RefObject<HTMLElement>) => {
    if (containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  },

  // 키보드 네비게이션
  handleKeyboardNavigation: (
    event: React.KeyboardEvent,
    onEnter?: () => void,
    onEscape?: () => void,
    onArrowUp?: () => void,
    onArrowDown?: () => void
  ) => {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        onEnter?.();
        break;
      case "Escape":
        event.preventDefault();
        onEscape?.();
        break;
      case "ArrowUp":
        event.preventDefault();
        onArrowUp?.();
        break;
      case "ArrowDown":
        event.preventDefault();
        onArrowDown?.();
        break;
    }
  },
};

// 상태 유틸리티
export const stateUtils = {
  // 로딩 상태 클래스
  loading: "opacity-50 cursor-not-allowed",
  disabled: "opacity-50 cursor-not-allowed",

  // 상태별 테두리 클래스
  error: "border-status-error focus:ring-status-error",
  success: "border-status-success focus:ring-status-success",
  warning: "border-status-warning focus:ring-status-warning",

  // 상태별 색상 클래스
  colors: {
    error: "text-status-error",
    success: "text-status-success",
    warning: "text-status-warning",
    info: "text-status-info",
  },
};

// 컴포넌트 조합 유틸리티
export const componentUtils = {
  // 클래스 조합
  combineClasses: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(" ");
  },

  // 조건부 클래스
  conditionalClass: (
    condition: boolean,
    trueClass: string,
    falseClass?: string
  ) => {
    return condition ? trueClass : falseClass || "";
  },

  // 반응형 클래스 생성
  responsiveClass: (baseClass: string, responsive: Record<string, string>) => {
    return Object.entries(responsive).reduce((acc, [breakpoint, className]) => {
      return `${acc} ${breakpoint}:${className}`;
    }, baseClass);
  },
};
