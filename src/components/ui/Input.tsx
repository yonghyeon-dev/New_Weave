import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, fullWidth = false, ...props },
    ref
  ) => {
    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          className={cn(
            "flex h-10 w-full rounded-lg border border-primary-borderSecondary bg-primary-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary",
            "focus:outline-none focus:ring-2 focus:ring-primary-border focus:ring-offset-2 focus:ring-offset-primary-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-status-error focus:ring-status-error",
            className
          )}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={cn(
              "text-xs",
              error ? "text-status-error" : "text-text-secondary"
            )}
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
