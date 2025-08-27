import React from 'react';
import { 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default';
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
  showIcon?: boolean;
}

const alertVariants = {
  default: {
    container: 'border-border-light text-txt-secondary',
    icon: Info,
    iconColor: 'text-txt-tertiary'
  },
  info: {
    container: 'border-blue-200/50 text-txt-secondary',
    icon: Info,
    iconColor: 'text-weave-primary'
  },
  success: {
    container: 'border-green-200/50 text-txt-secondary',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  warning: {
    container: 'border-yellow-200/50 text-txt-secondary',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600'
  },
  error: {
    container: 'border-red-200/50 text-txt-secondary',
    icon: XCircle,
    iconColor: 'text-red-600'
  }
};

const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  children,
  className,
  icon: CustomIcon,
  showIcon = true
}) => {
  const variantConfig = alertVariants[variant];
  const Icon = CustomIcon || variantConfig.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        'bg-white/50 backdrop-blur-sm',
        variantConfig.container,
        className
      )}
    >
      {showIcon && (
        <Icon 
          className={cn(
            'w-5 h-5 flex-shrink-0 mt-0.5',
            variantConfig.iconColor
          )} 
        />
      )}
      <div className="flex-1">
        {title && (
          <div className="font-medium mb-1 text-txt-primary">
            {title}
          </div>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Alert;