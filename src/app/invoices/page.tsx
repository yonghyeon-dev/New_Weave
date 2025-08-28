'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Select from '@/components/ui/Select';
import Typography from '@/components/ui/Typography';
import { Invoice, InvoiceStatus } from '@/lib/types/invoice';
import { cn } from '@/lib/utils';

// Mock client data
const mockClients: Record<string, any> = {
  'client-1': {
    id: 'client-1',
    name: '㈜테크스타트',
    businessNumber: '123-45-67890',
    email: 'contact@techstart.co.kr',
    phone: '02-1234-5678'
  },
  'client-2': {
    id: 'client-2',
    name: '디자인컴퍼니',
    businessNumber: '234-56-78901',
    email: 'hello@designco.com',
    phone: '02-2345-6789'
  },
  'client-3': {
    id: 'client-3',
    name: '이커머스플러스',
    businessNumber: '345-67-89012',
    email: 'info@ecomplus.kr',
    phone: '02-3456-7890'
  }
};

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    tenantId: 'tenant-1',
    clientId: 'client-1',
    status: 'issued',
    issueDate: new Date('2024-08-15'),
    dueDate: new Date('2024-09-15'),
    items: [
      {
        id: '1',
        description: '웹사이트 리뉴얼',
        quantity: 1,
        unitPrice: 3500000,
        amount: 3500000
      }
    ],
    subtotal: 3500000,
    tax: 350000,
    total: 3850000,
    currency: 'KRW',
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-15')
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    tenantId: 'tenant-1',
    clientId: 'client-2',
    status: 'overdue',
    issueDate: new Date('2024-07-10'),
    dueDate: new Date('2024-08-10'),
    items: [
      {
        id: '2',
        description: '브랜드 아이덴티티 디자인',
        quantity: 1,
        unitPrice: 2800000,
        amount: 2800000
      }
    ],
    subtotal: 2800000,
    tax: 280000,
    total: 3080000,
    currency: 'KRW',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-10')
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    tenantId: 'tenant-1',
    clientId: 'client-3',
    status: 'paid',
    issueDate: new Date('2024-08-01'),
    dueDate: new Date('2024-09-01'),
    paidDate: new Date('2024-08-25'),
    items: [
      {
        id: '3',
        description: '쇼핑몰 구축',
        quantity: 1,
        unitPrice: 5500000,
        amount: 5500000
      }
    ],
    subtotal: 5500000,
    tax: 550000,
    total: 6050000,
    currency: 'KRW',
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-08-25')
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    tenantId: 'tenant-1',
    clientId: 'client-1',
    status: 'draft',
    issueDate: new Date('2024-08-25'),
    dueDate: new Date('2024-09-25'),
    items: [
      {
        id: '4',
        description: '모바일 앱 개발 1차',
        quantity: 1,
        unitPrice: 4200000,
        amount: 4200000
      }
    ],
    subtotal: 4200000,
    tax: 420000,
    total: 4620000,
    currency: 'KRW',
    createdAt: new Date('2024-08-25'),
    updatedAt: new Date('2024-08-25')
  }
];

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 'draft', label: '임시저장' },
  { value: 'issued', label: '발행됨' },
  { value: 'overdue', label: '연체' },
  { value: 'paid', label: '결제완료' },
  { value: 'cancelled', label: '취소됨' }
];

const getStatusColor = (status: InvoiceStatus): string => {
  switch (status) {
    case 'draft':
      return 'text-txt-tertiary border border-border-light/50';
    case 'issued':
      return 'text-weave-primary border border-blue-200/50';
    case 'overdue':
      return 'text-red-600 border border-red-200/50';
    case 'paid':
      return 'text-green-600 border border-green-200/50';
    case 'cancelled':
      return 'text-txt-tertiary border border-border-light/30';
    default:
      return 'text-txt-tertiary border border-border-light/50';
  }
};

const getStatusLabel = (status: InvoiceStatus): string => {
  switch (status) {
    case 'draft':
      return '임시저장';
    case 'issued':
      return '발행됨';
    case 'overdue':
      return '연체';
    case 'paid':
      return '결제완료';
    case 'cancelled':
      return '취소됨';
    default:
      return status;
  }
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ko-KR') + '원';
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredInvoices = selectedStatus === 'all' 
    ? invoices 
    : invoices.filter(invoice => invoice.status === selectedStatus);

  const getClientInfo = (clientId: string) => {
    return mockClients[clientId] || { name: 'Unknown Client', businessNumber: '' };
  };

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - 모바일 가로 배치 최적화 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 sm:p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-weave-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <Typography variant="h2" className="text-xl sm:text-2xl mb-0 sm:mb-1 text-txt-primary leading-tight">인보이스 관리</Typography>
              <Typography variant="body1" className="text-sm sm:text-base text-txt-secondary leading-tight hidden sm:block">
                발행된 인보이스를 관리하고 결제 상태를 추적하세요
              </Typography>
            </div>
          </div>
          <Button 
            variant="primary" 
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 flex-shrink-0"
            onClick={() => console.log('Navigate to invoice creation')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">새 인보이스</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-border-light p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-txt-secondary mb-2">
                상태 필터
              </label>
              <Select
                options={statusOptions}
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                placeholder="상태 선택"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-txt-tertiary">
                총 {filteredInvoices.length}건의 인보이스
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-lg border border-border-light overflow-hidden">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>인보이스 번호</Table.Head>
                <Table.Head>클라이언트</Table.Head>
                <Table.Head>발행일</Table.Head>
                <Table.Head>만료일</Table.Head>
                <Table.Head>금액</Table.Head>
                <Table.Head>상태</Table.Head>
                <Table.Head>액션</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredInvoices.map((invoice) => {
                const client = getClientInfo(invoice.clientId);
                return (
                  <Table.Row key={invoice.id}>
                    <Table.Cell>
                      <div className="font-medium text-txt-primary">
                        {invoice.invoiceNumber}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <div className="font-medium text-txt-primary">
                          {client.name}
                        </div>
                        <div className="text-sm text-txt-tertiary">
                          {client.businessNumber}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-txt-secondary">
                      {formatDate(invoice.issueDate)}
                    </Table.Cell>
                    <Table.Cell className="text-txt-secondary">
                      {formatDate(invoice.dueDate)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="font-medium text-txt-primary">
                        {formatCurrency(invoice.total)}
                      </div>
                      {invoice.tax > 0 && (
                        <div className="text-xs text-txt-tertiary">
                          VAT 포함
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/50 backdrop-blur-sm",
                        getStatusColor(invoice.status)
                      )}>
                        {getStatusLabel(invoice.status)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log('View invoice', invoice.id)}
                        >
                          보기
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log('Edit invoice', invoice.id)}
                          >
                            수정
                          </Button>
                        )}
                        {(invoice.status === 'issued' || invoice.status === 'overdue') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log('Mark as paid', invoice.id)}
                          >
                            결제완료
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-txt-tertiary text-lg mb-2">
                조건에 맞는 인보이스가 없습니다
              </div>
              <div className="text-txt-tertiary text-sm">
                새로운 인보이스를 생성하거나 필터를 변경해보세요
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg border border-border-light p-6">
            <Typography variant="body2" className="font-medium text-txt-secondary mb-1">
              총 발행 금액
            </Typography>
            <Typography variant="h3" className="text-2xl">
              {formatCurrency(invoices.reduce((sum, inv) => sum + inv.total, 0))}
            </Typography>
          </div>
          
          <div className="bg-white rounded-lg border border-border-light p-6">
            <Typography variant="body2" className="font-medium text-txt-secondary mb-1">
              결제 완료
            </Typography>
            <Typography variant="h3" className="text-2xl text-green-600">
              {formatCurrency(invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0))}
            </Typography>
          </div>
          
          <div className="bg-white rounded-lg border border-border-light p-6">
            <Typography variant="body2" className="font-medium text-txt-secondary mb-1">
              미수금
            </Typography>
            <Typography variant="h3" className="text-2xl text-orange-600">
              {formatCurrency(invoices.filter(inv => inv.status === 'issued' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0))}
            </Typography>
          </div>
          
          <div className="bg-white rounded-lg border border-border-light p-6">
            <Typography variant="body2" className="font-medium text-txt-secondary mb-1">
              연체 금액
            </Typography>
            <Typography variant="h3" className="text-2xl text-red-600">
              {formatCurrency(invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0))}
            </Typography>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}