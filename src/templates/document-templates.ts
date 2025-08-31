// 문서 템플릿 정의
// 각 템플릿은 마크다운 형식으로 작성되며 {{변수명}} 형태로 데이터를 치환

export interface DocumentTemplate {
  id: string;
  name: string;
  category: 'proposal' | 'contract' | 'invoice' | 'report' | 'specification';
  description: string;
  template: string;
  variables: string[]; // 필요한 변수 목록
  thumbnail?: string;
}

// 제안서 템플릿
export const proposalTemplate: DocumentTemplate = {
  id: 'proposal-001',
  name: '프로젝트 제안서',
  category: 'proposal',
  description: '신규 프로젝트를 위한 표준 제안서 템플릿',
  template: `# 프로젝트 제안서

## 1. 프로젝트 개요

**프로젝트명:** {{projectName}}  
**제안일자:** {{date}}  
**제안업체:** {{companyName}}  
**담당자:** {{userName}}

---

## 2. 고객 정보

**고객사명:** {{clientCompany}}  
**담당자:** {{clientName}}  
**연락처:** {{clientPhone}}  
**이메일:** {{clientEmail}}

---

## 3. 프로젝트 배경 및 목적

### 3.1 프로젝트 배경
{{projectBackground}}

### 3.2 프로젝트 목적
{{projectPurpose}}

---

## 4. 프로젝트 범위

### 4.1 주요 기능
{{projectFeatures}}

### 4.2 제외 사항
{{projectExclusions}}

---

## 5. 개발 일정

**프로젝트 시작일:** {{startDate}}  
**프로젝트 종료일:** {{endDate}}  
**총 개발 기간:** {{duration}}

### 주요 마일스톤
{{milestones}}

---

## 6. 예상 비용

### 6.1 개발 비용
{{developmentCost}}

### 6.2 유지보수 비용
{{maintenanceCost}}

### 6.3 총 비용
**{{totalCost}}원** (VAT 별도)

---

## 7. 산출물

{{deliverables}}

---

## 8. 프로젝트 팀 구성

{{teamStructure}}

---

## 9. 기대 효과

{{expectedBenefits}}

---

## 10. 참고 사항

{{notes}}

---

*본 제안서는 {{companyName}}에서 작성하였으며, 제안 내용은 협의를 통해 조정될 수 있습니다.*

**작성자:** {{userName}}  
**연락처:** {{userPhone}}  
**이메일:** {{userEmail}}`,
  variables: [
    'projectName', 'date', 'companyName', 'userName', 'clientCompany', 
    'clientName', 'clientPhone', 'clientEmail', 'projectBackground',
    'projectPurpose', 'projectFeatures', 'projectExclusions', 'startDate',
    'endDate', 'duration', 'milestones', 'developmentCost', 'maintenanceCost',
    'totalCost', 'deliverables', 'teamStructure', 'expectedBenefits',
    'notes', 'userPhone', 'userEmail'
  ]
};

