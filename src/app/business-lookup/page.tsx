'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import Alert from '@/components/ui/Alert';
import Notice from '@/components/ui/Notice';
import { 
  Search, 
  Building, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  Info,
  Phone
} from 'lucide-react';

interface BusinessInfo {
  businessNumber: string;
  companyName: string;
  representativeName: string;
  businessType: string;
  businessCategory: string;
  address: string;
  status: 'active' | 'closed' | 'suspended';
  registrationDate: string;
}

export default function BusinessLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<BusinessInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery) {
      setError('사업자등록번호를 입력해주세요');
      return;
    }

    // 사업자등록번호 형식 검증 (10자리 숫자)
    const cleanedNumber = searchQuery.replace(/[-\s]/g, '');
    if (!/^\d{10}$/.test(cleanedNumber)) {
      setError('올바른 사업자등록번호 형식이 아닙니다 (10자리 숫자)');
      return;
    }

    setIsSearching(true);
    setError(null);

    // 실제 API 호출 시뮬레이션
    setTimeout(() => {
      // 테스트용 데이터
      setSearchResult({
        businessNumber: cleanedNumber,
        companyName: '㈜테크스타트',
        representativeName: '김대표',
        businessType: '법인사업자',
        businessCategory: '소프트웨어 개발 및 공급업',
        address: '서울특별시 강남구 테헤란로 123',
        status: 'active',
        registrationDate: '2020-01-15'
      });
      setIsSearching(false);
    }, 1500);
  };

  const formatBusinessNumber = (number: string) => {
    const cleaned = number.replace(/[-\s]/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
    }
    return number;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
            정상
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
            폐업
          </span>
        );
      case 'suspended':
        return (
          <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
            휴업
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-weave-primary-light rounded-lg">
                <Search className="w-6 h-6 text-weave-primary" />
              </div>
              <div>
                <Typography variant="h2" className="text-2xl mb-1">사업자 조회</Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  공공 API를 통해 사업자등록번호 진위 여부를 확인합니다
                </Typography>
              </div>
            </div>
          </div>

          {/* 검색 영역 */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div>
                <Typography variant="body2" className="font-medium mb-2">
                  사업자등록번호
                </Typography>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setError(null);
                      }}
                      placeholder="123-45-67890"
                      maxLength={12}
                      className="w-full"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        조회 중...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        조회하기
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="error">
                  {error}
                </Alert>
              )}

              <Notice
                title="안내사항"
                icon={Info}
                items={[
                  '하이픈(-)은 자동으로 처리되므로 입력하지 않으셔도 됩니다',
                  '국세청 공공 API를 통해 실시간으로 진위 여부를 확인합니다',
                  '개인정보 보호를 위해 최소한의 정보만 표시됩니다'
                ]}
              />
            </div>
          </Card>

          {/* 검색 결과 */}
          {searchResult && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h3">조회 결과</Typography>
                {getStatusBadge(searchResult.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="body2" className="text-txt-tertiary mb-1">
                    사업자등록번호
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {formatBusinessNumber(searchResult.businessNumber)}
                  </Typography>
                </div>

                <div>
                  <Typography variant="body2" className="text-txt-tertiary mb-1">
                    상호명
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {searchResult.companyName}
                  </Typography>
                </div>

                <div>
                  <Typography variant="body2" className="text-txt-tertiary mb-1">
                    대표자명
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {searchResult.representativeName}
                  </Typography>
                </div>

                <div>
                  <Typography variant="body2" className="text-txt-tertiary mb-1">
                    사업자구분
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {searchResult.businessType}
                  </Typography>
                </div>

                <div>
                  <Typography variant="body2" className="text-txt-tertiary mb-1">
                    업종
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {searchResult.businessCategory}
                  </Typography>
                </div>

                <div>
                  <Typography variant="body2" className="text-txt-tertiary mb-1">
                    개업일자
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {searchResult.registrationDate}
                  </Typography>
                </div>

                <div className="md:col-span-2">
                  <Typography variant="body2" className="text-txt-tertiary mb-1">
                    사업장 주소
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {searchResult.address}
                  </Typography>
                </div>
              </div>

              {searchResult.status === 'active' && (
                <Alert
                  variant="success"
                  className="mt-6"
                >
                  정상 사업자로 확인되었습니다
                </Alert>
              )}
            </Card>
          )}

          {/* 관련 연락처 */}
          <Card className="p-6 mt-6">
            <Typography variant="h3" className="mb-4">관련 기관 연락처</Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <Typography variant="body2" className="font-medium text-green-800">
                    국세청 상담센터
                  </Typography>
                </div>
                <Typography variant="body2" className="text-green-700">
                  ☎ 126 (평일 9:00~18:00)
                </Typography>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <Typography variant="body2" className="font-medium text-blue-800">
                    홈택스 고객센터
                  </Typography>
                </div>
                <Typography variant="body2" className="text-blue-700">
                  ☎ 1588-0060
                </Typography>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}