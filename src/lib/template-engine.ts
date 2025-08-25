// 문서 템플릿 엔진 - 핵심 기능 구현

import { 
  DocumentTemplate, 
  TemplateVariable, 
  TemplateData, 
  TemplateValidationResult,
  TemplateRenderOptions,
  formatCurrency,
  formatDate
} from '@/lib/types/template';

import { formatBusinessNumber } from '@/lib/types/business';

export class TemplateEngine {
  private static instance: TemplateEngine;
  private templates: Map<string, DocumentTemplate> = new Map();

  private constructor() {}

  static getInstance(): TemplateEngine {
    if (!TemplateEngine.instance) {
      TemplateEngine.instance = new TemplateEngine();
    }
    return TemplateEngine.instance;
  }

  /**
   * 템플릿 등록
   */
  registerTemplate(template: DocumentTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * 템플릿 조회
   */
  getTemplate(id: string): DocumentTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * 모든 템플릿 조회
   */
  getAllTemplates(): DocumentTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * 카테고리별 템플릿 조회
   */
  getTemplatesByCategory(category: string): DocumentTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.category === category);
  }

  /**
   * 템플릿에서 변수 추출
   */
  extractVariables(content: string): string[] {
    const variablePattern = /\{([^}]+)\}/g;
    const variables: string[] = [];
    let match;

    while ((match = variablePattern.exec(content)) !== null) {
      const variable = match[1];
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    }

    return variables;
  }

  /**
   * 데이터 유효성 검사
   */
  validateData(template: DocumentTemplate, data: TemplateData): TemplateValidationResult {
    const result: TemplateValidationResult = {
      isValid: true,
      missingVariables: [],
      invalidValues: []
    };

    // 필수 변수 검사
    template.variables.forEach(variable => {
      if (variable.required && (!data[variable.key] || data[variable.key] === '')) {
        result.missingVariables.push(variable.key);
        result.isValid = false;
      }

      const value = data[variable.key];
      if (value && variable.validation) {
        const validation = variable.validation;
        
        // 타입별 유효성 검사
        switch (variable.type) {
          case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(String(value))) {
              result.invalidValues.push({
                key: variable.key,
                value,
                message: '올바른 이메일 형식이 아닙니다'
              });
              result.isValid = false;
            }
            break;

          case 'phone':
            const phonePattern = /^[\d\-\+\(\)\s]+$/;
            if (!phonePattern.test(String(value))) {
              result.invalidValues.push({
                key: variable.key,
                value,
                message: '올바른 전화번호 형식이 아닙니다'
              });
              result.isValid = false;
            }
            break;

          case 'number':
            const numValue = Number(value);
            if (isNaN(numValue)) {
              result.invalidValues.push({
                key: variable.key,
                value,
                message: '숫자를 입력해주세요'
              });
              result.isValid = false;
            } else {
              if (validation.min !== undefined && numValue < validation.min) {
                result.invalidValues.push({
                  key: variable.key,
                  value,
                  message: validation.message || `최소값은 ${validation.min}입니다`
                });
                result.isValid = false;
              }
              if (validation.max !== undefined && numValue > validation.max) {
                result.invalidValues.push({
                  key: variable.key,
                  value,
                  message: validation.message || `최대값은 ${validation.max}입니다`
                });
                result.isValid = false;
              }
            }
            break;

          case 'text':
            const strValue = String(value);
            if (validation.min !== undefined && strValue.length < validation.min) {
              result.invalidValues.push({
                key: variable.key,
                value,
                message: validation.message || `최소 ${validation.min}자 이상 입력해주세요`
              });
              result.isValid = false;
            }
            if (validation.max !== undefined && strValue.length > validation.max) {
              result.invalidValues.push({
                key: variable.key,
                value,
                message: validation.message || `최대 ${validation.max}자까지 입력 가능합니다`
              });
              result.isValid = false;
            }
            if (validation.pattern) {
              const regex = new RegExp(validation.pattern);
              if (!regex.test(strValue)) {
                result.invalidValues.push({
                  key: variable.key,
                  value,
                  message: validation.message || '올바른 형식이 아닙니다'
                });
                result.isValid = false;
              }
            }
            break;
        }
      }
    });

    return result;
  }

  /**
   * 템플릿 렌더링
   */
  render(template: DocumentTemplate, data: TemplateData, options: TemplateRenderOptions = {
    format: 'html',
    includeStyles: true,
    pageBreaks: false
  }): string {
    // 데이터 유효성 검사
    const validation = this.validateData(template, data);
    if (!validation.isValid) {
      throw new Error(`템플릿 데이터가 유효하지 않습니다: ${validation.missingVariables.join(', ')}`);
    }

    let content = template.content;

    // 변수 치환
    template.variables.forEach(variable => {
      const value = data[variable.key] || variable.defaultValue || '';
      const placeholder = `{${variable.key}}`;
      
      // 타입별 포맷팅
      let formattedValue = this.formatValue(value, variable);
      
      // 전역 치환
      content = content.replace(new RegExp(this.escapeRegExp(placeholder), 'g'), formattedValue);
    });

    // 추가 변수들 (계산된 값들)
    content = this.processComputedVariables(content, data);

    // 포맷별 변환
    switch (options.format) {
      case 'html':
        return this.convertToHtml(content, options);
      case 'markdown':
        return content;
      case 'pdf':
        // PDF 변환은 별도 구현 필요
        return this.convertToHtml(content, options);
      default:
        return content;
    }
  }

  /**
   * 값 포맷팅
   */
  private formatValue(value: any, variable: TemplateVariable): string {
    if (!value) return '';

    switch (variable.type) {
      case 'number':
        // 금액 관련 변수인 경우 통화 포맷팅
        if (variable.key.includes('amount') || variable.key.includes('price') || variable.key.includes('cost')) {
          return formatCurrency(Number(value));
        }
        return Number(value).toLocaleString('ko-KR');

      case 'date':
        return formatDate(value);

      case 'phone':
        // 전화번호 포맷팅
        const phone = String(value).replace(/[^0-9]/g, '');
        if (phone.length === 11) {
          return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
        } else if (phone.length === 10 && phone.startsWith('02')) {
          return `${phone.slice(0, 2)}-${phone.slice(2, 6)}-${phone.slice(6)}`;
        }
        return String(value);

      default:
        if (variable.key.includes('business_number')) {
          return formatBusinessNumber(String(value));
        }
        return String(value);
    }
  }

  /**
   * 계산된 변수 처리
   */
  private processComputedVariables(content: string, data: TemplateData): string {
    // VAT 계산 (부가세)
    content = content.replace(/\{vat_amount\}/g, () => {
      const amount = Number(data.project_amount) || 0;
      return formatCurrency(Math.round(amount * 0.1));
    });

    // 총 금액 계산 (VAT 포함)
    content = content.replace(/\{total_amount\}/g, () => {
      const amount = Number(data.project_amount) || 0;
      return formatCurrency(Math.round(amount * 1.1));
    });

    // 현재 연도
    content = content.replace(/\{current_year\}/g, new Date().getFullYear().toString());

    // 현재 월
    content = content.replace(/\{current_month\}/g, (new Date().getMonth() + 1).toString());

    return content;
  }

  /**
   * HTML 변환
   */
  private convertToHtml(markdown: string, options: TemplateRenderOptions): string {
    // 간단한 마크다운 -> HTML 변환
    let html = markdown
      // 제목
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      
      // 굵은 글씨
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      
      // 기울임
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      
      // 줄바꿈
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      
      // 리스트
      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*<\/li>)/g, '<ul>$1</ul>')
      
      // 번호 리스트
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*<\/li>)/g, '<ol>$1</ol>');

    // p 태그로 감싸기
    if (!html.startsWith('<h1>') && !html.startsWith('<h2>') && !html.startsWith('<h3>')) {
      html = '<p>' + html + '</p>';
    }

    // CSS 스타일 추가
    if (options.includeStyles) {
      const styles = `
        <style>
          body { 
            font-family: 'Arial', 'Malgun Gothic', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          h1 { color: #2c3e50; border-bottom: 2px solid #4ECDC4; padding-bottom: 10px; }
          h2 { color: #34495e; margin-top: 30px; }
          h3 { color: #34495e; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; }
          .signature { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature > div { text-align: center; width: 200px; }
          .amount { font-weight: bold; color: #4ECDC4; }
          ${options.pageBreaks ? '.page-break { page-break-after: always; }' : ''}
        </style>
      `;
      html = styles + html;
    }

    // 헤더/푸터 추가
    if (options.headerFooter) {
      if (options.headerFooter.header) {
        html = `<header>${options.headerFooter.header}</header>` + html;
      }
      if (options.headerFooter.footer) {
        html = html + `<footer>${options.headerFooter.footer}</footer>`;
      }
    }

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Document</title></head><body>${html}</body></html>`;
  }

  /**
   * 정규식 특수문자 이스케이프
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 템플릿 미리보기
   */
  preview(template: DocumentTemplate, sampleData?: TemplateData): string {
    const data = sampleData || this.generateSampleData(template);
    return this.render(template, data, { format: 'html', includeStyles: true, pageBreaks: false });
  }

  /**
   * 샘플 데이터 생성
   */
  private generateSampleData(template: DocumentTemplate): TemplateData {
    const sampleData: TemplateData = {};

    template.variables.forEach(variable => {
      switch (variable.type) {
        case 'text':
          if (variable.key.includes('name')) {
            sampleData[variable.key] = variable.key.includes('client') ? '㈜샘플클라이언트' : '홍길동';
          } else if (variable.key.includes('project')) {
            sampleData[variable.key] = '샘플 프로젝트';
          } else {
            sampleData[variable.key] = variable.placeholder || '샘플 텍스트';
          }
          break;

        case 'number':
          sampleData[variable.key] = variable.key.includes('amount') ? 5000000 : 1;
          break;

        case 'date':
          sampleData[variable.key] = new Date();
          break;

        case 'email':
          sampleData[variable.key] = 'sample@example.com';
          break;

        case 'phone':
          sampleData[variable.key] = '02-1234-5678';
          break;

        case 'address':
          sampleData[variable.key] = '서울시 강남구 테헤란로 123';
          break;

        default:
          sampleData[variable.key] = variable.defaultValue || '샘플 값';
      }
    });

    return sampleData;
  }
}