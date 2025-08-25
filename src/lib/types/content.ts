/**
 * Content & Home Section Types
 * 홈 콘텐츠 섹션 관련 타입 정의
 */

export type ContentType = 'article' | 'guide' | 'release' | 'tip';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type PersonaType = 'P1' | 'P2' | 'P3' | 'all';
export type ContentStage = 'onboarding' | 'core' | 'retention';
export type ContentTopic = 'tax' | 'contract' | 'invoicing' | 'howto' | 'general';

export interface ContentCard {
  id: string;
  type: ContentType;
  status: ContentStatus;
  
  // 기본 정보
  title: string;
  subtitle?: string;
  tag?: string;
  readTimeMin: number;
  
  // 메타데이터
  slug: string;
  locale: 'ko' | 'en';
  topics: ContentTopic[];
  persona: PersonaType;
  stage: ContentStage;
  
  // CTA 설정
  ctaLabel: string;
  ctaHref: string;
  
  // 배지
  badge?: 'New' | 'Updated' | 'Popular';
  
  // 발행 정보
  publishAt: Date;
  updatedAt: Date;
  
  // 메트릭
  impressions?: number;
  ctr?: number;
  avgReadTime?: number;
  scrollDepth?: number;
  assistedConversions?: number;
  
  // 콘텐츠
  content?: string; // 마크다운 형태
  excerpt?: string; // 요약/미리보기
  
  // SEO
  metaDesc?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon: string; // Icon name (e.g., 'plus', 'calculator', 'file-text')
  variant: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export interface HomeContentSection {
  // 피처드 콘텐츠
  featured?: ContentCard;
  
  // 퀵 액션
  quickActions: QuickAction[];
  
  // 카테고리별 콘텐츠
  categories: {
    tax: ContentCard[];
    contract: ContentCard[];
    invoicing: ContentCard[];
  };
  
  // What's New
  releases: ContentCard[];
  
  // Popular This Month
  popular: ContentCard[];
}

export interface ContentMetrics {
  totalViews: number;
  avgReadTime: number;
  conversionRate: number;
  topPerformers: ContentCard[];
}

// CMS 관련 타입
export interface ContentMeta {
  owner: string;
  reviewer?: string;
  approver?: string;
  legalReviewed: boolean;
  slaStatus: 'on_time' | 'delayed' | 'overdue';
}

export interface ContentGovernance {
  publishingCadence: 'weekly' | 'bi_weekly' | 'monthly';
  reviewCycle: number; // days
  rollbackProcedure: string;
  complianceChecks: string[];
}