'use client';

import React from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { ContentCard as ContentCardType } from '@/lib/types/content';

interface ContentCardProps {
  content: ContentCardType;
  size?: 'small' | 'medium' | 'large';
  showCTA?: boolean;
  className?: string;
}

export function ContentCard({ 
  content, 
  size = 'medium',
  showCTA = true,
  className = ''
}: ContentCardProps) {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const titleSizes = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl'
  };

  const handleClick = () => {
    // 메트릭 추적
    console.log('Content card clicked:', content.id);
    // TODO: 실제 메트릭 서비스에 이벤트 전송
  };

  return (
    <Card className={`${sizeClasses[size]} hover:shadow-md transition-shadow cursor-pointer ${className}`}>
      <div className="flex flex-col h-full">
        {/* 헤더 - 태그와 배지 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {content.tag && (
              <span className="text-xs text-weave-primary font-medium bg-weave-primary/10 px-2 py-1 rounded">
                {content.tag}
              </span>
            )}
            {content.badge && (
              <Badge 
                variant={content.badge === 'New' ? 'accent' : content.badge === 'Updated' ? 'secondary' : 'primary'}
                size="sm"
              >
                {content.badge}
              </Badge>
            )}
          </div>
          <span className="text-xs text-txt-tertiary">
            {content.readTimeMin}분
          </span>
        </div>

        {/* 제목과 부제목 */}
        <div className="flex-1">
          <h3 className={`font-semibold text-txt-primary mb-2 line-clamp-2 ${titleSizes[size]}`}>
            {content.title}
          </h3>
          {content.subtitle && (
            <p className="text-sm text-txt-secondary mb-4 line-clamp-2">
              {content.subtitle}
            </p>
          )}
          {content.excerpt && (
            <p className="text-sm text-txt-tertiary line-clamp-3">
              {content.excerpt}
            </p>
          )}
        </div>

        {/* 하단 - CTA와 메타 정보 */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
          <div className="flex items-center gap-2 text-xs text-txt-tertiary">
            {content.topics.slice(0, 2).map((topic) => (
              <span key={topic} className="capitalize">
                #{topic}
              </span>
            ))}
          </div>
          
          {showCTA && (
            <Link href={content.ctaHref} onClick={handleClick}>
              <Button variant="outline" size="sm">
                {content.ctaLabel}
              </Button>
            </Link>
          )}
        </div>

        {/* 업데이트 날짜 */}
        <div className="text-xs text-txt-tertiary mt-2">
          업데이트: {content.updatedAt.toLocaleDateString('ko-KR')}
        </div>
      </div>
    </Card>
  );
}

// 피처드 카드 (대형)
export function FeaturedCard({ content }: { content: ContentCardType }) {
  return (
    <Card className="p-8 bg-gradient-to-br from-weave-primary/5 to-weave-secondary/5 border-weave-primary/20">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="primary">피처드</Badge>
            {content.badge && (
              <Badge variant="accent" size="sm">
                {content.badge}
              </Badge>
            )}
            <span className="text-sm text-txt-tertiary">
              {content.readTimeMin}분 읽기
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-txt-primary mb-3">
            {content.title}
          </h2>
          
          {content.subtitle && (
            <p className="text-lg text-txt-secondary mb-4">
              {content.subtitle}
            </p>
          )}
          
          {content.excerpt && (
            <p className="text-txt-tertiary mb-6">
              {content.excerpt}
            </p>
          )}
          
          <Link href={content.ctaHref}>
            <Button variant="primary" size="lg">
              {content.ctaLabel}
            </Button>
          </Link>
        </div>
        
        {content.ogImage && (
          <div className="w-full md:w-64 h-48 bg-gray-100 rounded-lg flex-shrink-0">
            {/* TODO: 실제 이미지 컴포넌트로 교체 */}
            <div className="w-full h-full flex items-center justify-center text-txt-tertiary">
              이미지 영역
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ContentCard;