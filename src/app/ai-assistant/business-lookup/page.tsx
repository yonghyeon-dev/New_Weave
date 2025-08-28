'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import { Building, Search, CheckCircle, AlertCircle, X, Copy, BrainCircuit } from 'lucide-react';

interface BusinessInfo {
  businessNumber: string;
  companyName: string;
  representative: string;
  address: string;
  businessType: string;
  businessStatus: 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  taxType: string;
}

interface SearchHistory {
  id: string;
  businessNumber: string;
  companyName: string;
  searchTime: Date;
  status: 'active' | 'inactive' | 'suspended';
}

const mockBusinessData: BusinessInfo[] = [
  {
    businessNumber: '123-45-67890',
    companyName: '㈜테크스타트',
    representative: '김철수',
    address: '서울특별시 강남구 테헤란로 123, 10층',
    businessType: '소프트웨어 개발업',
    businessStatus: 'active',
    registrationDate: '2020-03-15',
    taxType: '일반과세자'
  },
  {
    businessNumber: '987-65-43210',
    companyName: '디자인컴퍼니',
    representative: '이영희',
    address: '서울특별시 서초구 서초대로 456, 5층',
    businessType: '광고 및 시각디자인업',
    businessStatus: 'active',
    registrationDate: '2019-08-22',
    taxType: '간이과세자'
  }
];

