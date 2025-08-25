'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { Invoice } from '@/lib/types/invoice';

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (invoiceData: Partial<Invoice>) => {
    setIsLoading(true);
    
    try {
      // 실제 구현 시 API 호출
      console.log('Creating invoice:', invoiceData);
      
      // 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 성공 시 인보이스 목록으로 리다이렉트
      router.push('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('인보이스 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="flex items-center space-x-2 mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>돌아가기</span>
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-txt-primary">새 인보이스 생성</h1>
            <p className="text-txt-secondary mt-1">
              클라이언트에게 발행할 새로운 인보이스를 생성합니다
            </p>
          </div>
        </div>

        {/* Form */}
        <InvoiceForm
          clients={[]} // 실제 구현 시 API에서 가져올 클라이언트 목록
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}