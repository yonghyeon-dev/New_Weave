'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';
import ContentCard, { FeaturedCard } from './ContentCard';
import type { HomeContentSection as HomeContentSectionType } from '@/lib/types/content';

interface HomeContentSectionProps {
  content: HomeContentSectionType;
  className?: string;
}

export function HomeContentSection({ content, className = '' }: HomeContentSectionProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* 피처드 카드 */}
      {content.featured && (
        <section>
          <Typography variant="h2" className="mb-4">
            추천 콘텐츠
          </Typography>
          <FeaturedCard content={content.featured} />
        </section>
      )}

      {/* 카테고리별 콘텐츠 */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 세금 관련 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <Typography variant="h4">세금 · 정산</Typography>
          </div>
          <div className="space-y-4">
            {content.categories.tax.map((card) => (
              <ContentCard key={card.id} content={card} size="small" />
            ))}
          </div>
        </div>

        {/* 계약 관련 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <Typography variant="h4">계약 · 견적</Typography>
          </div>
          <div className="space-y-4">
            {content.categories.contract.map((card) => (
              <ContentCard key={card.id} content={card} size="small" />
            ))}
          </div>
        </div>

        {/* 인보이스 관련 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <Typography variant="h4">인보이스 · 수금</Typography>
          </div>
          <div className="space-y-4">
            {content.categories.invoicing.map((card) => (
              <ContentCard key={card.id} content={card} size="small" />
            ))}
          </div>
        </div>
      </section>

      {/* What's New + Popular */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Typography variant="h3" className="mb-4">
            새로운 소식
          </Typography>
          <div className="space-y-4">
            {content.releases.slice(0, 3).map((card) => (
              <ContentCard key={card.id} content={card} size="small" />
            ))}
          </div>
        </div>
        
        <div>
          <Typography variant="h3" className="mb-4">
            인기 콘텐츠
          </Typography>
          <div className="space-y-4">
            {content.popular.slice(0, 3).map((card) => (
              <ContentCard key={card.id} content={card} size="small" />
            ))}
          </div>
        </div>
      </section>

      {/* 법적 고지 */}
      <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-yellow-800 font-medium mb-1">
              법적 고지
            </p>
            <p className="text-sm text-yellow-700">
              본 콘텐츠는 일반적인 정보 제공 목적으로만 작성되었으며, 세무나 법률 자문으로 해석될 수 없습니다.
              구체적인 사안은 반드시 전문가와 상의하시기 바랍니다.
            </p>
            <button className="text-sm text-weave-primary hover:text-weave-primary-hover mt-2 font-medium">
              세무사 연결 서비스 →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeContentSection;