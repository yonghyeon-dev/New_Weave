'use client';

import React, { useState } from 'react';
import { Calendar, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Payment, PaymentMethod, PaymentStatus } from '@/lib/types/invoice';
import { cn } from '@/lib/utils';

interface PaymentTrackerProps {
  invoiceId: string;
  payments?: Payment[];
  onAddPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  onUpdatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  className?: string;
}

const paymentMethodOptions = [
  { value: 'bank_transfer', label: '계좌이체' },
  { value: 'credit_card', label: '신용카드' },
  { value: 'cash', label: '현금' },
  { value: 'check', label: '수표' },
  { value: 'other', label: '기타' }
];

const paymentStatusOptions = [
  { value: 'pending', label: '대기중' },
  { value: 'completed', label: '완료' },
  { value: 'failed', label: '실패' },
  { value: 'refunded', label: '환불' }
];

const getStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'completed':
      return 'text-green-700 bg-green-100 border-green-200';
    case 'pending':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    case 'failed':
      return 'text-red-700 bg-red-100 border-red-200';
    case 'refunded':
      return 'text-gray-700 bg-gray-100 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

const getStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'failed':
      return <AlertCircle className="w-4 h-4" />;
    case 'refunded':
      return <CreditCard className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getMethodLabel = (method: PaymentMethod): string => {
  const option = paymentMethodOptions.find(opt => opt.value === method);
  return option?.label || method;
};

const getStatusLabel = (status: PaymentStatus): string => {
  const option = paymentStatusOptions.find(opt => opt.value === status);
  return option?.label || status;
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ko-KR') + '원';
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};

export default function PaymentTracker({
  invoiceId,
  payments = [],
  onAddPayment,
  onUpdatePayment,
  className = ''
}: PaymentTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    method: 'bank_transfer' as PaymentMethod,
    status: 'completed' as PaymentStatus,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleAddPayment = () => {
    const amount = parseFloat(newPayment.amount);
    
    if (!amount || amount <= 0) {
      alert('올바른 금액을 입력해주세요.');
      return;
    }

    onAddPayment({
      invoiceId,
      amount,
      method: newPayment.method,
      status: newPayment.status,
      date: new Date(newPayment.date),
      notes: newPayment.notes.trim() || undefined
    });

    // 폼 초기화
    setNewPayment({
      amount: '',
      method: 'bank_transfer',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    
    setShowAddForm(false);
  };

  const handleStatusUpdate = (paymentId: string, newStatus: PaymentStatus) => {
    onUpdatePayment(paymentId, { status: newStatus });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-txt-primary">결제 추적</h3>
          <p className="text-sm text-txt-secondary mt-1">
            결제 내역을 관리하고 상태를 추적합니다
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>결제 추가</span>
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-bg-secondary rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-txt-secondary mb-1">총 결제액</div>
            <div className="text-lg font-semibold text-txt-primary">
              {formatCurrency(totalPaid)}
            </div>
          </div>
          <div>
            <div className="text-sm text-txt-secondary mb-1">결제 건수</div>
            <div className="text-lg font-semibold text-txt-primary">
              {payments.filter(p => p.status === 'completed').length}건
            </div>
          </div>
          <div>
            <div className="text-sm text-txt-secondary mb-1">대기중</div>
            <div className="text-lg font-semibold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}건
            </div>
          </div>
          <div>
            <div className="text-sm text-txt-secondary mb-1">실패</div>
            <div className="text-lg font-semibold text-red-600">
              {payments.filter(p => p.status === 'failed').length}건
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Form */}
      {showAddForm && (
        <div className="bg-white border border-border-light rounded-lg p-6">
          <h4 className="text-lg font-medium text-txt-primary mb-4">새 결제 추가</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">
                금액 *
              </label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={newPayment.amount}
                onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="결제 금액 입력"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">
                결제 방법 *
              </label>
              <Select
                options={paymentMethodOptions}
                value={newPayment.method}
                onValueChange={(value) => setNewPayment(prev => ({ 
                  ...prev, 
                  method: value as PaymentMethod 
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">
                결제일 *
              </label>
              <Input
                type="date"
                value={newPayment.date}
                onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">
                상태 *
              </label>
              <Select
                options={paymentStatusOptions}
                value={newPayment.status}
                onValueChange={(value) => setNewPayment(prev => ({ 
                  ...prev, 
                  status: value as PaymentStatus 
                }))}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-txt-secondary mb-2">
              참고사항
            </label>
            <textarea
              className={cn(
                "w-full px-3 py-2 border border-border-medium rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-weave-primary",
                "placeholder-txt-tertiary text-txt-primary"
              )}
              rows={2}
              value={newPayment.notes}
              onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="결제와 관련된 추가 정보"
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowAddForm(false)}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleAddPayment}
            >
              추가
            </Button>
          </div>
        </div>
      )}

      {/* Payment List */}
      <div className="space-y-4">
        {payments.length === 0 ? (
          <div className="bg-white border border-border-light rounded-lg p-8 text-center">
            <CreditCard className="w-12 h-12 text-txt-disabled mx-auto mb-4" />
            <div className="text-txt-secondary text-lg mb-2">결제 내역이 없습니다</div>
            <div className="text-txt-tertiary text-sm mb-4">
              첫 번째 결제를 추가해보세요
            </div>
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="bg-white border border-border-light rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
                    getStatusColor(payment.status)
                  )}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1">{getStatusLabel(payment.status)}</span>
                  </div>
                  
                  <div>
                    <div className="text-lg font-semibold text-txt-primary">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-sm text-txt-secondary">
                      {getMethodLabel(payment.method)} • {formatDate(payment.date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {payment.status === 'pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(payment.id, 'completed')}
                        className="text-green-600 hover:text-green-700"
                      >
                        완료 처리
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(payment.id, 'failed')}
                        className="text-red-600 hover:text-red-700"
                      >
                        실패 처리
                      </Button>
                    </>
                  )}
                  
                  {payment.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusUpdate(payment.id, 'refunded')}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      환불 처리
                    </Button>
                  )}
                </div>
              </div>

              {payment.notes && (
                <div className="mt-3 pt-3 border-t border-border-light">
                  <div className="text-sm text-txt-secondary">
                    참고사항: {payment.notes}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-border-light">
                <div className="text-xs text-txt-tertiary">
                  등록일: {formatDate(payment.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}