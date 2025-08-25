/**
 * Advanced Template Examples
 * 고급 템플릿 엔진을 사용한 실제 템플릿 예제들
 */

import type { TemplateContext } from '@/lib/advanced-template-engine';

// 인보이스 템플릿
export const invoiceTemplate = `
# 세금계산서

<div class="invoice-header">
  <div class="company-info">
    <h2>{{user.company | default:"Weave"}}</h2>
    <p>{{user.address}}</p>
    <p>TEL: {{user.phone | phone}}</p>
    <p>EMAIL: {{user.email}}</p>
  </div>
  <div class="invoice-info">
    <p><strong>Invoice #{{invoice.invoiceNumber}}</strong></p>
    <p>발행일: {{invoice.issueDate | date:"YYYY.MM.DD"}}</p>
    <p>결제기한: {{invoice.dueDate | date:"YYYY년 MM월 DD일"}}</p>
    {{#if invoice.status}}
    <p>상태: <strong>{{invoice.status | uppercase}}</strong></p>
    {{/if}}
  </div>
</div>

## 청구 대상

<div class="client-info">
  <p><strong>{{client.name}}</strong></p>
  {{#if client.businessNumber}}
  <p>사업자등록번호: {{client.businessNumber | businessnumber}}</p>
  {{/if}}
  {{#if client.representative}}
  <p>대표자: {{client.representative}}</p>
  {{/if}}
  <p>주소: {{client.address | default:"주소 미등록"}}</p>
  {{#if client.contactPerson}}
  <p>담당자: {{client.contactPerson}}
  {{#if client.contactEmail}} ({{client.contactEmail}}){{/if}}
  {{#if client.contactPhone}} / {{client.contactPhone | phone}}{{/if}}
  </p>
  {{/if}}
</div>

{{#if project}}
## 프로젝트 정보

**{{project.name}}**
{{#if project.description}}
{{project.description}}
{{/if}}

{{#if project.dueDate}}
- 납기: {{project.dueDate | date:"YYYY년 MM월 DD일"}}
{{/if}}
{{/if}}

## 청구 내역

<div class="invoice-items">
<table>
  <thead>
    <tr>
      <th>항목명</th>
      <th>설명</th>
      <th style="text-align: right;">수량</th>
      <th style="text-align: right;">단가</th>
      <th style="text-align: right;">금액</th>
    </tr>
  </thead>
  <tbody>
    {{#each invoice.items}}
    <tr>
      <td><strong>{{name}}</strong></td>
      <td>{{description | default:"-"}}</td>
      <td class="amount">{{quantity | number}}</td>
      <td class="amount">{{unitPrice | currency}}</td>
      <td class="amount">{{amount | currency}}</td>
    </tr>
    {{/each}}
  </tbody>
</table>
</div>

<div class="invoice-total">
  <table style="width: 300px; margin-left: auto;">
    <tr>
      <td><strong>소계:</strong></td>
      <td class="amount"><strong>{{invoice.subtotal | currency}}</strong></td>
    </tr>
    {{#if invoice.tax}}
    <tr>
      <td><strong>부가세 (10%):</strong></td>
      <td class="amount"><strong>{{invoice.tax | currency}}</strong></td>
    </tr>
    {{/if}}
    <tr class="total-line">
      <td><strong>합계:</strong></td>
      <td class="amount"><strong>{{invoice.total | currency}}</strong></td>
    </tr>
  </table>
</div>

{{#if payment}}
## 결제 정보

- **결제 방법:** {{payment.method}}
{{#if payment.paidAt}}
- **결제 완료일:** {{payment.paidAt | date:"YYYY.MM.DD"}}
- **결제 금액:** {{payment.amount | currency}}
{{#if payment.memo}}
- **결제 메모:** {{payment.memo}}
{{/if}}
{{/if}}
{{/if}}

---

<div class="signature-section">
  <div class="signature-box">
    <p><strong>발행자</strong></p>
    <br><br>
    <p>{{user.name | default:"서명"}}</p>
  </div>
  <div class="signature-box">
    <p><strong>수신자</strong></p>
    <br><br>
    <p>{{client.representative | default:"서명"}}</p>
  </div>
</div>

<p style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9em;">
본 세금계산서는 {{system.generatedAt | date:"YYYY년 MM월 DD일"}}에 전자적으로 생성되었습니다.
</p>
`;

