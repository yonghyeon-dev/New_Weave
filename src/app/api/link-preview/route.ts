import { NextRequest, NextResponse } from 'next/server';

// 링크 메타데이터 추출 API
export async function POST(request: NextRequest) {
  let url = '';
  
  try {
    const body = await request.json();
    url = body.url;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // URL 유효성 검사
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // 메타데이터 페칭
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)'
      },
      signal: AbortSignal.timeout(5000) // 5초 타임아웃
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // HTML 파싱하여 메타데이터 추출
    const metadata = parseMetadata(html, url);
    
    return NextResponse.json(metadata);
    
  } catch (error) {
    console.error('Link preview error:', error);
    
    // 에러 발생 시 기본 메타데이터 반환
    if (url) {
      try {
        return NextResponse.json({
          url,
          title: new URL(url).hostname
        });
      } catch {
        // URL이 잘못된 경우
      }
    }
    
    return NextResponse.json({
      error: 'Failed to fetch link preview'
    }, { status: 500 });
  }
}

function parseMetadata(html: string, url: string) {
  const metadata: any = { url };
  
  // 제목 추출
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }
  
  // Open Graph 메타 태그 파싱
  const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  if (ogTitleMatch) {
    metadata.title = ogTitleMatch[1];
  }
  
  const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
  if (ogDescMatch) {
    metadata.description = ogDescMatch[1];
  }
  
  const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (ogImageMatch) {
    metadata.image = makeAbsoluteUrl(ogImageMatch[1], url);
  }
  
  const ogSiteMatch = html.match(/<meta\s+property="og:site_name"\s+content="([^"]+)"/i);
  if (ogSiteMatch) {
    metadata.siteName = ogSiteMatch[1];
  }
  
  // Twitter 카드 메타 태그 (Open Graph가 없을 경우 대체)
  if (!metadata.title) {
    const twitterTitleMatch = html.match(/<meta\s+name="twitter:title"\s+content="([^"]+)"/i);
    if (twitterTitleMatch) {
      metadata.title = twitterTitleMatch[1];
    }
  }
  
  if (!metadata.description) {
    const twitterDescMatch = html.match(/<meta\s+name="twitter:description"\s+content="([^"]+)"/i);
    if (twitterDescMatch) {
      metadata.description = twitterDescMatch[1];
    }
  }
  
  if (!metadata.image) {
    const twitterImageMatch = html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);
    if (twitterImageMatch) {
      metadata.image = makeAbsoluteUrl(twitterImageMatch[1], url);
    }
  }
  
  // 일반 메타 description
  if (!metadata.description) {
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (descMatch) {
      metadata.description = descMatch[1];
    }
  }
  
  // Favicon 추출
  const faviconMatch = html.match(/<link[^>]*rel="(?:shortcut )?icon"[^>]*href="([^"]+)"/i);
  if (faviconMatch) {
    metadata.favicon = makeAbsoluteUrl(faviconMatch[1], url);
  } else {
    // 기본 favicon 경로
    metadata.favicon = new URL('/favicon.ico', url).href;
  }
  
  return metadata;
}

// 상대 URL을 절대 URL로 변환
function makeAbsoluteUrl(path: string, baseUrl: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  try {
    return new URL(path, baseUrl).href;
  } catch {
    return path;
  }
}