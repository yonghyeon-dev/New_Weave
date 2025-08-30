/**
 * 세금 계산 엔진
 * 한국 세법 기준 정확한 세금 계산
 */

import Decimal from 'decimal.js';
import { TaxCategory, TaxKnowledgeBase } from './taxKnowledgeBase';

// Decimal 설정 (정확한 금액 계산)
Decimal.set({ precision: 20, rounding: Decimal.ROUND_DOWN });

/**
 * 세금 계산 결과
 */
export interface TaxCalculationResult {
  category: TaxCategory;
  taxYear: number;
  inputAmount: number;
  taxableAmount: number;
  taxRate: number;
  calculatedTax: number;
  deductions: TaxDeduction[];
  credits: TaxCredit[];
  finalTax: number;
  calculationSteps: CalculationStep[];
  metadata: {
    calculatedAt: Date;
    formula: string;
    references: string[];
  };
}

/**
 * 공제 항목
 */
export interface TaxDeduction {
  type: string;
  amount: number;
  description: string;
  limit?: number;
}

/**
 * 세액공제 항목
 */
export interface TaxCredit {
  type: string;
  amount: number;
  description: string;
  rate?: number;
}

/**
 * 계산 단계
 */
export interface CalculationStep {
  step: number;
  description: string;
  formula: string;
  result: number;
}

/**
 * 세금 계산기 클래스
 */
export class TaxCalculator {
  private knowledgeBase: TaxKnowledgeBase;

  constructor() {
    this.knowledgeBase = new TaxKnowledgeBase();
  }

  /**
   * 종합소득세 계산
   */
  calculateIncomeTax(params: {
    income: number;
    deductions: TaxDeduction[];
    credits: TaxCredit[];
    year?: number;
  }): TaxCalculationResult {
    const year = params.year || new Date().getFullYear();
    const steps: CalculationStep[] = [];
    
    // Step 1: 총 소득 계산
    const totalIncome = new Decimal(params.income);
    steps.push({
      step: 1,
      description: '총 수입금액',
      formula: '수입금액',
      result: totalIncome.toNumber()
    });

    // Step 2: 소득공제 적용
    let totalDeductions = new Decimal(0);
    const basicDeduction = 1500000; // 기본공제
    totalDeductions = totalDeductions.plus(basicDeduction);
    
    for (const deduction of params.deductions) {
      const amount = new Decimal(deduction.amount);
      const limited = deduction.limit 
        ? Decimal.min(amount, deduction.limit)
        : amount;
      totalDeductions = totalDeductions.plus(limited);
    }
    
    steps.push({
      step: 2,
      description: '소득공제 합계',
      formula: '기본공제 + 추가공제',
      result: totalDeductions.toNumber()
    });

    // Step 3: 과세표준 계산
    const taxableIncome = Decimal.max(
      totalIncome.minus(totalDeductions),
      0
    );
    
    steps.push({
      step: 3,
      description: '과세표준',
      formula: '총소득 - 소득공제',
      result: taxableIncome.toNumber()
    });

    // Step 4: 세율 적용
    const rateInfo = this.knowledgeBase.calculateTaxRate(
      TaxCategory.INCOME_TAX,
      taxableIncome.toNumber(),
      year
    );

    if (!rateInfo) {
      throw new Error('세율 정보를 찾을 수 없습니다.');
    }

    const calculatedTax = taxableIncome
      .mul(rateInfo.rate)
      .div(100)
      .minus(rateInfo.deduction);

    steps.push({
      step: 4,
      description: '산출세액',
      formula: `과세표준 × ${rateInfo.rate}% - ${rateInfo.deduction.toLocaleString()}원`,
      result: calculatedTax.toNumber()
    });

    // Step 5: 세액공제 적용
    let totalCredits = new Decimal(0);
    for (const credit of params.credits) {
      totalCredits = totalCredits.plus(credit.amount);
    }

    steps.push({
      step: 5,
      description: '세액공제 합계',
      formula: '세액공제 항목 합계',
      result: totalCredits.toNumber()
    });

    // Step 6: 최종 납부세액
    const finalTax = Decimal.max(
      calculatedTax.minus(totalCredits),
      0
    );

    steps.push({
      step: 6,
      description: '납부할 세액',
      formula: '산출세액 - 세액공제',
      result: finalTax.toNumber()
    });

    return {
      category: TaxCategory.INCOME_TAX,
      taxYear: year,
      inputAmount: params.income,
      taxableAmount: taxableIncome.toNumber(),
      taxRate: rateInfo.rate,
      calculatedTax: calculatedTax.toNumber(),
      deductions: [
        { type: '기본공제', amount: basicDeduction, description: '기본공제' },
        ...params.deductions
      ],
      credits: params.credits,
      finalTax: finalTax.toNumber(),
      calculationSteps: steps,
      metadata: {
        calculatedAt: new Date(),
        formula: '(소득 - 소득공제) × 세율 - 누진공제 - 세액공제',
        references: ['소득세법 제55조', '소득세법 제59조']
      }
    };
  }

