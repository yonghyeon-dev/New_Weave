import { ExtractedData, APIResponse } from '@/types/ai-assistant';

// Gemini API 설정
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.0-flash-exp';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// 추출 프롬프트 템플릿
const EXTRACTION_PROMPT = `
You are an expert data extraction specialist. Analyze the provided image or document and extract all relevant information in a structured format.

Please extract the following information if available:
1. Document type (receipt, invoice, tax invoice, contract, business card, etc.)
2. Document number or ID
3. Date
4. Supplier/Sender information (name, business number, address, contact)
5. Buyer/Receiver information (name, business number, address, contact)
6. Item details (name, quantity, unit price, amount, tax)
7. Financial totals (subtotal, tax amount, total amount)
8. Any other relevant information

Return the extracted data in the following JSON format:
{
  "documentType": "type of document",
  "documentNumber": "document number if any",
  "date": "date in YYYY-MM-DD format",
  "supplier": {
    "name": "company or person name",
    "businessNumber": "business registration number",
    "representative": "representative name",
    "address": "full address",
    "email": "email address",
    "phone": "phone number"
  },
  "buyer": {
    "name": "company or person name",
    "businessNumber": "business registration number",
    "representative": "representative name",
    "address": "full address",
    "email": "email address",
    "phone": "phone number"
  },
  "items": [
    {
      "name": "item name",
      "quantity": number,
      "unitPrice": number,
      "amount": number,
      "tax": number
    }
  ],
  "subtotal": number,
  "tax": number,
  "total": number
}

If any field is not found or not applicable, use null.
Ensure all monetary values are numbers, not strings.
For Korean documents, you may see Korean text - extract and translate key information.
`;

/**
 * Gemini API를 사용하여 이미지/PDF에서 데이터 추출
 */
export async function extractDataWithGemini(
  base64Data: string,
  fileType: string
): Promise<APIResponse<ExtractedData>> {
  const startTime = Date.now();

  try {
    // API 키 확인
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }

    // Base64 데이터에서 헤더 제거 (data:image/jpeg;base64, 부분)
    const cleanBase64 = base64Data.split(',')[1] || base64Data;

    // API 요청 본문 구성
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: EXTRACTION_PROMPT
            },
            {
              inline_data: {
                mime_type: fileType,
                data: cleanBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 0.1,
        maxOutputTokens: 2048,
      }
    };

    // API 호출
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API 오류: ${response.status}`);
    }

    const data = await response.json();
    
    // 응답 파싱
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error('API 응답에서 텍스트를 찾을 수 없습니다.');
    }

    // JSON 추출 (코드 블록 제거)
    const jsonMatch = generatedText.match(/```json\n?([\s\S]*?)\n?```/) || 
                     generatedText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('추출된 데이터를 JSON으로 파싱할 수 없습니다.');
    }

    const extractedFields = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    
    // 문서 타입 결정
    const documentType = extractedFields.documentType?.toLowerCase() || 'unknown';
    
    // ExtractedData 형식으로 변환
    const extractedData: ExtractedData = {
      documentType: documentType as any,
      fields: extractedFields,
      confidence: 0.85, // Gemini는 confidence score를 직접 제공하지 않으므로 기본값 사용
      rawText: generatedText,
      structuredData: extractedFields,
      metadata: {
        extractedAt: new Date(),
        processingTime: Date.now() - startTime,
        aiModel: GEMINI_MODEL,
        confidence: {
          overall: 0.85,
          fields: {} // 필드별 confidence는 추후 구현
        }
      }
    };

    return {
      success: true,
      data: extractedData,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        tokenUsage: {
          prompt: data.usageMetadata?.promptTokenCount || 0,
          completion: data.usageMetadata?.candidatesTokenCount || 0,
          total: data.usageMetadata?.totalTokenCount || 0
        }
      }
    };
  } catch (error) {
    console.error('Gemini API 오류:', error);
    
    return {
      success: false,
      error: {
        code: 'EXTRACTION_ERROR',
        message: error instanceof Error ? error.message : '데이터 추출 중 오류가 발생했습니다.',
        details: error
      },
      metadata: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      }
    };
  }
}

/**
 * 문서 생성을 위한 Gemini API 호출
 */
export async function generateDocumentWithGemini(
  template: string,
  data: any
): Promise<APIResponse<string>> {
  const startTime = Date.now();

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }

    const prompt: string = `
다음 템플릿과 데이터를 사용하여 전문적인 문서를 생성해주세요.

템플릿:
${template}

데이터:
${JSON.stringify(data, null, 2)}

요구사항:
1. 템플릿의 {{변수명}} 부분을 제공된 데이터로 치환
2. 전문적이고 격식있는 어조 사용
3. 한국어 비즈니스 문서 형식 준수
4. 마크다운 형식으로 출력
`;

    const requestBody: any = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 1,
        topP: 0.8,
        maxOutputTokens: 4096,
      }
    };

    const response: Response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API 오류: ${response.status}`);
    }

    const responseData: any = await response.json();
    const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('문서 생성에 실패했습니다.');
    }

    return {
      success: true,
      data: generatedText,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        tokenUsage: {
          prompt: responseData.usageMetadata?.promptTokenCount || 0,
          completion: responseData.usageMetadata?.candidatesTokenCount || 0,
          total: responseData.usageMetadata?.totalTokenCount || 0
        }
      }
    };
  } catch (error) {
    console.error('Gemini 문서 생성 오류:', error);
    
    return {
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: error instanceof Error ? error.message : '문서 생성 중 오류가 발생했습니다.',
        details: error
      },
      metadata: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      }
    };
  }
}