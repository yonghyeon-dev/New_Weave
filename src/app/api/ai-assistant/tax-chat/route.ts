/**
 * 세무 전문 RAG 챗봇 API
 * 세무 지식 기반 상담 및 계산 서비스
 */

import { NextRequest, NextResponse } from 'next/server';
import RAGPipeline from '@/lib/rag/ragPipeline';
import TaxKnowledgeBase, { TaxCategory } from '@/lib/tax/taxKnowledgeBase';
import TaxPromptEngine, { TaxConsultationContext } from '@/lib/tax/taxPromptEngine';
import TaxCalculator from '@/lib/tax/taxCalculator';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI 초기화
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// 인스턴스 초기화
const ragPipeline = new RAGPipeline({
  maxContextChunks: 7,
  minSimilarityScore: 0.75,
  useHybridSearch: true,
  includeMetadata: true,
  contextWindow: 6000
});

const taxKnowledgeBase = new TaxKnowledgeBase();
const taxCalculator = new TaxCalculator();

/**
 * 세무 상담 요청 인터페이스
 */
interface TaxConsultationRequest {
  message: string;
  category?: TaxCategory;
  userType?: 'individual' | 'business' | 'corporate';
  taxYear?: number;
  calculationData?: any;
  sessionId?: string;
  messages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

/**
 * POST: 세무 상담 및 계산
 */
export async function POST(request: NextRequest) {
  try {
    const body: TaxConsultationRequest = await request.json();
    const {
      message,
      category = TaxCategory.INCOME_TAX,
      userType = 'individual',
      taxYear = new Date().getFullYear(),
      calculationData,
      messages = []
    } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: '상담 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    // 세무 상담 컨텍스트 생성
    const context: TaxConsultationContext = {
      userType,
      category,
      taxYear,
      specificQuestion: message,
      previousContext: messages.map(m => m.content).join('\n')
    };

    // 계산 요청 감지
    const isCalculationRequest = message.includes('계산') || 
                                 message.includes('얼마') ||
                                 calculationData !== undefined;

    // SSE 스트리밍 설정
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 계산 요청 처리
          if (isCalculationRequest && calculationData) {
            const calculationResult = await handleCalculation(
              category,
              calculationData,
              controller,
              encoder
            );
            
            if (calculationResult) {
              // 계산 결과를 포함한 설명 생성
              await generateCalculationExplanation(
                calculationResult,
                context,
                controller,
                encoder
              );
            }
          } else {
            // 일반 세무 상담
            await handleTaxConsultation(
              message,
              context,
              messages,
              controller,
              encoder
            );
          }

          // 완료 신호
          sendChunk(controller, encoder, {
            type: 'done',
            timestamp: Date.now()
          });

        } catch (error) {
          console.error('세무 상담 오류:', error);
          sendChunk(controller, encoder, {
            type: 'error',
            data: error instanceof Error ? error.message : '상담 처리 실패',
            timestamp: Date.now()
          });
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
    console.error('세무 API 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '세무 상담 실패' 
      },
      { status: 500 }
    );
  }
}

/**
 * 세금 계산 처리
 */
async function handleCalculation(
  category: TaxCategory,
  data: any,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  try {
    let result;

    switch (category) {
      case TaxCategory.INCOME_TAX:
        result = taxCalculator.calculateIncomeTax({
          income: data.income || 0,
          deductions: data.deductions || [],
          credits: data.credits || [],
          year: data.year
        });
        break;

      case TaxCategory.VAT:
        result = taxCalculator.calculateVAT({
          amount: data.amount || 0,
          type: data.type || 'total',
          rate: data.rate
        });
        break;

      case TaxCategory.CORPORATE_TAX:
        result = taxCalculator.calculateCorporateTax({
          income: data.income || 0,
          deductibleExpenses: data.expenses || 0,
          year: data.year,
          isSmallBusiness: data.isSmallBusiness
        });
        break;

      case TaxCategory.CAPITAL_GAINS:
        result = taxCalculator.calculateCapitalGainsTax({
          acquisitionPrice: data.acquisitionPrice || 0,
          salePrice: data.salePrice || 0,
          acquisitionDate: new Date(data.acquisitionDate),
          saleDate: new Date(data.saleDate),
          propertyType: data.propertyType || 'apartment',
          isOnlyHouse: data.isOnlyHouse
        });
        break;

      default:
        throw new Error('지원하지 않는 세금 계산 유형입니다.');
    }

    // 계산 결과 전송
    sendChunk(controller, encoder, {
      type: 'calculation',
      data: result,
      timestamp: Date.now()
    });

    return result;

  } catch (error) {
    console.error('계산 오류:', error);
    sendChunk(controller, encoder, {
      type: 'error',
      data: '세금 계산 중 오류가 발생했습니다.',
      timestamp: Date.now()
    });
    return null;
  }
}

