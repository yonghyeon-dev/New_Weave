import type { HomeContentSection, ContentCard, QuickAction } from '@/lib/types/content';

// Mock 콘텐츠 카드 데이터
const mockContentCards: ContentCard[] = [
  // 세금 관련 콘텐츠
  {
    id: 'tax-guide-001',
    type: 'guide',
    status: 'published',
    title: '프리랜서 세금 신고 완벽 가이드',
    subtitle: '소득세 신고부터 부가세까지, 놓치면 안 되는 모든 것',
    tag: '세금',
    readTimeMin: 8,
    slug: 'freelancer-tax-guide-2024',
    locale: 'ko',
    topics: ['tax'],
    persona: 'all',
    stage: 'core',
    ctaLabel: '가이드 보기',
    ctaHref: '/guides/tax-guide-2024',
    badge: 'New',
    publishAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-20'),
    excerpt: '2024년 개정된 세법에 맞춰 프리랜서가 꼭 알아야 할 세금 신고 방법을 단계별로 설명합니다.',
    impressions: 1250,
    ctr: 8.2,
    avgReadTime: 6.5
  },
  {
    id: 'tax-tip-001',
    type: 'tip',
    status: 'published',
    title: '미수금 관리로 세금 최적화하기',
    subtitle: '현금주의 vs 발생주의, 어떤 게 유리할까?',
    tag: '절세',
    readTimeMin: 5,
    slug: 'receivables-tax-optimization',
    locale: 'ko',
    topics: ['tax', 'invoicing'],
    persona: 'P2',
    stage: 'core',
    ctaLabel: '방법 알아보기',
    ctaHref: '/tips/receivables-tax',
    publishAt: new Date('2024-08-18'),
    updatedAt: new Date('2024-08-18'),
    excerpt: '미수금 처리 방법에 따른 세금 영향을 분석하고 최적화 전략을 제시합니다.',
    impressions: 890,
    ctr: 12.1,
    avgReadTime: 4.8
  },
  {
    id: 'tax-checklist-001',
    type: 'guide',
    status: 'published',
    title: '연말정산 체크리스트',
    subtitle: '놓치기 쉬운 공제 항목들을 한눈에',
    tag: '체크리스트',
    readTimeMin: 3,
    slug: 'year-end-tax-checklist',
    locale: 'ko',
    topics: ['tax'],
    persona: 'all',
    stage: 'retention',
    ctaLabel: '체크리스트 받기',
    ctaHref: '/checklists/year-end-tax',
    publishAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-22'),
    excerpt: '연말정산에서 놓치기 쉬운 공제 항목들을 체크리스트로 정리했습니다.',
    impressions: 2100,
    ctr: 15.5,
    avgReadTime: 3.2
  },

  // 계약 관련 콘텐츠
  {
    id: 'contract-guide-001',
    type: 'guide',
    status: 'published',
    title: '안전한 프리랜서 계약서 작성법',
    subtitle: '분쟁을 예방하는 필수 조항들',
    tag: '계약',
    readTimeMin: 12,
    slug: 'safe-freelancer-contract',
    locale: 'ko',
    topics: ['contract'],
    persona: 'all',
    stage: 'core',
    ctaLabel: '계약서 템플릿',
    ctaHref: '/templates/contract-template',
    badge: 'Popular',
    publishAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-08-20'),
    excerpt: '법적 분쟁을 예방하고 권익을 보호하는 계약서 작성 가이드입니다.',
    impressions: 3400,
    ctr: 18.7,
    avgReadTime: 9.8
  },
  {
    id: 'quote-tip-001',
    type: 'tip',
    status: 'published',
    title: '견적서로 첫인상 확실히 만들기',
    subtitle: '고객이 YES라고 말하게 하는 견적서의 비밀',
    tag: '견적',
    readTimeMin: 6,
    slug: 'impressive-quote-tips',
    locale: 'ko',
    topics: ['contract'],
    persona: 'P1',
    stage: 'core',
    ctaLabel: '견적 팁 보기',
    ctaHref: '/tips/impressive-quotes',
    publishAt: new Date('2024-08-12'),
    updatedAt: new Date('2024-08-12'),
    excerpt: '승률을 높이는 견적서 작성법과 실전 템플릿을 소개합니다.',
    impressions: 1680,
    ctr: 11.2,
    avgReadTime: 5.4
  },
  {
    id: 'negotiation-guide-001',
    type: 'guide',
    status: 'published',
    title: '프로젝트 범위 협상 가이드',
    subtitle: '무리한 요구사항에 현명하게 대처하기',
    tag: '협상',
    readTimeMin: 9,
    slug: 'project-scope-negotiation',
    locale: 'ko',
    topics: ['contract'],
    persona: 'P2',
    stage: 'core',
    ctaLabel: '협상법 배우기',
    ctaHref: '/guides/scope-negotiation',
    publishAt: new Date('2024-08-05'),
    updatedAt: new Date('2024-08-15'),
    excerpt: '프로젝트 범위 변경 요청에 전문적으로 대응하는 방법을 알려드립니다.',
    impressions: 2250,
    ctr: 14.3,
    avgReadTime: 7.9
  },

  // 인보이스 관련 콘텐츠
  {
    id: 'invoice-guide-001',
    type: 'guide',
    status: 'published',
    title: '미수금 제로! 인보이스 관리법',
    subtitle: '정확한 발행부터 빠른 회수까지',
    tag: '인보이스',
    readTimeMin: 10,
    slug: 'zero-receivables-invoice',
    locale: 'ko',
    topics: ['invoicing'],
    persona: 'all',
    stage: 'core',
    ctaLabel: '관리법 보기',
    ctaHref: '/guides/invoice-management',
    badge: 'Updated',
    publishAt: new Date('2024-08-08'),
    updatedAt: new Date('2024-08-23'),
    excerpt: '인보이스 발행부터 대금 회수까지, 미수금을 최소화하는 체계적인 관리법입니다.',
    impressions: 2890,
    ctr: 16.4,
    avgReadTime: 8.7
  },
  {
    id: 'reminder-tip-001',
    type: 'tip',
    status: 'published',
    title: '정중하면서도 효과적인 리마인드 메시지',
    subtitle: '관계 손상 없이 대금을 독촉하는 법',
    tag: '리마인드',
    readTimeMin: 7,
    slug: 'effective-reminder-messages',
    locale: 'ko',
    topics: ['invoicing'],
    persona: 'P1',
    stage: 'core',
    ctaLabel: '메시지 템플릿',
    ctaHref: '/templates/reminder-messages',
    publishAt: new Date('2024-08-14'),
    updatedAt: new Date('2024-08-14'),
    excerpt: '고객과의 관계를 유지하면서 대금 회수 효율을 높이는 커뮤니케이션 전략입니다.',
    impressions: 1950,
    ctr: 13.8,
    avgReadTime: 6.1
  },
  {
    id: 'payment-terms-001',
    type: 'guide',
    status: 'published',
    title: '결제 조건 설정 가이드',
    subtitle: '선입금부터 후불까지, 상황별 최적 조건',
    tag: '결제',
    readTimeMin: 8,
    slug: 'payment-terms-guide',
    locale: 'ko',
    topics: ['invoicing', 'contract'],
    persona: 'P2',
    stage: 'core',
    ctaLabel: '조건 설정하기',
    ctaHref: '/guides/payment-terms',
    publishAt: new Date('2024-08-11'),
    updatedAt: new Date('2024-08-21'),
    excerpt: '프로젝트 특성과 고객 유형에 맞는 최적의 결제 조건 설정 방법입니다.',
    impressions: 1720,
    ctr: 10.9,
    avgReadTime: 6.8
  }
];