// 견적서 템플릿
export const quoteTemplate = `
# 견적서 (Quotation)

<div class="invoice-header">
  <div class="company-info">
    <h2>{{user.company | default:"Weave"}}</h2>
    <p>{{user.address}}</p>
    <p>TEL: {{user.phone | phone}}</p>
    <p>EMAIL: {{user.email}}</p>
  </div>
  <div class="invoice-info">
    <p><strong>견적번호: {{invoice.invoiceNumber | default:"QUOTE-001"}}</strong></p>
    <p>견적일: {{invoice.issueDate | date:"YYYY.MM.DD"}}</p>
    <p>유효기간: {{invoice.dueDate | date:"YYYY년 MM월 DD일"}}</p>
  </div>
</div>

## 견적 대상

<div class="client-info">
  <p><strong>{{client.name}}</strong></p>
  {{#if client.businessNumber}}
  <p>사업자등록번호: {{client.businessNumber | businessnumber}}</p>
  {{/if}}
  {{#if client.contactPerson}}
  <p>담당자: {{client.contactPerson}}
  {{#if client.contactEmail}} ({{client.contactEmail}}){{/if}}
  {{#if client.contactPhone}} / {{client.contactPhone | phone}}{{/if}}
  </p>
  {{/if}}
</div>

{{#if project}}
## 프로젝트 개요

**{{project.name}}**

{{#if project.description}}
### 프로젝트 설명
{{project.description}}
{{/if}}

{{#if project.startDate}}
**예상 시작일:** {{project.startDate | date:"YYYY년 MM월 DD일"}}
{{/if}}
{{#if project.endDate}}
**예상 완료일:** {{project.endDate | date:"YYYY년 MM월 DD일"}}
{{/if}}
{{/if}}

## 견적 내역

<div class="invoice-items">
<table>
  <thead>
    <tr>
      <th>작업 항목</th>
      <th>작업 내용</th>
      <th style="text-align: right;">수량</th>
      <th style="text-align: right;">단가</th>
      <th style="text-align: right;">금액</th>
    </tr>
  </thead>
  <tbody>
    {{#each invoice.items}}
    <tr>
      <td><strong>{{name}}</strong></td>
      <td>{{description | default:"상세 내용은 협의 예정"}}</td>
      <td class="amount">{{quantity | number}}</td>
      <td class="amount">{{unitPrice | currency}}</td>
      <td class="amount">{{amount | currency}}</td>
    </tr>
    {{/each}}
  </tbody>
</table>
</div>

<div class="invoice-total">
  <table style="width: 300px; margin-left: auto;">
    <tr>
      <td><strong>소계:</strong></td>
      <td class="amount"><strong>{{invoice.subtotal | currency}}</strong></td>
    </tr>
    <tr>
      <td><strong>부가세 (10%):</strong></td>
      <td class="amount"><strong>{{vat_amount}}</strong></td>
    </tr>
    <tr class="total-line">
      <td><strong>총 견적 금액:</strong></td>
      <td class="amount"><strong>{{total_with_vat}}</strong></td>
    </tr>
  </table>
</div>

## 견적 조건

- **결제 조건:** {{payment.method | default:"협의 예정"}}
- **견적 유효 기간:** {{invoice.dueDate | date:"YYYY년 MM월 DD일"}}까지
- **작업 기간:** {{#if project.startDate}}{{project.startDate | date:"MM.DD"}} ~ {{/if}}{{project.endDate | date:"MM.DD" | default:"협의 예정"}}
- **납품 형태:** 협의에 따라 결정

### 주의사항

1. 본 견적서는 {{invoice.dueDate | date:"YYYY년 MM월 DD일"}}까지 유효합니다.
2. 작업 범위 변경 시 별도 협의가 필요합니다.
3. 계약금은 총 금액의 50% 선납, 잔금은 완료 후 지급입니다.
4. 부가세는 별도이며, 세금계산서를 발행합니다.

---

<div class="signature-section">
  <div class="signature-box">
    <p><strong>제안자</strong></p>
    <br><br>
    <p>{{user.name | default:"서명"}}</p>
    <p style="font-size: 0.9em;">{{user.company | default:"Weave"}}</p>
  </div>
</div>

<p style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9em;">
감사합니다. 추가 문의사항이 있으시면 언제든 연락 주시기 바랍니다.
</p>
`;

