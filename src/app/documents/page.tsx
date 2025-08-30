'use client';

import React from 'react';
import { DataPageContainer } from '@/components/layout/PageContainer';
import { Typography, Card, Button } from '@/components/ui';
import { FileText, Upload, Download, Search } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <DataPageContainer>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-weave-primary-light rounded-lg">
          <FileText className="w-6 h-6 text-weave-primary" />
        </div>
        <div>
          <Typography variant="h2" className="text-2xl mb-1 text-txt-primary">
            문서 관리
          </Typography>
          <Typography variant="body1" className="text-txt-secondary">
            프로젝트 문서를 관리하고 템플릿을 생성합니다
          </Typography>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Button variant="primary" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              문서 업로드
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              템플릿 다운로드
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-txt-tertiary" />
            <input 
              type="text"
              placeholder="문서 검색..."
              className="px-3 py-1.5 bg-bg-secondary rounded-lg border border-border-light"
            />
          </div>
        </div>

        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-txt-tertiary mx-auto mb-4" />
          <Typography variant="h3" className="text-txt-secondary mb-2">
            문서가 없습니다
          </Typography>
          <Typography variant="body2" className="text-txt-tertiary">
            새 문서를 업로드하거나 템플릿을 생성하세요
          </Typography>
        </div>
      </Card>
    </DataPageContainer>
  );
}