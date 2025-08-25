'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Typography from '@/components/ui/Typography';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard,
  Database,
  Mail,
  Phone,
  MapPin,
  Building,
  Save
} from 'lucide-react';

interface UserSettings {
  // 개인 정보
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  businessNumber: string;
  
  // 알림 설정
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderNotifications: boolean;
  
  // 시스템 설정
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  
  // 보안 설정
  twoFactorEnabled: boolean;
  sessionTimeout: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<UserSettings>({
    // 개인 정보
    name: '김철수',
    email: 'kim@example.com',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    company: '㈜개인사업자',
    businessNumber: '123-45-67890',
    
    // 알림 설정
    emailNotifications: true,
    pushNotifications: true,
    reminderNotifications: true,
    
    // 시스템 설정
    language: 'ko',
    timezone: 'Asia/Seoul',
    dateFormat: 'YYYY-MM-DD',
    currency: 'KRW',
    
    // 보안 설정
    twoFactorEnabled: false,
    sessionTimeout: '1h'
  });

  const tabs = [
    { id: 'profile', icon: User, label: '개인정보', description: '기본 정보 및 프로필 설정' },
    { id: 'notifications', icon: Bell, label: '알림', description: '알림 및 리마인더 설정' },
    { id: 'system', icon: Settings, label: '시스템', description: '언어, 시간대, 통화 설정' },
    { id: 'security', icon: Shield, label: '보안', description: '보안 및 개인정보 보호' },
    { id: 'billing', icon: CreditCard, label: '결제', description: '구독 및 결제 관리' }
  ];

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // 설정 저장 로직
    console.log('Settings saved:', settings);
    alert('설정이 저장되었습니다.');
  };

  const renderProfileTab = () => (
    <Card className="p-6">
      <Typography variant="h3" className="mb-6">개인정보 설정</Typography>
      
      <div className="space-y-6">
        {/* 기본 정보 */}
        <div>
          <Typography variant="h4" className="mb-4">기본 정보</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="body2" className="mb-2">이름 *</Typography>
              <Input
                value={settings.name}
                onChange={(e) => handleSettingChange('name', e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <Typography variant="body2" className="mb-2">이메일 *</Typography>
              <Input
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
                placeholder="이메일을 입력하세요"
                type="email"
              />
            </div>
            <div>
              <Typography variant="body2" className="mb-2">전화번호</Typography>
              <Input
                value={settings.phone}
                onChange={(e) => handleSettingChange('phone', e.target.value)}
                placeholder="전화번호를 입력하세요"
              />
            </div>
            <div>
              <Typography variant="body2" className="mb-2">주소</Typography>
              <Input
                value={settings.address}
                onChange={(e) => handleSettingChange('address', e.target.value)}
                placeholder="주소를 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="pt-6 border-t border-border-light">
          <Typography variant="h4" className="mb-4">사업자 정보</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="body2" className="mb-2">회사명/상호</Typography>
              <Input
                value={settings.company}
                onChange={(e) => handleSettingChange('company', e.target.value)}
                placeholder="회사명을 입력하세요"
              />
            </div>
            <div>
              <Typography variant="body2" className="mb-2">사업자등록번호</Typography>
              <Input
                value={settings.businessNumber}
                onChange={(e) => handleSettingChange('businessNumber', e.target.value)}
                placeholder="000-00-00000"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderNotificationsTab = () => (
    <Card className="p-6">
      <Typography variant="h3" className="mb-6">알림 설정</Typography>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body1" className="font-medium">이메일 알림</Typography>
              <Typography variant="body2" className="text-txt-secondary">
                인보이스, 결제, 프로젝트 관련 이메일 알림
              </Typography>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-weave-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body1" className="font-medium">푸시 알림</Typography>
              <Typography variant="body2" className="text-txt-secondary">
                브라우저 푸시 알림 및 모바일 알림
              </Typography>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-weave-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body1" className="font-medium">리마인더 알림</Typography>
              <Typography variant="body2" className="text-txt-secondary">
                결제 일정, 프로젝트 마감일 리마인더
              </Typography>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.reminderNotifications}
                onChange={(e) => handleSettingChange('reminderNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-weave-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderSystemTab = () => (
    <Card className="p-6">
      <Typography variant="h3" className="mb-6">시스템 설정</Typography>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Typography variant="body2" className="mb-2">언어</Typography>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSettingChange('language', value)}
              options={[
                { value: 'ko', label: '한국어' },
                { value: 'en', label: 'English' },
                { value: 'ja', label: '日本語' }
              ]}
            />
          </div>
          
          <div>
            <Typography variant="body2" className="mb-2">시간대</Typography>
            <Select
              value={settings.timezone}
              onValueChange={(value) => handleSettingChange('timezone', value)}
              options={[
                { value: 'Asia/Seoul', label: '서울 (UTC+9)' },
                { value: 'America/New_York', label: '뉴욕 (UTC-5)' },
                { value: 'Europe/London', label: '런던 (UTC+0)' }
              ]}
            />
          </div>

          <div>
            <Typography variant="body2" className="mb-2">날짜 형식</Typography>
            <Select
              value={settings.dateFormat}
              onValueChange={(value) => handleSettingChange('dateFormat', value)}
              options={[
                { value: 'YYYY-MM-DD', label: '2024-08-25' },
                { value: 'MM/DD/YYYY', label: '08/25/2024' },
                { value: 'DD/MM/YYYY', label: '25/08/2024' }
              ]}
            />
          </div>

          <div>
            <Typography variant="body2" className="mb-2">통화</Typography>
            <Select
              value={settings.currency}
              onValueChange={(value) => handleSettingChange('currency', value)}
              options={[
                { value: 'KRW', label: '원 (₩)' },
                { value: 'USD', label: '달러 ($)' },
                { value: 'EUR', label: '유로 (€)' }
              ]}
            />
          </div>
        </div>
      </div>
    </Card>
  );

  const renderSecurityTab = () => (
    <Card className="p-6">
      <Typography variant="h3" className="mb-6">보안 설정</Typography>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body1" className="font-medium">2단계 인증</Typography>
              <Typography variant="body2" className="text-txt-secondary">
                계정 보안을 위한 추가 인증 단계
              </Typography>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-weave-primary"></div>
            </label>
          </div>

          <div>
            <Typography variant="body2" className="mb-2">세션 타임아웃</Typography>
            <Select
              value={settings.sessionTimeout}
              onValueChange={(value) => handleSettingChange('sessionTimeout', value)}
              options={[
                { value: '30m', label: '30분' },
                { value: '1h', label: '1시간' },
                { value: '4h', label: '4시간' },
                { value: '1d', label: '1일' }
              ]}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border-light">
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              비밀번호 변경
            </Button>
            <Button variant="outline" className="w-full">
              로그인 기록 확인
            </Button>
            <Button variant="destructive" className="w-full">
              계정 삭제
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderBillingTab = () => (
    <Card className="p-6">
      <Typography variant="h3" className="mb-6">결제 및 구독</Typography>
      
      <div className="space-y-6">
        {/* 현재 플랜 */}
        <div className="p-4 bg-weave-primary-light/20 border border-weave-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4">프로 플랜</Typography>
              <Typography variant="body2" className="text-txt-secondary">
                월 29,900원 • 다음 결제일: 2024-09-25
              </Typography>
            </div>
            <Button variant="outline">플랜 변경</Button>
          </div>
        </div>

        {/* 사용량 */}
        <div>
          <Typography variant="h4" className="mb-3">이번 달 사용량</Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-bg-secondary rounded-lg">
              <Typography variant="body2" className="text-txt-tertiary">AI 쿼리</Typography>
              <Typography variant="h3">1,247 / 5,000</Typography>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-weave-primary h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-bg-secondary rounded-lg">
              <Typography variant="body2" className="text-txt-tertiary">문서 생성</Typography>
              <Typography variant="h3">47 / 200</Typography>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-weave-primary h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-bg-secondary rounded-lg">
              <Typography variant="body2" className="text-txt-tertiary">스토리지</Typography>
              <Typography variant="h3">2.1GB / 10GB</Typography>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-weave-primary h-2 rounded-full" style={{ width: '21%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 내역 */}
        <div>
          <Typography variant="h4" className="mb-3">최근 결제 내역</Typography>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-bg-secondary rounded-lg">
              <div>
                <Typography variant="body1">프로 플랜 월 구독</Typography>
                <Typography variant="body2" className="text-txt-secondary">2024-08-25</Typography>
              </div>
              <Typography variant="body1" className="font-medium">29,900원</Typography>
            </div>
            <div className="flex justify-between items-center p-3 bg-bg-secondary rounded-lg">
              <div>
                <Typography variant="body1">프로 플랜 월 구독</Typography>
                <Typography variant="body2" className="text-txt-secondary">2024-07-25</Typography>
              </div>
              <Typography variant="body1" className="font-medium">29,900원</Typography>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'system':
        return renderSystemTab();
      case 'security':
        return renderSecurityTab();
      case 'billing':
        return renderBillingTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <Typography variant="h1" className="mb-2">설정</Typography>
            <Typography variant="body1" className="text-txt-secondary">
              계정 정보와 시스템 설정을 관리하세요
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 사이드바 */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <div className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-weave-primary-light text-weave-primary'
                          : 'hover:bg-bg-secondary text-txt-secondary'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-txt-tertiary">{tab.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-3">
              {renderTabContent()}
              
              {/* 저장 버튼 */}
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSave}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  설정 저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}