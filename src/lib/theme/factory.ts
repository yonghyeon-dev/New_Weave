import { cn } from "@/lib/utils";
import { COMMON_STYLES, COMPONENT_DEFAULTS } from "./constants";
import type { ButtonVariant, ButtonSize, CardVariant } from "./types";

// 버튼 스타일 팩토리
export const createButtonStyles = (
  variant: ButtonVariant = COMPONENT_DEFAULTS.button.variant,
  size: ButtonSize = COMPONENT_DEFAULTS.button.size,
  className?: string
) => {
  const baseStyles = cn(COMMON_STYLES.button.base, className);

  const variants = {
    primary: cn(
      "bg-primary-border text-primary-background border border-primary-border",
      "hover:bg-white hover:border-white hover:text-primary-background",
      "focus:ring-primary-border focus:ring-offset-primary-background",
      "shadow-sm"
    ),
    secondary: cn(
      "bg-transparent text-text-secondary border border-transparent",
      "hover:bg-primary-surfaceHover hover:text-text-primary hover:border-primary-borderSecondary",
      "focus:ring-text-secondary focus:ring-offset-primary-background"
    ),
    ghost: cn(
      "bg-transparent text-text-secondary border border-transparent",
      "hover:bg-primary-surfaceHover hover:text-text-primary",
      "focus:ring-text-secondary focus:ring-offset-primary-background"
    ),
    danger: cn(
      "bg-status-error text-white border border-status-error",
      "hover:bg-red-600 hover:border-red-600",
      "focus:ring-status-error focus:ring-offset-primary-background",
      "shadow-sm"
    ),
    outline: cn(
      "bg-transparent text-text-secondary border border-primary-borderSecondary",
      "hover:bg-primary-surfaceHover hover:text-text-primary hover:border-primary-border",
      "focus:ring-text-secondary focus:ring-offset-primary-background"
    ),
    gradient: cn(
      "bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white border border-transparent",
      "hover:from-[#ff5252] hover:to-[#26a69a]",
      "focus:ring-[#FF6B6B] focus:ring-offset-primary-background",
      "shadow-sm"
    ),
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md h-8",
    md: "px-4 py-2 text-sm rounded-lg h-10",
    lg: "px-6 py-3 text-base rounded-xl h-12",
  };

  return cn(baseStyles, variants[variant], sizes[size]);
};

// 카드 스타일 팩토리
export const createCardStyles = (
  variant: CardVariant = COMPONENT_DEFAULTS.card.variant,
  className?: string,
  interactive: boolean = false
) => {
  const variants = {
    default: COMMON_STYLES.card.base,
    elevated: COMMON_STYLES.card.elevated,
    outlined: COMMON_STYLES.card.outlined,
  };

  const baseClass = variants[variant];
  const interactiveClass = interactive ? "card-interactive" : "";

  return cn(baseClass, interactiveClass, className);
};

// 입력 필드 스타일 팩토리
export const createInputStyles = (
  size: "sm" | "md" | "lg" = COMPONENT_DEFAULTS.input.size,
  className?: string
) => {
  const sizes = {
    sm: "px-2 py-1 text-sm rounded-md",
    md: "px-3 py-2 text-base rounded-lg",
    lg: "px-4 py-3 text-lg rounded-xl",
  };

  return cn(COMMON_STYLES.input.base, sizes[size], className);
};

// 타이포그래피 스타일 팩토리
export const createTypographyStyles = (
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "small",
  className?: string
) => {
  return cn(COMMON_STYLES.typography[variant], className);
};

// 레이아웃 스타일 팩토리
export const createLayoutStyles = {
  container: (className?: string) => cn(COMMON_STYLES.container, className),
  section: (className?: string) => cn(COMMON_STYLES.section, className),
  grid: (
    cols: 1 | 2 | 3 | 4 | 6 | 12,
    gap: "sm" | "md" | "lg" = "md",
    className?: string
  ) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
      12: "grid-cols-6 md:grid-cols-12",
    };

    const gaps = {
      sm: "gap-2",
      md: "gap-4 md:gap-6",
      lg: "gap-6 md:gap-8",
    };

    return cn("grid", gridCols[cols], gaps[gap], className);
  },
  flex: (
    direction: "row" | "col" = "row",
    align: "start" | "center" | "end" = "start",
    justify: "start" | "center" | "end" | "between" = "start",
    className?: string
  ) => {
    const directions = {
      row: "flex-row",
      col: "flex-col",
    };

    const aligns = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    };

    const justifies = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    };

    return cn(
      "flex",
      directions[direction],
      aligns[align],
      justifies[justify],
      className
    );
  },
};

// 상태별 스타일 팩토리
export const createStateStyles = {
  loading: "opacity-50 cursor-not-allowed",
  disabled: "opacity-50 cursor-not-allowed",
  error: "border-status-error focus:ring-status-error",
  success: "border-status-success focus:ring-status-success",
  warning: "border-status-warning focus:ring-status-warning",
};

// 반응형 스타일 팩토리
export const createResponsiveStyles = {
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
