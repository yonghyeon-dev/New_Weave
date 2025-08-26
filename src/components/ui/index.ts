export { default as Avatar } from "./Avatar";
export { default as Badge } from "./Badge";
export { default as Button } from "./Button";
export {
  Card,
  CardImage,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";
export {
  Carousel,
  CarouselItem,
  CarouselDots,
  CarouselArrows,
} from "./Carousel";
export { default as ColorSelector } from "./ColorSelector";
export { default as Footer } from "./Footer";
export { default as Hero } from "./Hero";
export { default as Input } from "./Input";
export { default as Navbar } from "./Navbar";
export { default as Status } from "./Status";
export { default as ThemeSelector } from "./ThemeSelector";
export { default as ThemeWrapper } from "./ThemeWrapper";
export { default as Typography } from "./Typography";

// New Components from Check_List.md implementation
export { default as StateManager } from "./StateManager";
export { default as ValidationInput } from "./ValidationInput";
export { default as StatusBadge } from "./StatusBadge";
export { default as StatusCounter, StatusSummaryCard } from "./StatusCounter";
export { default as AiSampleCard } from "./AiSampleCard";
export { default as DemoBadge, DemoMetric } from "./DemoBadge";
export { default as EmptyStateGuide, SimpleEmptyState } from "./EmptyStateGuide";
export { default as SettingsFeedback, SettingSection, useSettingsState } from "./SettingsFeedback";
export { default as Calendar } from "./Calendar";
export { default as Toast, ToastProvider, useToast } from "./Toast";
export { default as Tooltip, HelpTooltip, FieldTooltip } from "./Tooltip";
export { 
  default as FormattedNumber,
  FormattedDate,
  DdayBadge,
  TruncatedText,
  FormattingGuide,
  formatNumber,
  formatDate,
  formatDday,
  formatFileSize,
  formatPercent,
  formatPhoneNumber,
  formatBusinessNumber
} from "./FormattingHelper";
export { default as FilterBar } from "./FilterBar";
export { default as DetailPanel } from "./DetailPanel";
export { default as DemoScenario } from "./DemoScenario";
export { default as Pagination } from "./Pagination";
export { default as PrintLayout, PrintButton, PageBreak, NoPrint } from "./PrintLayout";
export { default as AccessibilityProvider, AccessibilityPanel, useAccessibility, useKeyboardNavigation, useFocusManagement } from "./AccessibilityProvider";
export { default as AcceptanceCriteria } from "./AcceptanceCriteria";

// Re-export common types
export type * from "@/lib/types/components";

// Re-export component types
export type { ButtonProps } from "./Button";
export type {
  CardProps,
  CardImageProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "./Card";
export type { StatusProps } from "./Status";
export type { TypographyProps } from "./Typography";
export type { InputProps } from "./Input";
export type { BadgeProps } from "./Badge";
export type { AvatarProps } from "./Avatar";
export type {
  CarouselProps,
  CarouselItemProps,
  CarouselDotsProps,
  CarouselArrowsProps,
} from "./Carousel";
export type { NavbarProps, NavbarMenuItem } from "./Navbar";
export type {
  FooterProps,
  FooterLinkGroup,
  FooterLink,
  FooterSocialLink,
} from "./Footer";
export type { HeroProps, HeroAction } from "./Hero";
export type { ThemeSelectorProps } from "./ThemeSelector";

// New Component Types
export type { StateManagerProps, StateType } from "./StateManager";
export type { ValidationInputProps, ValidationType, ValidationResult } from "./ValidationInput";
export type { StatusBadgeProps, InvoiceStatus, PaymentStatus, GeneralStatus, StatusType as StatusBadgeStatusType } from "./StatusBadge";
export type { StatusCounterProps, StatusCount, StatusSummaryCardProps } from "./StatusCounter";
export type { AiSampleCardProps, ChatMessage, GeneratedDocument } from "./AiSampleCard";
export type { DemoBadgeProps, DemoBadgeType, DataSource, DemoTooltipProps, DemoMetricProps } from "./DemoBadge";
export type { EmptyStateGuideProps, EmptyStateType, EmptyStateAction, SimpleEmptyStateProps } from "./EmptyStateGuide";
export type { SettingsFeedbackProps, SettingStatus, FieldError, SettingsToast, SettingSectionProps, ToastProps, FieldErrorDisplayProps } from "./SettingsFeedback";
export type { ProgressProps } from "./Progress";
export type { SwitchProps } from "./Switch";
export type { AcceptanceCriteriaProps } from "./AcceptanceCriteria";
export type { ThemeWrapperProps } from "./ThemeWrapper";
export type { ToastItemProps, ToastContainerProps, ToastProviderProps } from "./Toast";
export type { CalendarProps, DateValue, DateRange } from "./Calendar";
export type { ToastData, ToastType } from "./Toast";
export type { TooltipProps, TooltipPosition, HelpTooltipProps, FieldTooltipProps } from "./Tooltip";
export type { 
  FormattedNumberProps,
  FormattedDateProps,
  DdayBadgeProps,
  TruncatedTextProps,
  NumberFormatOptions,
  DateFormatOptions
} from "./FormattingHelper";
export type { FilterBarProps, FilterOption, SortOption, ActiveFilter } from "./FilterBar";
export type { DetailPanelProps, ClientInfo, InvoiceInfo, PaymentInfo, ClientMemo, TimelineActivity } from "./DetailPanel";
export type { DemoScenarioProps, ScenarioStep } from "./DemoScenario";
export type { PaginationProps } from "./Pagination";
export type { PrintLayoutProps, PrintButtonProps } from "./PrintLayout";
export type { AccessibilityProviderProps, AccessibilitySettings } from "./AccessibilityProvider";
