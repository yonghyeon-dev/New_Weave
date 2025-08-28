"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "secondary-dark" | "filled-secondary" | "outline" | "ghost" | "destructive" | "positive" | "negative" | "notice" | "information" | "neutral" | "inverse-secondary" | "inverse-primary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      disabled = false,
      fullWidth = false,
      loading = false,
      success = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    // 기본 스타일 - 홈화면과 동일한 매력적인 호버효과 적용
    const baseStyles = cn(
      "inline-flex items-center justify-center font-medium rounded-lg",
      "transition-all duration-300 ease-in-out", // 홈화면과 동일한 부드러운 전환
      "transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg", // 홈화면과 동일한 움직임 효과
      "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
      "disabled:transform-none disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none", // disabled 시 호버효과 비활성화
      fullWidth && "w-full"
    );

    // 변형별 스타일 - 홈화면의 색상 변경 효과와 그림자 효과 통합
    const variants = {
      // 브랜드 변형 - 홈화면과 동일한 색상 전환 효과
      primary: cn(
        "bg-weave-primary text-white border border-transparent",
        "hover:bg-weave-primary-hover hover:shadow-weave-primary/25", // 그림자에 브랜드 색상 적용
        "focus:ring-weave-primary"
      ),
      secondary: cn(
        "bg-transparent text-txt-secondary border-2 border-border-medium", // WEAVE 디자인 시스템 표준: 중성적 회색 초기 상태
        "hover:border-weave-primary hover:text-weave-primary", // WEAVE 디자인 시스템 표준: 브랜드 컬러 포인트 전환
        "hover:shadow-md", // WEAVE 디자인 시스템 표준: 미묘한 그림자 효과
        "focus:ring-weave-primary"
      ),
      "secondary-dark": cn(
        "bg-transparent text-white border-2 border-white/80", // 어두운 배경용: 반투명 흰색 테두리 + 흰색 텍스트
        "hover:bg-white hover:text-weave-primary hover:border-white", // 디자인 시스템 표준: 배경 채우기 + 브랜드 컬러 텍스트 전환
        "hover:shadow-lg", // 어두운 배경에서 돋보이는 그림자
        "focus:ring-white"
      ),
      "filled-secondary": cn(
        "bg-transparent text-weave-primary border-2 border-weave-primary", // 강력한 액션용: 프라이머리 색상
        "hover:bg-weave-primary hover:text-white hover:border-weave-primary", // 강력한 배경 채우기 전환
        "hover:shadow-weave-primary/25", // 강력한 그림자
        "focus:ring-weave-primary"
      ),
      outline: cn(
        "bg-transparent text-txt-secondary border-2 border-border-medium", // 표준 회색 테두리 + 회색 텍스트
        "hover:border-weave-primary hover:text-weave-primary", // 미묘한 포인트 색상 전환 (홈화면 표준)
        "hover:shadow-md", // 미묘한 그림자
        "focus:ring-weave-primary"
      ),
      ghost: cn(
        "bg-transparent text-txt-primary border border-transparent",
        "hover:bg-bg-secondary hover:text-txt-primary hover:shadow-md",
        "focus:ring-weave-primary"
      ),
      destructive: cn(
        "bg-status-error text-white border border-status-error",
        "hover:bg-red-700 hover:border-red-700 hover:shadow-red-500/25",
        "focus:ring-red-500"
      ),
      
      // 의미론적 변형 - 통합된 디자인 시스템 아키텍처 적용
      positive: cn(
        "bg-green-600 text-white border-2 border-green-600",
        "hover:bg-green-700 hover:border-green-700 hover:shadow-green-500/25", // 테두리 색상 동시 전환
        "focus:ring-green-500"
      ),
      negative: cn(
        "bg-red-600 text-white border-2 border-red-600", 
        "hover:bg-red-700 hover:border-red-700 hover:shadow-red-500/25", // 테두리 색상 동시 전환
        "focus:ring-red-500"
      ),
      notice: cn(
        "bg-orange-500 text-white border-2 border-orange-500",
        "hover:bg-orange-600 hover:border-orange-600 hover:shadow-orange-500/25", // 테두리 색상 동시 전환
        "focus:ring-orange-500"
      ),
      information: cn(
        "bg-blue-600 text-white border-2 border-blue-600",
        "hover:bg-blue-700 hover:border-blue-700 hover:shadow-blue-500/25", // 테두리 색상 동시 전환
        "focus:ring-blue-500"
      ),
      neutral: cn(
        "bg-gray-500 text-white border-2 border-gray-500",
        "hover:bg-gray-600 hover:border-gray-600 hover:shadow-gray-500/25", // 테두리 색상 동시 전환
        "focus:ring-gray-500"
      ),
      
      // 특수 컨텍스트용 변형
      "inverse-secondary": cn(
        "bg-transparent text-white border-2 border-white", // 어두운 배경용: 흰색 테두리 + 흰색 텍스트
        "hover:bg-white hover:text-weave-primary", // 디자인 시스템 표준: 배경 채우기 + 브랜드 컬러 텍스트
        "hover:shadow-lg", // 어두운 배경에서 돋보이는 그림자
        "focus:ring-white"
      ),
      "inverse-primary": cn(
        "bg-white text-weave-primary border-2 border-white", // 어두운 배경용: 흰색 배경 + 브랜드 컬러 텍스트
        "hover:bg-gray-100 hover:text-weave-primary-hover", // 디자인 시스템 표준: 미묘한 배경 변화
        "hover:shadow-lg", // 어두운 배경에서 돋보이는 그림자
        "focus:ring-white"
      ),
    };

    // 크기별 스타일
    const sizes = {
      sm: "px-3 py-1.5 text-xs h-8",
      md: "px-4 py-2 text-sm h-10",
      lg: "px-6 py-3 text-base h-12",
    };

    // 버튼 콘텐츠 렌더링
    const renderContent = () => {
      if (success) {
        return (
          <>
            <Check className="w-4 h-4 mr-2" />
            {children}
          </>
        );
      }

      if (loading) {
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {children}
          </>
        );
      }

      return (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      );
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className // className이 마지막에 오므로 모든 기본 스타일을 오버라이드 가능
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
