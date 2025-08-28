'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import Badge from '@/components/ui/Badge';
import { 
  Upload, 
  FileText, 
  Image, 
  Download, 
  Copy, 
  Check,
  AlertCircle,
  Loader2,
  X,
  Eye,
  FileImage
} from 'lucide-react';
import { ExtractedData } from '@/types/ai-assistant';

interface DataExtractorProps {
  onDataExtracted?: (data: ExtractedData) => void;
  onError?: (error: Error) => void;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

export default function DataExtractor({
  onDataExtracted,
  onError,
  maxFileSize = 10,
  acceptedFormats = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.bmp']
}: DataExtractorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 유효성 검사
  const validateFile = (file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024);

    if (!acceptedFormats.includes(fileExtension)) {
      setError(`지원하지 않는 파일 형식입니다. 지원 형식: ${acceptedFormats.join(', ')}`);
      return false;
    }

    if (fileSizeMB > maxFileSize) {
      setError(`파일 크기가 너무 큽니다. 최대 ${maxFileSize}MB까지 업로드 가능합니다.`);
      return false;
    }

    return true;
  };

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
    setError(null);
    setExtractedData(null);

    // 이미지 파일인 경우 미리보기 생성
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [acceptedFormats, maxFileSize]);

  // 드래그 앤 드롭 핸들러
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  // 파일 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // 데이터 추출 처리
  const extractData = async () => {
    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('taskType', 'extract');

      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const extracted: ExtractedData = result.data;
        setExtractedData(extracted);
        onDataExtracted?.(extracted);
      } else {
        throw new Error(result.error || '데이터 추출에 실패했습니다.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      onError?.(new Error(errorMessage));
    } finally {
      setIsProcessing(false);
    }
  };

  // JSON 복사
  const copyToClipboard = async () => {
    if (!extractedData) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('클립보드 복사에 실패했습니다.');
    }
  };

  // JSON 다운로드
  const downloadJSON = () => {
    if (!extractedData) return;

    const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 파일 제거
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setExtractedData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 추출된 데이터를 사용자 친화적으로 렌더링
  const renderExtractedDataUI = () => {
    if (!extractedData) return null;
    
    const data = extractedData.extractedData || extractedData;
    
    // 영수증인 경우
    if (data.documentType === '영수증' || data.vendor) {
      return (
        <div className="space-y-4">
          {/* 기본 정보 */}
          <div className="bg-bg-secondary rounded-lg p-4">
            <Typography variant="h4" className="text-sm font-semibold mb-3 text-txt-secondary">
              기본 정보
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.vendor && (
                <div className="flex justify-between">
                  <span className="text-txt-secondary">매장명:</span>
                  <span className="font-medium">{data.vendor}</span>
                </div>
              )}
              {data.date && (
                <div className="flex justify-between">
                  <span className="text-txt-secondary">날짜:</span>
                  <span className="font-medium">{data.date}</span>
                </div>
              )}
              {data.totalAmount && (
                <div className="flex justify-between">
                  <span className="text-txt-secondary">총 금액:</span>
                  <span className="font-bold text-weave-primary">
                    ₩{data.totalAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {data.taxAmount && (
                <div className="flex justify-between">
                  <span className="text-txt-secondary">부가세:</span>
                  <span className="font-medium">₩{data.taxAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* 구매 항목 */}
          {data.items && data.items.length > 0 && (
            <div className="bg-bg-secondary rounded-lg p-4">
              <Typography variant="h4" className="text-sm font-semibold mb-3 text-txt-secondary">
                구매 항목
              </Typography>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left py-2 px-2">품목</th>
                      <th className="text-center py-2 px-2">수량</th>
                      <th className="text-right py-2 px-2">단가</th>
                      <th className="text-right py-2 px-2">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-border-light">
                        <td className="py-2 px-2">{item.name}</td>
                        <td className="text-center py-2 px-2">{item.quantity}</td>
                        <td className="text-right py-2 px-2">
                          ₩{(item.price || 0).toLocaleString()}
                        </td>
                        <td className="text-right py-2 px-2">
                          ₩{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // 사업자등록증인 경우
    if (data.documentType === '사업자등록증' || data.businessNumber) {
      return (
        <div className="bg-bg-secondary rounded-lg p-4">
          <Typography variant="h4" className="text-sm font-semibold mb-3 text-txt-secondary">
            사업자 정보
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.businessNumber && (
              <div>
                <span className="text-txt-secondary text-sm">사업자등록번호</span>
                <p className="font-mono font-semibold text-lg">
                  {data.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}
                </p>
              </div>
            )}
            {data.companyName && (
              <div>
                <span className="text-txt-secondary text-sm">상호명</span>
                <p className="font-semibold">{data.companyName}</p>
              </div>
            )}
            {data.representativeName && (
              <div>
                <span className="text-txt-secondary text-sm">대표자명</span>
                <p className="font-medium">{data.representativeName}</p>
              </div>
            )}
            {data.businessAddress && (
              <div>
                <span className="text-txt-secondary text-sm">사업장 주소</span>
                <p className="font-medium">{data.businessAddress}</p>
              </div>
            )}
            {data.businessType && (
              <div>
                <span className="text-txt-secondary text-sm">업태</span>
                <p className="font-medium">{data.businessType}</p>
              </div>
            )}
            {data.businessItem && (
              <div>
                <span className="text-txt-secondary text-sm">업종</span>
                <p className="font-medium">{data.businessItem}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // 테이블 데이터가 있는 경우
    if (data.tables && data.tables.length > 0) {
      return (
        <div className="space-y-4">
          {data.tables.map((table: any, tableIdx: number) => (
            <div key={tableIdx} className="bg-bg-secondary rounded-lg p-4">
              <Typography variant="h4" className="text-sm font-semibold mb-3 text-txt-secondary">
                테이블 {tableIdx + 1}
              </Typography>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  {table.headers && (
                    <thead>
                      <tr className="border-b border-border-light">
                        {table.headers.map((header: string, idx: number) => (
                          <th key={idx} className="text-left py-2 px-2 font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {table.rows && table.rows.map((row: any[], rowIdx: number) => (
                      <tr key={rowIdx} className="border-b border-border-light">
                        {row.map((cell: any, cellIdx: number) => (
                          <td key={cellIdx} className="py-2 px-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // 폼 필드가 있는 경우
    if (data.formFields && Object.keys(data.formFields).length > 0) {
      return (
        <div className="bg-bg-secondary rounded-lg p-4">
          <Typography variant="h4" className="text-sm font-semibold mb-3 text-txt-secondary">
            추출된 정보
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(data.formFields).map(([key, value]: [string, any]) => (
              <div key={key} className="flex justify-between items-start">
                <span className="text-txt-secondary mr-2">{key}:</span>
                <span className="font-medium text-right">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // 기본 데이터 표시
    if (data.data && typeof data.data === 'object') {
      return (
        <div className="bg-bg-secondary rounded-lg p-4">
          <Typography variant="h4" className="text-sm font-semibold mb-3 text-txt-secondary">
            추출된 정보
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(data.data).map(([key, value]: [string, any]) => {
              if (typeof value === 'object' && value !== null) {
                return null; // 복잡한 객체는 별도 처리
              }
              return (
                <div key={key} className="flex justify-between items-start">
                  <span className="text-txt-secondary mr-2">{key}:</span>
                  <span className="font-medium text-right">{String(value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    // 그 외의 경우 원본 JSON 표시 (접을 수 있는 형태로)
    return (
      <details className="bg-bg-secondary rounded-lg p-4">
        <summary className="cursor-pointer text-sm font-semibold text-txt-secondary hover:text-txt-primary">
          원본 데이터 보기 (JSON)
        </summary>
        <pre className="mt-3 overflow-x-auto text-xs">
          <code className="text-txt-primary">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      </details>
    );
  };

  return (
    <div className="space-y-6">
      {/* 파일 업로드 영역 */}
      <Card className="bg-white rounded-lg border border-border-light p-8">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive 
              ? 'border-weave-primary bg-blue-50' 
              : file 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={acceptedFormats.join(',')}
            disabled={isProcessing}
          />

          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                {file.type.startsWith('image/') ? (
                  <FileImage className="w-12 h-12 text-green-600" />
                ) : (
                  <FileText className="w-12 h-12 text-green-600" />
                )}
                <div className="text-left">
                  <Typography variant="body1" className="font-medium text-txt-primary">
                    {file.name}
                  </Typography>
                  <Typography variant="body2" className="text-txt-secondary">
                    {(file.size / 1024).toFixed(1)} KB
                    {file.type === 'application/pdf' && ' - PDF 지원'}
                  </Typography>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={isProcessing}
                  className="ml-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {preview && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="mb-3"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? '미리보기 숨기기' : '미리보기 표시'}
                  </Button>
                  {showPreview && (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                    />
                  )}
                </div>
              )}

              <div className="flex justify-center space-x-3 mt-6">
                <Button
                  variant="primary"
                  onClick={extractData}
                  disabled={isProcessing}
                  className="min-w-32"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      데이터 추출
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  다른 파일 선택
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <Typography variant="body1" className="font-medium text-txt-primary mb-1">
                  파일을 드래그하여 놓거나 클릭하여 선택하세요
                </Typography>
                <Typography variant="body2" className="text-txt-secondary">
                  지원 형식: {acceptedFormats.join(', ')} (최대 {maxFileSize}MB)
                </Typography>
              </div>
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                파일 선택
              </Button>
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <Typography variant="body2" className="text-red-700">
              {error}
            </Typography>
          </div>
        )}
      </Card>

      {/* 추출된 데이터 표시 */}
      {extractedData && (
        <Card className="bg-white rounded-lg border border-border-light p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Typography variant="h3" className="text-lg font-semibold">
                추출된 데이터
              </Typography>
              <div className="flex items-center gap-2 mt-2">
                {extractedData.documentType && (
                  <Badge variant="secondary">
                    {extractedData.documentType}
                  </Badge>
                )}
                {extractedData.confidence && (
                  <Badge variant={extractedData.confidence > 0.8 ? 'success' : 'warning'}>
                    신뢰도: {(extractedData.confidence * 100).toFixed(0)}%
                  </Badge>
                )}
                {extractedData.language && (
                  <Badge variant="secondary">
                    {extractedData.language === 'ko' ? '한국어' : extractedData.language}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span>복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>JSON 복사</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadJSON}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>다운로드</span>
              </Button>
            </div>
          </div>

          {/* 추출된 데이터의 시각적 표현 */}
          {renderExtractedDataUI()}

          {/* 토큰 사용량 */}
          {extractedData.metadata?.tokenUsage && (
            <div className="mt-4 pt-4 border-t border-border-light">
              <Typography variant="body2" className="text-txt-secondary">
                토큰 사용량: {extractedData.metadata.tokenUsage.total.toLocaleString()}
                {extractedData.metadata.tokenUsage.cost && 
                  ` (비용: ₩${(extractedData.metadata.tokenUsage.cost * 1300).toFixed(0)})`
                }
              </Typography>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}