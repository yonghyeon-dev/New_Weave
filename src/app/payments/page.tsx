'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CreditCard, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Typography from '@/components/ui/Typography';
import PaymentTracker from '@/components/payments/PaymentTracker';
import { Payment, PaymentStatus, PaymentMethod } from '@/lib/types/invoice';
import { cn } from '@/lib/utils';

interface PaymentSummary {
  totalReceived: number;
  totalPending: number;
  totalFailed: number;
  totalRefunded: number;
  monthlyGrowth: number;
  averagePaymentAmount: number;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    amount: 3850000,
    method: 'bank_transfer',
    status: 'completed',
    date: new Date('2024-08-20'),
    createdAt: new Date('2024-08-20'),
    notes: '계좌이체로 정상 결제 완료'
  },
  {
    id: '2',
    invoiceId: '3',
    amount: 6050000,
    method: 'credit_card',
    status: 'completed',
    date: new Date('2024-08-25'),
    createdAt: new Date('2024-08-25')
  },
  {
    id: '3',
    invoiceId: '2',
    amount: 3080000,
    method: 'bank_transfer',
    status: 'pending',
    date: new Date('2024-08-26'),
    createdAt: new Date('2024-08-26'),
    notes: '고객 확인 대기 중'
  },
  {
    id: '4',
    invoiceId: '4',
    amount: 1500000,
    method: 'credit_card',
    status: 'failed',
    date: new Date('2024-08-24'),
    createdAt: new Date('2024-08-24'),
    notes: '카드 한도 초과로 결제 실패'
  }
];

const paymentStatusOptions = [
  { value: 'all', label: '전체' },
  { value: 'completed', label: '완료' },
  { value: 'pending', label: '대기중' },
  { value: 'failed', label: '실패' },
  { value: 'refunded', label: '환불' }
];

const paymentMethodOptions = [
  { value: 'all', label: '전체' },
  { value: 'bank_transfer', label: '계좌이체' },
  { value: 'credit_card', label: '신용카드' },
  { value: 'cash', label: '현금' },
  { value: 'check', label: '수표' },
  { value: 'other', label: '기타' }
];

const getStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600 border border-green-200/50';
    case 'pending':
      return 'text-yellow-600 border border-yellow-200/50';
    case 'failed':
      return 'text-red-600 border border-red-200/50';
    case 'refunded':
      return 'text-txt-tertiary border border-border-light/50';
    default:
      return 'text-txt-tertiary border border-border-light/50';
  }
};

const getStatusLabel = (status: PaymentStatus): string => {
  const option = paymentStatusOptions.find(opt => opt.value === status);
  return option?.label || status;
};

