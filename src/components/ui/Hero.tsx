"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme/ThemeContext";
import { Button, Typography } from "./";

export interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  image?: string;
  imageAlt?: string;
  variant?: "default" | "centered" | "split";
  className?: string;
}

export interface HeroAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      title,
      subtitle,
      description,
      primaryAction,
      secondaryAction,
      image,
      imageAlt,
      variant = "default",
      className,
    },
    ref
  ) => {
    const { currentColors } = useTheme();

    const variants = {
      default: "text-left",
      centered: "text-center",
      split: "text-left",
    };

    const isSplit = variant === "split";

    return (
      <section
        ref={ref}
        className={cn("relative overflow-hidden py-20 lg:py-32", className)}
      >
        <div className="container mx-auto px-6">
          <div
            className={cn(
              "grid gap-12 items-center",
              isSplit ? "lg:grid-cols-2" : "max-w-4xl mx-auto",
              variants[variant]
            )}
          >
            {/* Content */}
            <div className={cn("space-y-8", isSplit && "lg:pr-12")}>
              {subtitle && (
                <Typography
                  variant="p"
                  size="lg"
                  color="accent"
                  weight="medium"
                  className="tracking-wide"
                >
                  {subtitle}
                </Typography>
              )}

              <div className="space-y-6">
                <Typography
                  variant="h1"
                  size="4xl"
                  weight="bold"
                  className="leading-tight"
                >
                  {title}
                </Typography>

                {description && (
                  <Typography
                    variant="p"
                    size="xl"
                    color="secondary"
                    className="max-w-2xl"
                  >
                    {description}
                  </Typography>
                )}
              </div>

              {/* Actions */}
              {(primaryAction || secondaryAction) && (
                <div
                  className={cn(
                    "flex flex-col sm:flex-row gap-4",
                    variant === "centered" && "justify-center"
                  )}
                >
                  {primaryAction && (
                    <Button 
                      variant={primaryAction.variant || "primary"} 
                      size="lg" 
                      onClick={() => window.location.href = primaryAction.href}
                    >
                      {primaryAction.label}
                    </Button>
                  )}
                  {secondaryAction && (
                    <Button 
                      variant={secondaryAction.variant || "secondary"} 
                      size="lg" 
                      onClick={() => window.location.href = secondaryAction.href}
                    >
                      {secondaryAction.label}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Image */}
            {image && (
              <div
                className={cn(
                  "relative",
                  isSplit ? "lg:order-2" : "mt-12 lg:mt-16"
                )}
              >
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary-surface to-primary-surfaceSecondary p-1">
                  <img
                    src={image}
                    alt={imageAlt || "Hero image"}
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>

                {/* Decorative elements */}
                <div
                  className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary}, ${currentColors.default})`,
                  }}
                ></div>
                <div
                  className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-20 blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${currentColors.secondary}, ${currentColors.default}, ${currentColors.primary})`,
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{
              background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary}, ${currentColors.default})`,
            }}
          ></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{
              background: `linear-gradient(135deg, ${currentColors.secondary}, ${currentColors.default}, ${currentColors.primary})`,
            }}
          ></div>
        </div>
      </section>
    );
  }
);

Hero.displayName = "Hero";

export default Hero;
