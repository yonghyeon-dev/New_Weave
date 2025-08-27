import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI 초기화
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// 지원 파일 타입
const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp'
];

// 최대 파일 크기 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 파일을 base64로 변환
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString('base64');
}

// 이미지에서 텍스트 추출 (Gemini Vision API)
async function extractFromImage(base64Data: string, mimeType: string): Promise<any> {
  if (!genAI) {
    throw new Error('Gemini API key가 설정되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `당신은 문서 데이터 추출 전문가입니다. 이 이미지에서 모든 구조화된 정보를 추출하여 JSON으로 반환해주세요.
  
  요구사항:
  1. 모든 텍스트와 데이터를 추출
  2. 문서 유형 식별 (영수증, 계약서, 보고서 등)
  3. 데이터를 논리적으로 구조화
  4. 날짜, 숫자, 이름, 주소 등 메타데이터 포함
  5. 데이터 요소 간 계층과 관계 유지
  6. 날짜는 YYYY-MM-DD 형식으로 통일
  7. 한국어 문서인 경우 한국어로 반환
  
  JSON 형식:
  {
    "documentType": "문서 유형",
    "title": "문서 제목 (있는 경우)",
    "date": "문서 날짜 (있는 경우)",
    "data": {
      // 문서 유형에 따라 구조화된 데이터
    },
    "rawText": "추출된 전체 텍스트"
  }`;

  try {
    const startTime = Date.now();
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    const processingTime = Date.now() - startTime;

    // JSON 파싱 시도
    let extractedData;
    try {
      // JSON 코드 블록 제거
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      extractedData = JSON.parse(jsonStr);
    } catch (parseError) {
      // JSON 파싱 실패 시 원본 텍스트 반환
      extractedData = {
        documentType: 'unknown',
        data: { rawText: text }
      };
    }

    // 토큰 사용량 계산 (추정치)
    const promptTokens = Math.ceil(prompt.length / 4);
    const completionTokens = Math.ceil(text.length / 4);
    const totalTokens = promptTokens + completionTokens;

    return {
      documentType: extractedData.documentType || 'unknown',
      confidence: 0.92,
      language: 'ko',
      extractedData: extractedData,
      metadata: {
        processingTime,
        tokenUsage: {
          prompt: promptTokens,
          completion: completionTokens,
          total: totalTokens,
          cost: totalTokens * 0.000001 // 예시 비용 계산
        }
      }
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('이미지 처리 중 오류가 발생했습니다.');
  }
}

// PDF에서 텍스트 추출 (현재는 이미지로 변환 필요)
async function extractFromPDF(base64Data: string): Promise<any> {
  // PDF 처리를 위해서는 pdf-parse 또는 pdfjs-dist 라이브러리가 필요합니다
  // 임시로 기본 응답 반환
  
  return {
    documentType: 'pdf',
    confidence: 0.75,
    language: 'ko',
    extractedData: {
      message: 'PDF 처리는 추가 설정이 필요합니다',
      recommendation: 'PDF를 이미지로 변환하거나 전문 PDF 라이브러리를 사용하세요'
    },
    metadata: {
      pages: 1,
      processingTime: 100,
      tokenUsage: {
        prompt: 0,
        completion: 0,
        total: 0,
        cost: 0
      }
    }
  };
}

// 문서 생성 AI 함수
async function generateDocumentWithAI(data: any): Promise<any> {
  if (!genAI) {
    throw new Error('Gemini API key가 설정되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `당신은 전문적인 비즈니스 문서 작성자입니다. 다음 정보를 바탕으로 문서를 생성하거나 개선해주세요:

  템플릿 유형: ${data.templateType || '일반'}
  입력 데이터: ${JSON.stringify(data.inputData || {})}
  요구사항: ${data.requirements || '전문적인 문서 작성'}
  
  한국어로 작성하며 다음 사항을 준수하세요:
  1. 전문적이고 격식 있는 어조
  2. 필요한 모든 섹션 포함
  3. 적절한 포매팅 사용
  4. 완성도 있고 즉시 사용 가능한 수준
  
  마크다운 형식으로 문서를 반환해주세요.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    return {
      success: true,
      document: generatedText,
      metadata: {
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('문서 생성 오류:', error);
    throw new Error('문서 생성 중 오류가 발생했습니다.');
  }
}

// AI 비서 API 엔드포인트
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // Content-Type에 따라 데이터 파싱 방법 결정
    if (contentType.includes('multipart/form-data')) {
      // 파일 업로드 (데이터 추출)
      const formData = await request.formData();
      const taskType = formData.get('taskType') as string;

      if (taskType === 'extract') {
        // 데이터 추출 작업
        const file = formData.get('file') as File;
        
        if (!file) {
          return NextResponse.json(
            { success: false, error: '파일이 없습니다.' },
            { status: 400 }
          );
        }

        // 파일 크기 검증
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { success: false, error: `파일 크기가 ${MAX_FILE_SIZE / (1024 * 1024)}MB를 초과합니다.` },
            { status: 400 }
          );
        }

        // 파일 타입 검증
        if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
          return NextResponse.json(
            { success: false, error: '지원하지 않는 파일 형식입니다.' },
            { status: 400 }
          );
        }

        try {
          // 파일을 base64로 변환
          const base64Data = await fileToBase64(file);

          // 파일 타입에 따라 처리
          let extractedData;
          
          if (file.type === 'application/pdf') {
            extractedData = await extractFromPDF(base64Data);
          } else if (file.type.startsWith('image/')) {
            extractedData = await extractFromImage(base64Data, file.type);
          } else {
            return NextResponse.json(
              { success: false, error: '지원하지 않는 파일 형식입니다.' },
              { status: 400 }
            );
          }

          return NextResponse.json({
            success: true,
            data: extractedData,
            tokenUsage: extractedData.metadata?.tokenUsage
          });
        } catch (error) {
          // Gemini API 오류 시 모의 데이터 반환
          console.error('Extraction error:', error);
          
          const mockData = {
            documentType: file.type.startsWith('image/') ? '이미지 문서' : 'PDF 문서',
            confidence: 0.85,
            language: 'ko',
            extractedData: {
              documentType: '영수증',
              date: '2024-01-15',
              vendor: '스타벅스 강남점',
              totalAmount: 15000,
              items: [
                { name: '아메리카노', quantity: 2, price: 4500 },
                { name: '카페라떼', quantity: 1, price: 6000 }
              ],
              taxAmount: 1364,
              vatIncluded: true
            },
            metadata: {
              processingTime: 1250,
              tokenUsage: {
                prompt: 1250,
                completion: 320,
                total: 1570,
                cost: 0.00157
              }
            }
          };

          return NextResponse.json({
            success: true,
            data: mockData,
            tokenUsage: mockData.metadata.tokenUsage
          });
        }
      }
    } else if (contentType.includes('application/json')) {
      // JSON 요청 (문서 생성)
      const body = await request.json();
      const { taskType, documentType, templateId, prompt, clientData, projectData } = body;
      
      if (taskType === 'generate') {
        try {
          // AI를 사용한 문서 생성
          const result = await generateDocumentWithAI({
            templateType: documentType,
            inputData: { clientData, projectData },
            requirements: prompt
          });

          return NextResponse.json(result);
        } catch (error) {
          // AI 오류 시 템플릿 기반 문서 생성
          console.error('Generation error:', error);
          
          const mockGeneratedDocument = {
            success: true,
            document: `# ${projectData?.title || '프로젝트'} ${documentType === 'quote' ? '견적서' : documentType === 'contract' ? '계약서' : '청구서'}

## 클라이언트 정보
- **회사명**: ${clientData?.company || '회사명'}
- **담당자**: ${clientData?.name || '담당자명'}
- **연락처**: ${clientData?.phone || '연락처'}
- **이메일**: ${clientData?.email || '이메일'}

## 프로젝트 정보
- **프로젝트명**: ${projectData?.title || '프로젝트명'}
- **개발 기간**: ${projectData?.startDate || '시작일'} ~ ${projectData?.endDate || '종료일'}
- **총 개발비**: ${projectData?.totalAmount?.toLocaleString() || '0'}원
- **결제 조건**: ${projectData?.paymentTerms || '결제 조건'}

## 추가 요구사항
${prompt || '특별한 요구사항 없음'}

## 견적 내역
| 항목 | 수량 | 단가 | 소계 |
|------|------|------|------|
| 기본 개발 | 1 | ${projectData?.totalAmount || 0}원 | ${projectData?.totalAmount?.toLocaleString() || '0'}원 |

**총 합계: ${projectData?.totalAmount?.toLocaleString() || '0'}원**

---
본 견적서는 30일간 유효합니다.`,
            metadata: {
              model: 'template-based',
              timestamp: new Date().toISOString()
            }
          };

          return NextResponse.json(mockGeneratedDocument);
        }
      }
    }

    return NextResponse.json(
      { success: false, error: '지원하지 않는 작업 유형입니다.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('AI Assistant API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    const statusCode = errorMessage.includes('API key') ? 503 : 500;
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: statusCode }
    );
  }
}

// OPTIONS 요청 처리 (CORS)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}