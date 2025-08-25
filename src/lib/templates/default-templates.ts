// 기본 문서 템플릿 정의

import { DocumentTemplate, TemplateCategory, COMMON_VARIABLES } from '@/lib/types/template';

export const DEFAULT_TEMPLATES: DocumentTemplate[] = [
  // 웹 개발 프로젝트 계약서
  {
    id: 'web-dev-contract',
    name: '웹 개발 프로젝트 계약서',
    category: TemplateCategory.CONTRACT,
    description: '웹사이트 개발 프로젝트를 위한 표준 계약서 템플릿',
    content: `# 웹 개발 프로젝트 계약서

**계약일자:** {current_date}

## 당사자

**발주자 (甲)**
- 회사명: {client_name}
- 사업자등록번호: {client_business_number}
- 주소: {client_address}
- 전화: {client_phone}
- 이메일: {client_email}

**수주자 (을)**
- 회사명: {company_name}
- 사업자등록번호: {company_business_number}
- 주소: {company_address}
- 전화: {company_phone}
- 이메일: {company_email}

## 제1조 (계약의 목적)
본 계약은 발주자(甲)가 수주자(을)에게 **{project_name}** 개발을 의뢰하고, 수주자(을)가 이를 수행함에 있어 필요한 제반 사항을 정함을 목적으로 한다.

## 제2조 (프로젝트 개요)
**프로젝트명:** {project_name}

**프로젝트 내용:**
{project_description}

**개발 기간:** {start_date} ~ {end_date}

## 제3조 (계약금액 및 지급조건)
1. 총 계약금액: **{project_amount}**
2. 부가세(10%): **{vat_amount}**
3. 총 금액: **{total_amount}**

**지급 조건:**
- 계약체결 시: 총 금액의 30%
- 중간 점검 시: 총 금액의 40%
- 프로젝트 완료 시: 총 금액의 30%

## 제4조 (수주자의 의무)
1. 수주자는 계약 내용에 따라 성실히 개발 업무를 수행해야 한다.
2. 개발 과정에서 정기적으로 진행상황을 발주자에게 보고해야 한다.
3. 개발 완료 후 1개월간 무상 유지보수를 제공한다.

## 제5조 (발주자의 의무)
1. 발주자는 개발에 필요한 자료를 적기에 제공해야 한다.
2. 계약금액을 약정된 기일에 지급해야 한다.
3. 개발 과정에서 요구사항 변경 시 사전 협의해야 한다.

## 제6조 (지적재산권)
개발된 웹사이트의 지적재산권은 발주자에게 귀속되며, 수주자는 개발 과정에서 사용한 기술적 노하우에 대한 권리를 보유한다.

## 제7조 (기밀유지)
양 당사자는 본 계약과 관련하여 취득한 상대방의 기밀정보를 제3자에게 누설하지 않는다.

## 제8조 (계약의 해지)
일방 당사자가 계약상의 의무를 위반하고 상당한 기간 내에 이를 시정하지 않을 경우, 상대방은 본 계약을 해지할 수 있다.

---

**발주자 (甲)**
회사명: {client_name}
대표자: _________________ (인)
날짜: {current_date}

**수주자 (을)**  
회사명: {company_name}
대표자: {company_representative} (인)
날짜: {current_date}`,
    variables: [
      ...COMMON_VARIABLES,
      {
        key: 'company_representative',
        label: '대표자명',
        type: 'text',
        required: true,
        placeholder: '홍길동'
      }
    ],
    tags: ['계약서', '웹개발', '프로젝트'],
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 프리랜서 견적서
  {
    id: 'freelancer-quote',
    name: '프리랜서 견적서',
    category: TemplateCategory.QUOTE,
    description: '프리랜서 프로젝트를 위한 견적서 템플릿',
    content: `# 견적서

**견적서 번호:** QUOTE-{current_year}-001
**견적일자:** {current_date}

---

## 수신

**{client_name}** 귀중

안녕하세요. **{project_name}** 프로젝트에 대한 견적서를 제출드립니다.

## 프로젝트 개요

**프로젝트명:** {project_name}
**프로젝트 설명:**
{project_description}

**예상 기간:** {start_date} ~ {end_date}

## 견적 내역

| 항목 | 설명 | 금액 |
|------|------|------|
| {project_name} | {project_description} | {project_amount} |
| | **소계** | **{project_amount}** |
| | **부가세 (10%)** | **{vat_amount}** |
| | **총 금액** | **{total_amount}** |

## 작업 범위

1. **설계 및 기획**
   - 요구사항 분석
   - UI/UX 설계

2. **개발**
   - 프론트엔드 개발
   - 백엔드 개발
   - 데이터베이스 구축

3. **테스트 및 배포**
   - 기능 테스트
   - 성능 최적화
   - 배포 및 초기 설정

## 결제 조건

- **선급금:** 총 금액의 30% (계약 체결 시)
- **중도금:** 총 금액의 40% (개발 50% 완료 시)  
- **잔급:** 총 금액의 30% (프로젝트 완료 시)

## 제공 사항

- 소스코드 전체
- 개발 문서
- 1개월 무상 유지보수
- 운영 가이드

## 기타 조건

- 견적 유효기간: {current_date}로부터 30일
- 요구사항 변경 시 별도 협의
- 결제는 세금계산서 발행 후 진행

---

**견적 제출자**

{company_name}  
대표: {company_representative}  
연락처: {company_phone}  
이메일: {company_email}  

감사합니다.`,
    variables: COMMON_VARIABLES,
    tags: ['견적서', '프리랜서', '프로젝트'],
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 프로젝트 제안서
  {
    id: 'project-proposal',
    name: '프로젝트 제안서',
    category: TemplateCategory.PROPOSAL,
    description: '프로젝트 제안을 위한 상세 제안서 템플릿',
    content: `# {project_name} 제안서

**제출일:** {current_date}  
**제출자:** {company_name}

---

## Executive Summary

**{client_name}** 귀하에게 **{project_name}** 프로젝트를 제안드립니다.

본 제안서는 귀하의 비즈니스 목표 달성을 위한 최적의 솔루션을 제시합니다.

## 프로젝트 개요

### 프로젝트 목표
{project_description}

### 기대 효과
- 업무 효율성 향상
- 고객 만족도 증대
- 매출 증가 기여

## 제안 내용

### 1. 현황 분석
현재 상황에 대한 분석 결과, 다음과 같은 개선 사항이 필요합니다.

### 2. 솔루션 제안
제안하는 솔루션의 주요 특징:

- **사용자 중심 설계**
- **확장성 고려**
- **유지보수 용이성**

### 3. 기술 스택
- Frontend: React, TypeScript
- Backend: Node.js, Express
- Database: PostgreSQL
- Cloud: AWS/Azure

## 프로젝트 일정

| 단계 | 내용 | 기간 | 마일스톤 |
|------|------|------|----------|
| 1단계 | 기획 및 설계 | 2주 | 설계서 완성 |
| 2단계 | 개발 | 6주 | 베타 버전 |
| 3단계 | 테스트 및 배포 | 2주 | 정식 런칭 |

**전체 기간:** {start_date} ~ {end_date}

## 투자 계획

### 총 프로젝트 비용
- **개발비:** {project_amount}
- **부가세:** {vat_amount}
- **총액:** {total_amount}

### 비용 구성
| 항목 | 비율 | 금액 |
|------|------|------|
| 기획/설계 | 20% | {project_amount} × 0.2 |
| 개발 | 60% | {project_amount} × 0.6 |
| 테스트/배포 | 20% | {project_amount} × 0.2 |

## 팀 소개

### {company_name}
우리는 다양한 프로젝트 경험을 바탕으로 최고의 솔루션을 제공합니다.

**핵심 역량:**
- 웹/앱 개발
- UI/UX 디자인
- 시스템 통합

## 차별화 요소

1. **풍부한 경험**
2. **신속한 대응**
3. **합리적인 가격**
4. **체계적인 관리**

## 다음 단계

1. 제안서 검토
2. 미팅 일정 조율
3. 상세 요구사항 논의
4. 계약 진행

---

**연락처**

{company_name}  
대표: {company_representative}  
주소: {company_address}  
전화: {company_phone}  
이메일: {company_email}

**제안서에 대한 문의사항이 있으시면 언제든지 연락주시기 바랍니다.**`,
    variables: COMMON_VARIABLES,
    tags: ['제안서', '프로젝트', '비즈니스'],
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 비즈니스 이메일 템플릿
  {
    id: 'business-email-followup',
    name: '프로젝트 진행상황 이메일',
    category: TemplateCategory.EMAIL,
    description: '클라이언트에게 프로젝트 진행상황을 알리는 이메일 템플릿',
    content: `제목: [{project_name}] 프로젝트 진행상황 보고

{client_name} 담당자님께,

안녕하세요. {company_name}의 {company_representative}입니다.

**{project_name}** 프로젝트의 진행상황을 말씀드리고자 합니다.

## 이번 주 완료사항

- 기능 A 개발 완료
- 데이터베이스 구조 최적화
- UI/UX 개선

## 다음 주 계획

- 사용자 테스트 진행
- 버그 수정 및 개선
- 배포 준비

## 현재 진행률

전체 진행률: **75%** 완료

예정된 일정대로 **{end_date}**에 완료 예정입니다.

## 요청사항

테스트를 위해 다음 자료가 필요합니다:
- 실제 데이터 샘플
- 테스트 계정 정보

질문이나 추가 요청사항이 있으시면 언제든지 말씀해 주세요.

감사합니다.

---
{company_representative}  
{company_name}  
{company_phone} | {company_email}`,
    variables: COMMON_VARIABLES,
    tags: ['이메일', '진행상황', '커뮤니케이션'],
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 템플릿 엔진에 기본 템플릿 등록
export function registerDefaultTemplates() {
  const { TemplateEngine } = require('@/lib/template-engine');
  const engine = TemplateEngine.getInstance();
  
  DEFAULT_TEMPLATES.forEach(template => {
    engine.registerTemplate(template);
  });

  console.log(`${DEFAULT_TEMPLATES.length}개의 기본 템플릿이 등록되었습니다.`);
}