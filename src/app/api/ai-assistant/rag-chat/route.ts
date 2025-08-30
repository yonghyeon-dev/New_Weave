/**
 * RAG 기반 챗봇 API 엔드포인트
 * 사용자 데이터를 활용한 컨텍스트 기반 응답 생성
 */

import { NextRequest, NextResponse } from 'next/server';
import RAGPipeline from '@/lib/rag/ragPipeline';
import DataProcessor from '@/lib/rag/dataProcessor';
// import { getServerSession } from 'next-auth'; // 세션 관리는 추후 구현

// RAG 파이프라인 인스턴스
const ragPipeline = new RAGPipeline({
  maxContextChunks: 5,
  minSimilarityScore: 0.7,
  useHybridSearch: true,
  includeMetadata: true,
  contextWindow: 4000
});

// 데이터 프로세서 인스턴스
const dataProcessor = new DataProcessor();

/**
 * POST: RAG 기반 채팅 응답
 */
export async function POST(request: NextRequest) {
  try {
    // 세션 확인 (옵션)
    // const session = await getServerSession();
    // const userId = session?.user?.id;
    const userId = 'demo-user'; // 임시 사용자 ID

    const { message, messages = [], sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: '메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // SSE 스트리밍 설정
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let sources: any[] = [];
          
          // 스트리밍 응답 생성
          const responseStream = ragPipeline.generateStreamingResponse(
            message,
            userId,
            messages,
            (foundSources) => {
              sources = foundSources;
              // 소스 정보 전송
              const sourceChunk = `data: ${JSON.stringify({
                type: 'sources',
                data: sources.map(s => ({
                  content: s.chunk.content.substring(0, 200) + '...',
                  source: s.chunk.metadata?.source,
                  similarity: s.similarity
                }))
              })}\n\n`;
              controller.enqueue(encoder.encode(sourceChunk));
            }
          );

          // 스트림 처리
          for await (const chunk of responseStream) {
            const contentChunk = `data: ${JSON.stringify({
              type: 'content',
              data: chunk
            })}\n\n`;
            controller.enqueue(encoder.encode(contentChunk));
          }

          // 완료 신호
          const doneChunk = `data: ${JSON.stringify({
            type: 'done'
          })}\n\n`;
          controller.enqueue(encoder.encode(doneChunk));

        } catch (error) {
          console.error('RAG 스트리밍 오류:', error);
          const errorChunk = `data: ${JSON.stringify({
            type: 'error',
            data: error instanceof Error ? error.message : '응답 생성 실패'
          })}\n\n`;
          controller.enqueue(encoder.encode(errorChunk));
        } finally {
          controller.close();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('RAG API 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'RAG 처리 실패' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT: 문서 업로드 및 인덱싱
 */
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const projectId = formData.get('projectId') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 처리
    const userId = 'demo-user'; // 임시 사용자 ID
    const processed = await dataProcessor.processFile(
      file,
      userId,
      projectId,
      category
    );

    return NextResponse.json({
      success: true,
      data: {
        id: processed.id,
        fileName: processed.fileName,
        chunks: processed.chunks.length,
        wordCount: processed.metadata.wordCount,
        processingTime: processed.metadata.processingTime
      }
    });

  } catch (error) {
    console.error('문서 업로드 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '문서 처리 실패' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 문서 삭제
 */
export async function DELETE(request: NextRequest) {
  try {
    const { documentId } = await request.json();
    
    if (!documentId) {
      return NextResponse.json(
        { success: false, error: '문서 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const success = await ragPipeline.deleteDocument(documentId);

    return NextResponse.json({
      success,
      message: success ? '문서가 삭제되었습니다.' : '문서 삭제 실패'
    });

  } catch (error) {
    console.error('문서 삭제 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '삭제 처리 실패' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET: 사용자 문서 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const userId = 'demo-user'; // 임시 사용자 ID
    const documents = await ragPipeline.getUserDocuments(userId);

    return NextResponse.json({
      success: true,
      data: documents
    });

  } catch (error) {
    console.error('문서 조회 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '조회 실패' 
      },
      { status: 500 }
    );
  }
}