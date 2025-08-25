/**
 * Advanced Template Engine
 * PRD 요구사항에 따른 고급 템플릿 엔진 구현
 * - 객체 속성 접근: {{client.name}}, {{invoice.total}}
 * - 조건부 로직: {{#if condition}}, {{#unless condition}}
 * - 반복 로직: {{#each items}}
 * - 중첩 객체 지원 및 안전한 속성 접근
 * - 계산된 필드 및 포맷터 지원
 */

import type { InvoiceItem as BaseInvoiceItem } from './types/invoice';
import type { TemplateData } from '@/lib/types/template';

// Template Engine용 확장된 InvoiceItem (name 필드 추가)
export interface InvoiceItem extends BaseInvoiceItem {
  name?: string; // description을 기본으로 하되 name도 허용
}

export interface AdvancedTemplateOptions {
  format?: 'html' | 'markdown' | 'text';
  includeStyles?: boolean;
  pageBreaks?: boolean;
  strictMode?: boolean; // 누락 변수 시 오류 발생
  escapeHtml?: boolean;  // HTML 이스케이프
  headerFooter?: {
    header?: string;
    footer?: string;
  };
}

export interface TemplateContext extends Record<string, any> {
  // 기본 객체들
  client?: {
    id?: string;
    name?: string;
    businessNumber?: string;
    email?: string;
    phone?: string;
    address?: string;
    representative?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
  project?: {
    id?: string;
    name?: string;
    description?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    dueDate?: Date | string;
    budget?: number;
    status?: string;
  };
  invoice?: {
    id?: string;
    invoiceNumber?: string;
    issueDate?: Date | string;
    dueDate?: Date | string;
    subtotal?: number;
    tax?: number;
    total?: number;
    currency?: string;
    status?: string;
    items?: InvoiceItem[];
  };
  payment?: {
    method?: string;
    paidAt?: Date | string;
    amount?: number;
    memo?: string;
  };
  
  // 메타데이터
  user?: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    address?: string;
  };
  
  // 시스템 변수
  system?: {
    currentDate?: Date | string;
    currentYear?: number;
    currentMonth?: number;
    generatedAt?: Date | string;
  };
}

export class AdvancedTemplateEngine {
  private static instance: AdvancedTemplateEngine;
  
  private constructor() {}
  
  static getInstance(): AdvancedTemplateEngine {
    if (!AdvancedTemplateEngine.instance) {
      AdvancedTemplateEngine.instance = new AdvancedTemplateEngine();
    }
    return AdvancedTemplateEngine.instance;
  }

  /**
   * 템플릿 렌더링
   */
  render(template: string, context: TemplateContext, options: AdvancedTemplateOptions = {}): string {
    const defaultOptions: AdvancedTemplateOptions = {
      format: 'html',
      includeStyles: true,
      pageBreaks: false,
      strictMode: false,
      escapeHtml: true,
      ...options
    };

    // 시스템 변수 자동 추가
    const enrichedContext = this.enrichContext(context);

    // 메인 렌더링
    let result = this.processTemplate(template, enrichedContext, defaultOptions);

    // 포맷별 후처리
    switch (defaultOptions.format) {
      case 'html':
        result = this.convertToHtml(result, defaultOptions);
        break;
      case 'markdown':
        // 마크다운은 그대로
        break;
      case 'text':
        result = this.stripHtmlTags(result);
        break;
    }

    return result;
  }

  /**
   * 메인 템플릿 처리
   */
  private processTemplate(template: string, context: TemplateContext, options: AdvancedTemplateOptions): string {
    let result = template;

    // 1. 조건부 블록 처리 (if/unless)
    result = this.processConditionals(result, context, options);

    // 2. 반복 블록 처리 (each)
    result = this.processIterations(result, context, options);

    // 3. 변수 치환 처리 ({{variable}} 및 {{object.property}})
    result = this.processVariables(result, context, options);

    // 4. 계산된 필드 처리
    result = this.processComputedFields(result, context);

    return result;
  }

