'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Typography from '@/components/ui/Typography';
import Status from '@/components/ui/Status';
import type { DocumentRequest, DocumentRequestStatus } from '@/lib/types/document-request';

// 유틸리티 함수들
const getStatusLabel = (status: DocumentRequestStatus): string => {
  switch (status) {
    case 'active':
      return '활성';
    case 'expired':
      return '만료됨';
    case 'completed':
      return '완료됨';
    case 'cancelled':
      return '취소됨';
    default:
      return status;
  }
};

const getStatusType = (status: DocumentRequestStatus): "success" | "warning" | "error" | "info" | "progress" => {
  switch (status) {
    case 'active':
      return 'success';
    case 'expired':
      return 'error';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'info';
  }
};

interface DocumentRequestListProps {
  requests: DocumentRequest[];
  onCopy?: (request: DocumentRequest) => void;
  onCancel?: (requestId: string) => void;
  onRefresh?: () => void;
}

export function DocumentRequestList({
  requests,
  onCopy,
  onCancel,
  onRefresh
}: DocumentRequestListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = async (request: DocumentRequest) => {
    const shareUrl = `${window.location.origin}/upload/${request.token}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(request.id);
      setTimeout(() => setCopiedId(null), 2000);
      onCopy?.(request);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };


  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return '만료됨';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}일 ${hours % 24}시간 남음`;
    if (hours > 0) return `${hours}시간 남음`;
    
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}분 남음`;
  };

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <Typography variant="h4" className="mb-2">
          생성된 업로드 링크가 없습니다
        </Typography>
        <Typography variant="body2" className="text-txt-secondary mb-4">
          고객이 안전하게 파일을 업로드할 수 있는 보안 링크를 생성해보세요.
        </Typography>
        <Button variant="primary">
          첫 업로드 링크 생성하기
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h3">
          업로드 링크 ({requests.length})
        </Typography>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            새로고침
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((request) => (
          <DocumentRequestCard
            key={request.id}
            request={request}
            onCopyLink={() => handleCopyLink(request)}
            onCancel={onCancel}
            isCopied={copiedId === request.id}
          />
        ))}
      </div>
    </div>
  );
}

interface DocumentRequestCardProps {
  request: DocumentRequest;
  onCopyLink: () => void;
  onCancel?: (requestId: string) => void;
  isCopied: boolean;
}

function DocumentRequestCard({
  request,
  onCopyLink,
  onCancel,
  isCopied
}: DocumentRequestCardProps) {
  const uploadedCount = request.uploadedFiles?.length || 0;
  const remainingSlots = request.maxFiles - uploadedCount;
  const isExpired = new Date(request.expiresAt) <= new Date();
  const isActive = request.status === 'active' && !isExpired;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Typography variant="h4">
              {request.title}
            </Typography>
            <Status 
              type={getStatusType(request.status)}
              variant="badge"
            >
              {getStatusLabel(request.status)}
            </Status>
            {request.oneTimeUse && (
              <Badge variant="accent" size="sm">1회용</Badge>
            )}
            {request.passwordProtected && (
              <Badge variant="outline" size="sm">비밀번호</Badge>
            )}
          </div>

          {request.description && (
            <Typography variant="body2" className="text-txt-secondary mb-3">
              {request.description}
            </Typography>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-txt-tertiary">업로드:</span>
              <span className="ml-1 font-medium">
                {uploadedCount}/{request.maxFiles}
              </span>
            </div>
            <div>
              <span className="text-txt-tertiary">타입:</span>
              <span className="ml-1 font-medium">
                {request.type === 'single' ? '단일' : 
                 request.type === 'multiple' ? '복수' : '일괄'}
              </span>
            </div>
            <div>
              <span className="text-txt-tertiary">최대 크기:</span>
              <span className="ml-1 font-medium">
                {Math.round(request.maxFileSize / 1024 / 1024)}MB
              </span>
            </div>
            <div>
              <span className="text-txt-tertiary">유효 기간:</span>
              <span className={`ml-1 font-medium ${isExpired ? 'text-red-600' : 'text-txt-primary'}`}>
                {formatTimeRemaining(request.expiresAt)}
              </span>
            </div>
          </div>

          {request.allowedTypes.length > 0 && (
            <div className="mt-3">
              <span className="text-sm text-txt-tertiary">허용 형식: </span>
              <div className="inline-flex flex-wrap gap-1 ml-2">
                {request.allowedTypes.slice(0, 5).map(type => (
                  <Badge key={type} variant="secondary" size="sm">
                    .{type}
                  </Badge>
                ))}
                {request.allowedTypes.length > 5 && (
                  <Badge variant="secondary" size="sm">
                    +{request.allowedTypes.length - 5}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* 업로드된 파일 목록 */}
          {uploadedCount > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <Typography variant="body2" className="font-medium mb-2">
                업로드된 파일 ({uploadedCount})
              </Typography>
              <div className="space-y-1">
                {request.uploadedFiles?.slice(0, 3).map((file) => (
                  <div key={file.id} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="truncate flex-1">{file.originalName}</span>
                    <span className="text-txt-tertiary">
                      {Math.round(file.fileSize / 1024)}KB
                    </span>
                  </div>
                ))}
                {uploadedCount > 3 && (
                  <div className="text-sm text-txt-tertiary">
                    +{uploadedCount - 3}개 더
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2 ml-4">
          {isActive && (
            <Button
              variant="primary"
              size="sm"
              onClick={onCopyLink}
              disabled={isCopied}
            >
              {isCopied ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  복사됨
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  링크 복사
                </>
              )}
            </Button>
          )}
          
          <Link href={`/document-requests/${request.id}`}>
            <Button variant="outline" size="sm">
              상세보기
            </Button>
          </Link>
          
          {isActive && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(request.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              취소
            </Button>
          )}
        </div>
      </div>

      {/* 진행률 바 */}
      {request.maxFiles > 1 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-txt-tertiary">업로드 진행률</span>
            <span className="font-medium">
              {Math.round((uploadedCount / request.maxFiles) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-weave-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadedCount / request.maxFiles) * 100}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return '만료됨';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}일 ${hours % 24}시간 남음`;
  if (hours > 0) return `${hours}시간 남음`;
  
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}분 남음`;
}

export default DocumentRequestList;