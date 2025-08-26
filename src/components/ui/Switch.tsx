'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Switch({ 
  checked, 
  onCheckedChange, 
  disabled = false, 
  className = '', 
  size = 'md' 
}: SwitchProps) {
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-5',
      thumb: 'w-3 h-3',
      translate: 'translate-x-3'
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'w-5 h-5',
      translate: 'translate-x-7'
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-weave-primary focus:ring-offset-2",
        sizeClasses[size].switch,
        checked 
          ? "bg-weave-primary" 
          : "bg-gray-200",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none relative inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out",
          sizeClasses[size].thumb,
          checked 
            ? sizeClasses[size].translate 
            : "translate-x-0"
        )}
      >
        <span
          className={cn(
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
            checked ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
            checked ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"
          )}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

export default Switch;