/**
 * 계산 결과 설명 생성
 */
async function generateCalculationExplanation(
  calculationResult: any,
  context: TaxConsultationContext,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  if (!genAI) {
    sendChunk(controller, encoder, {
      type: 'error',
      data: 'AI 모델이 초기화되지 않았습니다.',
      timestamp: Date.now()
    });
    return;
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      maxOutputTokens: 2048,
    }
  });

  // 계산 설명 프롬프트
  const prompt = `다음 세금 계산 결과를 사용자가 이해하기 쉽게 설명해주세요.

계산 유형: ${context.category}
세무년도: ${context.taxYear}

계산 결과:
${JSON.stringify(calculationResult, null, 2)}

설명 요구사항:
1. 계산 과정을 단계별로 설명
2. 적용된 세율과 공제 항목 설명
3. 최종 납부세액 강조
4. 절세 팁 제공 (가능한 경우)
5. 관련 법령 안내

친근하고 이해하기 쉬운 말로 설명해주세요.`;

  try {
    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      sendChunk(controller, encoder, {
        type: 'content',
        data: chunk.text(),
        timestamp: Date.now()
      });
    }
  } catch (error) {
    console.error('설명 생성 오류:', error);
  }
}

/**
 * 일반 세무 상담 처리
 */
async function handleTaxConsultation(
  message: string,
  context: TaxConsultationContext,
  messages: any[],
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  try {
    // 세무 지식 검색
    const relatedKnowledge = taxKnowledgeBase.searchByKeywords(
      message.split(' ').filter(word => word.length > 1)
    );

    // 관련 세무 지식을 RAG 파이프라인에 추가
    if (relatedKnowledge.length > 0) {
      for (const knowledge of relatedKnowledge) {
        await ragPipeline.uploadDocument(
          knowledge.content,
          {
            source: knowledge.title,
            category: knowledge.category,
            userId: 'tax-system',
            tags: knowledge.keywords
          }
        );
      }
    }

    // 시스템 프롬프트 생성
    const systemPrompt = TaxPromptEngine.generateSystemPrompt(context);
    
    // Q&A 프롬프트 생성
    const qaPrompt = TaxPromptEngine.generateQAPrompt(
      message,
      relatedKnowledge.map(k => k.content).join('\n\n')
    );

    // 전체 프롬프트 구성
    const fullPrompt = `${systemPrompt}\n\n${qaPrompt}`;

    // 소스 정보 수집
    let sources: any[] = [];

    // RAG 스트리밍 응답 생성
    const responseStream = ragPipeline.generateStreamingResponse(
      fullPrompt,
      'tax-system',
      messages,
      (foundSources) => {
        sources = foundSources;
        
        // 법령 참조 추가
        const lawReferences = relatedKnowledge
          .flatMap(k => k.relatedLaws)
          .filter((law, index, self) => 
            self.findIndex(l => l.lawName === law.lawName && l.articleNumber === law.articleNumber) === index
          );

        sendChunk(controller, encoder, {
          type: 'sources',
          data: {
            knowledge: sources.map(s => ({
              content: s.chunk.content.substring(0, 200) + '...',
              source: s.chunk.metadata?.source,
              similarity: s.similarity
            })),
            laws: lawReferences
          },
          timestamp: Date.now()
        });
      }
    );

    // 스트림 처리
    for await (const chunk of responseStream) {
      sendChunk(controller, encoder, {
        type: 'content',
        data: chunk,
        timestamp: Date.now()
      });
    }

  } catch (error) {
    console.error('상담 처리 오류:', error);
    throw error;
  }
}

/**
 * 청크 전송 헬퍼
 */
function sendChunk(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  data: any
) {
  const chunk = `data: ${JSON.stringify(data)}\n\n`;
  controller.enqueue(encoder.encode(chunk));
}

/**
 * GET: 세무 지식 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as TaxCategory;
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    let result;

    if (category) {
      // 카테고리별 지식 조회
      const knowledge = taxKnowledgeBase.getKnowledgeByCategory(category);
      const taxRate = taxKnowledgeBase.getTaxRate(category, year);
      
      result = {
        knowledge,
        taxRate,
        category
      };
    } else {
      // 전체 통계
      result = {
        statistics: taxKnowledgeBase.getStatistics(),
        categories: Object.values(TaxCategory)
      };
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('지식 조회 오류:', error);
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
 * PUT: 세무 지식 업데이트
 */
export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: '지식 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const success = taxKnowledgeBase.updateKnowledge(id, updates);

    return NextResponse.json({
      success,
      message: success ? '지식이 업데이트되었습니다.' : '업데이트 실패'
    });

  } catch (error) {
    console.error('업데이트 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '업데이트 실패' 
      },
      { status: 500 }
    );
  }
}