// 계약서 템플릿
export const contractTemplate: DocumentTemplate = {
  id: 'contract-001',
  name: '용역 계약서',
  category: 'contract',
  description: '소프트웨어 개발 용역 계약서 템플릿',
  template: `# 소프트웨어 개발 용역 계약서

**{{supplierCompany}}**(이하 "공급자"라 한다)와 **{{buyerCompany}}**(이하 "수요자"라 한다)는 다음과 같이 소프트웨어 개발 용역 계약을 체결한다.

---

## 제1조 (계약의 목적)
본 계약은 수요자가 공급자에게 의뢰한 "**{{projectName}}**" 개발에 관한 제반 사항을 규정함을 목적으로 한다.

## 제2조 (용역의 범위)
공급자가 수행할 용역의 범위는 다음과 같다:
{{serviceScope}}

## 제3조 (계약 기간)
- **계약 시작일:** {{startDate}}
- **계약 종료일:** {{endDate}}
- **총 기간:** {{duration}}

## 제4조 (계약 금액 및 지급 방법)
### 4.1 계약 금액
- **총 계약 금액:** {{totalAmount}}원 (VAT 별도)

### 4.2 지급 방법
{{paymentTerms}}

### 4.3 지급 계좌
- **은행명:** {{bankName}}
- **계좌번호:** {{accountNumber}}
- **예금주:** {{accountHolder}}

## 제5조 (산출물)
공급자는 다음의 산출물을 수요자에게 제공한다:
{{deliverables}}

## 제6조 (비밀유지)
양 당사자는 본 계약과 관련하여 취득한 상대방의 영업비밀 및 기술정보를 제3자에게 누설하거나 본 계약 이외의 목적으로 사용하여서는 안 된다.

## 제7조 (지적재산권)
본 계약에 의해 개발된 소프트웨어의 지적재산권은 {{intellectualPropertyOwner}}에게 귀속된다.

## 제8조 (하자보수)
- **하자보수 기간:** 검수 완료일로부터 {{warrantyPeriod}}
- **하자보수 범위:** {{warrantyScope}}

## 제9조 (계약의 해제 및 해지)
{{terminationConditions}}

## 제10조 (손해배상)
어느 일방이 본 계약을 위반하여 상대방에게 손해를 입힌 경우, 그 손해를 배상하여야 한다.

## 제11조 (분쟁 해결)
본 계약과 관련하여 분쟁이 발생한 경우, 양 당사자는 상호 협의하여 해결하며, 협의가 이루어지지 않을 경우 {{jurisdiction}} 관할 법원에서 해결한다.

---

본 계약의 체결을 증명하기 위하여 계약서 2통을 작성하여 양 당사자가 서명날인 후 각 1통씩 보관한다.

**계약 체결일:** {{contractDate}}

### 공급자
- **회사명:** {{supplierCompany}}
- **대표자:** {{supplierRepresentative}} (인)
- **사업자번호:** {{supplierBusinessNumber}}
- **주소:** {{supplierAddress}}

### 수요자
- **회사명:** {{buyerCompany}}
- **대표자:** {{buyerRepresentative}} (인)
- **사업자번호:** {{buyerBusinessNumber}}
- **주소:** {{buyerAddress}}`,
  variables: [
    'supplierCompany', 'buyerCompany', 'projectName', 'serviceScope',
    'startDate', 'endDate', 'duration', 'totalAmount', 'paymentTerms',
    'bankName', 'accountNumber', 'accountHolder', 'deliverables',
    'intellectualPropertyOwner', 'warrantyPeriod', 'warrantyScope',
    'terminationConditions', 'jurisdiction', 'contractDate',
    'supplierRepresentative', 'supplierBusinessNumber', 'supplierAddress',
    'buyerRepresentative', 'buyerBusinessNumber', 'buyerAddress'
  ]
};

// 견적서 템플릿
export const quotationTemplate: DocumentTemplate = {
  id: 'quotation-001',
  name: '견적서',
  category: 'invoice',
  description: '프로젝트 견적서 템플릿',
  template: `# 견적서

**견적번호:** {{quotationNumber}}  
**견적일자:** {{quotationDate}}  
**유효기간:** {{validUntil}}

---

## 공급자 정보
- **회사명:** {{supplierCompany}}
- **대표자:** {{supplierRepresentative}}
- **사업자번호:** {{supplierBusinessNumber}}
- **주소:** {{supplierAddress}}
- **연락처:** {{supplierPhone}}
- **이메일:** {{supplierEmail}}

## 수신처 정보
- **회사명:** {{clientCompany}}
- **담당자:** {{clientName}}
- **연락처:** {{clientPhone}}
- **이메일:** {{clientEmail}}

---

## 견적 내역

### 프로젝트명: {{projectName}}

| 항목 | 규격 | 수량 | 단가 | 금액 |
|------|------|------|------|------|
{{itemList}}
| **소계** | | | | **{{subtotal}}원** |
| **부가세 (10%)** | | | | **{{tax}}원** |
| **총 합계** | | | | **{{total}}원** |

---

## 상세 내역

### 개발 범위
{{developmentScope}}

### 기술 스택
{{techStack}}

### 개발 일정
- **착수일:** {{startDate}}
- **완료일:** {{endDate}}
- **총 기간:** {{duration}}

---

## 결제 조건
{{paymentTerms}}

## 특이 사항
{{specialNotes}}

---

*상기 견적은 프로젝트 범위 및 요구사항 변경 시 조정될 수 있습니다.*

**담당자:** {{contactPerson}}  
**연락처:** {{contactPhone}}  
**이메일:** {{contactEmail}}`,
  variables: [
    'quotationNumber', 'quotationDate', 'validUntil', 'supplierCompany',
    'supplierRepresentative', 'supplierBusinessNumber', 'supplierAddress',
    'supplierPhone', 'supplierEmail', 'clientCompany', 'clientName',
    'clientPhone', 'clientEmail', 'projectName', 'itemList', 'subtotal',
    'tax', 'total', 'developmentScope', 'techStack', 'startDate', 'endDate',
    'duration', 'paymentTerms', 'specialNotes', 'contactPerson',
    'contactPhone', 'contactEmail'
  ]
};

