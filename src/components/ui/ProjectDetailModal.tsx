'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Calculator, 
  BarChart3, 
  DollarSign, 
  FileCheck,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import type { ProjectTableRow, ContractInfo } from '@/lib/types/project-table.types';

export interface ProjectDetailModalProps {
  project: ProjectTableRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'contract' | 'billing' | 'documents'>('overview');

  if (!isOpen || !project) return null;

  const tabs = [
    { id: 'overview', label: '개요', icon: FileText },
    { id: 'contract', label: '계약서', icon: FileCheck },
    { id: 'billing', label: '청구/정산', icon: DollarSign },
    { id: 'documents', label: '문서', icon: BarChart3 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-weave-primary-light rounded-lg">
              <FileText className="w-5 h-5 text-weave-primary" />
            </div>
            <div>
              <Typography variant="h3" className="text-xl font-semibold text-txt-primary">
                {project.name}
              </Typography>
              <Typography variant="body2" className="text-txt-secondary">
                {project.no} • {project.client}
              </Typography>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-border-light">
          <nav className="flex space-x-0">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-weave-primary text-weave-primary'
                      : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-light'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 프로젝트 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">프로젝트 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-txt-secondary">상태</span>
                      <span className="text-txt-primary">{getStatusLabel(project.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-txt-secondary">진행률</span>
                      <span className="text-txt-primary">{project.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-txt-secondary">등록일</span>
                      <span className="text-txt-primary">{new Date(project.registrationDate).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-txt-secondary">마감일</span>
                      <span className="text-txt-primary">{new Date(project.dueDate).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">클라이언트 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-txt-tertiary" />
                      <span className="text-txt-primary">{project.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-txt-secondary">수급현황</span>
                      <span className="text-txt-primary">{project.supplyStatus}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 진행률 차트 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">프로젝트 진행률</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-txt-secondary">전체 진행률</span>
                      <span className="text-txt-primary">{project.progress}%</span>
                    </div>
                    <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-weave-primary to-weave-primary-dark transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'contract' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">계약 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.contract ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Typography variant="body2" className="text-txt-secondary mb-2">계약자 정보</Typography>
                          <div className="p-3 bg-bg-secondary rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-txt-tertiary" />
                              <span className="text-txt-primary">{project.contract.contractorInfo.name}</span>
                            </div>
                            <div className="text-sm text-txt-secondary">{project.contract.contractorInfo.position}</div>
                          </div>
                        </div>
                        
                        <div>
                          <Typography variant="body2" className="text-txt-secondary mb-2">보고서</Typography>
                          <div className="p-3 bg-bg-secondary rounded-lg text-txt-primary">
                            {project.contract.reportInfo.type}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Typography variant="body2" className="text-txt-secondary mb-2">견적서</Typography>
                          <div className="p-3 bg-bg-secondary rounded-lg text-txt-primary">
                            {project.contract.estimateInfo.type}
                          </div>
                        </div>
                        
                        <div>
                          <Typography variant="body2" className="text-txt-secondary mb-2">기타</Typography>
                          <div className="p-3 bg-bg-secondary rounded-lg">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-txt-tertiary" />
                              <span className="text-txt-primary">{project.contract.other.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileCheck className="w-12 h-12 text-txt-tertiary mx-auto mb-3" />
                      <Typography variant="body1" className="text-txt-secondary">
                        계약 정보가 없습니다.
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>

              {project.contract && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">문서발행</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(project.contract.documentIssue).map(([key, value]) => (
                        <div key={key} className="text-center p-3 bg-bg-secondary rounded-lg">
                          <div className="text-sm text-txt-secondary mb-1">
                            {getDocumentTypeLabel(key)}
                          </div>
                          <div className="text-txt-primary">{value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">청구/정산 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.billing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {project.billing.totalAmount.toLocaleString()}원
                          </div>
                          <div className="text-sm text-blue-500">총 청구액</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {project.billing.paidAmount.toLocaleString()}원
                          </div>
                          <div className="text-sm text-green-500">입금완료</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {project.billing.remainingAmount.toLocaleString()}원
                          </div>
                          <div className="text-sm text-orange-500">미수금</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-txt-secondary">입금 진행률</span>
                          <span className="text-txt-primary">
                            {Math.round((project.billing.paidAmount / project.billing.totalAmount) * 100)}%
                          </span>
                        </div>
                        <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                            style={{ 
                              width: `${(project.billing.paidAmount / project.billing.totalAmount) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-txt-tertiary mx-auto mb-3" />
                      <Typography variant="body1" className="text-txt-secondary">
                        청구/정산 정보가 없습니다.
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">프로젝트 문서</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.documents && project.documents.length > 0 ? (
                    <div className="space-y-3">
                      {project.documents.map((doc) => (
                        <div 
                          key={doc.id} 
                          className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-txt-tertiary" />
                            <div>
                              <div className="font-medium text-txt-primary">{doc.name}</div>
                              <div className="text-sm text-txt-secondary">
                                {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                            {getDocumentStatusLabel(doc.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-txt-tertiary mx-auto mb-3" />
                      <Typography variant="body1" className="text-txt-secondary">
                        등록된 문서가 없습니다.
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-2 p-6 border-t border-border-light">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button variant="primary">
            편집
          </Button>
        </div>
      </div>
    </div>
  );
}

// 유틸리티 함수들
function getStatusLabel(status: string) {
  const labels = {
    planning: '기획',
    in_progress: '진행중',
    review: '검토',
    completed: '완료',
    on_hold: '보류',
    cancelled: '취소'
  };
  return labels[status as keyof typeof labels] || status;
}

function getDocumentTypeLabel(type: string) {
  const labels = {
    taxInvoice: '세금계산서',
    receipt: '영수증/부가세',
    cashReceipt: '현금영수증',
    businessReceipt: '카드영수증'
  };
  return labels[type as keyof typeof labels] || type;
}

function getDocumentStatusColor(status: string) {
  const colors = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    approved: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
}

function getDocumentStatusLabel(status: string) {
  const labels = {
    draft: '초안',
    sent: '전송됨',
    approved: '승인됨',
    completed: '완료'
  };
  return labels[status as keyof typeof labels] || status;
}