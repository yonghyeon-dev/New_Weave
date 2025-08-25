"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme/ThemeContext";
import { THEME_CONSTANTS } from "@/lib/theme/constants";

export interface ColorSelectorProps {
  className?: string;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ className }) => {
  const { selectedPaletteId, setSelectedPaletteId } = useTheme();

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">색상 선택</h3>
          <p className="text-sm text-text-secondary">
            버튼과 UI 요소에 적용될 그라디언트 색상을 선택하세요
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {THEME_CONSTANTS.colorPalettes.map((palette) => (
          <button
            key={palette.id}
            onClick={() => setSelectedPaletteId(palette.id)}
            className={cn(
              "relative p-4 rounded-lg border-2 transition-all duration-200 text-left group",
              selectedPaletteId === palette.id
                ? "border-primary-border bg-primary-surfaceHover"
                : "border-primary-borderSecondary bg-transparent hover:bg-primary-surfaceHover"
            )}
          >
            <div className="flex flex-col space-y-3">
              {/* 색상 미리보기 */}
              <div className="flex space-x-2">
                <div
                  className="w-8 h-8 rounded-md border border-gray-300"
                  style={{ backgroundColor: palette.colors.primary }}
                  title={`선택 색상1: ${palette.colors.primary}`}
                />
                <div
                  className="w-8 h-8 rounded-md border border-gray-300"
                  style={{ backgroundColor: palette.colors.secondary }}
                  title={`선택 색상2: ${palette.colors.secondary}`}
                />
                <div
                  className="w-8 h-8 rounded-md border border-gray-300"
                  style={{ backgroundColor: palette.colors.default }}
                  title={`기본 색상: ${palette.colors.default}`}
                />
              </div>

              {/* 색상 정보 */}
              <div className="space-y-1">
                <div className="font-medium text-text-primary text-sm">
                  {palette.name}
                </div>
                <div className="text-xs text-text-secondary">
                  {palette.description}
                </div>

                {/* RGB 값 표시 */}
                <div className="text-xs space-y-0.5">
                  <div className="text-gray-600 dark:text-text-tertiary">
                    선택 색상1: RGB({palette.rgb.primary})
                  </div>
                  <div className="text-gray-600 dark:text-text-tertiary">
                    선택 색상2: RGB({palette.rgb.secondary})
                  </div>
                  <div className="text-gray-600 dark:text-text-tertiary">
                    기본 색상: RGB({palette.rgb.default})
                  </div>
                </div>
              </div>
            </div>

            {/* 선택 표시 */}
            {selectedPaletteId === palette.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-border flex items-center justify-center">
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
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