// 프로젝트 완료 보고서 템플릿
export const completionReportTemplate: DocumentTemplate = {
  id: 'report-001',
  name: '프로젝트 완료 보고서',
  category: 'report',
  description: '프로젝트 완료 시 제출하는 최종 보고서 템플릿',
  template: `# 프로젝트 완료 보고서

## 1. 프로젝트 개요

**프로젝트명:** {{projectName}}  
**고객사:** {{clientCompany}}  
**수행기간:** {{startDate}} ~ {{endDate}}  
**프로젝트 매니저:** {{projectManager}}

---

## 2. 프로젝트 목표 및 달성도

### 2.1 프로젝트 목표
{{projectGoals}}

### 2.2 달성도
{{achievementRate}}

---

## 3. 주요 구현 기능

{{implementedFeatures}}

---

## 4. 프로젝트 일정 및 마일스톤

### 4.1 계획 대비 실제 일정
{{scheduleComparison}}

### 4.2 주요 마일스톤
{{milestones}}

---

## 5. 투입 자원

### 5.1 인력 투입
{{resourceAllocation}}

### 5.2 개발 환경
{{developmentEnvironment}}

---

## 6. 산출물

### 6.1 주요 산출물
{{mainDeliverables}}

### 6.2 문서 산출물
{{documentDeliverables}}

---

## 7. 품질 관리

### 7.1 테스트 결과
{{testResults}}

### 7.2 품질 지표
{{qualityMetrics}}

---

## 8. 이슈 및 해결 사항

{{issuesAndResolutions}}

---

## 9. 프로젝트 성과

### 9.1 정량적 성과
{{quantitativeResults}}

### 9.2 정성적 성과
{{qualitativeResults}}

---

## 10. 향후 계획

### 10.1 유지보수 계획
{{maintenancePlan}}

### 10.2 추가 개발 제안
{{futureDevelopment}}

---

## 11. 교훈 및 개선 사항

{{lessonsLearned}}

---

**작성일:** {{reportDate}}  
**작성자:** {{author}}  
**검토자:** {{reviewer}}

---

*본 보고서는 {{projectName}} 프로젝트의 공식 완료 보고서입니다.*`,
  variables: [
    'projectName', 'clientCompany', 'startDate', 'endDate', 'projectManager',
    'projectGoals', 'achievementRate', 'implementedFeatures', 'scheduleComparison',
    'milestones', 'resourceAllocation', 'developmentEnvironment', 'mainDeliverables',
    'documentDeliverables', 'testResults', 'qualityMetrics', 'issuesAndResolutions',
    'quantitativeResults', 'qualitativeResults', 'maintenancePlan', 'futureDevelopment',
    'lessonsLearned', 'reportDate', 'author', 'reviewer'
  ]
};

