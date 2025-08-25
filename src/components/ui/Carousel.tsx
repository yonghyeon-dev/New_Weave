"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export interface CarouselDotsProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
  className?: string;
}

export interface CarouselArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      className,
      autoPlay = false,
      interval = 3000,
      showDots = true,
      showArrows = true,
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const childrenArray = React.Children.toArray(children);

    const next = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % childrenArray.length);
    }, [childrenArray.length]);

    const previous = useCallback(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + childrenArray.length) % childrenArray.length
      );
    }, [childrenArray.length]);

    const goToSlide = useCallback((index: number) => {
      setCurrentIndex(index);
    }, []);

    React.useEffect(() => {
      if (!autoPlay) return;

      const timer = setInterval(next, interval);
      return () => clearInterval(timer);
    }, [autoPlay, interval, next]);

    return (
      <div ref={ref} className={cn("relative w-full", className)}>
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {childrenArray.map((child, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0"
                style={{ width: "100%" }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {showArrows && childrenArray.length > 1 && (
          <CarouselArrows onPrevious={previous} onNext={next} />
        )}

        {showDots && childrenArray.length > 1 && (
          <CarouselDots
            total={childrenArray.length}
            current={currentIndex}
            onDotClick={goToSlide}
          />
        )}
      </div>
    );
  }
);

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ children, className }, ref) => (
    <div ref={ref} className={cn("w-full", className)}>
      {children}
    </div>
  )
);

const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ total, current, onDotClick, className }, ref) => (
    <div
      ref={ref}
      className={cn("flex justify-center space-x-2 mt-4", className)}
    >
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-200",
            current === index
              ? "bg-primary-border"
              : "bg-primary-borderSecondary hover:bg-primary-border"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
);

const CarouselArrows = React.forwardRef<HTMLDivElement, CarouselArrowsProps>(
  ({ onPrevious, onNext, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 flex items-center justify-between p-4",
        className
      )}
    >
      <button
        onClick={onPrevious}
        className="w-10 h-10 rounded-full bg-primary-surface/80 backdrop-blur-sm border border-primary-borderSecondary flex items-center justify-center text-text-primary hover:bg-primary-surface transition-all duration-200"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={onNext}
        className="w-10 h-10 rounded-full bg-primary-surface/80 backdrop-blur-sm border border-primary-borderSecondary flex items-center justify-center text-text-primary hover:bg-primary-surface transition-all duration-200"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  )
);

Carousel.displayName = "Carousel";
CarouselItem.displayName = "CarouselItem";
CarouselDots.displayName = "CarouselDots";
CarouselArrows.displayName = "CarouselArrows";

export { Carousel, CarouselItem, CarouselDots, CarouselArrows };
