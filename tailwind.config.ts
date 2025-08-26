import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./weave_dev/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    // 반응형 브레이크포인트 재정의
    screens: {
      'xs': '320px',    // 모바일 최소 크기
      'sm': '640px',    // 모바일 가로/작은 태블릿
      'md': '768px',    // 태블릿
      'lg': '1024px',   // 작은 데스크톱
      'xl': '1280px',   // 데스크톱
      '2xl': '1440px',  // 큰 데스크톱
      // 컨테이너별 브레이크포인트
      'container': '1024px',  // 최대 컨테이너 너비
      'prose': '768px',       // 텍스트 콘텐츠 최적 너비
    },
    extend: {
      colors: {
        // Weave Design System Colors
        weave: {
          // Primary Brand Color: Weave Teal
          primary: "#4ECDC4",
          "primary-hover": "#3DB8B0",
          "primary-light": "#E0F7F5",
          "primary-dark": "#2A8A85",
        },
        // Background Colors
        bg: {
          primary: "#FFFFFF",
          secondary: "#F8F9FA", 
          tertiary: "#E9ECEF",
        },
        // Text Colors (high contrast for accessibility)
        txt: {
          primary: "#212529",    // 90% contrast
          secondary: "#495057",  // 70% contrast  
          tertiary: "#6C757D",   // 60% contrast
          disabled: "#ADB5BD",   // 40% contrast
        },
        // Border Colors
        border: {
          light: "#E9ECEF",
          medium: "#DEE2E6", 
          strong: "#CED4DA",
        },
        // Status Colors
        status: {
          success: "#28A745",
          warning: "#FFC107",
          error: "#DC3545",
          info: "#4ECDC4", // Reusing brand color
        },
        // Legacy support - using CSS variables for existing components
        primary: {
          background: "var(--color-primary-background)",
          surface: "var(--color-primary-surface)",
          surfaceSecondary: "var(--color-primary-surfaceSecondary)",
          surfaceHover: "var(--color-primary-surfaceHover)",
          surfacePressed: "var(--color-primary-surfacePressed)",
          border: "var(--color-primary-border)",
          borderSecondary: "var(--color-primary-borderSecondary)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          accent: "var(--color-text-accent)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
      },
      fontFamily: {
        primary: [
          "Inter Variable",
          "SF Pro Display",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Open Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: "13px",
        sm: "15px",
        base: "16px",
        lg: "21px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px",
        "4xl": "56px",
      },
      fontWeight: {
        normal: "400",
        medium: "510",
        semibold: "538",
        bold: "600",
      },
      lineHeight: {
        tight: "1.1",
        normal: "1.5",
        relaxed: "1.6",
      },
      letterSpacing: {
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px",
        "4xl": "64px",
        "5xl": "96px",
        "6xl": "128px",
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
        full: "9999px",
      },
      boxShadow: {
        none: "none",
        sm: "rgba(0, 0, 0, 0) 0px 8px 2px 0px, rgba(0, 0, 0, 0.01) 0px 5px 2px 0px, rgba(0, 0, 0, 0.04) 0px 3px 2px 0px, rgba(0, 0, 0, 0.07) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) 0px 0px 1px 0px",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
        "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
        "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "0.16s",
        normal: "0.2s",
        slow: "0.3s",
      },
      maxWidth: {
        container: "1024px",
        prose: "768px",
      },
      zIndex: {
        dropdown: "1000",
        overlay: "1010",
        modal: "1020",
        popover: "1030",
        tooltip: "1040",
      },
      backgroundImage: {
        "gradient-subtle":
          "linear-gradient(rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0) 20%)",
        "gradient-card":
          "linear-gradient(134deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0) 55%)",
        "gradient-text-fade":
          "linear-gradient(to right, rgb(247, 248, 248), rgba(0, 0, 0, 0) 80%)",
      },
    },
  },
  plugins: [],
};

export default config;
