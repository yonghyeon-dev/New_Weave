'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { ChartContainerProps } from './types';

export default function ChartContainer({
  title,
  subtitle,
  children,
  actions,
  className = ''
}: ChartContainerProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography variant="h4" className="text-txt-primary mb-1">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" className="text-txt-secondary">
              {subtitle}
            </Typography>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      <div className="w-full">
        {children}
      </div>
    </Card>
  );
}