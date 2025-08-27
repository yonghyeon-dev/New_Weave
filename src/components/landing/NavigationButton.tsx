'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface NavigationButtonProps {
  variant?: "primary" | "secondary" | "secondary-dark" | "filled-secondary" | "outline" | "ghost" | "destructive" | "positive" | "negative" | "notice" | "information" | "neutral" | "inverse-secondary" | "inverse-primary";
  size?: "sm" | "md" | "lg";
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function NavigationButton({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children
}: NavigationButtonProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후 잠시 대기
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (!isReady) return;
    
    try {
      router.push(href);
    } catch (error) {
      console.warn('Router failed, using fallback:', error);
      window.location.href = href;
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
      disabled={!isReady}
    >
      {children}
    </Button>
  );
}