"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme/ThemeContext";

export interface BadgeProps {
  variant?: "primary" | "secondary" | "accent" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = "primary", size = "md", children, className }, ref) => {
    const { currentColors } = useTheme();

    const variants = {
      primary: "text-white",
      secondary: "text-white",
      accent: "text-white",
      outline: "border text-text-primary",
      destructive: "bg-status-error text-white",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-sm",
      lg: "px-3 py-1 text-base",
    };

    // 동적 스타일 생성
    const getDynamicStyles = () => {
      const styles: React.CSSProperties = {};

      switch (variant) {
        case "primary":
          styles.background = `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary}, ${currentColors.default})`;
          styles.borderColor = currentColors.primary;
          break;
        case "secondary":
          styles.background = `linear-gradient(135deg, ${currentColors.secondary}, ${currentColors.default}, ${currentColors.primary})`;
          styles.borderColor = currentColors.secondary;
          break;
        case "accent":
          styles.background = `linear-gradient(135deg, ${currentColors.default}, ${currentColors.primary}, ${currentColors.secondary})`;
          styles.borderColor = currentColors.default;
          break;
        case "outline":
          styles.borderColor = currentColors.primary;
          styles.color = currentColors.primary;
          break;
        case "destructive":
          // destructive는 기존 스타일 유지
          break;
      }

      return styles;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md font-medium",
          variants[variant],
          sizes[size],
          className
        )}
        style={getDynamicStyles()}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
