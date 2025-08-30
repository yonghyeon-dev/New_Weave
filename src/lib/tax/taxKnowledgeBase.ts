/**
 * 세무 전문 지식 베이스
 * 한국 세법 및 세무 관련 도메인 지식 구조
 */

/**
 * 세무 카테고리 정의
 */
export enum TaxCategory {
  // 개인 세금
  INCOME_TAX = 'income_tax',           // 종합소득세
  EARNED_INCOME = 'earned_income',     // 근로소득세
  CAPITAL_GAINS = 'capital_gains',     // 양도소득세
  GIFT_TAX = 'gift_tax',              // 증여세
  INHERITANCE_TAX = 'inheritance_tax', // 상속세
  
  // 사업자 세금
  VAT = 'vat',                        // 부가가치세
  CORPORATE_TAX = 'corporate_tax',    // 법인세
  BUSINESS_INCOME = 'business_income', // 사업소득세
  LOCAL_TAX = 'local_tax',            // 지방세
  
  // 기타
  PROPERTY_TAX = 'property_tax',      // 재산세
  ACQUISITION_TAX = 'acquisition_tax', // 취득세
  STAMP_TAX = 'stamp_tax',            // 인지세
  TAX_CREDIT = 'tax_credit',          // 세액공제
  TAX_DEDUCTION = 'tax_deduction'     // 소득공제
}

/**
 * 세무 지식 구조
 */
export interface TaxKnowledge {
  id: string;
  category: TaxCategory;
  subcategory?: string;
  title: string;
  content: string;
  keywords: string[];
  relatedLaws: LawReference[];
  examples?: TaxExample[];
  calculationFormula?: string;
  effectiveDate: Date;
  expiryDate?: Date;
  metadata: {
    source: string;
    lastUpdated: Date;
    verifiedBy?: string;
    confidence: number; // 0-1
  };
}

/**
 * 법령 참조
 */
export interface LawReference {
  lawName: string;          // 예: "소득세법"
  articleNumber: string;    // 예: "제51조"
  clause?: string;          // 예: "제1항"
  description: string;
  url?: string;
}

/**
 * 세무 예시
 */
export interface TaxExample {
  scenario: string;
  calculation: string;
  result: string;
  explanation: string;
}

/**
 * 세율 테이블
 */
export interface TaxRateTable {
  category: TaxCategory;
  year: number;
  rates: TaxRate[];
  specialCases?: SpecialCase[];
}

/**
 * 세율 구간
 */
export interface TaxRate {
  minAmount: number;
  maxAmount?: number;
  rate: number;           // 퍼센트 (예: 6, 15, 24)
  deduction?: number;     // 누진공제액
  description?: string;
}

/**
 * 특수 케이스
 */
export interface SpecialCase {
  condition: string;
  rate?: number;
  deduction?: number;
  description: string;
}

/**
 * 세무 지식 베이스 클래스
 */
export class TaxKnowledgeBase {
  private knowledge: Map<string, TaxKnowledge>;
  private taxRates: Map<string, TaxRateTable>;

  constructor() {
    this.knowledge = new Map();
    this.taxRates = new Map();
    this.initializeKnowledge();
  }

