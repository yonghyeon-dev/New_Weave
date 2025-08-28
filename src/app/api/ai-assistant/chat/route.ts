import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI 초기화
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// 시스템 프롬프트
const SYSTEM_PROMPT = `당신은 도움이 되는 AI 어시스턴트입니다.
한국어로 대화하며, 정확하고 친절한 답변을 제공합니다.
질문에 명확하고 구체적으로 답변하며, 필요시 예시를 제공합니다.
전문적이면서도 이해하기 쉬운 설명을 제공합니다.`;

// 메시지 인터페이스
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// SSE 헬퍼 함수
function createSSEResponse(stream: ReadableStream) {
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// 스트림 청크 전송
function sendChunk(encoder: TextEncoder, controller: ReadableStreamDefaultController, data: any) {
  const chunk = `data: ${JSON.stringify(data)}\n\n`;
  controller.enqueue(encoder.encode(chunk));
}

// POST: 메시지 전송 및 스트리밍 응답
export async function POST(request: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key가 설정되지 않았습니다.' },
        { status: 503 }
      );
    }

    const { message, messages = [], sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: '메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // Gemini 모델 초기화 (gemini-2.5-flash-lite 사용)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });

    // 대화 컨텍스트 구성
    const chatHistory: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10), // 최근 10개 메시지만 컨텍스트로 사용
      { role: 'user', content: message }
    ];

    // 프롬프트 생성
    const prompt = chatHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => {
        const prefix = msg.role === 'user' ? '사용자: ' : 'AI: ';
        return `${prefix}${msg.content}`;
      })
      .join('\n\n');

    const fullPrompt = `${SYSTEM_PROMPT}\n\n대화 내용:\n${prompt}\n\nAI:`;

    // SSE 스트리밍 응답 생성
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const startTime = Date.now();
        let totalText = '';
        let tokenCount = 0;

        try {
          // 스트리밍 생성 시작
          const result = await model.generateContentStream(fullPrompt);
          
          // 스트림 처리
          for await (const chunk of result.stream) {
            const text = chunk.text();
            totalText += text;
            
            // 콘텐츠 청크 전송
            sendChunk(encoder, controller, {
              type: 'content',
              data: text,
              timestamp: Date.now()
            });

            // 토큰 수 추정 (대략 4자 = 1토큰)
            tokenCount = Math.ceil(totalText.length / 4);
          }

          // 처리 완료
          const processingTime = Date.now() - startTime;
          
          // 메타데이터 전송
          sendChunk(encoder, controller, {
            type: 'metadata',
            data: {
              totalTokens: tokenCount,
              processingTime,
              model: 'gemini-2.5-flash-lite'
            },
            timestamp: Date.now()
          });

          // 완료 신호
          sendChunk(encoder, controller, {
            type: 'done',
            timestamp: Date.now()
          });

        } catch (error) {
          console.error('Streaming error:', error);
          
          // 에러 전송
          sendChunk(encoder, controller, {
            type: 'error',
            data: error instanceof Error ? error.message : '스트리밍 중 오류 발생',
            timestamp: Date.now()
          });
        } finally {
          controller.close();
        }
      }
    });

    return createSSEResponse(stream);

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // 폴백: 일반 응답
    if (!genAI) {
      // API 키가 없는 경우 모의 응답
      return NextResponse.json({
        success: true,
        message: '안녕하세요! 저는 AI 어시스턴트입니다. 현재 테스트 모드로 작동 중입니다. 무엇을 도와드릴까요?',
        metadata: {
          model: 'mock',
          processingTime: 100,
          totalTokens: 50
        }
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

// GET: 대화 기록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    // 여기서는 클라이언트 측 LocalStorage를 사용하므로
    // 서버에서는 빈 응답만 반환
    return NextResponse.json({
      success: true,
      message: '대화 기록은 클라이언트에서 관리됩니다.',
      sessionId
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: '대화 기록 조회 실패' },
      { status: 500 }
    );
  }
}

// DELETE: 세션 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    // 클라이언트 측에서 처리하므로 성공 응답만 반환
    return NextResponse.json({
      success: true,
      message: '세션이 삭제되었습니다.',
      sessionId
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: '세션 삭제 실패' },
      { status: 500 }
    );
  }
}

// OPTIONS: CORS 처리
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}