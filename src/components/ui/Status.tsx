import React from "react";
import { cn } from "@/lib/utils";
import type { StatusType, StatusVariant } from "@/lib/theme/types";

export interface StatusProps {
  type: StatusType;
  variant?: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const Status = React.forwardRef<HTMLDivElement, StatusProps>(
  ({ type, variant = "badge", children, className }, ref) => {
    const baseStyles = "inline-flex items-center font-medium";

    const variants = {
      badge: "px-2 py-1 text-xs rounded-md",
      pill: "px-3 py-1 text-sm rounded-full",
      dot: "flex items-center space-x-2 text-sm",
    };

    const colors = {
      success: {
        badge:
          "bg-status-success/10 text-status-success border border-status-success/20",
        pill: "bg-status-success/10 text-status-success",
        dot: "text-status-success",
      },
      warning: {
        badge:
          "bg-status-warning/10 text-status-warning border border-status-warning/20",
        pill: "bg-status-warning/10 text-status-warning",
        dot: "text-status-warning",
      },
      error: {
        badge:
          "bg-status-error/10 text-status-error border border-status-error/20",
        pill: "bg-status-error/10 text-status-error",
        dot: "text-status-error",
      },
      info: {
        badge:
          "bg-status-info/10 text-status-info border border-status-info/20",
        pill: "bg-status-info/10 text-status-info",
        dot: "text-status-info",
      },
      progress: {
        badge:
          "bg-status-progress/10 text-status-progress border border-status-progress/20",
        pill: "bg-status-progress/10 text-status-progress",
        dot: "text-status-progress",
      },
    };

    const dotColors = {
      success: "bg-status-success",
      warning: "bg-status-warning",
      error: "bg-status-error",
      info: "bg-status-info",
      progress: "bg-status-progress",
    };

    if (variant === "dot") {
      return (
        <div ref={ref} className={cn(baseStyles, colors[type].dot, className)}>
          <div className={cn("w-2 h-2 rounded-full", dotColors[type])} />
          <span>{children}</span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          colors[type][variant],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Status.displayName = "Status";

export default Status;
