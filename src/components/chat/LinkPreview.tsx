'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { ExternalLink, Image as ImageIcon, Loader } from 'lucide-react';

interface LinkMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

interface LinkPreviewProps {
  url: string;
  compact?: boolean;
}

export default function LinkPreview({ url, compact = false }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchLinkMetadata(url);
  }, [url]);

  const fetchLinkMetadata = async (targetUrl: string) => {
    setIsLoading(true);
    setError(false);

    try {
      // 링크 메타데이터를 가져오는 API 호출
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });

      if (!response.ok) throw new Error('Failed to fetch metadata');
      
      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      console.error('Link preview error:', err);
      setError(true);
      // 실패해도 기본 미리보기 표시
      setMetadata({
        url: targetUrl,
        title: getDomainFromUrl(targetUrl)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDomainFromUrl = (targetUrl: string) => {
    try {
      const urlObj = new URL(targetUrl);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return targetUrl;
    }
  };

  // 컴팩트 모드 - 인라인 표시
  if (compact) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-weave-primary hover:text-weave-primary-light underline transition-colors"
      >
        <span className="break-all">{url}</span>
        <ExternalLink className="w-3 h-3 flex-shrink-0" />
      </a>
    );
  }

  // 로딩 중
  if (isLoading) {
    return (
      <Card className="p-3 border border-border-light bg-white/50 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-bg-tertiary rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-bg-tertiary rounded w-3/4" />
            <div className="h-3 bg-bg-tertiary rounded w-full" />
          </div>
        </div>
      </Card>
    );
  }

  // 전체 미리보기
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block no-underline"
    >
      <Card className="p-3 border border-border-light bg-white hover:bg-bg-secondary hover:border-weave-primary/30 transition-all cursor-pointer group">
        <div className="flex gap-3">
          {/* 썸네일 또는 아이콘 */}
          <div className="flex-shrink-0">
            {metadata?.image ? (
              <div className="w-20 h-20 rounded overflow-hidden bg-bg-secondary">
                <img 
                  src={metadata.image} 
                  alt="" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded bg-gradient-to-br from-bg-secondary to-bg-tertiary flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-txt-tertiary" />
              </div>
            )}
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* 제목 */}
                <Typography variant="body2" className="font-semibold text-txt-primary group-hover:text-weave-primary transition-colors line-clamp-1">
                  {metadata?.title || getDomainFromUrl(url)}
                </Typography>
                
                {/* 설명 */}
                {metadata?.description && (
                  <Typography variant="body2" className="text-txt-secondary text-sm line-clamp-2 mt-1">
                    {metadata.description}
                  </Typography>
                )}
                
                {/* URL */}
                <div className="flex items-center gap-1 mt-2">
                  {metadata?.favicon && (
                    <img 
                      src={metadata.favicon} 
                      alt="" 
                      className="w-4 h-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <Typography variant="body2" className="text-txt-tertiary text-xs truncate">
                    {getDomainFromUrl(url)}
                  </Typography>
                </div>
              </div>
              
              {/* 외부 링크 아이콘 */}
              <ExternalLink className="w-4 h-4 text-txt-tertiary flex-shrink-0 group-hover:text-weave-primary transition-colors" />
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}

// URL 감지 및 추출 유틸리티
export function extractUrlsFromText(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  return text.match(urlRegex) || [];
}

// 메시지에서 URL을 LinkPreview로 변환하는 컴포넌트
interface MessageWithLinksProps {
  content: string;
  compact?: boolean;
}

export function MessageWithLinks({ content, compact = false }: MessageWithLinksProps) {
  const urls = extractUrlsFromText(content);
  
  if (urls.length === 0) {
    return <>{content}</>;
  }

  // URL을 LinkPreview 컴포넌트로 교체
  let lastIndex = 0;
  const elements: React.ReactNode[] = [];
  
  urls.forEach((url, index) => {
    const urlIndex = content.indexOf(url, lastIndex);
    
    // URL 이전 텍스트
    if (urlIndex > lastIndex) {
      elements.push(
        <span key={`text-${index}`}>
          {content.substring(lastIndex, urlIndex)}
        </span>
      );
    }
    
    // URL을 LinkPreview로 변환
    elements.push(
      <LinkPreview key={`link-${index}`} url={url} compact={compact} />
    );
    
    lastIndex = urlIndex + url.length;
  });
  
  // 마지막 남은 텍스트
  if (lastIndex < content.length) {
    elements.push(
      <span key="text-last">
        {content.substring(lastIndex)}
      </span>
    );
  }
  
  return <>{elements}</>;
}