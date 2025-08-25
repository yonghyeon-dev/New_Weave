'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  className?: string;
}

export default function Select({
  options,
  value,
  placeholder = "선택하세요",
  disabled = false,
  onValueChange,
  className = ""
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === selectedValue);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    onValueChange?.(optionValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      {/* Select Trigger */}
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-border-medium bg-white px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-weave-primary focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:border-weave-primary",
          isOpen && "ring-2 ring-weave-primary"
        )}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn(
          "truncate",
          selectedOption ? "text-txt-primary" : "text-txt-tertiary"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={cn(
            "ml-2 h-4 w-4 shrink-0 text-txt-tertiary transition-transform",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Select Content */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border-medium bg-white py-1 shadow-lg",
            "animate-in fade-in-0 zoom-in-95"
          )}
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-txt-tertiary">
              옵션이 없습니다
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm outline-none",
                  "hover:bg-weave-primary-light hover:text-weave-primary",
                  "focus:bg-weave-primary-light focus:text-weave-primary",
                  "disabled:pointer-events-none disabled:opacity-50",
                  selectedValue === option.value && "bg-weave-primary-light text-weave-primary"
                )}
                disabled={option.disabled}
                onClick={() => !option.disabled && handleSelect(option.value)}
                role="option"
                aria-selected={selectedValue === option.value}
              >
                <span className="truncate">{option.label}</span>
                {selectedValue === option.value && (
                  <span className="absolute right-2 h-4 w-4">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}