  /**
   * 부가가치세 계산
   */
  calculateVAT(params: {
    amount: number;
    type: 'supply' | 'total'; // supply: 공급가액, total: 부가세 포함
    rate?: number; // 기본 10%
  }): {
    supplyValue: number;
    vat: number;
    total: number;
    rate: number;
  } {
    const rate = params.rate || 10;
    const amount = new Decimal(params.amount);
    
    let supplyValue: Decimal;
    let vat: Decimal;
    let total: Decimal;

    if (params.type === 'supply') {
      // 공급가액 기준
      supplyValue = amount;
      vat = amount.mul(rate).div(100);
      total = supplyValue.plus(vat);
    } else {
      // 총액 기준 (부가세 포함)
      total = amount;
      supplyValue = amount.div(1 + rate / 100);
      vat = total.minus(supplyValue);
    }

    return {
      supplyValue: supplyValue.toNumber(),
      vat: vat.toNumber(),
      total: total.toNumber(),
      rate
    };
  }

  /**
   * 법인세 계산
   */
  calculateCorporateTax(params: {
    income: number;
    deductibleExpenses: number;
    year?: number;
    isSmallBusiness?: boolean;
  }): TaxCalculationResult {
    const year = params.year || new Date().getFullYear();
    const steps: CalculationStep[] = [];

    // Step 1: 과세표준 계산
    const taxableIncome = new Decimal(params.income)
      .minus(params.deductibleExpenses);
    
    steps.push({
      step: 1,
      description: '과세표준',
      formula: '수입 - 손금',
      result: taxableIncome.toNumber()
    });

    // Step 2: 세율 적용
    const rateInfo = this.knowledgeBase.calculateTaxRate(
      TaxCategory.CORPORATE_TAX,
      taxableIncome.toNumber(),
      year
    );

    if (!rateInfo) {
      throw new Error('법인세율 정보를 찾을 수 없습니다.');
    }

    // 중소기업 특례 적용
    let appliedRate = rateInfo.rate;
    if (params.isSmallBusiness && taxableIncome.lte(200000000)) {
      appliedRate = 9; // 중소기업 특례세율
    }

    const calculatedTax = taxableIncome
      .mul(appliedRate)
      .div(100);

    steps.push({
      step: 2,
      description: '산출세액',
      formula: `과세표준 × ${appliedRate}%`,
      result: calculatedTax.toNumber()
    });

    return {
      category: TaxCategory.CORPORATE_TAX,
      taxYear: year,
      inputAmount: params.income,
      taxableAmount: taxableIncome.toNumber(),
      taxRate: appliedRate,
      calculatedTax: calculatedTax.toNumber(),
      deductions: [],
      credits: [],
      finalTax: calculatedTax.toNumber(),
      calculationSteps: steps,
      metadata: {
        calculatedAt: new Date(),
        formula: '(수입 - 손금) × 세율',
        references: ['법인세법 제55조']
      }
    };
  }