// 기능 명세서 템플릿
export const specificationTemplate: DocumentTemplate = {
  id: 'spec-001',
  name: '기능 명세서',
  category: 'specification',
  description: '소프트웨어 기능 명세서 템플릿',
  template: `# 기능 명세서

## 문서 정보

**문서명:** {{projectName}} 기능 명세서  
**버전:** {{version}}  
**작성일:** {{createdDate}}  
**최종 수정일:** {{lastModified}}  
**작성자:** {{author}}

---

## 1. 시스템 개요

### 1.1 시스템 목적
{{systemPurpose}}

### 1.2 시스템 범위
{{systemScope}}

### 1.3 용어 정의
{{terminology}}

---

## 2. 시스템 아키텍처

### 2.1 전체 구조
{{systemArchitecture}}

### 2.2 기술 스택
{{techStack}}

### 2.3 시스템 구성도
{{systemDiagram}}

---

## 3. 기능 요구사항

### 3.1 사용자 관리
{{userManagement}}

### 3.2 핵심 기능
{{coreFeatures}}

### 3.3 부가 기능
{{additionalFeatures}}

---

## 4. 비기능 요구사항

### 4.1 성능 요구사항
{{performanceRequirements}}

### 4.2 보안 요구사항
{{securityRequirements}}

### 4.3 사용성 요구사항
{{usabilityRequirements}}

---

## 5. 데이터베이스 설계

### 5.1 데이터 모델
{{dataModel}}

### 5.2 주요 테이블
{{mainTables}}

---

## 6. API 명세

### 6.1 API 목록
{{apiList}}

### 6.2 인증 방식
{{authenticationMethod}}

---

## 7. 화면 설계

### 7.1 화면 구성
{{screenLayout}}

### 7.2 주요 화면 명세
{{screenSpecifications}}

---

## 8. 인터페이스

### 8.1 외부 시스템 연동
{{externalInterfaces}}

### 8.2 데이터 연동
{{dataInterfaces}}

---

## 9. 제약 사항

{{constraints}}

---

## 10. 부록

### 10.1 참고 문서
{{references}}

### 10.2 변경 이력
{{changeHistory}}

---

*본 문서는 {{projectName}} 프로젝트의 공식 기능 명세서입니다.*`,
  variables: [
    'projectName', 'version', 'createdDate', 'lastModified', 'author',
    'systemPurpose', 'systemScope', 'terminology', 'systemArchitecture',
    'techStack', 'systemDiagram', 'userManagement', 'coreFeatures',
    'additionalFeatures', 'performanceRequirements', 'securityRequirements',
    'usabilityRequirements', 'dataModel', 'mainTables', 'apiList',
    'authenticationMethod', 'screenLayout', 'screenSpecifications',
    'externalInterfaces', 'dataInterfaces', 'constraints', 'references',
    'changeHistory'
  ]
};

// 추가 견적서 템플릿
export const detailedQuotationTemplate: DocumentTemplate = {
  id: 'quotation-002',
  name: '상세 견적서',
  category: 'invoice',
  description: '상세 내역이 포함된 견적서',
  template: `# 상세 견적서

**견적번호:** QT-{{date}}-001  
**견적일자:** {{date}}  
**유효기간:** 견적일로부터 30일

---

## 공급자 정보
- **회사명:** {{companyName}}
- **담당자:** {{userName}}
- **연락처:** {{userEmail}}

## 수신처
- **회사명:** {{clientCompany}}
- **담당자:** {{clientName}}
- **연락처:** {{clientPhone}}

---

## 견적 상세 내역

### 1. 개발 비용
| 항목 | 상세내역 | 수량 | 단가 | 금액 |
|------|---------|------|------|------|
| 기획/디자인 | UI/UX 설계 및 기획 | 1 | {{projectBudget}} | {{projectBudget}} |
| 프론트엔드 개발 | React 기반 프론트 | 1 | - | - |
| 백엔드 개발 | API 서버 개발 | 1 | - | - |
| 테스트/배포 | QA 및 배포 | 1 | - | - |

### 2. 추가 옵션
- 유지보수 (월): 별도 협의
- 추가 기능 개발: 별도 견적

### 3. 총 견적 금액
**총액: {{projectBudget}}원**

---

## 결제 조건
- 계약금: 30%
- 중도금: 40%
- 잔금: 30%

## 참고사항
- 본 견적서는 부가세 별도입니다
- 상세 일정은 계약 후 협의`,
  variables: ['date', 'companyName', 'userName', 'userEmail', 'clientCompany', 'clientName', 'clientPhone', 'projectBudget'],
  thumbnail: '📋'
};

