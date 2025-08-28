'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Search, 
  Plus, 
  Building2, 
  User,
  Phone,
  Mail,
  MapPin,
  Check
} from 'lucide-react';
import { Client } from '@/types/document-workflow';

interface ClientSelectorProps {
  onSelectClient: (client: Client) => void;
  selectedClient?: Client | null;
}

// 샘플 클라이언트 데이터 (실제로는 API에서 가져와야 함)
const SAMPLE_CLIENTS: Client[] = [
  {
    id: '1',
    name: '테크스타트',
    companyName: '주식회사 테크스타트',
    contactPerson: '김철수',
    phone: '010-1234-5678',
    email: 'kim@techstart.co.kr',
    address: '서울시 강남구 테헤란로 123',
    businessNumber: '123-45-67890',
    industry: 'it'
  },
  {
    id: '2',
    name: '디자인랩',
    companyName: '디자인랩 스튜디오',
    contactPerson: '이영희',
    phone: '010-2345-6789',
    email: 'lee@designlab.co.kr',
    address: '서울시 마포구 와우산로 456',
    businessNumber: '234-56-78901',
    industry: 'design'
  },
  {
    id: '3',
    name: '컨설팅파트너스',
    companyName: '컨설팅파트너스 그룹',
    contactPerson: '박민수',
    phone: '010-3456-7890',
    email: 'park@consulting.co.kr',
    address: '서울시 중구 을지로 789',
    businessNumber: '345-67-89012',
    industry: 'consulting'
  }
];

export default function ClientSelector({ 
  onSelectClient,
  selectedClient
}: ClientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [clients] = useState<Client[]>(SAMPLE_CLIENTS);

  // 검색 필터링
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    onSelectClient(client);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white rounded-lg border border-border-light p-6">
        <div className="mb-6">
          <Typography variant="h3" className="text-lg font-semibold text-txt-primary mb-2">
            클라이언트 선택
          </Typography>
          <Typography variant="body2" className="text-txt-secondary">
            문서를 작성할 클라이언트를 선택하거나 새로 추가하세요
          </Typography>
        </div>

        {/* 검색 및 추가 버튼 */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="클라이언트 검색 (회사명, 담당자명)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-txt-tertiary" />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowNewClient(!showNewClient)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            새 클라이언트
          </Button>
        </div>

        {/* 클라이언트 목록 */}
        <div className="space-y-3">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className={`border ${
                selectedClient?.id === client.id 
                  ? 'border-weave-primary bg-blue-50' 
                  : 'border-border-light bg-white hover:shadow-md'
              } transition-all cursor-pointer`}
              onClick={() => handleSelectClient(client)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-bg-secondary rounded-lg">
                      <Building2 className="w-5 h-5 text-txt-primary" />
                    </div>
                    <div>
                      <Typography variant="body1" className="font-semibold text-txt-primary mb-1">
                        {client.companyName}
                      </Typography>
                      <Typography variant="body2" className="text-txt-secondary">
                        {client.name}
                      </Typography>
                    </div>
                  </div>
                  {selectedClient?.id === client.id && (
                    <div className="p-1 bg-weave-primary rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-11">
                  {client.contactPerson && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-txt-tertiary" />
                      <Typography variant="body2" className="text-txt-tertiary">
                        {client.contactPerson}
                      </Typography>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-txt-tertiary" />
                      <Typography variant="body2" className="text-txt-tertiary">
                        {client.phone}
                      </Typography>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-txt-tertiary" />
                      <Typography variant="body2" className="text-txt-tertiary">
                        {client.email}
                      </Typography>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-txt-tertiary" />
                      <Typography variant="body2" className="text-txt-tertiary">
                        {client.address}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-txt-tertiary" />
            </div>
            <Typography variant="body1" className="text-txt-tertiary mb-2">
              검색 결과가 없습니다
            </Typography>
            <Typography variant="body2" className="text-txt-tertiary">
              새 클라이언트를 추가해주세요
            </Typography>
          </div>
        )}
      </Card>

      {/* 새 클라이언트 추가 폼 (추후 구현) */}
      {showNewClient && (
        <Card className="bg-white rounded-lg border border-border-light p-6">
          <Typography variant="h4" className="text-lg font-semibold text-txt-primary mb-4">
            새 클라이언트 추가
          </Typography>
          <Typography variant="body2" className="text-txt-tertiary">
            (추후 구현 예정)
          </Typography>
        </Card>
      )}
    </div>
  );
}