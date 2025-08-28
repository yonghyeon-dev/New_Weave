'use client';

import React, { useState, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { Upload, FileText, Shield, CheckCircle, AlertTriangle, X, BrainCircuit } from 'lucide-react';

interface ProcessedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: {
    type: string;
    summary: string;
    security: 'safe' | 'warning' | 'danger';
    details: string[];
  };
}

export default function FileProcessPage() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [fileIdCounter, setFileIdCounter] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach((file, index) => {
      const newFile: ProcessedFile = {
        id: `file-${fileIdCounter + index}`,
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0
      };

      setFiles(prev => [...prev, newFile]);

      // 파일 업로드 및 처리 시뮬레이션
      simulateFileProcessing(newFile.id);
    });
    
    setFileIdCounter(prev => prev + selectedFiles.length);
  };

  const simulateFileProcessing = (fileId: string) => {
    // 업로드 진행률 시뮬레이션
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 10;
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, progress, status: progress >= 100 ? 'processing' : 'uploading' }
          : file
      ));

      if (progress >= 100) {
        clearInterval(uploadInterval);
        
        // 처리 완료 시뮬레이션
        setTimeout(() => {
          const mockResults = [
            {
              type: 'PDF 계약서',
              summary: '업무 위탁 계약서로 확인됩니다.',
              security: 'safe' as const,
              details: [
                '바이러스 검사 완료 - 안전',
                '개인정보 포함: 이름, 연락처',
                '계약 조건 8항목 확인',
                '파일 형식 검증 완료'
              ]
            },
            {
              type: 'Excel 파일',
              summary: '재무 데이터가 포함된 스프레드시트입니다.',
              security: 'warning' as const,
              details: [
                '바이러스 검사 완료 - 안전',
                '민감한 재무 정보 포함',
                '매크로 코드 발견 - 검토 필요',
                '암호화 권장'
              ]
            },
            {
              type: '이미지 파일',
              summary: '사업자등록증 스캔 파일입니다.',
              security: 'safe' as const,
              details: [
                '바이러스 검사 완료 - 안전',
                '사업자등록번호 포함',
                '이미지 품질 양호',
                'OCR 처리 가능'
              ]
            }
          ];

          const resultIndex = parseInt(fileId.split('-')[1]) % mockResults.length;
          const randomResult = mockResults[resultIndex];

          setFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { 
                  ...file, 
                  status: 'completed', 
                  progress: 100,
                  result: randomResult
                }
              : file
          ));
        }, 2000);
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'danger':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'safe':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'danger':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
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
                <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">파일 처리</Typography>
                <Typography variant="body1" className="text-txt-secondary">
                  보안 업로드 및 파일 분석 처리
                </Typography>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 파일 업로드 */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <Typography variant="h3" className="mb-4">파일 업로드</Typography>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-light rounded-lg p-6 text-center cursor-pointer hover:border-weave-primary hover:bg-weave-primary-light/10 transition-colors"
                >
                  <Upload className="w-8 h-8 text-txt-tertiary mx-auto mb-3" />
                  <Typography variant="body1" className="font-medium mb-1">파일을 선택하세요</Typography>
                  <Typography variant="body2" className="text-txt-secondary">
                    또는 드래그하여 업로드
                  </Typography>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-weave-primary" />
                    <Typography variant="body2" className="font-medium">보안 기능</Typography>
                  </div>
                  <ul className="space-y-2 text-sm text-txt-secondary">
                    <li>• 바이러스 스캔</li>
                    <li>• 개인정보 탐지</li>
                    <li>• 파일 무결성 검사</li>
                    <li>• 보안 취약점 분석</li>
                  </ul>
                </div>
              </Card>
            </div>

            {/* 처리 중인 파일들 */}
            <div className="lg:col-span-2">
              <Card className="p-6 h-full">
                <Typography variant="h3" className="mb-4">
                  처리 상태 ({files.length})
                </Typography>

                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <FileText className="w-12 h-12 text-txt-tertiary mb-4" />
                    <Typography variant="h4" className="mb-2">파일을 업로드해주세요</Typography>
                    <Typography variant="body2" className="text-txt-secondary">
                      업로드된 파일들의 처리 상태가 여기에 표시됩니다
                    </Typography>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div key={file.id} className={`border rounded-lg p-4 ${
                        file.result ? getSecurityColor(file.result.security) : 'border-border-light'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Typography variant="body1" className="font-medium">
                                {file.name}
                              </Typography>
                              {file.result && getSecurityIcon(file.result.security)}
                            </div>
                            <Typography variant="body2" className="text-txt-secondary mb-2">
                              {formatFileSize(file.size)}
                            </Typography>

                            {/* 진행률 바 */}
                            {file.status !== 'completed' && (
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                  <Typography variant="body2" className="text-txt-secondary">
                                    {file.status === 'uploading' ? '업로드 중' : '처리 중'}
                                  </Typography>
                                  <Typography variant="body2" className="text-txt-secondary">
                                    {file.progress}%
                                  </Typography>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-weave-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${file.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* 처리 결과 */}
                            {file.result && (
                              <div className="mt-3">
                                <Typography variant="body2" className="font-medium mb-2">
                                  {file.result.type} - {file.result.summary}
                                </Typography>
                                <ul className="space-y-1">
                                  {file.result.details.map((detail, index) => (
                                    <li key={index} className="text-xs text-txt-secondary flex items-center gap-2">
                                      <div className="w-1 h-1 bg-txt-tertiary rounded-full" />
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-txt-tertiary hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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