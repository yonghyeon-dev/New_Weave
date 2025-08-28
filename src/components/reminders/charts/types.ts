import { ReminderStatus, ReminderType } from '@/lib/types/reminder';

export interface ChartData {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
  icon?: string;
  description?: string;
}

export interface StatusChartData extends ChartData {
  status: ReminderStatus;
}

export interface TypeChartData extends ChartData {
  type: ReminderType;
}

export interface ChartProps {
  data: ChartData[];
  title: string;
  totalCount: number;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  onSegmentClick?: (data: ChartData) => void;
}

export interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  position?: { x: number; y: number };
}

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}