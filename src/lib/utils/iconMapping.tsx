import React from 'react';
import { 
  Plus, 
  FileText, 
  BarChart3, 
  ChevronRight,
  Calculator,
  CreditCard,
  Building,
  Upload,
  Bell,
  Users,
  Settings,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  TrendingUp,
  Cpu
} from 'lucide-react';

// Icon mapping for string identifiers to Lucide React components
export const iconMap = {
  // Actions
  'plus': Plus,
  'edit': Edit,
  'trash': Trash2,
  'copy': Copy,
  'play': Play,
  'pause': Pause,
  'download': Download,
  'eye': Eye,
  
  // Navigation
  'chevron-right': ChevronRight,
  'search': Search,
  'filter': Filter,
  
  // Business
  'file-text': FileText,
  'bar-chart': BarChart3,
  'calculator': Calculator,
  'credit-card': CreditCard,
  'building': Building,
  'upload': Upload,
  'bell': Bell,
  'users': Users,
  'settings': Settings,
  'mail': Mail,
  'calendar': Calendar,
  'trending-up': TrendingUp,
  'cpu': Cpu,
  
  // Status
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'clock': Clock
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function Icon({ name, className = 'w-4 h-4', size }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return <FileText className={className} />;
  }
  
  return <IconComponent className={className} size={size} />;
}

export default Icon;