// 릴리즈 노트 Mock 데이터
const mockReleases: ContentCard[] = [
  {
    id: 'release-001',
    type: 'release',
    status: 'published',
    title: 'Weave v1.2 업데이트',
    subtitle: '템플릿 에디터 개선 및 새로운 리마인드 기능',
    tag: '업데이트',
    readTimeMin: 2,
    slug: 'release-v1-2',
    locale: 'ko',
    topics: ['general'],
    persona: 'all',
    stage: 'retention',
    ctaLabel: '새 기능 보기',
    ctaHref: '/releases/v1-2',
    badge: 'New',
    publishAt: new Date('2024-08-25'),
    updatedAt: new Date('2024-08-25'),
    excerpt: '더욱 직관적인 템플릿 에디터와 자동화된 리마인드 시스템을 만나보세요.',
    impressions: 450,
    ctr: 22.1,
    avgReadTime: 1.8
  }
];

// 퀵 액션 Mock 데이터
const mockQuickActions: QuickAction[] = [
  {
    id: 'ai-assistant',
    label: 'AI 비서',
    description: '문서 추출 및 생성을 AI로 자동화하세요',
    href: '/ai-assistant',
    variant: 'primary',
    icon: 'cpu'
  },
  {
    id: 'create-invoice',
    label: '인보이스 생성',
    description: '새로운 청구서를 빠르게 생성하세요',
    href: '/invoices/new',
    variant: 'secondary',
    icon: 'plus'
  },
  {
    id: 'track-payments',
    label: '결제 추적',
    description: '미결제 인보이스를 확인하세요',
    href: '/payments',
    variant: 'outline',
    icon: 'bar-chart'
  }
];

// 메인 홈 콘텐츠 섹션 Mock 데이터
export const mockHomeContent: HomeContentSection = {
  featured: mockContentCards.find(card => card.badge === 'Popular'),
  quickActions: mockQuickActions,
  categories: {
    tax: mockContentCards.filter(card => card.topics.includes('tax')),
    contract: mockContentCards.filter(card => card.topics.includes('contract')),
    invoicing: mockContentCards.filter(card => card.topics.includes('invoicing'))
  },
  releases: mockReleases,
  popular: mockContentCards
    .filter(card => card.impressions && card.impressions > 2000)
    .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
    .slice(0, 3)
};

export default mockHomeContent;