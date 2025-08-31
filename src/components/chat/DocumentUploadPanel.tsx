'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { Upload, FileText, X, Check, AlertCircle, FileSearch } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadedDocument {
  id: string;
  fileName: string;
  chunks: number;
  wordCount: number;
  uploadTime: Date;
}

interface DocumentUploadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export default function DocumentUploadPanel({ 
  isOpen, 
  onClose,
  onUploadSuccess 
}: DocumentUploadPanelProps) {
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // 파일 업로드 처리
  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    setUploadStatus('idle');
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'business');
      formData.append('projectId', 'default');
      
      try {
        const response = await fetch('/api/ai-assistant/rag-chat', {
          method: 'PUT',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          const newDoc: UploadedDocument = {
            id: result.data.id,
            fileName: result.data.fileName,
            chunks: result.data.chunks,
            wordCount: result.data.wordCount,
            uploadTime: new Date()
          };
          
          setUploadedDocs(prev => [...prev, newDoc]);
          setUploadStatus('success');
          setStatusMessage(`${file.name} 업로드 완료`);
          if (onUploadSuccess) onUploadSuccess();
        } else {
          throw new Error('업로드 실패');
        }
      } catch (error) {
        console.error('파일 업로드 오류:', error);
        setUploadStatus('error');
        setStatusMessage(`${file.name} 업로드 실패`);
      }
    }
    
    setIsUploading(false);
    setTimeout(() => {
      setUploadStatus('idle');
      setStatusMessage('');
    }, 3000);
  };

  // 문서 삭제
  const handleDeleteDoc = async (docId: string) => {
    try {
      const response = await fetch('/api/ai-assistant/rag-chat', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId })
      });
      
      if (response.ok) {
        setUploadedDocs(prev => prev.filter(doc => doc.id !== docId));
        setStatusMessage('문서가 삭제되었습니다');
        setUploadStatus('success');
      }
    } catch (error) {
      console.error('문서 삭제 오류:', error);
      setStatusMessage('삭제 실패');
      setUploadStatus('error');
    }
  };

  // 문서 목록 로드
  React.useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen]);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/ai-assistant/rag-chat');
      if (response.ok) {
        const result = await response.json();
        // API 응답 형식에 맞게 조정 필요
        setUploadedDocs(result.data || []);
      }
    } catch (error) {
      console.error('문서 목록 로드 오류:', error);
    }
  };

  // Dropzone 설정
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b border-border-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSearch className="w-5 h-5 text-weave-primary" />
            <Typography variant="h3" className="text-lg font-semibold">
              RAG 문서 관리
            </Typography>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 업로드 영역 */}
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
              isDragActive 
                ? 'border-weave-primary bg-weave-primary/5' 
                : 'border-border-light hover:border-weave-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-txt-tertiary mx-auto mb-3" />
            <Typography variant="body1" className="text-txt-secondary mb-1">
              {isDragActive 
                ? '파일을 여기에 놓으세요'
                : '파일을 드래그하거나 클릭하여 업로드'}
            </Typography>
            <Typography variant="body2" className="text-txt-tertiary text-sm">
              지원 형식: TXT, MD, PDF, DOC, DOCX
            </Typography>
          </div>
          
          {/* 상태 메시지 */}
          {uploadStatus !== 'idle' && (
            <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
              uploadStatus === 'success' 
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {uploadStatus === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <Typography variant="body2">{statusMessage}</Typography>
            </div>
          )}
        </div>
        
        {/* 업로드된 문서 목록 */}
        <div className="flex-1 overflow-y-auto p-4 border-t border-border-light">
          <Typography variant="h4" className="text-sm font-semibold text-txt-secondary mb-3">
            업로드된 문서 ({uploadedDocs.length})
          </Typography>
          
          {uploadedDocs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-txt-tertiary mx-auto mb-3" />
              <Typography variant="body2" className="text-txt-tertiary">
                아직 업로드된 문서가 없습니다
              </Typography>
            </div>
          ) : (
            <div className="space-y-2">
              {uploadedDocs.map(doc => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg hover:bg-bg-tertiary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-weave-primary" />
                    <div>
                      <Typography variant="body2" className="font-medium">
                        {doc.fileName}
                      </Typography>
                      <Typography variant="body2" className="text-xs text-txt-tertiary">
                        {doc.chunks}개 청크 • {doc.wordCount.toLocaleString()}단어
                      </Typography>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-1 hover:bg-red-50 rounded transition-colors group"
                  >
                    <X className="w-4 h-4 text-txt-tertiary group-hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 하단 액션 */}
        <div className="p-4 border-t border-border-light">
          <div className="flex justify-between items-center">
            <Typography variant="body2" className="text-txt-tertiary text-sm">
              문서는 RAG 검색에 자동으로 사용됩니다
            </Typography>
            <Button variant="primary" onClick={onClose}>
              완료
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}