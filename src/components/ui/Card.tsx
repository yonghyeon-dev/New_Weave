import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CardVariant } from "@/lib/theme/types";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
  interactive?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", children, interactive = false, ...props },
    ref
  ) => {
    const variants = {
      default:
        "bg-transparent border border-primary-borderSecondary rounded-lg",
      elevated:
        "bg-primary-surface border border-primary-borderSecondary rounded-lg shadow-sm",
      outlined: "bg-transparent border-2 border-primary-border rounded-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-fast",
          variants[variant],
          interactive && "card-interactive",
          className
        )}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "button" : "article"}
        {...(interactive && {
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              (e.currentTarget as HTMLElement).click();
            }
          }
        })}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, alt, fill = true, ...props }, ref) => (
    <div className="relative w-full h-48">
      <Image
        ref={ref}
        className={cn("object-cover rounded-t-lg", className)}
        alt={alt}
        fill={fill}
        {...props}
      />
    </div>
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
);

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-text-secondary", className)}
    {...props}
  >
    {children}
  </p>
));

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";
CardImage.displayName = "CardImage";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardImage,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
