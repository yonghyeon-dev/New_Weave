import themeData from "./theme.json";
import type { Theme, ButtonVariant, StatusType, AccentColors } from "./types";

export const theme: Theme = themeData as Theme;

export const getColor = (path: string): string => {
  const keys = path.split(".");
  let value: unknown = theme;

  for (const key of keys) {
    if (typeof value === "object" && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      console.warn(`Color path "${path}" not found in theme`);
      return "#000000";
    }
  }

  return typeof value === "string" ? value : "#000000";
};

export const getStatusColor = (type: StatusType): string => {
  return theme.colors.status[type];
};

export const getAccentColor = (color: keyof AccentColors): string => {
  return theme.colors.accent[color];
};

export const getButtonStyles = (variant: ButtonVariant) => {
  return theme.components.button[variant];
};

export const getSpacing = (size: keyof Theme["spacing"]): string => {
  return theme.spacing[size];
};

export const getBorderRadius = (size: keyof Theme["borderRadius"]): string => {
  return theme.borderRadius[size];
};

export const getFontSize = (
  size: keyof Theme["typography"]["fontSize"]
): string => {
  return theme.typography.fontSize[size];
};

export const getFontWeight = (
  weight: keyof Theme["typography"]["fontWeight"]
): string => {
  return theme.typography.fontWeight[weight];
};

export const getTransition = (type: "fast" | "normal" | "slow"): string => {
  return theme.transitions[type];
};

export const getShadow = (size: keyof Theme["shadows"]): string => {
  return theme.shadows[size];
};

// CSS 변수로 테마를 적용하는 함수
export const getThemeCSSVariables = (): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key}`] = value;
  });

  Object.entries(theme.colors.text).forEach(([key, value]) => {
    cssVars[`--color-text-${key}`] = value;
  });

  Object.entries(theme.colors.status).forEach(([key, value]) => {
    cssVars[`--color-status-${key}`] = value;
  });

  Object.entries(theme.colors.accent).forEach(([key, value]) => {
    cssVars[`--color-accent-${key}`] = value;
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });

  // Font sizes
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value;
  });

  // Font weights
  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    cssVars[`--font-weight-${key}`] = value;
  });

  return cssVars;
};
