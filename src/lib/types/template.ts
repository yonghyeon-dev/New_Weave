// 문서 템플릿 엔진 타입 정의

export interface TemplateVariable {
  key: string;                    // 변수 키 (예: {client_name})
  label: string;                  // 사용자에게 보여질 레이블
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'address' | 'select';
  required: boolean;              // 필수 여부
  placeholder?: string;           // 플레이스홀더
  options?: string[];             // select 타입일 때 선택 옵션
  defaultValue?: string;          // 기본값
  validation?: {
    min?: number;                 // 최소 길이/값
    max?: number;                 // 최대 길이/값
    pattern?: string;             // 정규식 패턴
    message?: string;             // 유효성 검사 실패 메시지
  };
}

export interface DocumentTemplate {
  id: string;                     // 템플릿 고유 ID
  name: string;                   // 템플릿 이름
  category: TemplateCategory;     // 카테고리
  description: string;            // 설명
  content: string;                // 템플릿 내용 (마크다운)
  variables: TemplateVariable[];  // 사용된 변수들
  tags: string[];                 // 태그
  isDefault: boolean;             // 기본 템플릿 여부
  createdAt: Date;
  updatedAt: Date;
}

export enum TemplateCategory {
  CONTRACT = 'contract',          // 계약서
  INVOICE = 'invoice',            // 인보이스
  PROPOSAL = 'proposal',          // 제안서
  QUOTE = 'quote',                // 견적서
  EMAIL = 'email',                // 이메일
  REPORT = 'report',              // 리포트
  LEGAL = 'legal',                // 법적 문서
  OTHER = 'other'                 // 기타
}

export interface TemplateData {
  [key: string]: string | number | Date;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  title: string;
  content: string;                // 생성된 최종 내용
  data: TemplateData;            // 입력된 데이터
  generatedAt: Date;
}

// 템플릿 렌더링 옵션
export interface TemplateRenderOptions {
  format: 'html' | 'markdown' | 'pdf';
  includeStyles: boolean;
  pageBreaks: boolean;
  headerFooter?: {
    header?: string;
    footer?: string;
  };
}

// 템플릿 유효성 검사 결과
export interface TemplateValidationResult {
  isValid: boolean;
  missingVariables: string[];     // 누락된 필수 변수
  invalidValues: {                // 유효하지 않은 값들
    key: string;
    value: any;
    message: string;
  }[];
}

// 기본 템플릿 카테고리별 설정
export const TEMPLATE_CATEGORIES = {
  [TemplateCategory.CONTRACT]: {
    label: '계약서',
    description: '프로젝트 계약서 및 업무 계약서',
    icon: '📄'
  },
  [TemplateCategory.INVOICE]: {
    label: '인보이스',
    description: '세금계산서 및 거래명세서',
    icon: '🧾'
  },
  [TemplateCategory.PROPOSAL]: {
    label: '제안서',
    description: '사업 제안서 및 프로젝트 제안서',
    icon: '📋'
  },
  [TemplateCategory.QUOTE]: {
    label: '견적서',
    description: '프로젝트 견적서 및 서비스 견적서',
    icon: '💰'
  },
  [TemplateCategory.EMAIL]: {
    label: '이메일',
    description: '비즈니스 이메일 템플릿',
    icon: '✉️'
  },
  [TemplateCategory.REPORT]: {
    label: '리포트',
    description: '프로젝트 보고서 및 분석 보고서',
    icon: '📊'
  },
  [TemplateCategory.LEGAL]: {
    label: '법적 문서',
    description: '계약서, 동의서, 면책조항',
    icon: '⚖️'
  },
  [TemplateCategory.OTHER]: {
    label: '기타',
    description: '기타 비즈니스 문서',
    icon: '📝'
  }
};

// 일반적으로 사용되는 변수들
export const COMMON_VARIABLES: TemplateVariable[] = [
  {
    key: 'client_name',
    label: '클라이언트명',
    type: 'text',
    required: true,
    placeholder: '클라이언트 회사명 또는 개인명'
  },
  {
    key: 'client_business_number',
    label: '사업자등록번호',
    type: 'text',
    required: false,
    placeholder: '123-45-67890',
    validation: {
      pattern: '^\\d{3}-\\d{2}-\\d{5}$',
      message: '올바른 사업자등록번호 형식이 아닙니다'
    }
  },
  {
    key: 'client_email',
    label: '이메일',
    type: 'email',
    required: false,
    placeholder: 'client@example.com'
  },
  {
    key: 'client_phone',
    label: '전화번호',
    type: 'phone',
    required: false,
    placeholder: '02-1234-5678'
  },
  {
    key: 'client_address',
    label: '주소',
    type: 'address',
    required: false,
    placeholder: '서울시 강남구 테헤란로 123'
  },
  {
    key: 'project_name',
    label: '프로젝트명',
    type: 'text',
    required: true,
    placeholder: '웹사이트 개발 프로젝트'
  },
  {
    key: 'project_description',
    label: '프로젝트 설명',
    type: 'text',
    required: false,
    placeholder: '프로젝트에 대한 상세 설명'
  },
  {
    key: 'project_amount',
    label: '프로젝트 금액',
    type: 'number',
    required: true,
    placeholder: '5000000',
    validation: {
      min: 0,
      message: '금액은 0 이상이어야 합니다'
    }
  },
  {
    key: 'start_date',
    label: '시작일',
    type: 'date',
    required: true
  },
  {
    key: 'end_date',
    label: '종료일',
    type: 'date',
    required: true
  },
  {
    key: 'current_date',
    label: '작성일',
    type: 'date',
    required: true,
    defaultValue: new Date().toISOString().split('T')[0]
  },
  {
    key: 'company_name',
    label: '회사명',
    type: 'text',
    required: true,
    defaultValue: 'Weave',
    placeholder: '귀하의 회사명'
  },
  {
    key: 'company_representative',
    label: '대표자명',
    type: 'text',
    required: true,
    placeholder: '홍길동'
  },
  {
    key: 'company_business_number',
    label: '사업자등록번호',
    type: 'text',
    required: true,
    placeholder: '123-45-67890'
  },
  {
    key: 'company_email',
    label: '회사 이메일',
    type: 'email',
    required: false,
    placeholder: 'contact@company.com'
  },
  {
    key: 'company_phone',
    label: '회사 전화번호',
    type: 'phone',
    required: false,
    placeholder: '02-1234-5678'
  },
  {
    key: 'company_address',
    label: '회사 주소',
    type: 'address',
    required: false,
    placeholder: '서울시 강남구 테헤란로 123'
  }
];

// 템플릿 엔진 유틸리티 함수들
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ko-KR') + '원';
};

export const formatDate = (date: Date | string, format: 'short' | 'long' = 'long'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return d.toLocaleDateString('ko-KR');
  }
  
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// formatBusinessNumber는 business.ts에서 가져와서 사용