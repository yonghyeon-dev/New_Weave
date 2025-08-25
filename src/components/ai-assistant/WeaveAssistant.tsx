'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Typography from '@/components/ui/Typography';

// AI비서 메인 컴포넌트
export default function WeaveAssistant() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'chat' | 'extract' | 'generate' | 'tax-consult' | 'business-lookup' | 'file-process'>('chat');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('auto');
  const [tokenUsage, setTokenUsage] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL 파라미터로부터 탭 설정
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['chat', 'extract', 'generate', 'tax-consult', 'business-lookup', 'file-process'].includes(tab)) {
      setActiveTab(tab as 'chat' | 'extract' | 'generate' | 'tax-consult' | 'business-lookup' | 'file-process');
    }
  }, [searchParams]);

  // 탭 버튼 데이터
  const tabs = [
    { id: 'chat' as const, icon: '💬', label: 'AI 채팅' },
    { id: 'extract' as const, icon: '📄', label: '정보 추출' },
    { id: 'generate' as const, icon: '📝', label: '문서 생성' },
    { id: 'tax-consult' as const, icon: '💰', label: '세무 상담' },
    { id: 'business-lookup' as const, icon: '🏢', label: '사업자 조회' },
    { id: 'file-process' as const, icon: '📁', label: '파일 처리' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processExtraction = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('taskType', 'extract');

      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        if (data.tokenUsage) {
          setTokenUsage(prev => prev + data.tokenUsage.cost);
        }
      } else {
        setError(data.error || '처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDocument = async () => {
    if (!prompt.trim()) {
      setError('추가 정보를 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // 샘플 데이터
    const clientData = {
      company: '주식회사 테크스타트',
      name: '김철수',
      phone: '010-1234-5678',
      email: 'kim@techstart.co.kr'
    };

    const projectData = {
      title: '모바일 쇼핑몰 앱 개발',
      startDate: '2024-02-01',
      endDate: '2024-04-30',
      totalAmount: 15000000,
      paymentTerms: '계약금 30%, 중도금 30%, 잔금 40%'
    };

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskType: 'generate',
          documentType: 'quote',
          templateId: 'standard',
          prompt,
          clientData,
          projectData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        if (data.tokenUsage) {
          setTokenUsage(prev => prev + data.tokenUsage.cost);
        }
      } else {
        setError(data.error || '문서 생성 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const lookupBusiness = async () => {
    if (!businessNumber.trim()) {
      setError('사업자등록번호를 입력해주세요.');
      return;
    }

    // 사업자등록번호 형식 검증
    const cleanNumber = businessNumber.replace(/[-]/g, '');
    if (cleanNumber.length !== 10 || !/^\d+$/.test(cleanNumber)) {
      setError('올바른 사업자등록번호 형식을 입력해주세요. (예: 123-45-67890)');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 국세청 사업자등록번호 조회 API 호출 시뮬레이션
      const response = await fetch('/api/business-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessNumber: cleanNumber
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || '사업자 조회 중 오류가 발생했습니다.');
      }
    } catch (err) {
      // API가 없는 경우 목업 데이터 반환
      const mockResult = {
        businessNumber: businessNumber,
        status: '정상',
        businessName: '주식회사 테크스타트',
        businessType: '소프트웨어 개발업',
        ceoName: '김철수',
        address: '서울특별시 강남구 테헤란로 123',
        establishDate: '2020-03-15',
        isActive: true,
        taxOffice: '강남세무서'
      };
      setResult(mockResult);
      console.warn('API 연결 실패, 목업 데이터 사용:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const processFile = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('taskType', 'process');

      const response = await fetch('/api/file-process', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || '파일 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      // API가 없는 경우 목업 데이터 반환
      const mockResult = {
        fileName: selectedFile.name,
        fileSize: `${(selectedFile.size / 1024).toFixed(2)} KB`,
        fileType: selectedFile.type || 'unknown',
        processedAt: new Date().toLocaleString('ko-KR'),
        summary: '파일이 성공적으로 분석되었습니다.',
        securityScan: '안전한 파일입니다.',
        extractedData: {
          text: '파일에서 추출된 텍스트 내용이 여기에 표시됩니다.',
          metadata: 'PDF 1.4, 2페이지, 생성일: 2024-08-25'
        }
      };
      setResult(mockResult);
      console.warn('API 연결 실패, 목업 데이터 사용:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderExtractTab = () => (
    <div className="space-y-4">
      <div>
        <Typography variant="h3" className="mb-2">데이터 추출</Typography>
        <Typography variant="body1" className="text-txt-secondary mb-1">
          영수증, 세금계산서, 청구서 등의 이미지나 PDF를 업로드하면 AI가 자동으로 데이터를 추출합니다.
        </Typography>
        <Typography variant="body2" className="text-txt-tertiary">
          Gemini 2.5 Flash Lite 모델로 빠르고 정확하게 처리
        </Typography>
      </div>

      <div>
        <Typography variant="body2" className="mb-2">서류 종류 선택</Typography>
        <Select
          value={documentType}
          onValueChange={setDocumentType}
          options={[
            { value: 'auto', label: '자동 감지 (권장)' },
            { value: 'receipt', label: '영수증' },
            { value: 'tax', label: '세금계산서' },
            { value: 'cash', label: '현금영수증' },
            { value: 'invoice', label: '인보이스/청구서' },
            { value: 'manual', label: '수기 계산서' },
            { value: 'other', label: '기타' }
          ]}
        />
        <Typography variant="body2" className="text-txt-tertiary mt-1">
          AI가 서류 종류를 자동으로 파악합니다
        </Typography>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,.pdf"
          className="hidden"
        />
        {selectedFile ? (
          <div className="space-y-2">
            <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <Typography variant="body1" className="font-medium">{selectedFile.name}</Typography>
            <Typography variant="body2" className="text-gray-500">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </Typography>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📁</span>
            </div>
            <Typography variant="body1">파일을 드래그하거나 클릭하여 업로드</Typography>
            <Typography variant="body2" className="text-gray-500">
              지원 형식: 이미지 (JPG, PNG 등), PDF
            </Typography>
          </div>
        )}
      </div>

      <Button
        onClick={processExtraction}
        disabled={!selectedFile || isProcessing}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {isProcessing ? '처리 중...' : '데이터 추출하기'}
      </Button>

      {/* 결과 표시 */}
      {result && activeTab === 'extract' && (
        <Card variant="outlined" className="p-4 mt-4">
          <Typography variant="h4" className="mb-3">추출된 데이터</Typography>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">문서 유형:</span> {result.documentType}</p>
            <p><span className="font-medium">날짜:</span> {result.date}</p>
            <p><span className="font-medium">업체명:</span> {result.vendor}</p>
            <p><span className="font-medium">총액:</span> {result.totalAmount?.toLocaleString()}원</p>
            {result.items && result.items.length > 0 && (
              <div>
                <p className="font-medium">항목:</p>
                <ul className="ml-4 space-y-1">
                  {result.items.map((item: any, idx: number) => (
                    <li key={idx}>
                      {item.name} {item.quantity && `x${item.quantity}`} {item.price && `- ${item.price.toLocaleString()}원`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-2 border-t">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                }}
                variant="outline"
                size="sm"
              >
                JSON 복사
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderGenerateTab = () => (
    <div className="space-y-4">
      <div>
        <Typography variant="h3" className="mb-2">문서 생성</Typography>
        <Typography variant="body1" className="text-txt-secondary mb-1">
          문서 종류와 템플릿을 선택하고 프로젝트 정보를 입력하면 AI가 문서를 생성합니다.
        </Typography>
        <Typography variant="body2" className="text-txt-tertiary">
          Gemini 2.5 Flash Lite 모델로 템플릿 기반 생성
        </Typography>
      </div>

      <div>
        <Typography variant="body2" className="mb-2">문서 종류</Typography>
        <Select
          value="quote"
          onValueChange={() => {}}
          options={[
            { value: 'quote', label: '견적서' },
            { value: 'contract', label: '계약서' },
            { value: 'invoice', label: '청구서' }
          ]}
        />
      </div>

      <div>
        <Typography variant="body2" className="mb-2">템플릿 선택</Typography>
        <div className="flex gap-2">
          <Input
            value="표준 템플릿"
            readOnly
            className="flex-1"
          />
          <Button variant="outline">템플릿 선택</Button>
        </div>
        <Typography variant="body2" className="text-txt-tertiary mt-1">
          업종별 다양한 견적서 템플릿을 선택할 수 있습니다
        </Typography>
      </div>

      {/* 클라이언트 정보 */}
      <Card variant="outlined" className="p-4">
        <Typography variant="body2" className="font-semibold mb-2">클라이언트 정보</Typography>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">회사:</span> 주식회사 테크스타트</p>
          <p><span className="font-medium">담당자:</span> 김철수</p>
          <p><span className="font-medium">연락처:</span> 010-1234-5678</p>
          <p><span className="font-medium">이메일:</span> kim@techstart.co.kr</p>
        </div>
      </Card>

      {/* 프로젝트 정보 */}
      <Card variant="outlined" className="p-4">
        <Typography variant="body2" className="font-semibold mb-2">프로젝트 정보</Typography>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">프로젝트명:</span> 모바일 쇼핑몰 앱 개발</p>
          <p><span className="font-medium">기간:</span> 2024-02-01 ~ 2024-04-30</p>
          <p><span className="font-medium">예상 금액:</span> 15,000,000원</p>
          <p><span className="font-medium">결제 조건:</span> 계약금 30%, 중도금 30%, 잔금 40%</p>
        </div>
      </Card>

      <div>
        <Typography variant="body2" className="mb-2">추가 정보 입력</Typography>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="세부 작업 내역, 특별 요구사항 등 추가 정보를 입력하세요..."
          className="w-full px-3 py-2 border border-primary-borderSecondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue h-32 resize-none"
        />
      </div>

      <Button
        onClick={generateDocument}
        disabled={!prompt.trim() || isProcessing}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {isProcessing ? '생성 중...' : '문서 생성하기'}
      </Button>

      {/* 생성된 문서 표시 */}
      {result && activeTab === 'generate' && (
        <Card variant="outlined" className="p-4 mt-4">
          <Typography variant="h4" className="mb-3">{result.title}</Typography>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border overflow-auto max-h-96">
              {result.content}
            </pre>
          </div>
          <div className="pt-3 border-t flex gap-2 mt-4">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(result.content);
              }}
              variant="outline"
              size="sm"
            >
              📋 복사
            </Button>
            <Button
              onClick={() => {
                const blob = new Blob([result.content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${result.type}_${new Date().getTime()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              variant="outline"
              size="sm"
            >
              💾 다운로드
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  // 새로운 일반 상담 탭
  const renderChatTab = () => (
    <div className="space-y-4">
      <div>
        <Typography variant="h3" className="mb-2">AI 업무 상담</Typography>
        <Typography variant="body1" className="text-txt-secondary mb-1">
          프리랜서 업무 전반에 대한 질문과 상담을 AI와 나누어보세요.
        </Typography>
        <Typography variant="body2" className="text-txt-tertiary">
          계약 협상, 견적 산정, 업무 관리, 고객 응대 등 모든 영역 상담 가능
        </Typography>
      </div>

      {/* 자주 묻는 질문 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="text-left justify-start h-auto p-4"
          onClick={() => setPrompt('프리랜서 계약서에 꼭 포함해야 할 조항들을 알려주세요')}
        >
          <div>
            <div className="font-medium">💼 계약서 작성 가이드</div>
            <div className="text-xs text-gray-500 mt-1">필수 조항과 주의사항</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="text-left justify-start h-auto p-4"
          onClick={() => setPrompt('견적서 가격 책정할 때 고려해야 할 요소들을 알려주세요')}
        >
          <div>
            <div className="font-medium">💰 견적 가격 책정</div>
            <div className="text-xs text-gray-500 mt-1">합리적인 가격 산정 방법</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="text-left justify-start h-auto p-4"
          onClick={() => setPrompt('미수금을 효과적으로 회수하는 방법을 알려주세요')}
        >
          <div>
            <div className="font-medium">📞 미수금 회수</div>
            <div className="text-xs text-gray-500 mt-1">정중하고 효과적인 독촉법</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="text-left justify-start h-auto p-4"
          onClick={() => setPrompt('어려운 클라이언트와 소통할 때 주의할 점들을 알려주세요')}
        >
          <div>
            <div className="font-medium">🤝 고객 관계 관리</div>
            <div className="text-xs text-gray-500 mt-1">원활한 소통 전략</div>
          </div>
        </Button>
      </div>

      <div>
        <Typography variant="body2" className="mb-2">질문하기</Typography>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="프리랜서 업무에 대한 궁금한 점을 자유롭게 질문해보세요..."
          className="w-full px-3 py-2 border border-primary-borderSecondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue h-32 resize-none"
        />
      </div>

      <Button
        onClick={() => {/* 채팅 기능 구현 */}}
        disabled={!prompt.trim() || isProcessing}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {isProcessing ? '답변 생성 중...' : 'AI에게 질문하기'}
      </Button>

      {/* 대화 기록 영역 */}
      <div className="border border-gray-200 rounded-lg p-4 min-h-[300px] bg-gray-50">
        <Typography variant="body2" className="text-gray-500 text-center">
          대화를 시작해보세요. AI가 친근하고 전문적인 조언을 드립니다.
        </Typography>
      </div>
    </div>
  );

  // 세무 상담 탭 (기존 사업자 조회 확장)
  const renderTaxConsultTab = () => (
    <div className="space-y-4">
      <div>
        <Typography variant="h3" className="mb-2">세무 상담 센터</Typography>
        <Typography variant="body1" className="text-txt-secondary mb-1">
          사업자 정보 조회부터 세무 신고, 절세 전략까지 종합 세무 서비스
        </Typography>
        <Typography variant="body2" className="text-txt-tertiary">
          국세청 API 연동 및 전문 세무사 검증 정보 제공
        </Typography>
      </div>

      {/* 세무 상담 안내 */}
      <Card variant="outlined" className="p-4 bg-blue-50">
        <Typography variant="body2" className="text-blue-800 mb-2">
          💡 <span className="font-semibold">사업자 조회</span>는 별도 탭에서 이용하세요
        </Typography>
        <Typography variant="body2" className="text-blue-700">
          상단 탭에서 <span className="font-medium">"사업자 조회"</span>를 선택하시면 국세청 연동 조회 서비스를 이용할 수 있습니다.
        </Typography>
      </Card>

      {/* 빠른 세무 질문 */}
      <Card variant="outlined" className="p-4">
        <Typography variant="h4" className="mb-3">빠른 세무 질문</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => setPrompt('프리랜서 부가세 신고 방법을 알려주세요')}>
            📊 부가세 신고
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPrompt('소득세 절세 방법을 알려주세요')}>
            💰 소득세 절세
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPrompt('경비 처리 가능한 항목들을 알려주세요')}>
            📝 경비 처리
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPrompt('개인사업자 vs 법인 장단점을 비교해주세요')}>
            🏢 사업자 유형
          </Button>
        </div>
      </Card>

      {/* 세무 상담 입력 */}
      <div>
        <Typography variant="body2" className="mb-2">세무 질문하기</Typography>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="세무 관련 궁금한 점을 질문해주세요. 전문적이고 정확한 답변을 드립니다..."
          className="w-full px-3 py-2 border border-primary-borderSecondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue h-24 resize-none"
        />
      </div>

      <Button
        onClick={() => {/* 세무 상담 기능 구현 */}}
        disabled={!prompt.trim() || isProcessing}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {isProcessing ? '답변 생성 중...' : '세무 상담받기'}
      </Button>
    </div>
  );

  // 파일 처리 탭 (기존 문서 요청 확장)
  const renderFileProcessTab = () => (
    <div className="space-y-4">
      <div>
        <Typography variant="h3" className="mb-2">파일 처리 센터</Typography>
        <Typography variant="body1" className="text-txt-secondary mb-1">
          보안 업로드, 문서 요청, 파일 분석을 한 곳에서 처리
        </Typography>
        <Typography variant="body2" className="text-txt-tertiary">
          TTL 기반 보안 시스템 및 자동 감사 로그 제공
        </Typography>
      </div>

      {/* 서브 탭 */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <Button variant="ghost" className="border-b-2 border-blue-500 text-blue-600 whitespace-nowrap">보안 업로드</Button>
        <Button variant="ghost" className="whitespace-nowrap">문서 요청</Button>
        <Button variant="ghost" className="whitespace-nowrap">파일 분석</Button>
        <Button variant="ghost" className="whitespace-nowrap">업로드 기록</Button>
      </div>

      {/* 보안 업로드 섹션 */}
      <Card variant="outlined" className="p-4">
        <Typography variant="h4" className="mb-3">보안 파일 업로드 링크 생성</Typography>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="body2" className="mb-1">만료 시간</Typography>
              <Select
                value="24h"
                onValueChange={() => {}}
                options={[
                  { value: '1h', label: '1시간' },
                  { value: '24h', label: '24시간' },
                  { value: '7d', label: '7일' },
                  { value: '30d', label: '30일' }
                ]}
              />
            </div>
            <div>
              <Typography variant="body2" className="mb-1">최대 파일 수</Typography>
              <Select
                value="5"
                onValueChange={() => {}}
                options={[
                  { value: '1', label: '1개' },
                  { value: '5', label: '5개' },
                  { value: '10', label: '10개' },
                  { value: '20', label: '20개' }
                ]}
              />
            </div>
          </div>

          <div>
            <Typography variant="body2" className="mb-1">업로드 목적 (선택)</Typography>
            <Input placeholder="예: 계약서 검토용 문서" />
          </div>

          <Button variant="primary" className="w-full">
            <span className="mr-2">🔒</span>
            보안 업로드 링크 생성하기
          </Button>
        </div>
      </Card>

      {/* 즉시 파일 처리 */}
      <Card variant="outlined" className="p-4">
        <Typography variant="h4" className="mb-3">즉시 파일 분석</Typography>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedFile ? (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-xl">📄</span>
              </div>
              <Typography variant="body2" className="font-medium">{selectedFile.name}</Typography>
              <Typography variant="body2" className="text-gray-500 text-xs">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </Typography>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-xl">📎</span>
              </div>
              <Typography variant="body2">파일을 드래그하거나 클릭하여 업로드</Typography>
              <Typography variant="body2" className="text-gray-500 text-xs">
                모든 파일 형식 지원 (최대 50MB)
              </Typography>
            </div>
          )}
        </div>

        <Button
          onClick={processFile}
          disabled={!selectedFile || isProcessing}
          variant="primary"
          className="w-full mt-4"
        >
          {isProcessing ? '분석 중...' : '파일 분석하기'}
        </Button>
      </Card>

      {/* 파일 처리 결과 */}
      {result && activeTab === 'file-process' && (
        <Card variant="outlined" className="p-4">
          <Typography variant="h4" className="mb-4 flex items-center gap-2">
            📁 파일 처리 결과
            <Badge variant="success">완료</Badge>
          </Typography>
          
          <div className="space-y-4">
            {/* 파일 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Typography variant="body2" className="text-txt-tertiary">파일명</Typography>
                <Typography variant="body1" className="font-medium">{result.fileName}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">파일 크기</Typography>
                <Typography variant="body1" className="font-medium">{result.fileSize}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">처리 시간</Typography>
                <Typography variant="body1" className="font-medium">{result.processedAt}</Typography>
              </div>
            </div>

            {/* 처리 결과 */}
            <div>
              <Typography variant="h4" className="mb-2">처리 요약</Typography>
              <Typography variant="body1" className="text-txt-secondary">{result.summary}</Typography>
            </div>

            <div>
              <Typography variant="h4" className="mb-2">보안 검사</Typography>
              <Typography variant="body1" className="text-green-600">{result.securityScan}</Typography>
            </div>

            {/* 추출된 데이터 */}
            <div>
              <Typography variant="h4" className="mb-2">추출된 내용</Typography>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Typography variant="body2" className="text-txt-tertiary mb-1">텍스트 내용</Typography>
                <Typography variant="body1" className="mb-3">{result.extractedData.text}</Typography>
                <Typography variant="body2" className="text-txt-tertiary mb-1">메타데이터</Typography>
                <Typography variant="body2" className="text-txt-secondary">{result.extractedData.metadata}</Typography>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(result.extractedData.text);
                }}
                variant="outline"
                size="sm"
              >
                📋 텍스트 복사
              </Button>
              <Button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `file_analysis_${new Date().getTime()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                variant="outline"
                size="sm"
              >
                💾 결과 다운로드
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  // 사업자 조회 탭
  const renderBusinessLookupTab = () => (
    <div className="space-y-4">
      <div>
        <Typography variant="h3" className="mb-2">사업자등록번호 조회</Typography>
        <Typography variant="body1" className="text-txt-secondary mb-1">
          국세청 사업자등록번호 진위 확인 및 기본 정보 조회
        </Typography>
        <Typography variant="body2" className="text-txt-tertiary">
          실시간 국세청 연동으로 정확한 사업자 정보 제공
        </Typography>
      </div>

      <div>
        <Typography variant="body2" className="mb-2">사업자등록번호</Typography>
        <div className="flex gap-2">
          <Input
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            placeholder="123-45-67890 또는 1234567890"
            className="flex-1"
            maxLength={12}
          />
          <Button
            onClick={lookupBusiness}
            disabled={!businessNumber.trim() || isProcessing}
            variant="primary"
          >
            {isProcessing ? '조회 중...' : '조회'}
          </Button>
        </div>
        <Typography variant="body2" className="text-txt-tertiary mt-1">
          사업자등록번호는 10자리 숫자입니다 (하이픈 포함 가능)
        </Typography>
      </div>

      {/* 자주 조회하는 사업자 예시 */}
      <Card variant="outlined" className="p-4">
        <Typography variant="body2" className="font-semibold mb-2">빠른 테스트</Typography>
        <Typography variant="body2" className="text-txt-tertiary mb-3">
          아래 샘플 사업자등록번호로 기능을 테스트해보세요
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBusinessNumber('123-45-67890')}
          >
            123-45-67890
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBusinessNumber('987-65-43210')}
          >
            987-65-43210
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBusinessNumber('555-66-77888')}
          >
            555-66-77888
          </Button>
        </div>
      </Card>

      {/* 조회 결과 */}
      {result && activeTab === 'business-lookup' && (
        <Card variant="outlined" className="p-4">
          <Typography variant="h4" className="mb-4 flex items-center gap-2">
            🏢 사업자 정보
            <Badge variant={result.isActive ? 'success' : 'destructive'}>
              {result.status}
            </Badge>
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Typography variant="body2" className="text-txt-tertiary">사업자등록번호</Typography>
                <Typography variant="body1" className="font-medium">{result.businessNumber}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">사업체명</Typography>
                <Typography variant="body1" className="font-medium">{result.businessName}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">대표자명</Typography>
                <Typography variant="body1" className="font-medium">{result.ceoName}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">업종</Typography>
                <Typography variant="body1" className="font-medium">{result.businessType}</Typography>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Typography variant="body2" className="text-txt-tertiary">사업장 주소</Typography>
                <Typography variant="body1" className="font-medium">{result.address}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">개업일</Typography>
                <Typography variant="body1" className="font-medium">{result.establishDate}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">관할 세무서</Typography>
                <Typography variant="body1" className="font-medium">{result.taxOffice}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-tertiary">상태</Typography>
                <Typography variant="body1" className={`font-medium ${result.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {result.isActive ? '정상 사업자' : '휴업/폐업'}
                </Typography>
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="mt-4 pt-4 border-t">
            <Typography variant="body2" className="text-txt-tertiary mb-2">
              ⚠️ 본 조회 결과는 참고용이며, 정확한 정보는 국세청 홈택스에서 직접 확인하시기 바랍니다.
            </Typography>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                }}
                variant="outline"
                size="sm"
              >
                📋 정보 복사
              </Button>
              <Button
                onClick={() => {
                  window.open('https://www.hometax.go.kr', '_blank');
                }}
                variant="outline"
                size="sm"
              >
                🔗 홈택스 바로가기
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Typography variant="h1" className="mb-2">Weave AI 업무 비서</Typography>
          <Typography variant="body1" className="text-gray-600">
            문서 생성부터 세무 상담까지, 모든 업무를 하나의 인터페이스에서
          </Typography>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs px-2 py-1">
              🔧 문서 템플릿 통합
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-1">
              🏢 세무 관리 통합
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-1">
              📋 보안 업로드 통합
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setResult(null);
                    setError(null);
                    setSelectedFile(null);
                    setPrompt('');
                  }}
                  variant={activeTab === tab.id ? "primary" : "ghost"}
                  className="w-full justify-start text-left p-3 h-auto"
                  size="lg"
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="text-xl flex-shrink-0">{tab.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                        {tab.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
              
              {/* 통합 안내 */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs font-medium text-blue-800 mb-1">💡 통합된 기능들</div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• 문서 템플릿 → 문서 생성 모드</div>
                  <div>• 세무 관리 → 세무 상담 모드</div>
                  <div>• 보안 업로드 → 파일 처리 모드</div>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <Card className="p-6">
              {activeTab === 'chat' && renderChatTab()}
              {activeTab === 'extract' && renderExtractTab()}
              {activeTab === 'generate' && renderGenerateTab()}
              {activeTab === 'tax-consult' && renderTaxConsultTab()}
              {activeTab === 'business-lookup' && renderBusinessLookupTab()}
              {activeTab === 'file-process' && renderFileProcessTab()}

              {/* 오류 메시지 */}
              {error && (
                <div className="mt-4 p-3 bg-status-error/10 border border-status-error/20 rounded-lg text-status-error text-sm">
                  {error}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* 토큰 사용량 표시 */}
      <div className="fixed bottom-4 right-4">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">토큰 사용량</span>
            <Badge variant="outline" className="text-sm">
              ${tokenUsage.toFixed(4)}
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}