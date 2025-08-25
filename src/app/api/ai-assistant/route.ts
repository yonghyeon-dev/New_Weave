import { NextRequest, NextResponse } from 'next/server';

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

        // 실제 구현에서는 Gemini API를 호출
        // 현재는 모의 응답 반환
        const mockExtractedData = {
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
        };

        // 토큰 사용량 모의 데이터
        const tokenUsage = {
          inputTokens: 1250,
          outputTokens: 320,
          model: 'gemini-2.5-flash-lite',
          cost: 0.0025
        };

        return NextResponse.json({
          success: true,
          data: mockExtractedData,
          tokenUsage
        });
      }
    } else if (contentType.includes('application/json')) {
      // JSON 요청 (문서 생성)
      const body = await request.json();
      const { taskType, documentType, templateId, prompt, clientData, projectData } = body;
      
      if (taskType === 'generate') {
        // 실제 구현에서는 Gemini API를 호출
        // 현재는 모의 응답 반환
        const mockGeneratedDocument = {
          type: documentType,
          title: `${documentType === 'quote' ? '견적서' : documentType === 'contract' ? '계약서' : '청구서'} - ${projectData?.title || '프로젝트'}`,
          content: `# ${projectData?.title || '프로젝트'} ${documentType === 'quote' ? '견적서' : documentType === 'contract' ? '계약서' : '청구서'}

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
본 견적서는 30일간 유효합니다.
`,
          templateId,
          createdAt: new Date().toISOString()
        };

        // 토큰 사용량 모의 데이터
        const tokenUsage = {
          inputTokens: 2100,
          outputTokens: 850,
          model: 'gemini-2.5-flash-lite',
          cost: 0.0045
        };

        return NextResponse.json({
          success: true,
          data: mockGeneratedDocument,
          tokenUsage
        });
      }
    }

    return NextResponse.json(
      { success: false, error: '지원하지 않는 작업 유형입니다.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('AI Assistant API Error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}