const getMethodLabel = (method: PaymentMethod): string => {
  const option = paymentMethodOptions.find(opt => opt.value === method);
  return option?.label || method;
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ko-KR') + '원';
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [summary, setSummary] = useState<PaymentSummary>({
    totalReceived: 0,
    totalPending: 0,
    totalFailed: 0,
    totalRefunded: 0,
    monthlyGrowth: 0,
    averagePaymentAmount: 0
  });

  useEffect(() => {
    // 결제 요약 정보 계산
    const completed = payments.filter(p => p.status === 'completed');
    const pending = payments.filter(p => p.status === 'pending');
    const failed = payments.filter(p => p.status === 'failed');
    const refunded = payments.filter(p => p.status === 'refunded');

    const totalReceived = completed.reduce((sum, p) => sum + p.amount, 0);
    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
    const totalFailed = failed.reduce((sum, p) => sum + p.amount, 0);
    const totalRefunded = refunded.reduce((sum, p) => sum + p.amount, 0);

    const averagePaymentAmount = completed.length > 0 
      ? totalReceived / completed.length 
      : 0;

    setSummary({
      totalReceived,
      totalPending,
      totalFailed,
      totalRefunded,
      monthlyGrowth: 15.2, // 목업 데이터
      averagePaymentAmount
    });
  }, [payments]);

  const filteredPayments = payments.filter(payment => {
    const statusMatch = selectedStatus === 'all' || payment.status === selectedStatus;
    const methodMatch = selectedMethod === 'all' || payment.method === selectedMethod;
    return statusMatch && methodMatch;
  });

  const [paymentIdCounter, setPaymentIdCounter] = useState(5);

  const handleAddPayment = (newPayment: Omit<Payment, 'id' | 'createdAt'>) => {
    const payment: Payment = {
      ...newPayment,
      id: `payment-${paymentIdCounter}`,
      createdAt: new Date()
    };
    setPaymentIdCounter(prev => prev + 1);
    setPayments(prev => [payment, ...prev]);
  };

  const handleUpdatePayment = (paymentId: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, ...updates }
        : payment
    ));
  };

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - 모바일 가로 배치 최적화 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 sm:p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-weave-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <Typography variant="h2" className="text-xl sm:text-2xl mb-0 sm:mb-1 text-txt-primary leading-tight">결제 관리</Typography>
              <Typography variant="body1" className="text-sm sm:text-base text-txt-secondary leading-tight hidden sm:block">
                모든 결제 내역을 관리하고 상태를 추적하세요
              </Typography>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-border-light p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-weave-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Typography variant="body2" className="text-xs sm:text-sm text-txt-secondary">받은 금액</Typography>
                <Typography variant="h3" className="text-lg sm:text-2xl leading-tight">
                  {formatCurrency(summary.totalReceived)}
                </Typography>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{summary.monthlyGrowth}% 증가</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center">
              <div className="p-2 bg-bg-secondary rounded-lg">
                <Calendar className="w-6 h-6 text-txt-tertiary" />
              </div>
              <div className="ml-4 flex-1">
                <Typography variant="body2" className="text-txt-secondary">대기 중</Typography>
                <Typography variant="h3" className="text-2xl">
                  {formatCurrency(summary.totalPending)}
                </Typography>
                <div className="text-xs text-txt-tertiary mt-1">
                  {payments.filter(p => p.status === 'pending').length}건 대기
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center">
              <div className="p-2 bg-bg-secondary rounded-lg">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <Typography variant="body2" className="text-txt-secondary">실패 금액</Typography>
                <Typography variant="h3" className="text-2xl">
                  {formatCurrency(summary.totalFailed)}
                </Typography>
                <div className="text-xs text-txt-tertiary mt-1">
                  {payments.filter(p => p.status === 'failed').length}건 실패
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center">
              <div className="p-2 bg-weave-primary-light rounded-lg">
                <TrendingUp className="w-6 h-6 text-weave-primary" />
              </div>
              <div className="ml-4 flex-1">
                <Typography variant="body2" className="text-txt-secondary">평균 결제액</Typography>
                <Typography variant="h3" className="text-2xl">
                  {formatCurrency(Math.round(summary.averagePaymentAmount))}
                </Typography>
                <div className="text-xs text-txt-tertiary mt-1">
                  건당 평균
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              필터 조건
            </Typography>
            <div className="text-sm text-txt-tertiary">
              총 {filteredPayments.length}건의 결제
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">
                결제 상태
              </label>
              <Select
                options={paymentStatusOptions}
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                placeholder="상태 선택"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">
                결제 방법
              </label>
              <Select
                options={paymentMethodOptions}
                value={selectedMethod}
                onValueChange={setSelectedMethod}
                placeholder="방법 선택"
              />
            </div>
          </div>
        </div>

        {/* Payment Tracker */}
        <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
          <PaymentTracker
            invoiceId="new"
            payments={filteredPayments}
            onAddPayment={handleAddPayment}
            onUpdatePayment={handleUpdatePayment}
          />
        </div>

        {/* Detailed Payment Table */}
        <div className="bg-white rounded-lg border border-border-light overflow-hidden">
          <div className="px-6 py-4 border-b border-border-light">
            <Typography variant="h4">결제 내역</Typography>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>결제일</Table.Head>
                <Table.Head>인보이스</Table.Head>
                <Table.Head>금액</Table.Head>
                <Table.Head>결제방법</Table.Head>
                <Table.Head>상태</Table.Head>
                <Table.Head>참고사항</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredPayments.map((payment) => (
                <Table.Row key={payment.id}>
                  <Table.Cell className="font-medium">
                    {formatDate(payment.date)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-weave-primary font-medium">
                      INV-2024-{payment.invoiceId.padStart(3, '0')}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="font-semibold">
                    {formatCurrency(payment.amount)}
                  </Table.Cell>
                  <Table.Cell>
                    {getMethodLabel(payment.method)}
                  </Table.Cell>
                  <Table.Cell>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/50 backdrop-blur-sm",
                      getStatusColor(payment.status)
                    )}>
                      {getStatusLabel(payment.status)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-txt-secondary">
                    {payment.notes || '-'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-txt-disabled mx-auto mb-4" />
              <Typography variant="h4" className="text-txt-tertiary mb-2">
                조건에 맞는 결제 내역이 없습니다
              </Typography>
              <div className="text-txt-tertiary text-sm">
                필터 조건을 변경하거나 새로운 결제를 추가해보세요
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </AppLayout>
  );
}