export const serviceQuotationTemplate: DocumentTemplate = {
  id: 'quotation-003',
  name: '서비스 견적서',
  category: 'invoice',
  description: '서비스 제공 견적서',
  template: `# 서비스 견적서

**견적일:** {{date}}

## 제공 서비스
**서비스명:** {{projectName}}

### 서비스 내용
{{projectDescription}}

### 서비스 기간
{{projectStartDate}} ~ {{projectEndDate}}

### 서비스 비용
**월 {{projectBudget}}원**

---

회사명: {{companyName}}
담당자: {{userName}}`,
  variables: ['date', 'projectName', 'projectDescription', 'projectStartDate', 'projectEndDate', 'projectBudget', 'companyName', 'userName'],
  thumbnail: '📧'
};

// 추가 계약서 템플릿
export const projectContractTemplate: DocumentTemplate = {
  id: 'contract-002',
  name: '프로젝트 계약서',
  category: 'contract',
  description: '프로젝트 기반 계약서',
  template: `# 프로젝트 계약서

**계약일자:** {{date}}

## 계약 당사자

**갑(발주자):**
- 회사명: {{clientCompany}}
- 대표자: {{clientName}}
- 연락처: {{clientPhone}}

**을(수주자):**
- 회사명: {{companyName}}
- 대표자: {{userName}}
- 연락처: {{userEmail}}

## 프로젝트 개요

### 프로젝트명
{{projectName}}

### 프로젝트 내용
{{projectDescription}}

### 개발 기간
{{projectStartDate}} ~ {{projectEndDate}}

### 계약 금액
총 {{projectBudget}}원 (부가세 별도)

## 결제 조건
- 계약금: 계약 체결 시 30%
- 중도금: 개발 중간 시점 40%
- 잔금: 프로젝트 완료 후 30%

## 특약사항
1. 을은 본 계약서에 명시된 업무를 성실히 수행한다.
2. 갑은 을의 업무 수행에 필요한 자료를 제공한다.
3. 본 계약의 내용 변경은 상호 합의하에 진행한다.

위 계약을 증명하기 위하여 계약서 2부를 작성하여 각각 1부씩 보관한다.

**갑:** {{clientCompany}}  
**을:** {{companyName}}`,
  variables: ['date', 'clientCompany', 'clientName', 'clientPhone', 'companyName', 'userName', 'userEmail', 'projectName', 'projectDescription', 'projectStartDate', 'projectEndDate', 'projectBudget'],
  thumbnail: '📄'
};

export const maintenanceContractTemplate: DocumentTemplate = {
  id: 'contract-003',
  name: '유지보수 계약서',
  category: 'contract',
  description: '시스템 유지보수 계약서',
  template: `# 유지보수 계약서

## 계약 내용

### 유지보수 대상
{{projectName}}

### 유지보수 범위
- 시스템 오류 수정
- 정기 점검 및 보안 업데이트
- 서버 모니터링
- 데이터 백업

### 계약 기간
{{projectStartDate}} ~ {{projectEndDate}} (1년)

### 유지보수 비용
월 {{projectBudget}}원 (부가세 별도)

---

{{companyName}}
{{userName}}`,
  variables: ['projectName', 'projectStartDate', 'projectEndDate', 'projectBudget', 'companyName', 'userName'],
  thumbnail: '🔧'
};

// 추가 청구서 템플릿
export const taxInvoiceTemplate: DocumentTemplate = {
  id: 'invoice-001',
  name: '세금계산서',
  category: 'invoice',
  description: '정식 세금계산서',
  template: `# 세금계산서

**발행일:** {{date}}
**공급받는자:** {{clientCompany}}

## 공급자
- {{companyName}}
- 사업자번호: 123-45-67890

## 공급내역
| 품목 | 수량 | 단가 | 공급가액 | 세액 |
|-----|-----|-----|---------|------|
| {{projectName}} | 1 | {{projectBudget}} | {{projectBudget}} | - |

**합계 금액: {{projectBudget}}원**`,
  variables: ['date', 'clientCompany', 'companyName', 'projectName', 'projectBudget'],
  thumbnail: '🧾'
};

export const simpleInvoiceTemplate: DocumentTemplate = {
  id: 'invoice-002',
  name: '간편 청구서',
  category: 'invoice',
  description: '간단한 청구서',
  template: `# 청구서

**청구일:** {{date}}
**수신:** {{clientCompany}}

## 청구 내역
{{projectName}}

**청구금액: {{projectBudget}}원**

---
{{companyName}}
{{userName}}`,
  variables: ['date', 'clientCompany', 'projectName', 'projectBudget', 'companyName', 'userName'],
  thumbnail: '💵'
};

