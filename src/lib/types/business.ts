// 사업자 정보 조회 관련 타입 정의

export interface BusinessInfo {
  b_no: string;                    // 사업자등록번호
  b_stt: string;                   // 납세자상태명
  b_stt_cd: string;               // 납세자상태코드
  tax_type: string;               // 과세유형명
  tax_type_cd: string;            // 과세유형코드
  end_dt: string;                 // 폐업일자
  utcc_yn: string;                // 단위과세전환여부
  tax_type_change_dt: string;     // 과세유형전환일자
  invoice_apply_dt: string;       // 세금계산서적용일자
  rbf_tax_type: string;           // 직전과세유형명
  rbf_tax_type_cd: string;        // 직전과세유형코드
}

export interface BusinessInfoApiResponse {
  status_code: string;            // 응답 상태 코드
  match_cnt: number;              // 매칭된 건수
  request_cnt: number;            // 요청된 건수
  data?: BusinessInfo[];          // 조회된 사업자 정보 배열
  error_msg?: string;             // 오류 메시지
}

// 사업자 정보 조회 요청
export interface BusinessInfoRequest {
  businessNumber: string;         // 사업자등록번호 (하이픈 제거)
}

// 사업자 상태 코드
export enum BusinessStatusCode {
  ACTIVE = '01',                  // 계속사업자
  CLOSED = '02',                  // 휴업자
  TERMINATED = '03'               // 폐업자
}

// 과세 유형 코드
export enum TaxTypeCode {
  GENERAL = '01',                 // 일반과세자
  SIMPLIFIED = '02',              // 간이과세자
  EXEMPT = '03'                   // 면세사업자
}

// 사업자 정보 유틸리티 함수들
export const formatBusinessNumber = (businessNumber: string): string => {
  const numbers = businessNumber.replace(/[^0-9]/g, '');
  
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
  }
};

export const cleanBusinessNumber = (businessNumber: string): string => {
  return businessNumber.replace(/-/g, '');
};

export const validateBusinessNumber = (businessNumber: string): boolean => {
  const cleaned = cleanBusinessNumber(businessNumber);
  return cleaned.length === 10 && /^\d{10}$/.test(cleaned);
};

export const getBusinessStatusLabel = (statusCode: string): string => {
  switch (statusCode) {
    case '01':
      return '계속사업자';
    case '02':
      return '휴업자';
    case '03':
      return '폐업자';
    default:
      return '알 수 없음';
  }
};

export const getTaxTypeLabel = (taxTypeCode: string): string => {
  switch (taxTypeCode) {
    case '01':
      return '일반과세자';
    case '02':
      return '간이과세자';
    case '03':
      return '면세사업자';
    default:
      return '알 수 없음';
  }
};