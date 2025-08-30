/**
 * 세무 전문 프롬프트 엔지니어링
 * 정확하고 신뢰할 수 있는 세무 상담을 위한 프롬프트 설계
 */

import { TaxCategory } from './taxKnowledgeBase';

/**
 * 세무 상담 컨텍스트
 */
export interface TaxConsultationContext {
  userType: 'individual' | 'business' | 'corporate';
  category: TaxCategory;
  taxYear: number;
  specificQuestion?: string;
  previousContext?: string;
  relatedDocuments?: string[];
}

/**
 * 세무 프롬프트 엔진
 */
export class TaxPromptEngine {
  /**
   * 시스템 프롬프트 생성
   */
  static generateSystemPrompt(context: TaxConsultationContext): string {
    return `당신은 한국 세법에 정통한 전문 세무 컨설턴트입니다.
    
역할과 책임:
1. 정확한 세법 정보 제공
2. 실무적이고 구체적인 세무 조언
3. 복잡한 세무 개념을 쉽게 설명
4. 최신 세법 개정사항 반영
5. 법적 책임을 명확히 고지

중요 원칙:
- 항상 ${context.taxYear}년 기준 세법을 적용합니다
- 불확실한 정보는 추측하지 않고 명확히 안내합니다
- 구체적인 세금 계산 시 반드시 계산 과정을 보여줍니다
- 법적 조언이 필요한 경우 전문가 상담을 권유합니다
- 개인정보 보호를 최우선으로 합니다

사용자 유형: ${this.getUserTypeDescription(context.userType)}
상담 분야: ${this.getCategoryDescription(context.category)}

답변 시 주의사항:
1. 관련 법조문을 인용할 때는 정확한 조항을 명시
2. 세금 계산 시 단계별로 상세히 설명
3. 신고 기한과 절차를 명확히 안내
4. 가능한 절세 방안을 제시
5. 필요한 증빙서류를 구체적으로 안내`;
  }

  /**
   * 사용자 유형별 설명
   */
  private static getUserTypeDescription(userType: string): string {
    const descriptions: Record<string, string> = {
      'individual': '개인 납세자 (근로소득자, 프리랜서 등)',
      'business': '개인사업자 (자영업자, 소규모 사업자)',
      'corporate': '법인사업자 (주식회사, 유한회사 등)'
    };
    return descriptions[userType] || '일반 납세자';
  }

  /**
   * 카테고리별 설명
   */
  private static getCategoryDescription(category: TaxCategory): string {
    const descriptions: Record<TaxCategory, string> = {
      [TaxCategory.INCOME_TAX]: '종합소득세 (사업, 근로, 이자, 배당, 연금, 기타소득)',
      [TaxCategory.EARNED_INCOME]: '근로소득세 및 연말정산',
      [TaxCategory.VAT]: '부가가치세 (매출세액, 매입세액)',
      [TaxCategory.CORPORATE_TAX]: '법인세',
      [TaxCategory.CAPITAL_GAINS]: '양도소득세 (부동산, 주식)',
      [TaxCategory.GIFT_TAX]: '증여세',
      [TaxCategory.INHERITANCE_TAX]: '상속세',
      [TaxCategory.BUSINESS_INCOME]: '사업소득세',
      [TaxCategory.LOCAL_TAX]: '지방세 (취득세, 재산세 등)',
      [TaxCategory.PROPERTY_TAX]: '재산세',
      [TaxCategory.ACQUISITION_TAX]: '취득세',
      [TaxCategory.STAMP_TAX]: '인지세',
      [TaxCategory.TAX_CREDIT]: '세액공제',
      [TaxCategory.TAX_DEDUCTION]: '소득공제'
    };
    return descriptions[category] || '일반 세무 상담';
  }

  /**
   * 세금 계산 요청 프롬프트
   */
  static generateCalculationPrompt(
    category: TaxCategory,
    data: Record<string, any>
  ): string {
    let prompt = `다음 정보를 바탕으로 ${this.getCategoryDescription(category)}를 계산해주세요.\n\n`;
    
    prompt += '입력 정보:\n';
    for (const [key, value] of Object.entries(data)) {
      prompt += `- ${this.translateFieldName(key)}: ${this.formatValue(value)}\n`;
    }
    
    prompt += `
계산 요구사항:
1. 적용 세율과 세율 구간을 명시
2. 각 단계별 계산 과정을 상세히 설명
3. 적용 가능한 공제 항목 안내
4. 최종 납부세액 산출
5. 관련 법령 근거 제시

주의: 계산 시 ${new Date().getFullYear()}년 세법 기준을 적용하고, 
모든 금액은 원 단위로 표시하며 천 단위 구분 기호(,)를 사용하세요.`;

    return prompt;
  }

  /**
   * 필드명 한글 변환
   */
  private static translateFieldName(fieldName: string): string {
    const translations: Record<string, string> = {
      'income': '소득금액',
      'revenue': '수입금액',
      'expense': '필요경비',
      'deduction': '소득공제',
      'tax_credit': '세액공제',
      'supply_value': '공급가액',
      'vat_amount': '부가세액',
      'acquisition_price': '취득가액',
      'sale_price': '양도가액',
      'holding_period': '보유기간',
      'dependents': '부양가족수',
      'insurance_premium': '보험료',
      'medical_expense': '의료비',
      'education_expense': '교육비',
      'donation': '기부금'
    };
    return translations[fieldName] || fieldName;
  }

