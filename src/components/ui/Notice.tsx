import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Typography from './Typography';

interface NoticeItem {
  text: string;
  highlight?: boolean;
}

interface NoticeProps {
  title: string;
  items?: NoticeItem[] | string[];
  icon?: LucideIcon;
  className?: string;
}

const Notice: React.FC<NoticeProps> = ({
  title,
  items,
  icon: Icon,
  className
}) => {
  // 문자열 배열을 NoticeItem 배열로 변환
  const normalizedItems = items?.map(item => 
    typeof item === 'string' ? { text: item } : item
  );

  return (
    <div
      className={cn(
        'p-4 rounded-lg',
        'border border-border-light/50',
        'bg-gradient-to-r from-bg-secondary/30 to-transparent',
        className
      )}
    >
      <div className="flex items-start gap-2">
        {Icon && (
          <Icon className="w-4 h-4 text-weave-primary flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <Typography variant="body2" className="font-medium text-txt-primary mb-2">
            {title}
          </Typography>
          {normalizedItems && normalizedItems.length > 0 && (
            <div className="space-y-1">
              {normalizedItems.map((item, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  className={cn(
                    'text-txt-secondary',
                    item.highlight && 'text-txt-primary font-medium'
                  )}
                >
                  • {item.text}
                </Typography>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notice;