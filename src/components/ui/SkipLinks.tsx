'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// 건너뛰기 링크 Props
export interface SkipLinksProps {
  links?: {
    href: string;
    label: string;
  }[];
  className?: string;
}

// 기본 건너뛰기 링크
const DEFAULT_SKIP_LINKS = [
  {
    href: '#main-content',
    label: '주요 내용으로 건너뛰기',
  },
  {
    href: '#navigation',
    label: '네비게이션으로 건너뛰기',
  },
  {
    href: '#search',
    label: '검색으로 건너뛰기',
  },
];

const SkipLinks: React.FC<SkipLinksProps> = ({
  links = DEFAULT_SKIP_LINKS,
  className,
}) => {
  return (
    <div className={cn("skip-links", className)}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link"
          onFocus={(e) => {
            // 포커스 시 화면 최상단으로 스크롤
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {link.label}
        </a>
      ))}
      
      {/* 건너뛰기 링크 스타일 */}
      <style jsx>{`
        .skip-links {
          position: relative;
          z-index: 9999;
        }
        
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 14px;
          transition: top 0.3s ease;
          z-index: 10000;
          white-space: nowrap;
        }
        
        .skip-link:focus {
          top: 6px;
          outline: 2px solid #4ECDC4;
          outline-offset: 2px;
        }
        
        .skip-link:hover:focus {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default SkipLinks;