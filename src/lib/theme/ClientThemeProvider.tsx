"use client";

import { ThemeProvider } from "./ThemeContext";

export const ClientThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