  /**
   * 기본 세무 지식 초기화
   */
  private initializeKnowledge() {
    // 종합소득세 세율 (2024년 기준)
    const incomeTaxRates: TaxRateTable = {
      category: TaxCategory.INCOME_TAX,
      year: 2024,
      rates: [
        { minAmount: 0, maxAmount: 14000000, rate: 6, deduction: 0 },
        { minAmount: 14000000, maxAmount: 50000000, rate: 15, deduction: 1260000 },
        { minAmount: 50000000, maxAmount: 88000000, rate: 24, deduction: 5760000 },
        { minAmount: 88000000, maxAmount: 150000000, rate: 35, deduction: 15440000 },
        { minAmount: 150000000, maxAmount: 300000000, rate: 38, deduction: 19940000 },
        { minAmount: 300000000, maxAmount: 500000000, rate: 40, deduction: 25940000 },
        { minAmount: 500000000, maxAmount: 1000000000, rate: 42, deduction: 35940000 },
        { minAmount: 1000000000, rate: 45, deduction: 65940000 }
      ]
    };

    // 부가가치세 세율
    const vatRates: TaxRateTable = {
      category: TaxCategory.VAT,
      year: 2024,
      rates: [
        { minAmount: 0, rate: 10, description: "일반 세율" }
      ],
      specialCases: [
        { condition: "영세율", rate: 0, description: "수출품, 국제운송 등" },
        { condition: "면세", description: "기초생활필수품, 의료서비스 등" }
      ]
    };

    // 법인세 세율 (2024년 기준)
    const corporateTaxRates: TaxRateTable = {
      category: TaxCategory.CORPORATE_TAX,
      year: 2024,
      rates: [
        { minAmount: 0, maxAmount: 200000000, rate: 9, description: "중소기업 특례" },
        { minAmount: 200000000, maxAmount: 2000000000, rate: 19 },
        { minAmount: 2000000000, maxAmount: 300000000000, rate: 21 },
        { minAmount: 300000000000, rate: 24 }
      ]
    };

    this.taxRates.set('income_tax_2024', incomeTaxRates);
    this.taxRates.set('vat_2024', vatRates);
    this.taxRates.set('corporate_tax_2024', corporateTaxRates);

    // 기본 지식 추가
    this.addKnowledge({
      id: 'kt_001',
      category: TaxCategory.INCOME_TAX,
      title: '종합소득세 신고 대상',
      content: `종합소득세는 개인이 1년간 경제활동으로 얻은 소득에 대하여 납부하는 세금입니다.
      
신고 대상:
1. 사업소득이 있는 자
2. 2곳 이상에서 근로소득이 있는 자
3. 금융소득(이자, 배당)이 연 2,000만원을 초과하는 자
4. 기타소득이 연 300만원을 초과하는 자
5. 연금소득이 있는 자 (일정 금액 이상)

신고 기한: 다음해 5월 1일 ~ 5월 31일`,
      keywords: ['종합소득세', '신고', '대상', '기한'],
      relatedLaws: [
        {
          lawName: '소득세법',
          articleNumber: '제70조',
          description: '종합소득과세표준 확정신고',
          url: 'https://www.law.go.kr/법령/소득세법'
        }
      ],
      effectiveDate: new Date('2024-01-01'),
      metadata: {
        source: '국세청',
        lastUpdated: new Date(),
        confidence: 1.0
      }
    });

    this.addKnowledge({
      id: 'kt_002',
      category: TaxCategory.VAT,
      title: '부가가치세 과세 대상',
      content: `부가가치세는 재화 또는 용역의 공급과 재화의 수입에 대하여 과세됩니다.

과세 대상:
1. 사업자가 행하는 재화 또는 용역의 공급
2. 재화의 수입

세율:
- 일반세율: 10%
- 영세율: 0% (수출, 국제운송 등)
- 면세: 과세 제외 (기초생활필수품, 의료서비스 등)

신고 및 납부:
- 일반과세자: 분기별 신고 (1기: 1~6월, 2기: 7~12월)
- 간이과세자: 연 1회 신고`,
      keywords: ['부가가치세', 'VAT', '과세', '세율'],
      relatedLaws: [
        {
          lawName: '부가가치세법',
          articleNumber: '제1조',
          description: '과세대상',
          url: 'https://www.law.go.kr/법령/부가가치세법'
        }
      ],
      effectiveDate: new Date('2024-01-01'),
      metadata: {
        source: '국세청',
        lastUpdated: new Date(),
        confidence: 1.0
      }
    });
  }

  /**
   * 지식 추가
   */
  addKnowledge(knowledge: TaxKnowledge): void {
    this.knowledge.set(knowledge.id, knowledge);
  }

  /**
   * 카테고리별 지식 조회
   */
  getKnowledgeByCategory(category: TaxCategory): TaxKnowledge[] {
    return Array.from(this.knowledge.values())
      .filter(k => k.category === category);
  }

  /**
   * 키워드 검색
   */
  searchByKeywords(keywords: string[]): TaxKnowledge[] {
    return Array.from(this.knowledge.values())
      .filter(k => 
        keywords.some(keyword => 
          k.keywords.includes(keyword) || 
          k.content.includes(keyword) ||
          k.title.includes(keyword)
        )
      );
  }

  /**
   * 세율 조회
   */
  getTaxRate(category: TaxCategory, year: number): TaxRateTable | undefined {
    return this.taxRates.get(`${category}_${year}`);
  }

  /**
   * 세금 계산을 위한 세율 조회
   */
  calculateTaxRate(category: TaxCategory, amount: number, year: number = 2024): {
    rate: number;
    deduction: number;
    description?: string;
  } | null {
    const rateTable = this.getTaxRate(category, year);
    if (!rateTable) return null;

    const applicableRate = rateTable.rates.find(r => 
      amount >= r.minAmount && (!r.maxAmount || amount < r.maxAmount)
    );

    if (!applicableRate) return null;

    return {
      rate: applicableRate.rate,
      deduction: applicableRate.deduction || 0,
      description: applicableRate.description
    };
  }

  /**
   * 관련 법령 조회
   */
  getRelatedLaws(knowledgeId: string): LawReference[] {
    const knowledge = this.knowledge.get(knowledgeId);
    return knowledge?.relatedLaws || [];
  }

  /**
   * 지식 업데이트
   */
  updateKnowledge(id: string, updates: Partial<TaxKnowledge>): boolean {
    const existing = this.knowledge.get(id);
    if (!existing) return false;

    this.knowledge.set(id, {
      ...existing,
      ...updates,
      metadata: {
        ...existing.metadata,
        lastUpdated: new Date()
      }
    });

    return true;
  }

  /**
   * 전체 지식 베이스 내보내기
   */
  exportKnowledgeBase(): TaxKnowledge[] {
    return Array.from(this.knowledge.values());
  }

  /**
   * 지식 베이스 통계
   */
  getStatistics(): {
    totalKnowledge: number;
    byCategory: Record<string, number>;
    lastUpdated: Date;
  } {
    const stats = {
      totalKnowledge: this.knowledge.size,
      byCategory: {} as Record<string, number>,
      lastUpdated: new Date()
    };

    for (const knowledge of this.knowledge.values()) {
      stats.byCategory[knowledge.category] = 
        (stats.byCategory[knowledge.category] || 0) + 1;
    }

    return stats;
  }
}

export default TaxKnowledgeBase;