'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { taxTransactionService } from '@/lib/services/supabase/tax-transactions.service';
import type { YearlyProjection } from '@/lib/services/supabase/tax-transactions.service';

export default function TaxOverview() {
  const [projection, setProjection] = useState<YearlyProjection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      const year = new Date().getFullYear();
      const data = await taxTransactionService.getYearlyProjection(year);
      setProjection(data);
    } catch (error) {
      console.error('Failed to load overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-bg-secondary rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 매출 예상 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 당해연도 매출 예상 */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-txt-tertiary">
              {new Date().getFullYear()}년
            </span>
          </div>
          <Typography variant="h3" className="text-2xl font-bold text-txt-primary mb-1">
            ₩{projection?.expectedRevenue.toLocaleString() || 0}
          </Typography>
          <Typography variant="body2" className="text-txt-secondary">
            연간 매출 예상
          </Typography>
          {projection?.growthRate && (
            <div className={`mt-2 text-sm ${projection.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {projection.growthRate > 0 ? '↑' : '↓'} {Math.abs(projection.growthRate).toFixed(1)}% 
              <span className="text-txt-tertiary"> vs 작년</span>
            </div>
          )}
        </Card>

        {/* 당월 매출 예상 */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-txt-tertiary">
              {new Date().getMonth() + 1}월
            </span>
          </div>
          <Typography variant="h3" className="text-2xl font-bold text-txt-primary mb-1">
            ₩{projection?.currentMonthRevenue.toLocaleString() || 0}
          </Typography>
          <Typography variant="body2" className="text-txt-secondary">
            이번 달 매출
          </Typography>
          <div className="mt-2 text-sm text-txt-tertiary">
            전월 대비 {projection?.previousMonthRevenue ? 
              `${((projection.currentMonthRevenue / projection.previousMonthRevenue - 1) * 100).toFixed(1)}%` 
              : '-%'}
          </div>
        </Card>

        {/* 다음 신고 일정 */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs text-txt-tertiary">다음 신고</span>
          </div>
          <Typography variant="h3" className="text-2xl font-bold text-txt-primary mb-1">
            D-15
          </Typography>
          <Typography variant="body2" className="text-txt-secondary">
            부가가치세 신고
          </Typography>
          <div className="mt-2 text-sm text-orange-600">
            2025년 1월 25일 마감
          </div>
        </Card>
      </div>

      {/* 월별 매출 트렌드 차트 - 추후 구현 */}
      <Card className="p-6">
        <Typography variant="h3" className="text-lg font-semibold text-txt-primary mb-6">
          월별 매출 트렌드
        </Typography>
        <div className="h-64 flex items-center justify-center text-txt-tertiary">
          차트 컴포넌트 구현 예정
        </div>
      </Card>
    </div>
  );
}