  /**
   * 값 포맷팅
   */
  private static formatValue(value: any): string {
    if (typeof value === 'number') {
      return value.toLocaleString('ko-KR') + '원';
    }
    if (value instanceof Date) {
      return value.toLocaleDateString('ko-KR');
    }
    return String(value);
  }

  /**
   * 문서 분석 프롬프트
   */
  static generateDocumentAnalysisPrompt(
    documentType: string,
    extractedText: string
  ): string {
    return `다음 ${documentType} 문서에서 세무 관련 정보를 추출하고 분석해주세요.

문서 내용:
${extractedText}

분석 요구사항:
1. 주요 세무 정보 추출
   - 거래일자
   - 거래처 정보 (사업자번호, 상호)
   - 금액 정보 (공급가액, 부가세)
   - 품목 및 수량

2. 세무 처리 방법 안내
   - 적용 가능한 비용 처리
   - 필요한 추가 증빙
   - 세무 신고 시 주의사항

3. 문서 유효성 검증
   - 필수 기재사항 확인
   - 세법상 적격 증빙 여부

4. 추가 조치사항
   - 보완이 필요한 사항
   - 관련 서류 준비사항`;
  }

  /**
   * 오류 처리 프롬프트
   */
  static generateErrorHandlingPrompt(error: string): string {
    return `세무 상담 중 다음과 같은 상황이 발생했습니다:
${error}

안내사항:
1. 이 문제가 발생한 이유를 간단히 설명
2. 사용자가 취할 수 있는 조치 방법
3. 추가로 필요한 정보나 서류
4. 대안적인 해결 방법 제시

주의: 기술적인 용어는 피하고 일반 사용자가 이해할 수 있는 언어로 설명해주세요.`;
  }

  /**
   * 컴플라이언스 체크 프롬프트
   */
  static generateComplianceCheckPrompt(
    category: TaxCategory,
    situation: string
  ): string {
    return `다음 상황에 대한 세법 준수 사항을 검토해주세요.

세무 분야: ${this.getCategoryDescription(category)}
상황 설명: ${situation}

검토 항목:
1. 법적 의무사항
   - 신고 의무
   - 납부 기한
   - 보관 의무

2. 필요 서류
   - 제출 서류
   - 증빙 서류
   - 보관 서류

3. 주의사항
   - 가산세 발생 요인
   - 세무조사 대상 여부
   - 형사처벌 가능성

4. 권장사항
   - 절세 방안
   - 리스크 관리
   - 전문가 상담 필요성

모든 답변은 현행 세법에 근거하여 제공하고, 
불확실한 부분은 명확히 표시해주세요.`;
  }

  /**
   * Q&A 형식 프롬프트
   */
  static generateQAPrompt(question: string, context?: string): string {
    let prompt = `세무 관련 질문에 답변해주세요.

질문: ${question}`;

    if (context) {
      prompt += `\n\n추가 정보:\n${context}`;
    }

    prompt += `

답변 형식:
1. 핵심 답변 (1-2문장으로 요약)
2. 상세 설명
3. 실무 예시 (가능한 경우)
4. 관련 법령 또는 규정
5. 추가 고려사항

주의사항:
- 정확한 정보만 제공
- 추측이나 불확실한 정보는 명시
- 필요시 전문가 상담 권유`;

    return prompt;
  }

  /**
   * 대화 컨텍스트 유지 프롬프트
   */
  static generateContextualPrompt(
    currentQuestion: string,
    previousQA: Array<{question: string; answer: string}>
  ): string {
    let prompt = '이전 대화 내용:\n';
    
    previousQA.slice(-3).forEach((qa, index) => {
      prompt += `\n[질문 ${index + 1}] ${qa.question}\n`;
      prompt += `[답변 ${index + 1}] ${qa.answer}\n`;
    });

    prompt += `\n현재 질문: ${currentQuestion}\n\n`;
    prompt += `이전 대화 내용을 참고하여 일관성 있게 답변해주세요. 
필요한 경우 이전 답변을 수정하거나 보완할 수 있습니다.`;

    return prompt;
  }

  /**
   * 신고서 작성 도움 프롬프트
   */
  static generateTaxReturnAssistancePrompt(
    taxType: string,
    stage: 'preparation' | 'filling' | 'review'
  ): string {
    const prompts = {
      preparation: `${taxType} 신고를 준비하고 있습니다.

필요한 준비사항을 안내해주세요:
1. 준비해야 할 서류 목록
2. 수집해야 할 정보
3. 신고 전 확인사항
4. 예상 소요 시간
5. 주의사항`,

      filling: `${taxType} 신고서를 작성 중입니다.

작성 가이드를 제공해주세요:
1. 각 항목별 작성 방법
2. 자주 하는 실수와 예방법
3. 공제 및 감면 항목 확인
4. 첨부서류 체크리스트
5. 최종 검토 사항`,

      review: `${taxType} 신고서 검토를 요청합니다.

다음을 확인해주세요:
1. 필수 항목 누락 여부
2. 계산 오류 가능성
3. 놓친 공제 항목
4. 추가 절세 방안
5. 제출 전 최종 체크리스트`
    };

    return prompts[stage];
  }
}

export default TaxPromptEngine;