  /**
   * 조건부 로직 처리
   */
  private processConditionals(template: string, context: TemplateContext, options: AdvancedTemplateOptions): string {
    let result = template;

    // {{#if condition}}...{{/if}} 처리
    result = result.replace(/\{\{#if\s+(.+?)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
      const conditionResult = this.evaluateCondition(condition.trim(), context);
      return conditionResult ? content : '';
    });

    // {{#unless condition}}...{{/unless}} 처리
    result = result.replace(/\{\{#unless\s+(.+?)\}\}([\s\S]*?)\{\{\/unless\}\}/g, (match, condition, content) => {
      const conditionResult = this.evaluateCondition(condition.trim(), context);
      return !conditionResult ? content : '';
    });

    // {{#if condition}}...{{else}}...{{/if}} 처리
    result = result.replace(/\{\{#if\s+(.+?)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, ifContent, elseContent) => {
      const conditionResult = this.evaluateCondition(condition.trim(), context);
      return conditionResult ? ifContent : elseContent;
    });

    return result;
  }

  /**
   * 반복 로직 처리
   */
  private processIterations(template: string, context: TemplateContext, options: AdvancedTemplateOptions): string {
    let result = template;

    // {{#each items}}...{{/each}} 처리
    result = result.replace(/\{\{#each\s+(.+?)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayPath, itemTemplate) => {
      const items = this.getNestedValue(context, arrayPath.trim());
      
      if (!Array.isArray(items)) {
        if (options.strictMode) {
          throw new Error(`템플릿 오류: ${arrayPath}는 배열이 아닙니다.`);
        }
        return '';
      }

      return items.map((item, index) => {
        // 각 아이템에 대해 컨텍스트 생성
        const itemContext = {
          ...context,
          this: item,
          '@index': index,
          '@first': index === 0,
          '@last': index === items.length - 1,
          '@length': items.length,
          ...item // 아이템의 속성을 직접 접근 가능하게
        };

        return this.processTemplate(itemTemplate, itemContext, options);
      }).join('');
    });

    return result;
  }

  /**
   * 변수 치환 처리
   */
  private processVariables(template: string, context: TemplateContext, options: AdvancedTemplateOptions): string {
    let result = template;

    // {{variable}} 또는 {{object.property}} 형태의 변수 처리
    result = result.replace(/\{\{([^#\/][^}]*)\}\}/g, (match, variablePath) => {
      const path = variablePath.trim();
      
      // 포맷터 처리 (예: {{invoice.total | currency}})
      const [valuePath, ...formatters] = path.split('|').map((s: string) => s.trim());
      
      let value = this.getNestedValue(context, valuePath);

      // 누락 변수 처리
      if (value === undefined || value === null) {
        if (options.strictMode) {
          throw new Error(`템플릿 오류: 변수 '${valuePath}'를 찾을 수 없습니다.`);
        }
        // 누락 변수 표시
        return `<span class="missing-variable" title="누락된 변수: ${valuePath}">{{${valuePath}}}</span>`;
      }

      // 포맷터 적용
      if (formatters.length > 0) {
        value = this.applyFormatters(value, formatters);
      }

      // HTML 이스케이프
      if (options.escapeHtml && typeof value === 'string') {
        value = this.escapeHtml(value);
      }

      return String(value);
    });

    return result;
  }

  /**
   * 조건식 평가
   */
  private evaluateCondition(condition: string, context: TemplateContext): boolean {
    try {
      // 간단한 조건식 파싱
      
      // 존재성 체크 (예: client.name)
      if (!condition.includes(' ')) {
        const value = this.getNestedValue(context, condition);
        return this.isTruthy(value);
      }

      // 비교 연산자 처리
      const operators = ['===', '!==', '==', '!=', '>=', '<=', '>', '<'];
      
      for (const op of operators) {
        if (condition.includes(op)) {
          const [left, right] = condition.split(op).map(s => s.trim());
          const leftValue = this.getNestedValue(context, left);
          const rightValue = this.parseValue(right, context);

          switch (op) {
            case '===': return leftValue === rightValue;
            case '!==': return leftValue !== rightValue;
            case '==': return leftValue == rightValue;
            case '!=': return leftValue != rightValue;
            case '>=': return Number(leftValue) >= Number(rightValue);
            case '<=': return Number(leftValue) <= Number(rightValue);
            case '>': return Number(leftValue) > Number(rightValue);
            case '<': return Number(leftValue) < Number(rightValue);
          }
        }
      }

      // 논리 연산자 처리 (and, or)
      if (condition.includes(' and ') || condition.includes(' && ')) {
        const conditions = condition.split(/ and | && /).map(c => c.trim());
        return conditions.every(c => this.evaluateCondition(c, context));
      }

      if (condition.includes(' or ') || condition.includes(' || ')) {
        const conditions = condition.split(/ or | \\|\\| /).map(c => c.trim());
        return conditions.some(c => this.evaluateCondition(c, context));
      }

      // 기본: 변수의 truthy 값
      const value = this.getNestedValue(context, condition);
      return this.isTruthy(value);

    } catch (error) {
      console.warn(`조건식 평가 오류: ${condition}`, error);
      return false;
    }
  }

  /**
   * 중첩 객체 속성 안전 접근
   */
  private getNestedValue(obj: any, path: string): any {
    if (!path) return undefined;
    
    // 특수 변수 처리
    if (path.startsWith('@')) {
      return obj[path];
    }

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * 값 파싱 (문자열, 숫자, 불린 등)
   */
  private parseValue(value: string, context: TemplateContext): any {
    value = value.trim();

    // 문자열 리터럴
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }

    // 숫자
    if (!isNaN(Number(value))) {
      return Number(value);
    }

    // 불린
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (value === 'undefined') return undefined;

    // 변수 참조
    return this.getNestedValue(context, value);
  }

  /**
   * Truthy 값 판정
   */
  private isTruthy(value: any): boolean {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.length > 0;
    return Boolean(value);
  }

  /**
   * 포맷터 적용
   */
  private applyFormatters(value: any, formatters: string[]): any {
    let result = value;

    for (const formatter of formatters) {
      const [name, ...args] = formatter.split(':');
      
      switch (name.toLowerCase()) {
        case 'currency':
          result = this.formatCurrency(Number(result));
          break;
        
        case 'date':
          const format = args[0] || 'YYYY-MM-DD';
          result = this.formatDate(result, format);
          break;
        
        case 'number':
          result = Number(result).toLocaleString('ko-KR');
          break;
        
        case 'uppercase':
          result = String(result).toUpperCase();
          break;
        
        case 'lowercase':
          result = String(result).toLowerCase();
          break;
        
        case 'capitalize':
          result = String(result).replace(/\b\w/g, l => l.toUpperCase());
          break;
        
        case 'phone':
          result = this.formatPhone(String(result));
          break;
        
        case 'businessnumber':
          result = this.formatBusinessNumber(String(result));
          break;
        
        case 'default':
          if (!result || result === '') {
            result = args[0] || '';
          }
          break;
      }
    }

    return result;
  }

  /**
   * 계산된 필드 처리
   */
  private processComputedFields(template: string, context: TemplateContext): string {
    let result = template;

    // VAT 계산
    result = result.replace(/\{\{vat_amount\}\}/g, () => {
      const subtotal = context.invoice?.subtotal || 0;
      return this.formatCurrency(Math.round(subtotal * 0.1));
    });

    // 총액 계산
    result = result.replace(/\{\{total_with_vat\}\}/g, () => {
      const subtotal = context.invoice?.subtotal || 0;
      return this.formatCurrency(Math.round(subtotal * 1.1));
    });

    return result;
  }

  /**
   * 컨텍스트 보강 (시스템 변수 추가)
   */
  private enrichContext(context: TemplateContext): TemplateContext {
    const now = new Date();
    
    return {
      ...context,
      system: {
        currentDate: now,
        currentYear: now.getFullYear(),
        currentMonth: now.getMonth() + 1,
        generatedAt: now,
        ...context.system
      }
    };
  }

  /**
   * HTML 변환
   */
  private convertToHtml(content: string, options: AdvancedTemplateOptions): string {
    let html = content;

    // 마크다운 스타일 변환
    html = html
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // CSS 스타일 추가
    if (options.includeStyles) {
      const styles = `
        <style>
          body { 
            font-family: 'Malgun Gothic', 'Arial', sans-serif; 
            line-height: 1.8; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px; 
            background: #fff;
          }
          h1 { color: #2c3e50; border-bottom: 3px solid #4ECDC4; padding-bottom: 15px; margin-bottom: 30px; }
          h2 { color: #34495e; margin-top: 40px; margin-bottom: 20px; }
          h3 { color: #34495e; margin-top: 30px; margin-bottom: 15px; }
          .invoice-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; }
          .invoice-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .invoice-items table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .invoice-items th, .invoice-items td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .invoice-items th { background-color: #4ECDC4; color: white; font-weight: bold; }
          .invoice-items .amount { text-align: right; font-weight: bold; }
          .invoice-total { text-align: right; margin-top: 20px; }
          .invoice-total .total-line { font-size: 1.2em; font-weight: bold; color: #4ECDC4; }
          .signature-section { margin-top: 60px; display: flex; justify-content: space-between; }
          .signature-box { text-align: center; width: 200px; border-top: 2px solid #333; padding-top: 10px; }
          .missing-variable { color: #e74c3c; background: #ffeaa7; padding: 2px 4px; border-radius: 3px; }
          .company-info { margin-bottom: 30px; }
          .client-info { background: #ecf0f1; padding: 15px; border-radius: 5px; }
          ${options.pageBreaks ? '.page-break { page-break-after: always; }' : ''}
        </style>
      `;
      html = styles + html;
    }

    // 헤더/푸터 추가
    if (options.headerFooter?.header) {
      html = `<header>${options.headerFooter.header}</header>` + html;
    }
    if (options.headerFooter?.footer) {
      html = html + `<footer>${options.headerFooter.footer}</footer>`;
    }

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Document</title></head><body>${html}</body></html>`;
  }

  /**
   * 유틸리티 메서드들
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  }

  private formatDate(date: any, format: string = 'YYYY-MM-DD'): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    switch (format) {
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'YYYY.MM.DD':
        return `${year}.${month}.${day}`;
      case 'YYYY년 MM월 DD일':
        return `${year}년 ${month}월 ${day}일`;
      default:
        return `${year}-${month}-${day}`;
    }
  }

  private formatPhone(phone: string): string {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10 && cleaned.startsWith('02')) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  private formatBusinessNumber(number: string): string {
    const cleaned = number.replace(/[^0-9]/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
    }
    return number;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * 템플릿 유효성 검사
   */
  validateTemplate(template: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 미닫이 태그 검사
    const openBlocks = template.match(/\{\{#\w+/g)?.length || 0;
    const closeBlocks = template.match(/\{\{\/\w+/g)?.length || 0;

    if (openBlocks !== closeBlocks) {
      errors.push('미닫이 블록의 개수가 맞지 않습니다.');
    }

    // 구문 오류 검사
    const invalidSyntax = template.match(/\{\{[^}]*\{|\}[^{]*\}\}/g);
    if (invalidSyntax) {
      errors.push('잘못된 구문이 발견되었습니다: ' + invalidSyntax.join(', '));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 템플릿에서 사용된 변수 추출
   */
  extractVariables(template: string): string[] {
    const variables = new Set<string>();
    
    // 단순 변수 {{variable}}
    const simpleVars = template.match(/\{\{([^#\/][^}]*)\}\}/g);
    if (simpleVars) {
      simpleVars.forEach(match => {
        const variable = match.replace(/[{}]/g, '').split('|')[0].trim();
        variables.add(variable);
      });
    }

    // 조건문의 변수 {{#if variable}}
    const condVars = template.match(/\{\{#(if|unless)\s+([^}]+)\}\}/g);
    if (condVars) {
      condVars.forEach(match => {
        const variable = match.replace(/\{\{#(if|unless)\s+/, '').replace(/\}\}/, '').trim();
        variables.add(variable.split(/\s+/)[0]); // 첫 번째 변수만
      });
    }

    // 반복문의 배열 {{#each items}}
    const eachVars = template.match(/\{\{#each\s+([^}]+)\}\}/g);
    if (eachVars) {
      eachVars.forEach(match => {
        const variable = match.replace(/\{\{#each\s+/, '').replace(/\}\}/, '').trim();
        variables.add(variable);
      });
    }

    return Array.from(variables);
  }
}

export default AdvancedTemplateEngine;