// 문서 템플릿 카테고리 시스템

export interface DocumentCategory {
  id: string;
  name: string;
  icon: string; // 이모지 아이콘
  description: string;
  color: string; // Tailwind CSS 색상 클래스
  templates: TemplateInfo[];
}

export interface TemplateInfo {
  id: string;
  name: string;
  type: 'simple' | 'detailed'; // 약식 또는 상세
  description: string;
  popular?: boolean; // 인기 템플릿 표시
  variables?: string[]; // 필요한 변수 목록
}

export const documentCategories: DocumentCategory[] = [
  {
    id: 'development',
    name: '개발 문서',
    icon: '💻',
    description: '소프트웨어, 웹, 앱 개발 관련 문서',
    color: 'bg-blue-100 border-blue-300 text-blue-900',
    templates: [
      {
        id: 'contract-001',
        name: '소프트웨어 개발 계약서',
        type: 'detailed',
        description: '소프트웨어 개발 프로젝트를 위한 상세 계약서',
        popular: true
      },
      {
        id: 'contract-001',
        name: '소프트웨어 개발 계약서 (약식)',
        type: 'simple',
        description: '간단한 소프트웨어 개발을 위한 약식 계약서'
      },
      {
        id: 'proposal-001',
        name: '프로젝트 제안서',
        type: 'detailed',
        description: '개발 프로젝트 제안을 위한 상세 문서',
        popular: true
      },
      {
        id: 'spec-001',
        name: '기술 명세서',
        type: 'detailed',
        description: '소프트웨어 기능 및 기술 요구사항 명세서'
      },
      {
        id: 'spec-001',
        name: 'API 문서',
        type: 'detailed',
        description: 'REST API 명세 및 사용 가이드'
      }
    ]
  },
  {
    id: 'business',
    name: '비즈니스 문서',
    icon: '💼',
    description: '견적서, 제안서, 보고서 등 비즈니스 문서',
    color: 'bg-green-100 border-green-300 text-green-900',
    templates: [
      {
        id: 'quotation-001',
        name: '견적서',
        type: 'simple',
        description: '프로젝트 견적을 위한 표준 문서',
        popular: true
      },
      {
        id: 'quotation-001',
        name: '청구서/세금계산서',
        type: 'simple',
        description: '서비스 요금 청구를 위한 문서'
      },
      {
        id: 'proposal-001',
        name: '사업 제안서',
        type: 'detailed',
        description: '신규 사업 제안을 위한 상세 문서'
      },
      {
        id: 'report-001',
        name: '프로젝트 완료 보고서',
        type: 'detailed',
        description: '프로젝트 완료 시 제출하는 최종 보고서'
      },
      {
        id: 'report-001',
        name: '회의록',
        type: 'simple',
        description: '회의 내용 기록 및 공유를 위한 문서'
      }
    ]
  },
  {
    id: 'creative',
    name: '창작 문서',
    icon: '🎨',
    description: '디자인, 컨텐츠, 미디어 관련 문서',
    color: 'bg-purple-100 border-purple-300 text-purple-900',
    templates: [
      {
        id: 'contract-001',
        name: '디자인 계약서',
        type: 'detailed',
        description: 'UI/UX, 그래픽 디자인 프로젝트 계약서',
        popular: true
      },
      {
        id: 'proposal-001',
        name: '컨텐츠 브리프',
        type: 'simple',
        description: '컨텐츠 제작 요구사항 문서'
      },
      {
        id: 'spec-001',
        name: '브랜드 가이드라인',
        type: 'detailed',
        description: '브랜드 아이덴티티 및 사용 지침서'
      },
      {
        id: 'proposal-001',
        name: '영상 스토리보드',
        type: 'detailed',
        description: '영상 제작을 위한 스토리보드 문서'
      }
    ]
  },
  {
    id: 'legal',
    name: '법률 문서',
    icon: '⚖️',
    description: 'NDA, 동의서, 약관 등 법률 관련 문서',
    color: 'bg-red-100 border-red-300 text-red-900',
    templates: [
      {
        id: 'contract-001',
        name: '비밀유지계약서 (NDA)',
        type: 'detailed',
        description: '비밀정보 보호를 위한 계약서',
        popular: true
      },
      {
        id: 'contract-001',
        name: '서비스 이용약관',
        type: 'detailed',
        description: '온라인 서비스 이용 약관'
      },
      {
        id: 'contract-001',
        name: '개인정보처리방침',
        type: 'detailed',
        description: '개인정보 수집 및 처리 방침'
      },
      {
        id: 'contract-001',
        name: '라이선스 계약서',
        type: 'detailed',
        description: '소프트웨어 라이선스 사용 계약서'
      }
    ]
  },
  {
    id: 'marketing',
    name: '마케팅 문서',
    icon: '📢',
    description: '마케팅, 홍보, 캠페인 관련 문서',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    templates: [
      {
        id: 'proposal-001',
        name: '마케팅 제안서',
        type: 'detailed',
        description: '마케팅 전략 및 캠페인 제안서'
      },
      {
        id: 'report-001',
        name: '보도자료',
        type: 'simple',
        description: '언론 배포용 보도자료'
      },
      {
        id: 'contract-001',
        name: '인플루언서 계약서',
        type: 'detailed',
        description: 'SNS 인플루언서 협업 계약서',
        popular: true
      },
      {
        id: 'report-001',
        name: '캠페인 성과 보고서',
        type: 'detailed',
        description: '마케팅 캠페인 결과 분석 보고서'
      }
    ]
  },
  {
    id: 'general',
    name: '일반 문서',
    icon: '📄',
    description: '공문, 증명서, 신청서 등 일반 문서',
    color: 'bg-gray-100 border-gray-300 text-gray-900',
    templates: [
      {
        id: 'proposal-001',
        name: '공문',
        type: 'simple',
        description: '공식 업무 서신'
      },
      {
        id: 'report-001',
        name: '증명서',
        type: 'simple',
        description: '각종 증명서 양식'
      },
      {
        id: 'proposal-001',
        name: '신청서',
        type: 'simple',
        description: '각종 신청서 양식'
      },
      {
        id: 'report-001',
        name: '업무 협조문',
        type: 'simple',
        description: '부서간 업무 협조 요청서'
      }
    ]
  }
];

// 인기 템플릿 가져오기
export function getPopularTemplates(): TemplateInfo[] {
  const popular: TemplateInfo[] = [];
  documentCategories.forEach(category => {
    category.templates.forEach(template => {
      if (template.popular) {
        popular.push(template);
      }
    });
  });
  return popular;
}

// 템플릿 검색
export function searchTemplates(query: string): TemplateInfo[] {
  const lowerQuery = query.toLowerCase();
  const results: TemplateInfo[] = [];
  
  documentCategories.forEach(category => {
    category.templates.forEach(template => {
      if (
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push(template);
      }
    });
  });
  
  return results;
}

// ID로 템플릿 찾기
export function findTemplateById(templateId: string): TemplateInfo | null {
  for (const category of documentCategories) {
    const template = category.templates.find(t => t.id === templateId);
    if (template) {
      return template;
    }
  }
  return null;
}

// 카테고리별 템플릿 가져오기
export function getTemplatesByCategory(categoryId: string): TemplateInfo[] {
  const category = documentCategories.find(cat => cat.id === categoryId);
  return category ? category.templates : [];
}