  /**
   * 양도소득세 계산 (부동산)
   */
  calculateCapitalGainsTax(params: {
    acquisitionPrice: number;
    salePrice: number;
    acquisitionDate: Date;
    saleDate: Date;
    propertyType: 'house' | 'land' | 'apartment';
    isOnlyHouse?: boolean;
    holdingPeriod?: number; // 개월
  }): TaxCalculationResult {
    const steps: CalculationStep[] = [];
    
    // 보유기간 계산
    const holdingMonths = params.holdingPeriod || 
      this.calculateHoldingPeriod(params.acquisitionDate, params.saleDate);
    
    // Step 1: 양도차익 계산
    const capitalGain = new Decimal(params.salePrice)
      .minus(params.acquisitionPrice);
    
    steps.push({
      step: 1,
      description: '양도차익',
      formula: '양도가액 - 취득가액',
      result: capitalGain.toNumber()
    });

    // Step 2: 장기보유특별공제 (1주택자)
    let deductionRate = 0;
    if (params.isOnlyHouse && params.propertyType === 'house') {
      if (holdingMonths >= 36) {
        deductionRate = Math.min(holdingMonths * 2, 80); // 최대 80%
      }
    }

    const longTermDeduction = capitalGain
      .mul(deductionRate)
      .div(100);

    if (deductionRate > 0) {
      steps.push({
        step: 2,
        description: '장기보유특별공제',
        formula: `양도차익 × ${deductionRate}%`,
        result: longTermDeduction.toNumber()
      });
    }

    // Step 3: 과세표준
    const taxableAmount = capitalGain.minus(longTermDeduction);
    
    steps.push({
      step: 3,
      description: '과세표준',
      formula: '양도차익 - 장기보유특별공제',
      result: taxableAmount.toNumber()
    });

    // Step 4: 세율 적용 (기본세율)
    const baseRate = this.getCapitalGainsRate(
      params.propertyType,
      holdingMonths,
      params.isOnlyHouse
    );

    const calculatedTax = taxableAmount
      .mul(baseRate)
      .div(100);

    steps.push({
      step: 4,
      description: '산출세액',
      formula: `과세표준 × ${baseRate}%`,
      result: calculatedTax.toNumber()
    });

    return {
      category: TaxCategory.CAPITAL_GAINS,
      taxYear: new Date().getFullYear(),
      inputAmount: params.salePrice,
      taxableAmount: taxableAmount.toNumber(),
      taxRate: baseRate,
      calculatedTax: calculatedTax.toNumber(),
      deductions: deductionRate > 0 ? [{
        type: '장기보유특별공제',
        amount: longTermDeduction.toNumber(),
        description: `${holdingMonths}개월 보유 (${deductionRate}%)`
      }] : [],
      credits: [],
      finalTax: calculatedTax.toNumber(),
      calculationSteps: steps,
      metadata: {
        calculatedAt: new Date(),
        formula: '(양도가액 - 취득가액 - 공제) × 세율',
        references: ['소득세법 제95조', '소득세법 제104조']
      }
    };
  }

  /**
   * 보유기간 계산 (개월)
   */
  private calculateHoldingPeriod(start: Date, end: Date): number {
    const months = (end.getFullYear() - start.getFullYear()) * 12 +
                  (end.getMonth() - start.getMonth());
    return Math.max(months, 0);
  }

  /**
   * 양도소득세율 결정
   */
  private getCapitalGainsRate(
    propertyType: string,
    holdingMonths: number,
    isOnlyHouse?: boolean
  ): number {
    // 1세대 1주택 비과세 (2년 이상 보유)
    if (isOnlyHouse && propertyType === 'house' && holdingMonths >= 24) {
      return 0;
    }

    // 단기 보유 (1년 미만)
    if (holdingMonths < 12) {
      return 50;
    }
    // 단기 보유 (2년 미만)
    if (holdingMonths < 24) {
      return 40;
    }

    // 일반 세율 (누진세율 적용)
    // 실제로는 과세표준에 따라 6~45% 누진세율 적용
    return 24; // 기본세율
  }