export default function BusinessLookupPage() {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState<BusinessInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [error, setError] = useState('');
  const [historyIdCounter, setHistoryIdCounter] = useState(1);

  const formatBusinessNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, '');
    
    // 형식에 맞게 하이픈 추가
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBusinessNumber(e.target.value);
    setSearchNumber(formatted);
  };

  const validateBusinessNumber = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length === 10 && /^\d{10}$/.test(cleaned);
  };

  const handleSearch = async () => {
    if (!validateBusinessNumber(searchNumber)) {
      setError('올바른 사업자등록번호를 입력해주세요 (10자리)');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResult(null);

    // 모의 검색
    setTimeout(() => {
      const foundBusiness = mockBusinessData.find(
        business => business.businessNumber === searchNumber
      );

      if (foundBusiness) {
        setSearchResult(foundBusiness);
        
        // 검색 기록 추가
        const historyItem: SearchHistory = {
          id: `history-${historyIdCounter}`,
          businessNumber: foundBusiness.businessNumber,
          companyName: foundBusiness.companyName,
          searchTime: new Date(),
          status: foundBusiness.businessStatus
        };
        
        setSearchHistory(prev => [historyItem, ...prev.slice(0, 9)]); // 최근 10개만 유지
        setHistoryIdCounter(prev => prev + 1);
      } else {
        setError('해당 사업자등록번호를 찾을 수 없습니다.');
      }
      
      setIsSearching(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="w-3 h-3" />
            사업중
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
            <X className="w-3 h-3" />
            휴업중
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
            <AlertCircle className="w-3 h-3" />
            폐업
          </span>
        );
      default:
        return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-weave-primary-light rounded-lg">
                <BrainCircuit className="w-6 h-6 text-weave-primary" />
              </div>
              <div>
                <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">사업자 조회</Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  사업자등록번호 조회 및 검증 서비스
                </Typography>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 검색 */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <Typography variant="h3" className="mb-4">사업자등록번호 조회</Typography>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-txt-primary mb-2">
                      사업자등록번호
                    </label>
                    <div className="flex gap-3">
                      <Input
                        value={searchNumber}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="000-00-00000 (10자리)"
                        className="flex-1"
                        maxLength={12}
                      />
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching || !searchNumber}
                        className="px-6 flex items-center gap-2"
                      >
                        {isSearching ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        조회
                      </Button>
                    </div>
                    {error && (
                      <Typography variant="body2" className="text-red-600 mt-2">
                        {error}
                      </Typography>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <Typography variant="body2" className="text-blue-800">
                    <strong>안내사항:</strong> 국세청 사업자등록 정보를 기반으로 조회됩니다. 
                    실시간 정보 업데이트에 따라 일부 차이가 있을 수 있습니다.
                  </Typography>
                </div>
              </Card>

              {/* 조회 결과 */}
              {searchResult && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Typography variant="h3">조회 결과</Typography>
                    {getStatusBadge(searchResult.businessStatus)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Typography variant="body2" className="text-txt-tertiary mb-1">
                          사업자등록번호
                        </Typography>
                        <div className="flex items-center gap-2">
                          <Typography variant="body1" className="font-medium">
                            {searchResult.businessNumber}
                          </Typography>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(searchResult.businessNumber)}
                            className="p-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Typography variant="body2" className="text-txt-tertiary mb-1">
                          회사명
                        </Typography>
                        <div className="flex items-center gap-2">
                          <Typography variant="body1" className="font-medium">
                            {searchResult.companyName}
                          </Typography>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(searchResult.companyName)}
                            className="p-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Typography variant="body2" className="text-txt-tertiary mb-1">
                          대표자
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {searchResult.representative}
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="body2" className="text-txt-tertiary mb-1">
                          업종
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {searchResult.businessType}
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Typography variant="body2" className="text-txt-tertiary mb-1">
                          사업장 주소
                        </Typography>
                        <div className="flex items-start gap-2">
                          <Typography variant="body1" className="font-medium flex-1">
                            {searchResult.address}
                          </Typography>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(searchResult.address)}
                            className="p-1 mt-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Typography variant="body2" className="text-txt-tertiary mb-1">
                          개업일자
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {new Date(searchResult.registrationDate).toLocaleDateString('ko-KR')}
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="body2" className="text-txt-tertiary mb-1">
                          과세유형
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {searchResult.taxType}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <Typography variant="body2" className="text-green-800 font-medium">
                          조회 완료
                        </Typography>
                        <Typography variant="body2" className="text-green-700 mt-1">
                          해당 사업자는 정상적으로 등록된 사업자입니다.
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 빠른 조회 */}
              <Card className="p-6">
                <Typography variant="h3" className="mb-4">빠른 조회</Typography>
                
                <div className="space-y-3">
                  {mockBusinessData.map((business, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchNumber(business.businessNumber)}
                      className="w-full p-3 text-left rounded-lg border border-border-light hover:bg-bg-secondary transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Typography variant="body2" className="font-medium">
                          {business.companyName}
                        </Typography>
                        {getStatusBadge(business.businessStatus)}
                      </div>
                      <Typography variant="body2" className="text-txt-secondary">
                        {business.businessNumber}
                      </Typography>
                    </button>
                  ))}
                </div>
              </Card>

              {/* 최근 조회 기록 */}
              {searchHistory.length > 0 && (
                <Card className="p-6">
                  <Typography variant="h3" className="mb-4">최근 조회 기록</Typography>
                  
                  <div className="space-y-3">
                    {searchHistory.slice(0, 5).map((history) => (
                      <div key={history.id} className="p-3 bg-bg-secondary rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <Typography variant="body2" className="font-medium">
                            {history.companyName}
                          </Typography>
                          {getStatusBadge(history.status)}
                        </div>
                        <Typography variant="body2" className="text-txt-secondary text-xs">
                          {history.businessNumber}
                        </Typography>
                        <Typography variant="body2" className="text-txt-tertiary text-xs">
                          {history.searchTime.toLocaleString('ko-KR')}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 도움말 */}
              <Card className="p-6">
                <Typography variant="h3" className="mb-4">사업자등록번호 확인법</Typography>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <Typography variant="body2" className="font-medium mb-1">
                      1. 형식 확인
                    </Typography>
                    <Typography variant="body2" className="text-txt-secondary">
                      000-00-00000 (총 10자리 숫자)
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" className="font-medium mb-1">
                      2. 확인 방법
                    </Typography>
                    <Typography variant="body2" className="text-txt-secondary">
                      사업자등록증, 세금계산서에서 확인 가능
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" className="font-medium mb-1">
                      3. 주의사항
                    </Typography>
                    <Typography variant="body2" className="text-txt-secondary">
                      휴업 또는 폐업한 사업자도 조회됩니다
                    </Typography>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}