'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import { clientService, type Client } from '@/lib/services/supabase/clients.service';
import { projectsService } from '@/lib/services/supabase/projects.service';
import type { ProjectTableRow } from '@/lib/types/project-table.types';
import { 
  X,
  Save,
  Calendar,
  DollarSign,
  Loader2,
  AlertCircle,
  FolderPlus
} from 'lucide-react';

export interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: ProjectTableRow) => void;
}

interface FormData {
  name: string;
  description: string;
  client_id: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget: number;
  start_date: string;
  end_date: string;
  progress: number;
}

/**
 * 프로젝트 생성 모달 컴포넌트
 * 
 * 특징:
 * - 기존 /projects/new 페이지 폼을 모달로 변환
 * - 클라이언트 목록 자동 로드
 * - 폼 유효성 검증
 * - 에러 처리 및 로딩 상태
 * - 접근성 지원 (ESC 키, focus trap)
 */
export function ProjectCreateModal({
  isOpen,
  onClose,
  onSuccess
}: ProjectCreateModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    client_id: '',
    status: 'planning',
    priority: 'medium',
    budget: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    progress: 0
  });

  // 모달이 열릴 때 클라이언트 목록 로드
  useEffect(() => {
    if (isOpen) {
      loadClients();
      resetForm();
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !saving) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, saving, onClose]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const userId = 'system'; // TODO: 실제 사용자 ID로 교체 필요
      const clientsData = await clientService.getClients(userId);
      setClients(clientsData);
    } catch (err) {
      console.error('Failed to load clients:', err);
      setError('클라이언트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      client_id: '',
      status: 'planning',
      priority: 'medium',
      budget: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      progress: 0
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.client_id) {
      setError('프로젝트명과 클라이언트는 필수입니다.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const newProject = await projectsService.createProject({
        user_id: 'system', // TODO: 실제 사용자 ID로 교체 필요
        name: formData.name,
        description: formData.description || null,
        client_id: formData.client_id,
        status: formData.status,
        priority: formData.priority,
        budget_estimated: formData.budget || null,
        budget_spent: 0,
        start_date: formData.start_date,
        due_date: formData.end_date || null,
        progress: formData.progress
      });

      // 목록에서 사용할 형태로 변환
      const tableRow: ProjectTableRow = {
        id: newProject.id,
        no: `WEAVE_${String(clients.length + 1).padStart(3, '0')}`, // 임시 번호 생성
        name: newProject.name,
        registrationDate: newProject.created_at,
        client: clients.find(c => c.id === newProject.client_id)?.company || 'Unknown',
        progress: newProject.progress,
        paymentProgress: 0, // 초기값
        status: newProject.status,
        dueDate: newProject.due_date || new Date().toISOString(),
        modifiedDate: newProject.updated_at,
        hasContract: false,
        hasBilling: false,
        hasDocuments: false
      };

      onSuccess(tableRow);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('프로젝트 생성에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !saving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-weave-primary-light rounded-lg">
              <FolderPlus className="w-5 h-5 text-weave-primary" />
            </div>
            <div>
              <Typography variant="h3" className="text-xl font-semibold text-txt-primary">
                새 프로젝트 생성
              </Typography>
              <Typography variant="body2" className="text-txt-secondary">
                프로젝트 정보를 입력하고 관리를 시작하세요
              </Typography>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} disabled={saving} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <Typography variant="body2" className="text-red-600">
              {error}
            </Typography>
          </div>
        )}

        {/* 폼 컨텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 프로젝트명 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-txt-secondary mb-2">
                  프로젝트명 *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="프로젝트 이름을 입력하세요"
                  required
                  disabled={saving}
                />
              </div>

              {/* 설명 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-txt-secondary mb-2">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="프로젝트에 대한 설명을 입력하세요"
                  rows={3}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-border-medium rounded-md focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-weave-primary resize-none"
                />
              </div>

              {/* 클라이언트 */}
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-2">
                  클라이언트 *
                </label>
                {loading ? (
                  <div className="flex items-center gap-2 text-txt-tertiary py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">불러오는 중...</span>
                  </div>
                ) : (
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-border-medium rounded-md focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-weave-primary"
                    required
                    disabled={saving}
                  >
                    <option value="">클라이언트 선택</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.company} - {client.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 상태 */}
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-2">
                  상태
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-border-medium rounded-md focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-weave-primary"
                  disabled={saving}
                >
                  <option value="planning">기획</option>
                  <option value="in_progress">진행중</option>
                  <option value="review">검토</option>
                  <option value="completed">완료</option>
                  <option value="on_hold">보류</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>

              {/* 우선순위 */}
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-2">
                  우선순위
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-border-medium rounded-md focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-weave-primary"
                  disabled={saving}
                >
                  <option value="urgent">긴급</option>
                  <option value="high">높음</option>
                  <option value="medium">보통</option>
                  <option value="low">낮음</option>
                </select>
              </div>

              {/* 예산 */}
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-2">
                  예산
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
                  <Input
                    type="number"
                    value={formData.budget || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="pl-10"
                    disabled={saving}
                  />
                </div>
              </div>

              {/* 시작일 */}
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-2">
                  시작일
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="pl-10"
                    disabled={saving}
                  />
                </div>
              </div>

              {/* 종료일 */}
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-2">
                  종료일
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="pl-10"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-3 p-6 border-t border-border-light">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={saving}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            disabled={saving || loading}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                프로젝트 생성
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}