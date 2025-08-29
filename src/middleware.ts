import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './middleware/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 리다이렉트 매핑
  const redirectMap: Record<string, string> = {
    '/': '/dashboard',
    '/home': '/dashboard',
    '/landing': '/dashboard',
    '/business-lookup': '/clients', // 사업자 조회는 클라이언트 관리로 통합
    '/reminders': '/projects/settings', // 리마인더는 프로젝트 설정으로 통합
    '/ai-assistant': '/dashboard', // AI 기능은 각 페이지에 분산 통합됨
    '/document-requests': '/documents', // 문서 요청은 문서 관리로 통합
    '/templates': '/documents', // 템플릿은 문서 관리로 통합
  };

  // 리다이렉트 처리
  if (redirectMap[pathname]) {
    return NextResponse.redirect(new URL(redirectMap[pathname], request.url));
  }

  // Supabase 인증 세션 업데이트
  return await updateSession(request);
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