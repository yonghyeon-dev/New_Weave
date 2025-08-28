'use client';

import React, { useState, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { Upload, FileText, Download, AlertCircle, CheckCircle, BrainCircuit } from 'lucide-react';

interface ExtractedInfo {
  key: string;
  value: string;
  confidence: number;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export default function InfoExtractPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type
    });
    setExtractedInfo([]);
    setExtractionComplete(false);
  };

  const handleExtract = async () => {
    if (!uploadedFile) return;

    setIsExtracting(true);

    // 모의 정보 추출
    setTimeout(() => {
      const mockExtractedInfo: ExtractedInfo[] = [
        { key: '회사명', value: '㈜테크스타트', confidence: 95 },
        { key: '사업자등록번호', value: '123-45-67890', confidence: 98 },
        { key: '대표자명', value: '김철수', confidence: 92 },
        { key: '연락처', value: '02-1234-5678', confidence: 87 },
        { key: '이메일', value: 'contact@techstart.co.kr', confidence: 94 },
        { key: '주소', value: '서울시 강남구 테헤란로 123', confidence: 89 },
        { key: '계약금액', value: '15,000,000원', confidence: 96 },
        { key: '계약기간', value: '2025-09-01 ~ 2025-12-31', confidence: 91 },
        { key: '프로젝트명', value: '웹사이트 리뉴얼 프로젝트', confidence: 93 }
      ];

      setExtractedInfo(mockExtractedInfo);
      setIsExtracting(false);
      setExtractionComplete(true);
    }, 3000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const exportToCSV = () => {
    const csvContent = extractedInfo
      .map(info => `"${info.key}","${info.value}","${info.confidence}%"`)
      .join('\n');
    
    const blob = new Blob([`"항목","값","신뢰도"\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_info.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
                <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">정보 추출</Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  문서에서 핵심 정보를 자동으로 추출하세요
                </Typography>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 파일 업로드 */}
            <div className="space-y-6">
              <Card className="p-6">
                <Typography variant="h3" className="mb-4">파일 업로드</Typography>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-light rounded-lg p-8 text-center cursor-pointer hover:border-weave-primary hover:bg-weave-primary-light/10 transition-colors"
                >
                  <Upload className="w-12 h-12 text-txt-tertiary mx-auto mb-4" />
                  <Typography variant="h4" className="mb-2">파일을 선택하거나 드래그하세요</Typography>
                  <Typography variant="body2" className="text-txt-secondary">
                    PDF, DOC, DOCX, TXT 파일을 지원합니다 (최대 10MB)
                  </Typography>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {uploadedFile && (
                  <div className="mt-4 p-4 bg-bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-weave-primary" />
                      <div className="flex-1">
                        <Typography variant="body1" className="font-medium">
                          {uploadedFile.name}
                        </Typography>
                        <Typography variant="body2" className="text-txt-secondary">
                          {formatFileSize(uploadedFile.size)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                )}

                {uploadedFile && !isExtracting && (
                  <Button
                    onClick={handleExtract}
                    className="w-full mt-4 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    정보 추출 시작
                  </Button>
                )}

                {isExtracting && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-weave-primary border-t-transparent rounded-full animate-spin" />
                      <Typography variant="body1" className="text-weave-primary">
                        정보를 추출하고 있습니다...
                      </Typography>
                    </div>
                  </div>
                )}
              </Card>

              {/* 지원 파일 형식 */}
              <Card className="p-6">
                <Typography variant="h3" className="mb-4">지원 파일 형식</Typography>
                <div className="space-y-3">
                  {[
                    { type: 'PDF', desc: '계약서, 제안서, 보고서' },
                    { type: 'DOC/DOCX', desc: 'Microsoft Word 문서' },
                    { type: 'TXT', desc: '텍스트 파일' }
                  ].map((format) => (
                    <div key={format.type} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-weave-primary rounded-full" />
                      <div>
                        <Typography variant="body1" className="font-medium">{format.type}</Typography>
                        <Typography variant="body2" className="text-txt-secondary">{format.desc}</Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 추출된 정보 */}
            <div>
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h3">추출된 정보</Typography>
                  {extractionComplete && (
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      CSV 내보내기
                    </Button>
                  )}
                </div>

                {extractionComplete && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <Typography variant="body2" className="text-green-800">
                      {extractedInfo.length}개의 정보가 성공적으로 추출되었습니다
                    </Typography>
                  </div>
                )}

                {extractedInfo.length > 0 ? (
                  <div className="space-y-3">
                    {extractedInfo.map((info, index) => (
                      <div key={index} className="p-4 border border-border-light rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Typography variant="body1" className="font-medium text-txt-primary">
                            {info.key}
                          </Typography>
                          <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(info.confidence)}`}>
                            {info.confidence}%
                          </span>
                        </div>
                        <Typography variant="body1" className="text-txt-secondary">
                          {info.value}
                        </Typography>
                      </div>
                    ))}
                  </div>
                ) : !isExtracting ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <FileText className="w-12 h-12 text-txt-tertiary mb-4" />
                    <Typography variant="h4" className="mb-2">파일을 업로드해주세요</Typography>
                    <Typography variant="body2" className="text-txt-secondary">
                      문서를 업로드하면 AI가 자동으로 핵심 정보를 추출합니다
                    </Typography>
                  </div>
                ) : null}

                {extractionComplete && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <Typography variant="body2" className="text-yellow-800 font-medium">
                          주의사항
                        </Typography>
                        <Typography variant="body2" className="text-yellow-700 mt-1">
                          추출된 정보는 AI가 분석한 결과입니다. 실제 사용 전 반드시 검토해주세요.
                        </Typography>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}