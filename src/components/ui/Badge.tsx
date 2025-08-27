"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  variant?: "primary" | "secondary" | "accent" | "outline" | "destructive" | "positive" | "negative" | "notice" | "information" | "neutral";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = "primary", size = "md", children, className }, ref) => {
    // 기본 스타일 - 모든 Badge에 공통 적용
    const baseStyles = "inline-flex items-center rounded-md font-medium transition-colors duration-200";

    // 변형별 스타일 - CSS 클래스만 사용, 인라인 스타일 완전 제거
    const variants = {
      // 브랜드 변형 - CSS 변수 기반
      primary: "bg-weave-primary text-white hover:bg-weave-primary-hover",
      secondary: "bg-weave-secondary text-white hover:opacity-90",
      accent: "bg-weave-accent text-white hover:opacity-90",
      outline: "border-2 border-weave-primary text-weave-primary bg-transparent hover:bg-weave-primary-light",
      destructive: "bg-status-error text-white hover:bg-red-700",
      
      // 의미론적 변형 - Semantic UI 표준
      positive: "bg-green-600 text-white hover:bg-green-700",
      negative: "bg-red-600 text-white hover:bg-red-700", 
      notice: "bg-orange-500 text-white hover:bg-orange-600",
      information: "bg-blue-600 text-white hover:bg-blue-700",
      neutral: "bg-gray-500 text-white hover:bg-gray-600",
    };

    // 크기별 스타일
    const sizes = {
      sm: "px-2 py-0.5 text-xs h-5",
      md: "px-2.5 py-0.5 text-sm h-6",
      lg: "px-3 py-1 text-base h-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className // className이 마지막에 오므로 모든 기본 스타일을 오버라이드 가능
        )}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
