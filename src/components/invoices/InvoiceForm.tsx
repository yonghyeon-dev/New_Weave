'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, FileText, Upload } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Invoice, InvoiceItem, InvoiceStatus } from '@/lib/types/invoice';
import { Client } from '@/lib/types/client';
import { cn } from '@/lib/utils';
import DataExtractor from '@/components/ai-assistant/DataExtractor';

interface InvoiceFormProps {
  invoice?: Invoice;
  clients: Client[];
  onSave: (invoice: Partial<Invoice>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const mockClients: Client[] = [
  {
    id: '1',
    tenantId: 'tenant-1',
    name: '㈜테크스타트',
    businessNumber: '123-45-67890',
    email: 'contact@techstart.co.kr',
    phone: '02-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    contactPerson: '김철수',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    tenantId: 'tenant-1',
    name: '디자인컴퍼니',
    businessNumber: '234-56-78901',
    email: 'hello@designco.com',
    phone: '02-2345-6789',
    address: '서울시 서초구 서초대로 456',
    contactPerson: '박영희',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    tenantId: 'tenant-1',
    name: '이커머스플러스',
    businessNumber: '345-67-89012',
    email: 'info@ecomplus.kr',
    phone: '02-3456-7890',
    address: '서울시 마포구 월드컵로 789',
    contactPerson: '이민수',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const VAT_RATE = 0.1;

export default function InvoiceForm({ 
  invoice, 
  clients = mockClients, 
  onSave, 
  onCancel, 
  isLoading = false 
}: InvoiceFormProps) {
  const [showDataExtractor, setShowDataExtractor] = useState(false);
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: '',
    tenantId: 'tenant-1',
    clientId: '',
    status: 'draft',
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
    currency: 'KRW',
    items: [{
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    }],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: ''
  });

  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.name
  }));

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        issueDate: new Date(invoice.issueDate),
        dueDate: new Date(invoice.dueDate)
      });
    }
  }, [invoice]);

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * VAT_RATE;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...(formData.items || [])];
    const item = { ...newItems[index] };
    
    if (field === 'quantity' || field === 'unitPrice') {
      (item as any)[field] = Number(value) || 0;
      item.amount = item.quantity * item.unitPrice;
    } else {
      (item as any)[field] = value;
    }
    
    newItems[index] = item;
    const totals = calculateTotals(newItems);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    };
    
    const newItems = [...(formData.items || []), newItem];
    const totals = calculateTotals(newItems);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  const removeItem = (index: number) => {
    if ((formData.items?.length || 0) <= 1) return;
    
    const newItems = formData.items?.filter((_, i) => i !== index) || [];
    const totals = calculateTotals(newItems);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({
      ...prev,
      clientId: clientId
    }));
  };

  const handleSubmit = (e: React.FormEvent, status: InvoiceStatus = 'draft') => {
    e.preventDefault();
    
    if (!formData.clientId) {
      alert('클라이언트를 선택해주세요.');
      return;
    }
    
    if (!formData.items || formData.items.length === 0) {
      alert('최소 하나의 항목을 추가해주세요.');
      return;
    }
    
    const hasEmptyItems = formData.items.some(item => 
      !item.description.trim() || item.quantity <= 0 || item.unitPrice <= 0
    );
    
    if (hasEmptyItems) {
      alert('모든 항목의 정보를 입력해주세요.');
      return;
    }

    const invoiceData = {
      ...formData,
      status,
      invoiceNumber: formData.invoiceNumber || `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      createdAt: invoice?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(invoiceData);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('ko-KR');
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleExtractedData = (data: any) => {
    // 추출된 데이터를 폼에 자동 입력
    if (data.invoiceNumber) {
      setFormData(prev => ({ ...prev, invoiceNumber: data.invoiceNumber }));
    }
    
    if (data.items && Array.isArray(data.items)) {
      const extractedItems = data.items.map((item: any, index: number) => ({
        id: Date.now().toString() + index,
        description: item.description || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        amount: (item.quantity || 1) * (item.unitPrice || 0)
      }));
      
      const totals = calculateTotals(extractedItems);
      setFormData(prev => ({
        ...prev,
        items: extractedItems,
        ...totals
      }));
    }
    
    if (data.clientName) {
      // 클라이언트 이름으로 매칭
      const matchedClient = clients.find(c => 
        c.name.toLowerCase().includes(data.clientName.toLowerCase())
      );
      if (matchedClient) {
        setFormData(prev => ({ ...prev, clientId: matchedClient.id }));
      }
    }
    
    setShowDataExtractor(false);
  };

  return (
    <div className="bg-white rounded-lg border border-border-light overflow-hidden">
      <div className="px-6 py-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-txt-primary">
            {invoice ? '인보이스 수정' : '새 인보이스 생성'}
          </h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowDataExtractor(true)}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            AI로 데이터 추출
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, 'draft')} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-2">
              인보이스 번호
            </label>
            <Input
              value={formData.invoiceNumber || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              placeholder="자동 생성됩니다"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-2">
              클라이언트 *
            </label>
            <Select
              options={clientOptions}
              value={formData.clientId || ''}
              onValueChange={handleClientChange}
              placeholder="클라이언트 선택"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-2">
              발행일 *
            </label>
            <Input
              type="date"
              value={formatDate(formData.issueDate || new Date())}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                issueDate: new Date(e.target.value) 
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-2">
              만료일 *
            </label>
            <Input
              type="date"
              value={formatDate(formData.dueDate || new Date())}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                dueDate: new Date(e.target.value) 
              }))}
            />
          </div>
        </div>

        {/* Items Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-txt-primary">항목</h3>
            <Button 
              type="button"
              variant="secondary"
              onClick={addItem}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>항목 추가</span>
            </Button>
          </div>

          <div className="space-y-4">
            {formData.items?.map((item, index) => (
              <div key={item.id} className="border border-border-light rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-txt-secondary mb-2">
                      설명 *
                    </label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="서비스 또는 제품 설명"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-txt-secondary mb-2">
                      수량 *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-txt-secondary mb-2">
                      단가 *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-txt-secondary mb-2">
                      합계
                    </label>
                    <div className="h-10 flex items-center text-lg font-semibold text-txt-primary">
                      {formatCurrency(item.amount)}원
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                      disabled={(formData.items?.length || 0) <= 1}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-bg-secondary rounded-lg p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-txt-secondary">소계</span>
              <span className="text-lg font-semibold text-txt-primary">
                {formatCurrency(formData.subtotal || 0)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-txt-secondary">부가세 (10%)</span>
              <span className="text-lg font-semibold text-txt-primary">
                {formatCurrency(formData.tax || 0)}원
              </span>
            </div>
            <div className="border-t border-border-light pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-txt-primary">총액</span>
                <span className="text-2xl font-bold text-weave-primary">
                  {formatCurrency(formData.total || 0)}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-txt-secondary mb-2">
            참고사항
          </label>
          <textarea
            className={cn(
              "w-full px-3 py-2 border border-border-medium rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-weave-primary",
              "placeholder-txt-tertiary text-txt-primary"
            )}
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="추가 정보나 특별 조건을 입력하세요"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-border-light">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </Button>

          <div className="flex items-center space-x-3">
            <Button 
              type="submit"
              variant="secondary"
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : '임시저장'}
            </Button>
            
            <Button 
              type="button"
              variant="primary"
              onClick={(e) => handleSubmit(e, 'issued')}
              disabled={isLoading}
            >
              {isLoading ? '발행 중...' : '발행하기'}
            </Button>
          </div>
        </div>
      </form>

      {/* Data Extractor Modal */}
      {showDataExtractor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-txt-primary">
                AI 데이터 추출
              </h3>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDataExtractor(false)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <DataExtractor
              onExtract={handleExtractedData}
              extractType="invoice"
            />
          </div>
        </div>
      )}
    </div>
  );
}