export const detailedInvoiceTemplate: DocumentTemplate = {
  id: 'invoice-003',
  name: '상세 청구서',
  category: 'invoice',
  description: '상세 내역이 포함된 청구서',
  template: `# 상세 청구서

**청구번호:** INV-{{date}}-001
**청구일:** {{date}}
**납기일:** 청구일로부터 30일

## 청구 상세

### 프로젝트명
{{projectName}}

### 작업 기간
{{projectStartDate}} ~ {{projectEndDate}}

### 작업 내역
{{projectDescription}}

### 청구 금액
| 항목 | 금액 |
|------|------|
| 개발비 | {{projectBudget}} |
| 부가세 (10%) | - |
| **총 청구액** | **{{projectBudget}}원** |

## 입금 계좌
- 은행명: 국민은행
- 계좌번호: 123-456-789012
- 예금주: {{companyName}}

---
{{companyName}}
{{userName}}
{{userEmail}}`,
  variables: ['date', 'projectName', 'projectStartDate', 'projectEndDate', 'projectDescription', 'projectBudget', 'companyName', 'userName', 'userEmail'],
  thumbnail: '📊'
};

// 추가 보고서 템플릿
export const progressReportTemplate: DocumentTemplate = {
  id: 'report-002',
  name: '진행 보고서',
  category: 'report',
  description: '프로젝트 진행 현황 보고서',
  template: `# 프로젝트 진행 보고서

**보고일:** {{date}}
**프로젝트명:** {{projectName}}

## 진행 현황

### 전체 진행률
**70%** 완료

### 주요 완료 사항
- UI/UX 디자인 완료
- 프론트엔드 개발 80% 완료
- 백엔드 API 개발 60% 완료

### 예정 작업
- 테스트 및 QA
- 배포 환경 구축
- 최종 검수

### 예상 완료일
{{projectEndDate}}

---
작성자: {{userName}}
{{companyName}}`,
  variables: ['date', 'projectName', 'projectEndDate', 'userName', 'companyName'],
  thumbnail: '📈'
};

export const monthlyReportTemplate: DocumentTemplate = {
  id: 'report-003',
  name: '월간 보고서',
  category: 'report',
  description: '월간 업무 보고서',
  template: `# 월간 업무 보고서

**보고 기간:** {{date}}
**프로젝트:** {{projectName}}

## 이번 달 주요 성과

1. {{projectDescription}}
2. 버그 수정 및 개선
3. 고객 피드백 반영

## 다음 달 계획

1. 신규 기능 개발
2. 성능 최적화
3. 사용자 교육

---
{{companyName}}
{{userName}}`,
  variables: ['date', 'projectName', 'projectDescription', 'companyName', 'userName'],
  thumbnail: '📅'
};

// 모든 템플릿 목록
export const documentTemplates: DocumentTemplate[] = [
  proposalTemplate,
  contractTemplate,
  projectContractTemplate,
  maintenanceContractTemplate,
  quotationTemplate,
  detailedQuotationTemplate,
  serviceQuotationTemplate,
  taxInvoiceTemplate,
  simpleInvoiceTemplate,
  detailedInvoiceTemplate,
  completionReportTemplate,
  progressReportTemplate,
  monthlyReportTemplate,
  specificationTemplate
];

// 카테고리별 템플릿 조회
export function getTemplatesByCategory(category: DocumentTemplate['category']): DocumentTemplate[] {
  return documentTemplates.filter(template => template.category === category);
}

// ID로 템플릿 조회
export function getTemplateById(id: string): DocumentTemplate | undefined {
  return documentTemplates.find(template => template.id === id);
}

// 템플릿에 데이터 적용
export function applyDataToTemplate(template: string, data: Record<string, any>): string {
  let result = template;
  
  // {{변수명}} 패턴을 찾아서 데이터로 치환
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value || ''));
  });
  
  // 치환되지 않은 변수는 빈 문자열로 처리
  result = result.replace(/{{[^}]+}}/g, '');
  
  return result;
}