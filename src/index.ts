// UI Components
export { default as Button } from "./components/ui/Button";
export { default as Badge } from "./components/ui/Badge";
export { default as Input } from "./components/ui/Input";
export { default as Avatar } from "./components/ui/Avatar";
export { default as Navbar } from "./components/ui/Navbar";
export { default as Footer } from "./components/ui/Footer";
export { default as Hero } from "./components/ui/Hero";
export { default as Status } from "./components/ui/Status";
export { default as Typography } from "./components/ui/Typography";
export { default as ColorSelector } from "./components/ui/ColorSelector";
export { default as ThemeSelector } from "./components/ui/ThemeSelector";

// Theme System
export { ThemeProvider, useTheme } from "./lib/theme/ThemeContext";
export { ClientThemeProvider } from "./lib/theme/ClientThemeProvider";
export type { ThemeType, ColorPalette } from "./lib/theme/types";
export { THEME_CONSTANTS } from "./lib/theme/constants";

// Utilities
export { cn } from "./lib/utils";

// Version Management
export { VERSION_STRING, CURRENT_VERSION, VersionManager } from "./lib/version";
export type { Version } from "./lib/version";

// Re-export all components from index
export * from "./components/ui/index";
