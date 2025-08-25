import { NextRequest, NextResponse } from 'next/server';
import { BusinessInfoRequest, BusinessInfoApiResponse, cleanBusinessNumber, validateBusinessNumber } from '@/lib/types/business';

// 국세청 사업자등록정보 상태조회 API
const API_KEY = process.env.BUSINESS_API_KEY || 'IHXWXpobNTGEHV+mbvW6D3k9ETjK37Klv4RCEnvXSrDdanoVv3CfskmUXDFUEJlzXA8swiJCB5LRNBl2r6aXCg==';
const API_URL = 'https://api.odcloud.kr/api/nts-businessman/v1/status';

export async function POST(request: NextRequest) {
  try {
    const body: BusinessInfoRequest = await request.json();
    const { businessNumber } = body;

    if (!businessNumber) {
      return NextResponse.json(
        { 
          status_code: 'ERROR',
          error_msg: '사업자등록번호가 필요합니다.' 
        },
        { status: 400 }
      );
    }

    const cleanedBNo = cleanBusinessNumber(businessNumber);
    
    if (!validateBusinessNumber(cleanedBNo)) {
      return NextResponse.json(
        { 
          status_code: 'ERROR',
          error_msg: '올바른 사업자등록번호 형식이 아닙니다. (10자리)' 
        },
        { status: 400 }
      );
    }

    // 국세청 API 요청 데이터
    const requestBody = {
      b_no: [cleanedBNo]
    };

    console.log('국세청 API 요청:', {
      url: API_URL,
      businessNumber: cleanedBNo
    });

    const response = await fetch(`${API_URL}?serviceKey=${encodeURIComponent(API_KEY)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('국세청 API 응답 오류:', {
        status: response.status,
        statusText: response.statusText
      });
      
      let errorMsg = '국세청 API 조회에 실패했습니다.';
      
      if (response.status === 401) {
        errorMsg = 'API 인증 오류입니다. API 키를 확인해주세요.';
      } else if (response.status === 429) {
        errorMsg = 'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
      } else if (response.status === 500) {
        errorMsg = '국세청 서비스가 일시적으로 사용할 수 없습니다.';
      }
      
      return NextResponse.json(
        { 
          status_code: 'ERROR',
          error_msg: errorMsg 
        },
        { status: response.status }
      );
    }

    const data: BusinessInfoApiResponse = await response.json();
    
    console.log('국세청 API 응답:', {
      status_code: data.status_code,
      match_cnt: data.match_cnt,
      request_cnt: data.request_cnt
    });

    if (data.status_code !== 'OK') {
      return NextResponse.json(
        { 
          status_code: data.status_code,
          error_msg: data.error_msg || '조회에 실패했습니다.',
          match_cnt: data.match_cnt || 0,
          request_cnt: data.request_cnt || 0
        },
        { status: 400 }
      );
    }

    // 성공적으로 조회된 경우
    return NextResponse.json({
      status_code: data.status_code,
      match_cnt: data.match_cnt,
      request_cnt: data.request_cnt,
      data: data.data
    });

  } catch (error) {
    console.error('사업자 정보 조회 API 오류:', error);
    
    return NextResponse.json(
      { 
        status_code: 'ERROR',
        error_msg: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
      },
      { status: 500 }
    );
  }
}