// 계약서 템플릿
export const contractTemplate = `
# 프로젝트 수행 계약서

**계약 일자:** {{system.currentDate | date:"YYYY년 MM월 DD일"}}

## 제1조 (계약 당사자)

**갑 (발주자)**
- 상호/성명: {{client.name}}
{{#if client.businessNumber}}
- 사업자등록번호: {{client.businessNumber | businessnumber}}
{{/if}}
{{#if client.representative}}
- 대표자: {{client.representative}}
{{/if}}
- 주소: {{client.address | default:"주소 미기재"}}
{{#if client.contactPerson}}
- 담당자: {{client.contactPerson}} ({{client.contactEmail | default:"연락처 미기재"}})
{{/if}}

**을 (수행자)**
- 상호/성명: {{user.company | default:user.name}}
- 주소: {{user.address | default:"주소 미기재"}}
- 연락처: {{user.phone | phone}} / {{user.email}}

## 제2조 (계약 목적 및 내용)

{{#if project}}
**프로젝트명:** {{project.name}}

**프로젝트 내용:**
{{project.description | default:"별첨 사양서에 따름"}}

**수행기간:**
- 착수일: {{project.startDate | date:"YYYY년 MM월 DD일" | default:"계약 체결일"}}
- 완료일: {{project.endDate | date:"YYYY년 MM월 DD일" | default:"협의 예정"}}

**계약금액:** {{project.budget | currency | default:"별도 협의"}}
{{/if}}

## 제3조 (계약금액 및 지급조건)

1. 총 계약금액: {{invoice.total | currency}} (부가세 포함)
   - 공급가액: {{invoice.subtotal | currency}}
   - 부가세: {{invoice.tax | currency}}

2. 지급조건:
{{#if payment.method}}
   - 지급방법: {{payment.method}}
{{else}}
   - 계약금: 총 금액의 50% ({{invoice.total | currency | default:"0"}}의 50%)
   - 잔금: 완료 후 {{invoice.total | currency | default:"0"}}의 50%
{{/if}}

## 제4조 (수행 범위 및 납품)

### 수행 범위
{{#each invoice.items}}
{{@index | number}}. **{{name}}**
   {{#if description}}- {{description}}{{/if}}
   - 수량: {{quantity}} / 단가: {{unitPrice | currency}}
{{/each}}

### 납품 조건
- 납품형태: 협의에 따라 결정
- 납품장소: {{client.address | default:"협의 예정"}}
- 검수기간: 납품일로부터 7일 이내

## 제5조 (양 당사자의 의무)

### 갑(발주자)의 의무
1. 필요한 자료 및 정보의 적시 제공
2. 계약금액의 약정 기일 내 지급
3. 작업환경 및 접근권한 제공 (해당 시)

### 을(수행자)의 의무
1. 계약 내용에 따른 성실한 업무 수행
2. 약정 기일 내 완료 및 납품
3. 프로젝트 진행 상황의 정기적 보고

## 제6조 (계약 변경)

1. 본 계약의 내용을 변경하고자 하는 경우에는 양 당사자가 협의하여 서면으로 합의해야 한다.
2. 작업 범위 변경 시 추가 비용은 별도 정산한다.

## 제7조 (지적재산권)

1. 프로젝트 수행 결과물에 대한 지적재산권은 갑에게 귀속한다.
2. 을은 프로젝트 수행을 위해 보유한 기술 및 노하우에 대한 권리를 보유한다.

## 제8조 (기밀 유지)

양 당사자는 본 계약 수행 중 알게 된 상대방의 기밀정보를 제3자에게 누설하거나 본 계약 이외의 목적으로 사용하지 않는다.

## 제9조 (계약 해지)

다음 각 호의 사유가 발생한 경우 상대방에게 서면으로 통지하고 본 계약을 해지할 수 있다:

1. 상대방이 본 계약상의 의무를 현저히 위반한 경우
2. 상대방이 파산, 회생절차 개시신청을 한 경우
3. 기타 계약 이행이 불가능한 중대한 사유가 발생한 경우

## 제10조 (손해배상)

양 당사자는 본 계약 위반으로 인해 상대방에게 손해를 입힌 경우 그 손해를 배상할 책임을 진다.

## 제11조 (분쟁 해결)

본 계약과 관련하여 분쟁이 발생한 경우, 양 당사자는 상호 협의를 통해 해결하며, 협의가 불가능한 경우 관할법원에서 해결한다.

---

<div class="signature-section">
  <div class="signature-box">
    <p><strong>갑 (발주자)</strong></p>
    <br>
    <p>{{client.name}}</p>
    {{#if client.representative}}
    <p>대표자: {{client.representative}}</p>
    {{/if}}
    <br>
    <p>서명: ________________</p>
  </div>
  
  <div class="signature-box">
    <p><strong>을 (수행자)</strong></p>
    <br>
    <p>{{user.company | default:user.name}}</p>
    <p>{{user.name}}</p>
    <br>
    <p>서명: ________________</p>
  </div>
</div>

<p style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9em;">
본 계약서를 2부 작성하여 갑, 을이 각각 1부씩 보관한다.
</p>
`;

