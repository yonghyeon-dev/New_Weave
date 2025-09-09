'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import { Filter, Download, Upload, Plus } from 'lucide-react';
import { taxTransactionService } from '@/lib/services/supabase/tax-transactions.service';
import type { Transaction, TransactionFilters } from '@/lib/services/supabase/tax-transactions.service';

export default function TaxTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: 'thisYear',  // 2024년 전체 데이터를 표시하도록 변경
    transactionType: 'all',
    projectId: null,
    clientId: null
  });

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await taxTransactionService.getTransactions(filters);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 툴바 */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            엑셀 업로드
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            거래 추가
          </Button>
        </div>
      </div>

      {/* 필터 패널 */}
      {showFilter && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">
                기간
              </label>
              <select 
                className="w-full px-3 py-2 border border-border-light rounded-md"
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="thisMonth">이번 달</option>
                <option value="lastMonth">지난 달</option>
                <option value="thisYear">올해</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">
                거래 유형
              </label>
              <select 
                className="w-full px-3 py-2 border border-border-light rounded-md"
                value={filters.transactionType}
                onChange={(e) => setFilters({...filters, transactionType: e.target.value as any})}
              >
                <option value="all">전체</option>
                <option value="매출">매출</option>
                <option value="매입">매입</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* 거래 목록 */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-txt-tertiary">
            데이터를 불러오는 중...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <Typography variant="body1" className="text-txt-tertiary mb-4">
              거래 내역이 없습니다
            </Typography>
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              첫 거래 추가하기
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-secondary border-b border-border-light">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Typography variant="body2" className="font-semibold text-txt-secondary">
                      날짜
                    </Typography>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Typography variant="body2" className="font-semibold text-txt-secondary">
                      구분
                    </Typography>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Typography variant="body2" className="font-semibold text-txt-secondary">
                      프로젝트/공급처
                    </Typography>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Typography variant="body2" className="font-semibold text-txt-secondary">
                      클라이언트/공급자
                    </Typography>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <Typography variant="body2" className="font-semibold text-txt-secondary">
                      공급가액
                    </Typography>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <Typography variant="body2" className="font-semibold text-txt-secondary">
                      부가세(10%)
                    </Typography>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <Typography variant="body2" className="font-semibold text-txt-secondary">
                      원천세(3.3%)
                    </Typography>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <Typography variant="body2" className="font-semibold text-txt-secondary">
                      원천세(8.8%)
                    </Typography>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <Typography variant="body2" className="font-semibold text-txt-secondary">
                      합계(입금액)
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  // 실제 입금액 계산 (매출의 경우 원천세를 제외한 금액)
                  const actualAmount = transaction.transaction_type === '매출' 
                    ? transaction.total_amount - transaction.withholding_tax_3_3 - transaction.withholding_tax_6_8
                    : transaction.total_amount;
                  
                  return (
                    <tr 
                      key={transaction.id}
                      className="border-b border-border-light hover:bg-bg-secondary transition-colors cursor-pointer"
                      onClick={() => {
                        // 프로젝트가 연결된 경우 프로젝트 페이지로 이동
                        if (transaction.project_id) {
                          window.location.href = `/projects/${transaction.project_id}`;
                        }
                      }}
                    >
                      <td className="px-4 py-3">
                        <Typography variant="body2" className="text-txt-primary">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.transaction_type === '매출' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <Typography variant="body2" className="text-txt-primary font-medium">
                            {transaction.category || (transaction.transaction_type === '매출' ? 'A프로젝트' : '공급처')}
                          </Typography>
                          {transaction.description && (
                            <Typography variant="caption" className="text-txt-tertiary">
                              {transaction.description}
                            </Typography>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <Typography variant="body2" className="text-txt-primary">
                            {transaction.supplier_name}
                          </Typography>
                          {transaction.business_number && (
                            <Typography variant="caption" className="text-txt-tertiary">
                              {transaction.business_number}
                            </Typography>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Typography variant="body2" className="text-txt-primary">
                          ₩{Number(transaction.supply_amount).toLocaleString()}
                        </Typography>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Typography variant="body2" className="text-txt-primary">
                          {transaction.vat_amount > 0 ? `₩${Number(transaction.vat_amount).toLocaleString()}` : '-'}
                        </Typography>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Typography variant="body2" className={transaction.withholding_tax_3_3 > 0 ? "text-orange-600" : "text-txt-tertiary"}>
                          {transaction.withholding_tax_3_3 > 0 ? `₩${Number(transaction.withholding_tax_3_3).toLocaleString()}` : '-'}
                        </Typography>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Typography variant="body2" className={transaction.withholding_tax_6_8 > 0 ? "text-orange-600" : "text-txt-tertiary"}>
                          {transaction.withholding_tax_6_8 > 0 ? `₩${Number(transaction.withholding_tax_6_8).toLocaleString()}` : '-'}
                        </Typography>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          <Typography variant="body2" className="font-semibold text-txt-primary">
                            ₩{Number(actualAmount).toLocaleString()}
                          </Typography>
                          {transaction.transaction_type === '매출' && (transaction.withholding_tax_3_3 > 0 || transaction.withholding_tax_6_8 > 0) && (
                            <Typography variant="caption" className="text-txt-tertiary">
                              (총 ₩{Number(transaction.total_amount).toLocaleString()})
                            </Typography>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}