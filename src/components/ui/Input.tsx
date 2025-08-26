import React from "react";
import { cn } from "@/lib/utils";
import type { InputElementProps } from "@/lib/types/components";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
          Omit<InputElementProps, 'size' | 'className' | 'id' | 'role' | 'aria-label' | 'aria-describedby' | 'autoComplete'> {
  // 추가 Input 전용 props가 필요한 경우 여기에 정의
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, fullWidth = false, id, ...props },
    ref
  ) => {
    // 고유 ID 생성 (접근성을 위해) - Hooks 규칙 준수: 항상 같은 순서로 호출
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;
    
    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
            {props.required && (
              <span className="text-status-error ml-1" aria-label="필수">
                *
              </span>
            )}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-lg border border-primary-borderSecondary bg-primary-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary",
            "focus:outline-none focus:ring-2 focus:ring-primary-border focus:ring-offset-2 focus:ring-offset-primary-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-status-error focus:ring-status-error",
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={error ? errorId : helperId}
            className={cn(
              "text-xs",
              error ? "text-status-error" : "text-text-secondary"
            )}
            role={error ? "alert" : undefined}
            aria-live={error ? "polite" : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
