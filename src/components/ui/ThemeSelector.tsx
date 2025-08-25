"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme/ThemeContext";
import { Button } from "./";

export interface ThemeSelectorProps {
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { currentTheme, setTheme } = useTheme();

  const themes = [
    {
      id: "dark" as const,
      name: "Default (Black)",
      description: "다크테마",
      preview: "bg-gray-900 border border-gray-700",
    },
    {
      id: "white" as const,
      name: "Default (White)",
      description: "화이트 테마",
      preview: "bg-white border border-gray-200",
    },
  ];

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">테마 선택</h3>
          <p className="text-sm text-text-secondary">
            원하는 디자인 테마를 선택하세요
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={cn(
              "relative p-4 rounded-lg border-2 transition-all duration-200 text-left",
              currentTheme === theme.id
                ? "border-primary-border bg-primary-surfaceHover"
                : "border-primary-borderSecondary bg-transparent hover:bg-primary-surfaceHover"
            )}
          >
            <div className="flex items-start space-x-3">
              <div
                className={cn("w-12 h-8 rounded-md border", theme.preview)}
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-text-primary">
                  {theme.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-text-secondary">
                  {theme.description}
                </div>
              </div>
              {currentTheme === theme.id && (
                <div className="w-5 h-5 rounded-full bg-primary-border flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-primary-background"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
