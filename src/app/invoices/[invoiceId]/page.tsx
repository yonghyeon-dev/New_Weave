'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Download, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { Invoice, InvoiceStatus } from '@/lib/types/invoice';
import { cn } from '@/lib/utils';

const mockClient = {
  id: '1',
  name: '㈜테크스타트',
  businessNumber: '123-45-67890',
  email: 'contact@techstart.co.kr',
  phone: '02-1234-5678'
};

const mockInvoice: Invoice = {
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
      description: '웹사이트 리뉴얼 프로젝트',
      quantity: 1,
      unitPrice: 3200000,
      amount: 3200000
    },
    {
      id: '2', 
      description: 'SEO 최적화 작업',
      quantity: 1,
      unitPrice: 300000,
      amount: 300000
    }
  ],
  subtotal: 3500000,
  tax: 350000,
  total: 3850000,
  currency: 'KRW',
  notes: '프로젝트 완료 후 30일 내 결제 부탁드립니다.\n추가 수정 사항이 있으시면 별도 협의 바랍니다.',
  createdAt: new Date('2024-08-15'),
  updatedAt: new Date('2024-08-15')
};

interface InvoiceDetailPageProps {
  params: {
    invoiceId: string;
  };
}

const getStatusColor = (status: InvoiceStatus): string => {
  switch (status) {
    case 'draft':
      return 'text-gray-600 bg-gray-100 border-gray-200';
    case 'issued':
      return 'text-blue-700 bg-blue-100 border-blue-200';
    case 'overdue':
      return 'text-red-700 bg-red-100 border-red-200';
    case 'paid':
      return 'text-green-700 bg-green-100 border-green-200';
    case 'cancelled':
      return 'text-gray-500 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
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

const getStatusIcon = (status: InvoiceStatus) => {
  switch (status) {
    case 'paid':
      return <CheckCircle className="w-4 h-4" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    case 'overdue':
      return <Clock className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ko-KR') + '원';
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 구현 시 API에서 인보이스 데이터를 가져옴
    const fetchInvoice = async () => {
      try {
        // 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));
        setInvoice(mockInvoice);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [params.invoiceId]);

  const handleMarkAsPaid = async () => {
    if (!invoice || invoice.status === 'paid') return;

    try {
      setIsLoading(true);
      // 실제 구현 시 API 호출
      console.log('Marking invoice as paid:', invoice.id);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoice(prev => prev ? {
        ...prev,
        status: 'paid',
        paidDate: new Date(),
        updatedAt: new Date()
      } : null);

      alert('인보이스가 결제완료로 처리되었습니다.');
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvoice = () => {
    if (!invoice) return;
    console.log('Sending invoice via email:', invoice.id);
    alert('인보이스가 클라이언트에게 이메일로 발송되었습니다.');
  };

  const handleDownloadPDF = () => {
    if (!invoice) return;
    console.log('Downloading PDF for invoice:', invoice.id);
    alert('PDF 다운로드 기능이 준비 중입니다.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-border-light p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-bg-primary p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-border-light p-8 text-center">
            <h2 className="text-xl font-semibold text-txt-primary mb-2">
              인보이스를 찾을 수 없습니다
            </h2>
            <p className="text-txt-secondary mb-4">
              요청하신 인보이스가 존재하지 않습니다.
            </p>
            <Button onClick={() => router.push('/invoices')}>
              인보이스 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center space-x-2 mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>돌아가기</span>
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-txt-primary">
                {invoice.invoiceNumber}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
                  getStatusColor(invoice.status)
                )}>
                  {getStatusIcon(invoice.status)}
                  <span className="ml-1">{getStatusLabel(invoice.status)}</span>
                </span>
                <span className="text-txt-secondary text-sm">
                  {formatDate(invoice.issueDate)} 발행
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {invoice.status === 'draft' && (
              <Button 
                variant="secondary"
                onClick={() => router.push(`/invoices/${params.invoiceId}/edit`)}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>편집</span>
              </Button>
            )}
            
            {(invoice.status === 'issued' || invoice.status === 'overdue') && (
              <Button 
                variant="primary"
                onClick={handleMarkAsPaid}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>결제완료 처리</span>
              </Button>
            )}

            <Button 
              variant="secondary"
              onClick={handleSendInvoice}
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>이메일 발송</span>
            </Button>

            <Button 
              variant="secondary"
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>PDF 다운로드</span>
            </Button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="bg-white rounded-lg border border-border-light overflow-hidden">
          {/* Invoice Header */}
          <div className="p-8 border-b border-border-light">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Client Info */}
              <div>
                <h3 className="text-lg font-semibold text-txt-primary mb-4">청구 대상</h3>
                <div className="space-y-2">
                  <div className="text-lg font-medium text-txt-primary">
                    {mockClient.name}
                  </div>
                  <div className="text-txt-secondary">
                    사업자번호: {mockClient.businessNumber}
                  </div>
                  <div className="text-txt-secondary">
                    이메일: {mockClient.email}
                  </div>
                  <div className="text-txt-secondary">
                    전화: {mockClient.phone}
                  </div>
                </div>
              </div>

              {/* Invoice Info */}
              <div>
                <h3 className="text-lg font-semibold text-txt-primary mb-4">인보이스 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-txt-secondary">발행일:</span>
                    <span className="text-txt-primary font-medium">
                      {formatDateShort(invoice.issueDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-txt-secondary">만료일:</span>
                    <span className="text-txt-primary font-medium">
                      {formatDateShort(invoice.dueDate)}
                    </span>
                  </div>
                  {invoice.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-txt-secondary">결제일:</span>
                      <span className="text-green-600 font-medium">
                        {formatDateShort(invoice.paidDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-txt-primary mb-4">항목</h3>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head className="w-1/2">설명</Table.Head>
                  <Table.Head className="text-center">수량</Table.Head>
                  <Table.Head className="text-right">단가</Table.Head>
                  <Table.Head className="text-right">합계</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {invoice.items.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="font-medium">
                      {item.description}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {item.quantity}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      {formatCurrency(item.unitPrice)}
                    </Table.Cell>
                    <Table.Cell className="text-right font-medium">
                      {formatCurrency(item.amount)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          {/* Totals */}
          <div className="px-8 pb-8">
            <div className="bg-bg-secondary rounded-lg p-6 max-w-md ml-auto">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-txt-secondary">소계</span>
                  <span className="text-lg font-semibold text-txt-primary">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-txt-secondary">부가세 (10%)</span>
                  <span className="text-lg font-semibold text-txt-primary">
                    {formatCurrency(invoice.tax)}
                  </span>
                </div>
                <div className="border-t border-border-light pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-txt-primary">총액</span>
                    <span className="text-2xl font-bold text-weave-primary">
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="px-8 pb-8">
              <h3 className="text-lg font-semibold text-txt-primary mb-4">참고사항</h3>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-txt-secondary whitespace-pre-line">
                  {invoice.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}