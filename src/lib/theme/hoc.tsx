import React from "react";
import { cn } from "@/lib/utils";
import { createLayoutStyles, createStateStyles, createResponsiveStyles } from "./factory";

// 기본 컴포넌트 래퍼 HOC
export const withBaseComponent = <P extends object>(
  Component: React.ComponentType<P>,
  defaultClassName?: string
) => {
  return React.forwardRef<HTMLElement, P & { className?: string }>(
    ({ className, ...props }, ref) => {
      return (
        <Component
          ref={ref}
          className={cn(defaultClassName, className)}
          {...(props as P)}
        />
      );
    }
  );
};

// 컨테이너 HOC
export const withContainer = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<HTMLElement, P & { className?: string }>(
    ({ className, ...props }, ref) => {
      return (
        <Component
          ref={ref}
          className={createLayoutStyles.container(className)}
          {...(props as P)}
        />
      );
    }
  );
};

// 섹션 HOC
export const withSection = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<HTMLElement, P & { className?: string }>(
    ({ className, ...props }, ref) => {
      return (
        <Component
          ref={ref}
          className={createLayoutStyles.section(className)}
          {...(props as P)}
        />
      );
    }
  );
};

// 상태 관리 HOC
export const withState = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<
    HTMLElement,
    P & {
      className?: string;
      loading?: boolean;
      disabled?: boolean;
      error?: boolean;
      success?: boolean;
      warning?: boolean;
    }
  >(
    (
      { className, loading, disabled, error, success, warning, ...props },
      ref
    ) => {
      const stateClasses = [
        loading && createStateStyles.loading,
        disabled && createStateStyles.disabled,
        error && createStateStyles.error,
        success && createStateStyles.success,
        warning && createStateStyles.warning,
      ].filter(Boolean);

      return (
        <Component
          ref={ref}
          className={cn(className, ...stateClasses)}
          {...(props as P)}
        />
      );
    }
  );
};

// 반응형 HOC
export const withResponsive = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<
    HTMLElement,
    P & {
      className?: string;
      responsive?: {
        hidden?: "sm" | "md" | "lg" | "xl";
        visible?: "sm" | "md" | "lg" | "xl";
        text?: "sm" | "md" | "lg" | "xl";
      };
    }
  >(({ className, responsive, ...props }, ref) => {
    const responsiveClasses = [];

    if (responsive) {
      if (responsive.hidden) {
        responsiveClasses.push(
          createResponsiveStyles.hidden[responsive.hidden]
        );
      }
      if (responsive.visible) {
        responsiveClasses.push(
          createResponsiveStyles.visible[responsive.visible]
        );
      }
      if (responsive.text) {
        responsiveClasses.push(createResponsiveStyles.text[responsive.text]);
      }
    }

    return (
      <Component
        ref={ref}
        className={cn(className, ...responsiveClasses)}
        {...(props as P)}
      />
    );
  });
};

// 테마 인식 HOC
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<
    HTMLElement,
    P & {
      className?: string;
      theme?: "dark" | "white";
    }
  >(({ className, theme, ...props }, ref) => {
    const themeClasses = {
      dark: "dark",
      white: "light",
    };

    return (
      <Component
        ref={ref}
        className={cn(className, theme && themeClasses[theme])}
        data-theme={theme}
        {...(props as P)}
      />
    );
  });
};

// 접근성 HOC
export const withAccessibility = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<
    HTMLElement,
    P & {
      className?: string;
      "aria-label"?: string;
      "aria-describedby"?: string;
      "aria-hidden"?: boolean;
      role?: string;
      tabIndex?: number;
    }
  >(({ className, ...props }, ref) => {
    return <Component ref={ref} className={cn(className)} {...(props as P)} />;
  });
};

// 애니메이션 HOC
export const withAnimation = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<
    HTMLElement,
    P & {
      className?: string;
      animation?: {
        type?: "fade" | "slide" | "scale" | "bounce";
        duration?: "fast" | "normal" | "slow";
        delay?: number;
      };
    }
  >(({ className, animation, ...props }, ref) => {
    const animationClasses = [];

    if (animation) {
      const { type = "fade", duration = "normal", delay } = animation;

      const animations = {
        fade: "animate-fade-in",
        slide: "animate-slide-in",
        scale: "animate-scale-in",
        bounce: "animate-bounce-in",
      };

      const durations = {
        fast: "duration-150",
        normal: "duration-300",
        slow: "duration-500",
      };

      animationClasses.push(animations[type], durations[duration]);

      if (delay) {
        animationClasses.push(`delay-${delay}`);
      }
    }

    return (
      <Component
        ref={ref}
        className={cn(className, ...animationClasses)}
        {...(props as P)}
      />
    );
  });
};

// 조합 HOC (여러 HOC를 조합)
export const composeHOCs = (
  ...hocs: Array<
    (Component: React.ComponentType<any>) => React.ComponentType<any>
  >
) => {
  return (Component: React.ComponentType<any>) => {
    return hocs.reduce(
      (WrappedComponent, hoc) => hoc(WrappedComponent),
      Component
    );
  };
};

// 자주 사용되는 조합들
export const withCommonProps = composeHOCs(
  withBaseComponent,
  withState,
  withAccessibility
);

export const withLayoutProps = composeHOCs(
  withContainer,
  withSection,
  withResponsive
);

export const withFullProps = composeHOCs(
  withBaseComponent,
  withState,
  withResponsive,
  withTheme,
  withAccessibility,
  withAnimation
);