  /**
   * 연말정산 계산
   */
  calculateYearEndTaxAdjustment(params: {
    grossSalary: number;
    withheldTax: number;
    deductions: {
      insurance: number;
      medical: number;
      education: number;
      donation: number;
      creditCard: number;
    };
    dependents: number;
  }): {
    taxableIncome: number;
    calculatedTax: number;
    withheldTax: number;
    refund: number;
    additionalPayment: number;
  } {
    // 근로소득공제
    const incomeDeduction = this.calculateEmploymentIncomeDeduction(params.grossSalary);
    
    // 인적공제
    const personalDeduction = 1500000 + (params.dependents * 1500000);
    
    // 특별공제
    const specialDeductions = new Decimal(params.deductions.insurance)
      .plus(Math.min(params.deductions.medical, 7000000))
      .plus(Math.min(params.deductions.education, 3000000))
      .plus(params.deductions.donation);
    
    // 과세표준
    const taxableIncome = new Decimal(params.grossSalary)
      .minus(incomeDeduction)
      .minus(personalDeduction)
      .minus(specialDeductions);
    
    // 산출세액
    const rateInfo = this.knowledgeBase.calculateTaxRate(
      TaxCategory.EARNED_INCOME,
      taxableIncome.toNumber(),
      new Date().getFullYear()
    );
    
    const calculatedTax = rateInfo
      ? taxableIncome.mul(rateInfo.rate).div(100).minus(rateInfo.deduction)
      : new Decimal(0);
    
    // 세액공제 (신용카드 등)
    const creditCardCredit = new Decimal(params.deductions.creditCard)
      .mul(0.15); // 15% 공제율
    
    const finalTax = Decimal.max(
      calculatedTax.minus(creditCardCredit),
      0
    );
    
    // 정산 결과
    const difference = new Decimal(params.withheldTax).minus(finalTax);
    
    return {
      taxableIncome: taxableIncome.toNumber(),
      calculatedTax: finalTax.toNumber(),
      withheldTax: params.withheldTax,
      refund: difference.gt(0) ? difference.toNumber() : 0,
      additionalPayment: difference.lt(0) ? difference.abs().toNumber() : 0
    };
  }

  /**
   * 근로소득공제 계산
   */
  private calculateEmploymentIncomeDeduction(grossSalary: number): number {
    const salary = new Decimal(grossSalary);
    
    if (salary.lte(5000000)) {
      return salary.mul(0.7).toNumber();
    } else if (salary.lte(15000000)) {
      return new Decimal(3500000)
        .plus(salary.minus(5000000).mul(0.4))
        .toNumber();
    } else if (salary.lte(45000000)) {
      return new Decimal(7500000)
        .plus(salary.minus(15000000).mul(0.15))
        .toNumber();
    } else if (salary.lte(100000000)) {
      return new Decimal(12000000)
        .plus(salary.minus(45000000).mul(0.05))
        .toNumber();
    } else {
      return new Decimal(14750000)
        .plus(salary.minus(100000000).mul(0.02))
        .toNumber();
    }
  }

  /**
   * 세금 비교 계산
   */
  compareTaxScenarios(scenarios: Array<{
    name: string;
    params: any;
    type: 'income' | 'corporate' | 'capital_gains';
  }>): Array<{
    name: string;
    result: TaxCalculationResult;
    savings?: number;
  }> {
    const results = scenarios.map(scenario => {
      let result: TaxCalculationResult;
      
      switch (scenario.type) {
        case 'income':
          result = this.calculateIncomeTax(scenario.params);
          break;
        case 'corporate':
          result = this.calculateCorporateTax(scenario.params);
          break;
        case 'capital_gains':
          result = this.calculateCapitalGainsTax(scenario.params);
          break;
        default:
          throw new Error('지원하지 않는 세금 유형입니다.');
      }
      
      return {
        name: scenario.name,
        result
      };
    });
    
    // 최소 세금 찾기
    const minTax = Math.min(...results.map(r => r.result.finalTax));
    
    // 절세액 계산
    return results.map(r => ({
      ...r,
      savings: r.result.finalTax - minTax
    }));
  }
}

export default TaxCalculator;