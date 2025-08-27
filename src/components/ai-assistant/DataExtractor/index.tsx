'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  X, 
  Copy, 
  Download,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import Alert from '@/components/ui/Alert';
import { 
  validateFileType, 
  validateFileSize, 
  formatFileSize, 
  createImagePreview,
  revokeImagePreview,
  fileToBase64
} from '@/utils/file';
import { ExtractedData } from '@/types/ai-assistant';
import { DataExtractorProps, FileUploadState, ExtractionState } from './types';

// 기본 허용 파일 타입
const DEFAULT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf'
];

// 기본 최대 파일 크기 (MB)
const DEFAULT_MAX_SIZE = 10;

export default function DataExtractor({
  onDataExtracted,
  onError,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  maxFileSize = DEFAULT_MAX_SIZE,
  className = ''
}: DataExtractorProps) {
  // 파일 업로드 상태
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    isUploading: false,
    uploadProgress: 0,
    preview: undefined
  });

  // 추출 상태
  const [extractionState, setExtractionState] = useState<ExtractionState>({
    isExtracting: false,
    extractedData: null,
    error: null
  });

  // 복사 성공 상태
  const [isCopied, setIsCopied] = useState(false);

  // 파일 드롭 핸들러
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 파일 검증
    if (!validateFileType(file, acceptedFileTypes)) {
      const error = new Error(`지원하지 않는 파일 형식입니다. 허용된 형식: ${acceptedFileTypes.join(', ')}`);
      setExtractionState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    if (!validateFileSize(file, maxFileSize)) {
      const error = new Error(`파일 크기가 너무 큽니다. 최대 ${maxFileSize}MB까지 업로드 가능합니다.`);
      setExtractionState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    // 이전 미리보기 정리
    if (uploadState.preview) {
      revokeImagePreview(uploadState.preview);
    }

    // 새 파일 설정
    const preview = file.type.startsWith('image/') ? createImagePreview(file) : undefined;
    
    setUploadState({
      file,
      isUploading: false,
      uploadProgress: 0,
      preview: preview || undefined
    });

    // 에러 상태 초기화
    setExtractionState(prev => ({ ...prev, error: null }));
  }, [acceptedFileTypes, maxFileSize, onError, uploadState.preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: 1,
    multiple: false
  });

  // 파일 제거
  const handleRemoveFile = () => {
    if (uploadState.preview) {
      revokeImagePreview(uploadState.preview);
    }
    setUploadState({
      file: null,
      isUploading: false,
      uploadProgress: 0,
      preview: undefined
    });
    setExtractionState({
      isExtracting: false,
      extractedData: null,
      error: null
    });
  };

  // 데이터 추출
  const handleExtractData = async () => {
    if (!uploadState.file) return;

    setExtractionState(prev => ({
      ...prev,
      isExtracting: true,
      error: null
    }));

    try {
      // Base64로 변환
      const base64Data = await fileToBase64(uploadState.file);
      
      // API 호출 (현재는 모의 데이터)
      // TODO: 실제 Gemini API 호출로 교체
      await new Promise(resolve => setTimeout(resolve, 2000)); // 모의 딜레이

      // 모의 추출 데이터
      const mockExtractedData: ExtractedData = {
        documentType: 'invoice',
        fields: {
          documentNumber: 'INV-2025-001',
          date: '2025-08-27',
          supplier: {
            name: '테크 솔루션즈(주)',
            businessNumber: '123-45-67890',
            representative: '김대표',
            address: '서울특별시 강남구 테헤란로 123',
            email: 'contact@techsolutions.kr',
            phone: '02-1234-5678'
          },
          buyer: {
            name: '스타트업(주)',
            businessNumber: '987-65-43210',
            representative: '이대표',
            address: '서울특별시 서초구 서초대로 456'
          },
          items: [
            {
              name: '웹 개발 서비스',
              quantity: 1,
              unitPrice: 5000000,
              amount: 5000000,
              tax: 500000
            },
            {
              name: '유지보수 (3개월)',
              quantity: 3,
              unitPrice: 1000000,
              amount: 3000000,
              tax: 300000
            }
          ],
          subtotal: 8000000,
          tax: 800000,
          total: 8800000
        },
        confidence: 0.95,
        rawText: '원본 텍스트 내용...',
        structuredData: {},
        metadata: {
          extractedAt: new Date(),
          processingTime: 2000,
          aiModel: 'gemini-2.0-flash-exp',
          confidence: {
            overall: 0.95,
            fields: {
              documentNumber: 0.98,
              date: 0.99,
              supplier: 0.96,
              buyer: 0.94,
              items: 0.92,
              total: 0.97
            }
          }
        }
      };

      setExtractionState({
        isExtracting: false,
        extractedData: mockExtractedData,
        error: null
      });

      // 콜백 호출
      onDataExtracted(mockExtractedData);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('데이터 추출 중 오류가 발생했습니다.');
      setExtractionState({
        isExtracting: false,
        extractedData: null,
        error: err
      });
      onError?.(err);
    }
  };

  // JSON 복사
  const handleCopyJSON = async () => {
    if (!extractionState.extractedData) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(extractionState.extractedData, null, 2)
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  // JSON 다운로드
  const handleDownloadJSON = () => {
    if (!extractionState.extractedData) return;

    const blob = new Blob(
      [JSON.stringify(extractionState.extractedData, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 파일 업로드 영역 */}
      <Card className="p-6">
        <Typography variant="h3" className="mb-4">파일 업로드</Typography>
        
        {!uploadState.file ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragActive 
                ? 'border-weave-primary bg-weave-primary-light/10' 
                : 'border-border-light hover:border-weave-primary hover:bg-bg-secondary'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-txt-tertiary" />
            <Typography variant="body1" className="mb-2">
              {isDragActive 
                ? '파일을 여기에 놓으세요' 
                : '클릭하거나 파일을 드래그하여 업로드'}
            </Typography>
            <Typography variant="body2" className="text-txt-tertiary">
              지원 형식: JPG, PNG, PDF (최대 {maxFileSize}MB)
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 업로드된 파일 정보 */}
            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                {uploadState.preview ? (
                  <img 
                    src={uploadState.preview} 
                    alt="미리보기" 
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <FileText className="w-12 h-12 text-txt-tertiary" />
                )}
                <div>
                  <Typography variant="body1" className="font-medium">
                    {uploadState.file.name}
                  </Typography>
                  <Typography variant="body2" className="text-txt-secondary">
                    {formatFileSize(uploadState.file.size)}
                  </Typography>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-txt-tertiary hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 추출 버튼 */}
            <Button
              onClick={handleExtractData}
              disabled={extractionState.isExtracting}
              className="w-full"
            >
              {extractionState.isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  데이터 추출 중...
                </>
              ) : (
                '데이터 추출 시작'
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* 에러 메시지 */}
      {extractionState.error && (
        <Alert variant="error" title="오류">
          {extractionState.error.message}
        </Alert>
      )}

      {/* 추출 결과 */}
      {extractionState.extractedData && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <Typography variant="h3">추출 결과</Typography>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCopyJSON}
                className="text-sm"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    JSON 복사
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadJSON}
                className="text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                다운로드
              </Button>
            </div>
          </div>

          {/* 문서 정보 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-bg-secondary rounded-lg">
              <div>
                <Typography variant="body2" className="text-txt-secondary mb-1">
                  문서 유형
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {extractionState.extractedData.documentType}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-txt-secondary mb-1">
                  신뢰도
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {(extractionState.extractedData.confidence * 100).toFixed(1)}%
                </Typography>
              </div>
            </div>

            {/* JSON 데이터 표시 */}
            <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
              <pre className="text-green-400 text-sm">
                {JSON.stringify(extractionState.extractedData.fields, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}