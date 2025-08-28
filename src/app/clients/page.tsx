'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building, 
  Edit, 
  Trash2,
  FileText
} from 'lucide-react';

// 목업 클라이언트 데이터
interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  totalProjects: number;
  totalRevenue: number;
  status: 'active' | 'inactive';
  lastContact: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: '김철수',
    company: '㈜테크스타트',
    email: 'kim@techstart.co.kr',
    phone: '010-1234-5678',
    totalProjects: 3,
    totalRevenue: 15000000,
    status: 'active',
    lastContact: '2024-08-20'
  },
  {
    id: '2',
    name: '이영희',
    company: '디자인컴퍼니',
    email: 'lee@designco.com',
    phone: '010-9876-5432',
    totalProjects: 2,
    totalRevenue: 8500000,
    status: 'active',
    lastContact: '2024-08-18'
  },
  {
    id: '3',
    name: '박민수',
    company: '이커머스플러스',
    email: 'park@ecommerceplus.kr',
    phone: '010-5555-7777',
    totalProjects: 1,
    totalRevenue: 12000000,
    status: 'inactive',
    lastContact: '2024-07-15'
  }
];

export default function ClientsPage() {
  const [clients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 
      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">활성</span> :
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">비활성</span>;
  };

  return (
    <AppLayout>
      <div className="bg-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 - 모바일 가로 배치 최적화 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 sm:p-3 bg-weave-primary-light rounded-lg flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-weave-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <Typography variant="h2" className="text-xl sm:text-2xl mb-0 sm:mb-1 text-txt-primary leading-tight">클라이언트 관리</Typography>
                  <Typography variant="body1" className="text-sm sm:text-base text-txt-secondary leading-tight hidden sm:block">
                    고객 정보를 관리하고 프로젝트 현황을 확인하세요
                  </Typography>
                </div>
              </div>
              <Button variant="primary" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 flex-shrink-0">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">새 클라이언트</span>
              </Button>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-txt-tertiary w-4 h-4" />
                <Input
                  placeholder="클라이언트명, 회사명, 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 클라이언트 목록 */}
            <div className="lg:col-span-2">
              <Card className="p-0">
                <div className="p-6 border-b border-border-light">
                  <Typography variant="h3">클라이언트 목록 ({filteredClients.length})</Typography>
                </div>
                <div className="divide-y divide-border-light">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className={`p-6 hover:bg-bg-secondary cursor-pointer transition-colors ${
                        selectedClient?.id === client.id ? 'bg-weave-primary-light/20' : ''
                      }`}
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-weave-primary-light rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-weave-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Typography variant="h4">{client.name}</Typography>
                              {getStatusBadge(client.status)}
                            </div>
                            <div className="space-y-1 text-sm text-txt-secondary">
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                {client.company}
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {client.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {client.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Typography variant="h4" className="text-weave-primary">
                            {(client.totalRevenue / 10000).toLocaleString()}만원
                          </Typography>
                          <Typography variant="body2" className="text-txt-tertiary">
                            프로젝트 {client.totalProjects}건
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 클라이언트 상세 */}
            <div className="lg:col-span-1">
              {selectedClient ? (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3">클라이언트 상세</Typography>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-border-light">
                      <div className="w-20 h-20 bg-weave-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-10 h-10 text-weave-primary" />
                      </div>
                      <Typography variant="h3">{selectedClient.name}</Typography>
                      <Typography variant="body1" className="text-txt-secondary">{selectedClient.company}</Typography>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Typography variant="body2" className="text-txt-tertiary">이메일</Typography>
                        <Typography variant="body1">{selectedClient.email}</Typography>
                      </div>
                      <div>
                        <Typography variant="body2" className="text-txt-tertiary">전화번호</Typography>
                        <Typography variant="body1">{selectedClient.phone}</Typography>
                      </div>
                      <div>
                        <Typography variant="body2" className="text-txt-tertiary">상태</Typography>
                        {getStatusBadge(selectedClient.status)}
                      </div>
                      <div>
                        <Typography variant="body2" className="text-txt-tertiary">마지막 연락</Typography>
                        <Typography variant="body1">{selectedClient.lastContact}</Typography>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border-light">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <Typography variant="h3" className="text-weave-primary">
                            {selectedClient.totalProjects}
                          </Typography>
                          <Typography variant="body2" className="text-txt-tertiary">총 프로젝트</Typography>
                        </div>
                        <div className="text-center">
                          <Typography variant="h3" className="text-weave-primary">
                            {(selectedClient.totalRevenue / 10000).toLocaleString()}만원
                          </Typography>
                          <Typography variant="body2" className="text-txt-tertiary">총 매출</Typography>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        프로젝트 목록 보기
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center">
                  <Users className="w-16 h-16 text-txt-tertiary mx-auto mb-4" />
                  <Typography variant="h4" className="mb-2">클라이언트를 선택해주세요</Typography>
                  <Typography variant="body1" className="text-txt-secondary">
                    좌측 목록에서 클라이언트를 클릭하면 상세 정보를 확인할 수 있습니다
                  </Typography>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}