// 리마인드 이메일 템플릿
export const reminderEmailTemplate = `
안녕하세요, {{client.contactPerson | default:client.representative | default:"고객"}}님.

{{user.company | default:"Weave"}}의 {{user.name}}입니다.

{{#if invoice.dueDate}}
{{invoice.dueDate | date:"YYYY년 MM월 DD일"}}이 결제 예정일인 인보이스 {{invoice.invoiceNumber}}에 대해 안내드립니다.
{{else}}
발행된 인보이스 {{invoice.invoiceNumber}}에 대해 안내드립니다.
{{/if}}

**청구 내역:**
{{#each invoice.items}}
- {{name}}: {{amount | currency}}
{{/each}}

**총 청구 금액: {{invoice.total | currency}}**

{{#if invoice.dueDate}}
결제 기한이 {{invoice.dueDate | date:"MM월 DD일"}}까지입니다. 
{{/if}}

결제가 완료되셨다면 이 메시지는 무시해 주시기 바랍니다.

문의사항이 있으시면 언제든 연락 주시기 바랍니다.

감사합니다.

{{user.name}}
{{user.company | default:"Weave"}}
{{user.email}}
{{user.phone | phone}}
`;

// 샘플 컨텍스트 데이터
export const sampleContext: TemplateContext = {
  user: {
    name: "김개발",
    email: "kim@weave.com",
    company: "위브 테크놀로지",
    phone: "02-1234-5678",
    address: "서울시 강남구 테헤란로 123, 4층"
  },
  client: {
    id: "client-001",
    name: "㈜테크스타트업",
    businessNumber: "1234567890",
    representative: "박대표",
    email: "contact@techstartup.com",
    phone: "02-9876-5432",
    address: "서울시 서초구 서초대로 456, 7층",
    contactPerson: "이담당",
    contactEmail: "lee@techstartup.com",
    contactPhone: "010-1111-2222"
  },
  project: {
    id: "project-001",
    name: "웹사이트 리뉴얼 프로젝트",
    description: "기존 웹사이트의 UI/UX 개선 및 반응형 디자인 적용",
    startDate: "2024-09-01",
    endDate: "2024-10-31",
    budget: 10000000,
    status: "진행중"
  },
  invoice: {
    id: "invoice-001",
    invoiceNumber: "INV-2024-001",
    issueDate: "2024-08-25",
    dueDate: "2024-09-15",
    subtotal: 9090909,
    tax: 909091,
    total: 10000000,
    currency: "KRW",
    status: "발행됨",
    items: [
      {
        id: "item-001",
        name: "웹사이트 설계",
        description: "사용자 경험 설계 및 와이어프레임 작성",
        quantity: 1,
        unitPrice: 3000000,
        amount: 3000000
      },
      {
        id: "item-002",
        name: "프론트엔드 개발",
        description: "React 기반 반응형 웹사이트 개발",
        quantity: 1,
        unitPrice: 4000000,
        amount: 4000000
      },
      {
        id: "item-003",
        name: "백엔드 API 개발",
        description: "RESTful API 및 데이터베이스 구축",
        quantity: 1,
        unitPrice: 2090909,
        amount: 2090909
      }
    ]
  },
  payment: {
    method: "무통장입금",
    paidAt: undefined,
    amount: undefined,
    memo: undefined
  }
};

export const advancedTemplates = {
  invoice: invoiceTemplate,
  quote: quoteTemplate,
  contract: contractTemplate,
  reminderEmail: reminderEmailTemplate
};

export default advancedTemplates;