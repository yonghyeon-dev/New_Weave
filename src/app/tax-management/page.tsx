'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { DataPageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import { 
  Calculator,
  FileText,
  DollarSign,
  Calendar,
  Download,
  Upload,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  Receipt
} from 'lucide-react';

export default function TaxManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '개요', icon: Calculator },
    { id: 'vat', label: '부가가치세', icon: Receipt },
    { id: 'income', label: '소득세', icon: DollarSign },
    { id: 'corporate', label: '법인세', icon: FileSpreadsheet },
    { id: 'reports', label: '세무 보고서', icon: FileText }
  ];

  return (
    <AppLayout>
      <DataPageContainer>
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-weave-primary-light rounded-lg">
              <Calculator className="w-6 h-6 text-weave-primary" />
            </div>
            <div>
              <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">
                세무 관리
              </Typography>
              <Typography variant="body1" className="text-txt-secondary">
                세금 계산, 신고 및 세무 관리를 한 곳에서 처리하세요
              </Typography>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex items-center gap-2 border-b border-border-light">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-weave-primary text-weave-primary'
                    : 'border-transparent text-txt-secondary hover:text-txt-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 세무 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs text-txt-tertiary">이번 분기</span>
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-txt-primary mb-1">
                  ₩12,450,000
                </Typography>
                <Typography variant="body2" className="text-txt-secondary">
                  부가가치세 예상
                </Typography>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs text-txt-tertiary">연간</span>
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-txt-primary mb-1">
                  ₩45,200,000
                </Typography>
                <Typography variant="body2" className="text-txt-secondary">
                  예상 소득세
                </Typography>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileSpreadsheet className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs text-txt-tertiary">연간</span>
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-txt-primary mb-1">
                  ₩28,600,000
                </Typography>
                <Typography variant="body2" className="text-txt-secondary">
                  법인세 예상
                </Typography>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs text-txt-tertiary">다음 신고</span>
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-txt-primary mb-1">
                  15일
                </Typography>
                <Typography variant="body2" className="text-txt-secondary">
                  부가세 신고 마감
                </Typography>
              </Card>
            </div>

            {/* 세무 일정 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h3" className="text-lg font-semibold text-txt-primary">
                  세무 일정
                </Typography>
                <Button variant="primary" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  일정 추가
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-lg">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Typography variant="body1" className="font-medium text-txt-primary">
                        부가가치세 신고
                      </Typography>
                      <span className="text-sm text-red-600 font-medium">D-15</span>
                    </div>
                    <Typography variant="body2" className="text-txt-secondary">
                      2025년 1분기 부가가치세 신고 기한
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-lg">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Typography variant="body1" className="font-medium text-txt-primary">
                        원천세 납부
                      </Typography>
                      <span className="text-sm text-yellow-600 font-medium">D-30</span>
                    </div>
                    <Typography variant="body2" className="text-txt-secondary">
                      3월 원천징수세 납부 기한
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Typography variant="body1" className="font-medium text-txt-primary">
                        법인세 중간예납
                      </Typography>
                      <span className="text-sm text-green-600 font-medium">완료</span>
                    </div>
                    <Typography variant="body2" className="text-txt-secondary">
                      2025년 법인세 중간예납 완료
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>

            {/* 빠른 작업 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-weave-primary-light rounded-lg">
                    <Calculator className="w-6 h-6 text-weave-primary" />
                  </div>
                  <div>
                    <Typography variant="body1" className="font-medium text-txt-primary">
                      세금 계산기
                    </Typography>
                    <Typography variant="body2" className="text-txt-secondary">
                      부가세, 소득세 간편 계산
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-weave-primary-light rounded-lg">
                    <Upload className="w-6 h-6 text-weave-primary" />
                  </div>
                  <div>
                    <Typography variant="body1" className="font-medium text-txt-primary">
                      증빙 자료 업로드
                    </Typography>
                    <Typography variant="body2" className="text-txt-secondary">
                      세금계산서, 영수증 관리
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-weave-primary-light rounded-lg">
                    <FileText className="w-6 h-6 text-weave-primary" />
                  </div>
                  <div>
                    <Typography variant="body1" className="font-medium text-txt-primary">
                      세무 보고서 생성
                    </Typography>
                    <Typography variant="body2" className="text-txt-secondary">
                      월별, 분기별 보고서
                    </Typography>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* 다른 탭들은 추후 구현 */}
        {activeTab !== 'overview' && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Calculator className="w-16 h-16 text-txt-tertiary mx-auto mb-4" />
              <Typography variant="h3" className="text-lg font-medium text-txt-primary mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} 기능 준비 중
              </Typography>
              <Typography variant="body2" className="text-txt-secondary">
                곧 업데이트될 예정입니다
              </Typography>
            </div>
          </div>
        )}
      </DataPageContainer>
    </AppLayout>
  );
}