"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme/ThemeContext";
import type { ButtonVariant, ButtonSize } from "@/lib/theme/types";
import type { ButtonElementProps } from "@/lib/types/components";
import Tooltip from "./Tooltip";
import { Check } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
          Omit<ButtonElementProps, 'className' | 'id' | 'role' | 'aria-label' | 'aria-describedby'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  /** 자식 요소로 렌더링 */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      loading = false,
      disabled = false,
      fullWidth = false,
      asChild = false,
      disabledReason,
      loadingText,
      leftIcon,
      rightIcon,
      success = false,
      successText,
      ...props
    },
    ref
  ) => {
    const { currentColors } = useTheme();
    
    // 접근성 속성 설정
    const ariaProps = {
      'aria-disabled': disabled || loading,
      'aria-busy': loading,
      'aria-describedby': disabledReason ? `${props.id || 'button'}-description` : undefined,
      'aria-pressed': variant === 'secondary' && !disabled ? false : undefined,
    };

    const baseStyles = cn(
      "inline-flex items-center justify-center font-medium transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
      fullWidth && "w-full"
    );

    const variants = {
      primary: cn(
        "bg-weave-primary text-white border border-transparent",
        "hover:bg-weave-primary-hover hover:-translate-y-0.5 hover:shadow-md",
        "focus:ring-weave-primary focus:ring-offset-2",
        success && "bg-status-success hover:bg-status-success"
      ),
      secondary: cn(
        "bg-transparent text-weave-primary border border-weave-primary",
        "hover:bg-weave-primary-light",
        "focus:ring-weave-primary focus:ring-offset-2",
        success && "border-status-success text-status-success hover:bg-green-50"
      ),
      ghost: cn(
        "bg-transparent text-txt-primary border border-transparent",
        "hover:bg-bg-secondary hover:text-txt-primary",
        "focus:ring-weave-primary focus:ring-offset-2",
        success && "text-status-success hover:bg-green-50"
      ),
      danger: cn(
        "bg-status-error text-white border border-status-error",
        "hover:bg-red-600 hover:border-red-600",
        "focus:ring-red-500 focus:ring-offset-2",
        "shadow-sm"
      ),
      outline: cn(
        "bg-transparent text-txt-secondary border border-border-medium",
        "hover:border-weave-primary hover:text-weave-primary",
        "focus:ring-weave-primary focus:ring-offset-2",
        success && "border-status-success text-status-success hover:border-status-success"
      ),
      gradient: cn(
        "bg-gradient-to-r from-weave-primary to-weave-primary-hover text-white border border-transparent",
        "hover:from-weave-primary-hover hover:to-weave-primary hover:-translate-y-0.5 hover:shadow-md",
        "focus:ring-weave-primary focus:ring-offset-2",
        success && "from-status-success to-green-500 hover:from-green-500 hover:to-status-success"
      ),
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-md h-8",
      md: "px-4 py-2 text-sm rounded-lg h-10",
      lg: "px-6 py-3 text-base rounded-xl h-12",
    };

    // Weave 디자인 시스템 - 단순화된 스타일
    const getDynamicStyles = () => {
      const styles: React.CSSProperties = {};
      
      // Weave 디자인 시스템에서는 단일 브랜드 컬러(Teal) 사용
      // 복잡한 그라데이션 대신 깔끔한 단색 스타일 적용
      return styles;
    };

    const buttonProps = {
      className: cn(baseStyles, variants[variant], sizes[size], className),
      style: getDynamicStyles(),
      ref,
      disabled: disabled || loading,
      ...ariaProps,
      ...props,
    };

    if (asChild) {
      return React.cloneElement(children as React.ReactElement, buttonProps);
    }

    // 버튼 상태에 따른 컨텐츠 결정
    const getButtonContent = () => {
      if (success) {
        return (
          <>
            <Check className="w-4 h-4 mr-2" />
            {successText || children}
          </>
        );
      }

      if (loading) {
        return (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText || children}
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

    const buttonElement = (
      <button {...buttonProps}>
        {getButtonContent()}
      </button>
    );

    // 비활성 상태일 때 이유가 제공되면 툴팁과 스크린 리더용 설명 추가
    if (disabled && disabledReason) {
      return (
        <>
          <Tooltip content={disabledReason} position="top">
            {buttonElement}
          </Tooltip>
          <span 
            id={`${props.id || 'button'}-description`} 
            className="sr-only"
          >
            {disabledReason}
          </span>
        </>
      );
    }

    return buttonElement;
  }
);

Button.displayName = "Button";

export default Button;
