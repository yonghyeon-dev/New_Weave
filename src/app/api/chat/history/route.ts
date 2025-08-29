/**
 * 대화 히스토리 API 엔드포인트
 * 대화 세션 및 메시지 관리
 */

import { NextRequest, NextResponse } from 'next/server';
import ChatHistoryService from '@/lib/chat/chatHistoryService';

/**
 * GET: 대화 세션 목록 조회 또는 검색
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = 'demo-user'; // TODO: 실제 사용자 ID로 변경
    const service = new ChatHistoryService(userId);

    // 검색 모드
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const results = await service.searchChats(searchQuery, {
        limit: parseInt(searchParams.get('limit') || '20'),
        offset: parseInt(searchParams.get('offset') || '0')
      });

      return NextResponse.json({
        success: true,
        data: results
      });
    }

    // 세션 목록 조회
    const sessionId = searchParams.get('sessionId');
    if (sessionId) {
      // 특정 세션의 메시지 조회
      const messages = await service.getMessages(sessionId, {
        limit: parseInt(searchParams.get('limit') || '50'),
        offset: parseInt(searchParams.get('offset') || '0'),
        order: (searchParams.get('order') as 'asc' | 'desc') || 'asc'
      });

      return NextResponse.json({
        success: true,
        data: messages
      });
    }

    // 세션 목록 조회
    const sessions = await service.getSessions({
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      archived: searchParams.get('archived') === 'true',
      starred: searchParams.get('starred') === 'true',
      type: searchParams.get('type') as any,
      sortBy: searchParams.get('sortBy') as any
    });

    return NextResponse.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('히스토리 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '조회 실패' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST: 새 세션 생성 또는 메시지 저장
 */
export async function POST(request: NextRequest) {
  try {
    const userId = 'demo-user'; // TODO: 실제 사용자 ID로 변경
    const service = new ChatHistoryService(userId);
    const body = await request.json();

    // 메시지 저장
    if (body.sessionId && body.message) {
      const message = await service.saveMessage(body.sessionId, body.message);
      
      return NextResponse.json({
        success: true,
        data: message
      });
    }

    // 새 세션 생성
    if (body.createSession) {
      const session = await service.createSession({
        type: body.type || 'general',
        title: body.title,
        metadata: body.metadata
      });

      return NextResponse.json({
        success: true,
        data: session
      });
    }

    // 북마크 추가
    if (body.bookmarkMessageId) {
      await service.bookmarkMessage(body.bookmarkMessageId, body.note);
      
      return NextResponse.json({
        success: true,
        message: '북마크가 추가되었습니다.'
      });
    }

    return NextResponse.json(
      { success: false, error: '잘못된 요청입니다.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('히스토리 저장 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '저장 실패' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT: 세션 업데이트
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = 'demo-user'; // TODO: 실제 사용자 ID로 변경
    const service = new ChatHistoryService(userId);
    const body = await request.json();

    if (!body.sessionId) {
      return NextResponse.json(
        { success: false, error: '세션 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await service.updateSession(body.sessionId, {
      title: body.title,
      summary: body.summary,
      isArchived: body.isArchived,
      isStarred: body.isStarred,
      metadata: body.metadata
    });

    return NextResponse.json({
      success: true,
      message: '세션이 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('세션 업데이트 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '업데이트 실패' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 세션 삭제
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = 'demo-user'; // TODO: 실제 사용자 ID로 변경
    const service = new ChatHistoryService(userId);
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: '세션 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await service.deleteSession(sessionId);

    return NextResponse.json({
      success: true,
      message: '세션이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('세션 삭제 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '삭제 실패' 
      },
      { status: 500 }
    );
  }
}