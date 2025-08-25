"use client";

import React, { useEffect } from "react";
import { useTheme } from "@/lib/theme/ThemeContext";

interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { currentTheme } = useTheme();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  return <>{children}</>;
};

export default ThemeWrapper;
