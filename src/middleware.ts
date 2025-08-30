import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './middleware/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 경로 (인증 없이 접근 가능)
  const publicPaths = [
    '/',           // 랜딩페이지
    '/home',       // 홈 화면
    '/login',      // 로그인
    '/signup',     // 회원가입
    '/auth/callback', // OAuth 콜백
  ];

  // 보호된 경로 (인증 필요)
  const protectedPaths = [
    '/dashboard',
    '/clients',
    '/projects',
    '/invoices',
    '/documents',
    '/reminder',
    '/tax',
    '/chat',
    '/settings',
  ];

  // 레거시 리다이렉트 매핑
  const redirectMap: Record<string, string> = {
    '/business-lookup': '/clients', // 사업자 조회는 클라이언트 관리로 통합
    '/reminders': '/reminder', // 리마인더 경로 정리
    '/ai-assistant': '/chat', // AI 기능은 chat으로
    '/document-requests': '/documents', // 문서 요청은 문서 관리로 통합
    '/templates': '/documents', // 템플릿은 문서 관리로 통합
  };

  // 레거시 경로 리다이렉트 처리
  if (redirectMap[pathname]) {
    return NextResponse.redirect(new URL(redirectMap[pathname], request.url));
  }

  // Supabase 인증 세션 업데이트
  const response = await updateSession(request);
  
  // 세션 확인을 위해 쿠키에서 Supabase 토큰 확인
  const hasSession = request.cookies.getAll().some(cookie => 
    cookie.name.includes('sb-') && cookie.name.includes('auth-token')
  );

  // 보호된 경로에 인증 없이 접근 시 로그인 페이지로 리다이렉트
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  if (isProtectedPath && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인한 사용자가 로그인/회원가입 페이지 접근 시 대시보드로 리다이렉트
  if (hasSession && (pathname === '/login' || pathname === '/signup')) {
    // redirectTo 파라미터가 있으면 해당 경로로, 없으면 대시보드로
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청 경로에 매칭:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * - public 폴더
     * - api 라우트
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
};