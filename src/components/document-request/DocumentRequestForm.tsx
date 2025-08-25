'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Typography from '@/components/ui/Typography';
import type { CreateDocumentRequestInput, DocumentRequestType } from '@/lib/types/document-request';

interface DocumentRequestFormProps {
  onSubmit: (data: CreateDocumentRequestInput) => Promise<void>;
  onCancel: () => void;
  clients?: Array<{ id: string; name: string; }>;
  projects?: Array<{ id: string; name: string; clientId: string; }>;
}

export function DocumentRequestForm({
  onSubmit,
  onCancel,
  clients = [],
  projects = []
}: DocumentRequestFormProps) {
  const [formData, setFormData] = useState<CreateDocumentRequestInput>({
    title: '',
    description: '',
    type: 'single',
    ttlHours: 168, // 7일
    oneTimeUse: false,
    passwordProtected: false,
    maxFiles: 5,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg']
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to create document request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateDocumentRequestInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredProjects = formData.clientId 
    ? projects.filter(p => p.clientId === formData.clientId)
    : projects;

  return (
    <Card className="p-6 max-w-2xl">
      <div className="mb-6">
        <Typography variant="h3" className="mb-2">
          보안 업로드 링크 생성
        </Typography>
        <Typography variant="body2" className="text-txt-secondary">
          고객이 안전하게 파일을 업로드할 수 있는 보안 링크를 생성합니다.
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-txt-primary mb-2">
              링크 제목 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="예: 계약서 및 사업자등록증 제출"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-primary mb-2">
              설명
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="업로드할 파일에 대한 안내사항을 작성하세요"
              className="w-full px-3 py-2 border border-border-light rounded-md text-sm focus:ring-2 focus:ring-weave-primary focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-txt-primary mb-2">
                업로드 타입
              </label>
              <Select
                value={formData.type}
                onValueChange={(value: string) => handleInputChange('type', value as DocumentRequestType)}
                options={[
                  { value: 'single', label: '단일 파일' },
                  { value: 'multiple', label: '복수 파일' },
                  { value: 'batch', label: '일괄 업로드' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-txt-primary mb-2">
                유효 기간 (시간)
              </label>
              <Select
                value={formData.ttlHours?.toString() || '168'}
                onValueChange={(value) => handleInputChange('ttlHours', parseInt(value))}
                options={[
                  { value: '24', label: '1일' },
                  { value: '72', label: '3일' },
                  { value: '168', label: '7일 (권장)' },
                  { value: '336', label: '14일' },
                  { value: '720', label: '30일' }
                ]}
              />
            </div>
          </div>

          {/* 프로젝트 연결 (선택적) */}
          {clients.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-txt-primary mb-2">
                  고객 (선택)
                </label>
                <Select
                  value={formData.clientId || ''}
                  onValueChange={(value) => handleInputChange('clientId', value || undefined)}
                  options={[
                    { value: '', label: '선택 안함' },
                    ...clients.map(client => ({
                      value: client.id,
                      label: client.name
                    }))
                  ]}
                />
              </div>

              {formData.clientId && filteredProjects.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-txt-primary mb-2">
                    프로젝트 (선택)
                  </label>
                  <Select
                    value={formData.projectId || ''}
                    onValueChange={(value) => handleInputChange('projectId', value || undefined)}
                    options={[
                      { value: '', label: '선택 안함' },
                      ...filteredProjects.map(project => ({
                        value: project.id,
                        label: project.name
                      }))
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 보안 설정 */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Typography variant="h4">보안 설정</Typography>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '간단히 보기' : '고급 설정'}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.oneTimeUse}
                onChange={(e) => handleInputChange('oneTimeUse', e.target.checked)}
                className="rounded border-border-light text-weave-primary focus:ring-weave-primary"
              />
              <span className="text-sm">1회용 링크</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.passwordProtected}
                onChange={(e) => handleInputChange('passwordProtected', e.target.checked)}
                className="rounded border-border-light text-weave-primary focus:ring-weave-primary"
              />
              <span className="text-sm">비밀번호 보호</span>
            </label>
          </div>

          {formData.passwordProtected && (
            <div>
              <label className="block text-sm font-medium text-txt-primary mb-2">
                비밀번호
              </label>
              <Input
                type="password"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="6자리 이상 입력하세요"
                minLength={6}
              />
            </div>
          )}
        </div>

        {/* 고급 설정 */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <Typography variant="h5">업로드 제한</Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-txt-primary mb-2">
                  최대 파일 수
                </label>
                <Input
                  type="number"
                  value={formData.maxFiles}
                  onChange={(e) => handleInputChange('maxFiles', parseInt(e.target.value))}
                  min={1}
                  max={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-txt-primary mb-2">
                  최대 파일 크기 (MB)
                </label>
                <Select
                  value={(formData.maxFileSize! / 1024 / 1024).toString()}
                  onValueChange={(value) => handleInputChange('maxFileSize', parseInt(value) * 1024 * 1024)}
                  options={[
                    { value: '10', label: '10MB' },
                    { value: '50', label: '50MB' },
                    { value: '100', label: '100MB' },
                    { value: '200', label: '200MB' }
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-txt-primary mb-2">
                허용된 파일 형식
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.allowedTypes?.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    .{type}
                  </Badge>
                ))}
              </div>
              <Input
                value={formData.allowedTypes?.join(', ') || ''}
                onChange={(e) => handleInputChange('allowedTypes', e.target.value.split(',').map(t => t.trim()))}
                placeholder="pdf, doc, docx, jpg, png"
              />
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-light">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !formData.title}
          >
            {isSubmitting ? '생성 중...' : '보안 링크 생성'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default DocumentRequestForm;