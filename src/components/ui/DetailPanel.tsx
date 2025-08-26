'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Badge from './Badge';
import { Card } from './Card';
import Typography from './Typography';
import { FormattedDate, FormattedNumber } from './FormattingHelper';
import { 
  X, 
  Edit, 
  Eye, 
  Download, 
  MessageSquare, 
  Clock, 
  FileText,
  DollarSign,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Plus
} from 'lucide-react';

// 클라이언트 정보 타입
export interface ClientInfo {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  totalInvoices?: number;
  totalRevenue?: number;
  lastActivity?: Date;
}

// 인보이스 정보 타입
export interface InvoiceInfo {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
}

// 결제 정보 타입
export interface PaymentInfo {
  id: string;
  invoiceId: string;
  date: Date;
  amount: number;
  method: 'card' | 'bank' | 'cash' | 'other';
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

// 메모 타입
export interface ClientMemo {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  type?: 'note' | 'reminder' | 'important';
}

// 활동 타임라인 타입
export interface TimelineActivity {
  id: string;
  type: 'invoice' | 'payment' | 'memo' | 'status_change';
  title: string;
  description?: string;
  date: Date;
  metadata?: Record<string, any>;
}

// DetailPanel Props
export interface DetailPanelProps {
  client: ClientInfo | null;
  recentInvoices?: InvoiceInfo[];
  recentPayments?: PaymentInfo[];
  memos?: ClientMemo[];
  timeline?: TimelineActivity[];
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (client: ClientInfo) => void;
  onAddMemo?: (memo: string) => void;
  onInvoiceView?: (invoiceId: string) => void;
  className?: string;
}

// 상태 배지 색상
const statusColors = {
  active: 'bg-status-success text-white',
  inactive: 'bg-txt-disabled text-white',
  pending: 'bg-status-warning text-white',
  draft: 'bg-txt-secondary text-white',
  sent: 'bg-status-info text-white',
  paid: 'bg-status-success text-white',
  overdue: 'bg-status-error text-white',
  cancelled: 'bg-txt-disabled text-white',
  completed: 'bg-status-success text-white',
  failed: 'bg-status-error text-white',
} as const;

// 결제 방법 아이콘
const paymentMethodIcons = {
  card: DollarSign,
  bank: Building,
  cash: DollarSign,
  other: FileText,
};

const DetailPanel: React.FC<DetailPanelProps> = ({
  client,
  recentInvoices = [],
  recentPayments = [],
  memos = [],
  timeline = [],
  isOpen,
  onClose,
  onEdit,
  onAddMemo,
  onInvoiceView,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments' | 'memos' | 'timeline'>('overview');
  const [newMemo, setNewMemo] = useState('');

  if (!isOpen || !client) {
    return null;
  }

  const handleAddMemo = () => {
    if (newMemo.trim()) {
      onAddMemo?.(newMemo.trim());
      setNewMemo('');
    }
  };

  return (
    <>
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* 패널 */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-full lg:w-96 xl:w-[28rem] bg-bg-primary border-l border-border-light shadow-xl z-50 transform transition-transform duration-300",
        "lg:relative lg:shadow-none lg:border-l-0 lg:border border-border-light lg:rounded-lg",
        {
          "translate-x-0": isOpen,
          "translate-x-full lg:translate-x-0": !isOpen,
        },
        className
      )}>
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-border-light">
            <Typography variant="h3" className="text-txt-primary">
              클라이언트 상세
            </Typography>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
              aria-label="패널 닫기"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 클라이언트 정보 */}
          <div className="p-4 border-b border-border-light">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-weave-primary rounded-full flex items-center justify-center text-white font-semibold">
                {client.avatar ? (
                  <img src={client.avatar} alt={client.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Typography variant="h4" className="text-txt-primary">
                    {client.name}
                  </Typography>
                  <Badge 
                    variant="secondary" 
                    className={statusColors[client.status]}
                  >
                    {client.status === 'active' ? '활성' : client.status === 'inactive' ? '비활성' : '대기'}
                  </Badge>
                </div>
                {client.company && (
                  <div className="flex items-center gap-1 mb-1">
                    <Building className="w-3 h-3 text-txt-tertiary" />
                    <span className="text-sm text-txt-secondary">{client.company}</span>
                  </div>
                )}
                <div className="space-y-1">
                  {client.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-txt-tertiary" />
                      <span className="text-xs text-txt-tertiary">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-txt-tertiary" />
                      <span className="text-xs text-txt-tertiary">{client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(client)}
                  className="p-2"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* 요약 정보 */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-bg-secondary rounded-lg">
                <Typography variant="body2" className="text-txt-tertiary mb-1">
                  총 인보이스
                </Typography>
                <Typography variant="h4" className="text-txt-primary">
                  {client.totalInvoices || 0}
                </Typography>
              </div>
              <div className="text-center p-3 bg-bg-secondary rounded-lg">
                <Typography variant="body2" className="text-txt-tertiary mb-1">
                  총 매출
                </Typography>
                <Typography variant="h4" className="text-txt-primary">
                  <FormattedNumber 
                    value={client.totalRevenue || 0} 
                    showCurrency 
                    currency="KRW"
                  />
                </Typography>
              </div>
            </div>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex border-b border-border-light overflow-x-auto">
            {[
              { id: 'overview', label: '개요', icon: Eye },
              { id: 'invoices', label: '인보이스', icon: FileText },
              { id: 'payments', label: '결제', icon: DollarSign },
              { id: 'memos', label: '메모', icon: MessageSquare },
              { id: 'timeline', label: '타임라인', icon: Clock },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  {
                    "border-weave-primary text-weave-primary": activeTab === id,
                    "border-transparent text-txt-secondary hover:text-txt-primary": activeTab !== id,
                  }
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <Typography variant="h4" className="text-txt-primary mb-2">
                    연락처 정보
                  </Typography>
                  <div className="space-y-2">
                    {client.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-txt-tertiary mt-0.5" />
                        <span className="text-sm text-txt-secondary">{client.address}</span>
                      </div>
                    )}
                    {client.lastActivity && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-txt-tertiary" />
                        <span className="text-sm text-txt-secondary">
                          마지막 활동: <FormattedDate date={client.lastActivity} relative />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-3">
                <Typography variant="h4" className="text-txt-primary">
                  최근 인보이스
                </Typography>
                {recentInvoices.length > 0 ? (
                  <div className="space-y-2">
                    {recentInvoices.slice(0, 5).map((invoice) => (
                      <Card key={invoice.id} className="p-3 hover:bg-bg-secondary cursor-pointer transition-colors"
                            onClick={() => onInvoiceView?.(invoice.id)}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-txt-primary">
                                #{invoice.number}
                              </span>
                              <Badge 
                                variant="secondary" 
                                className={statusColors[invoice.status]}
                              >
                                {invoice.status === 'paid' ? '결제완료' : 
                                 invoice.status === 'sent' ? '발송됨' : 
                                 invoice.status === 'overdue' ? '연체' : 
                                 invoice.status === 'draft' ? '임시저장' : '취소'}
                              </Badge>
                            </div>
                            <div className="text-xs text-txt-tertiary">
                              <FormattedDate date={invoice.date} />
                              {invoice.description && ` • ${invoice.description}`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-txt-primary">
                              <FormattedNumber 
                                value={invoice.amount} 
                                showCurrency 
                                currency="KRW"
                              />
                            </div>
                            <div className="text-xs text-txt-tertiary">
                              만료: <FormattedDate date={invoice.dueDate} format="short" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-txt-tertiary">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>인보이스가 없습니다</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-3">
                <Typography variant="h4" className="text-txt-primary">
                  최근 결제
                </Typography>
                {recentPayments.length > 0 ? (
                  <div className="space-y-2">
                    {recentPayments.slice(0, 5).map((payment) => {
                      const PaymentIcon = paymentMethodIcons[payment.method];
                      return (
                        <Card key={payment.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-bg-tertiary rounded-full flex items-center justify-center">
                                <PaymentIcon className="w-4 h-4 text-txt-secondary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-txt-primary">
                                    <FormattedNumber 
                                      value={payment.amount} 
                                      showCurrency 
                                      currency="KRW"
                                    />
                                  </span>
                                  <Badge 
                                    variant="secondary" 
                                    className={statusColors[payment.status]}
                                  >
                                    {payment.status === 'completed' ? '완료' : 
                                     payment.status === 'pending' ? '대기' : '실패'}
                                  </Badge>
                                </div>
                                <div className="text-xs text-txt-tertiary">
                                  <FormattedDate date={payment.date} />
                                  {payment.reference && ` • ${payment.reference}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-txt-tertiary">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>결제 내역이 없습니다</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'memos' && (
              <div className="space-y-4">
                <div>
                  <Typography variant="h4" className="text-txt-primary mb-3">
                    메모
                  </Typography>
                  
                  {/* 새 메모 추가 */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <textarea
                        value={newMemo}
                        onChange={(e) => setNewMemo(e.target.value)}
                        placeholder="새 메모를 입력하세요..."
                        className="flex-1 p-2 text-sm border border-border-light rounded-lg bg-bg-primary text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-weave-primary resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddMemo}
                        disabled={!newMemo.trim()}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        메모 추가
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 기존 메모들 */}
                {memos.length > 0 ? (
                  <div className="space-y-3">
                    {memos.map((memo) => (
                      <Card key={memo.id} className="p-3">
                        <div className="space-y-2">
                          <p className="text-sm text-txt-primary">{memo.content}</p>
                          <div className="flex items-center justify-between text-xs text-txt-tertiary">
                            <span>{memo.author}</span>
                            <FormattedDate date={memo.createdAt} relative />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-txt-tertiary">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>메모가 없습니다</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-3">
                <Typography variant="h4" className="text-txt-primary">
                  활동 타임라인
                </Typography>
                {timeline.length > 0 ? (
                  <div className="space-y-4">
                    {timeline.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="w-2 h-2 bg-weave-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-txt-primary">
                              {activity.title}
                            </span>
                            <span className="text-xs text-txt-tertiary">
                              <FormattedDate date={activity.date} relative />
                            </span>
                          </div>
                          {activity.description && (
                            <p className="text-sm text-txt-secondary">
                              {activity.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-txt-tertiary">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>활동 내역이 없습니다</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPanel;