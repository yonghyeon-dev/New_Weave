'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Icon, IconName } from '@/lib/utils/iconMapping';
import type { QuickAction } from '@/lib/types/content';

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className = '' }: QuickActionsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {actions.map((action) => (
        <QuickActionCard key={action.id} action={action} />
      ))}
    </div>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const handleClick = () => {
    console.log('Quick action clicked:', action.id);
    // TODO: 메트릭 추적
  };

  return (
    <Link href={action.href} onClick={handleClick}>
      <div className="group bg-white border border-border-light rounded-lg p-6 hover:shadow-md hover:border-weave-primary/30 transition-all cursor-pointer">
        <div className="flex items-center gap-4 mb-3">
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            ${action.variant === 'primary' 
              ? 'bg-weave-primary text-white group-hover:bg-weave-primary-hover' 
              : action.variant === 'secondary'
              ? 'bg-weave-secondary text-white group-hover:bg-weave-secondary-hover'
              : 'bg-gray-100 text-txt-primary group-hover:bg-gray-200'
            }
            transition-colors
          `}>
            <Icon name={action.icon as IconName} className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-txt-primary group-hover:text-weave-primary transition-colors">
              {action.label}
            </h3>
            {action.description && (
              <p className="text-sm text-txt-secondary mt-1">
                {action.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end">
          <Button 
            variant={action.variant} 
            size="sm"
            disabled={action.disabled}
            className="group-hover:shadow-sm"
          >
            시작하기
            <Icon name="chevron-right" className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default QuickActions;