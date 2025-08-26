'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Typography from './Typography';
import { 
  MessageSquare, 
  RefreshCw, 
  Download, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  FileText,
  Sparkles,
  Clock,
  CheckCircle
} from 'lucide-react';

// 메시지 타입
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'generating' | 'completed';
}

// 생성된 문서 타입
export interface GeneratedDocument {
  id: string;
  type: 'contract' | 'invoice' | 'report' | 'letter';
  title: string;
  description: string;
  previewUrl?: string;
  downloadUrl?: string;
  createdAt: Date;
  status: 'generating' | 'completed' | 'error';
}

// Props 인터페이스
export interface AiSampleCardProps {
  title: string;
  description?: string;
  type: 'chat' | 'document' | 'analysis';
  sampleData: ChatMessage[] | GeneratedDocument[] | any;
  onRegenerate?: () => void;
  onTryDemo?: () => void;
  className?: string;
}

// 샘플 채팅 데이터
const sampleChatMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'user',
    content: '이번 달 매출 보고서를 작성해주세요. 주요 지표와 전월 대비 분석을 포함해주세요.',
    timestamp: new Date(Date.now() - 300000),
    status: 'sent'
  },
  {
    id: '2',
    type: 'assistant',
    content: '네, 이번 달 매출 보고서를 작성해드리겠습니다. 다음 내용을 포함하여 종합적인 분석을 제공하겠습니다:\n\n• 총 매출액 및 전월 대비 증감률\n• 주요 고객별 매출 분석\n• 제품/서비스별 매출 현황\n• 지역별 매출 동향\n• 향후 전망 및 개선방안\n\n보고서 생성을 시작하겠습니다.',
    timestamp: new Date(Date.now() - 280000),
    status: 'completed'
  }
];

// 샘플 문서 데이터
const sampleDocuments: GeneratedDocument[] = [
  {
    id: '1',
    type: 'report',
    title: '2024년 11월 매출 분석 보고서',
    description: '월별 매출 동향 분석 및 주요 성과 지표 정리',
    createdAt: new Date(Date.now() - 120000),
    status: 'completed'
  },
  {
    id: '2',
    type: 'contract',
    title: '서비스 제공 계약서 (템플릿)',
    description: 'AI가 생성한 표준 서비스 계약서 템플릿',
    createdAt: new Date(Date.now() - 300000),
    status: 'completed'
  }
];

const AiSampleCard = React.forwardRef<HTMLDivElement, AiSampleCardProps>(
  ({ title, description, type, sampleData, onRegenerate, onTryDemo, className, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

    // 재생성 핸들러
    const handleRegenerate = async () => {
      setIsLoading(true);
      try {
        await onRegenerate?.();
        // 실제로는 새로운 데이터를 받아올 것
      } finally {
        setIsLoading(false);
      }
    };

    // 피드백 핸들러
    const handleFeedback = (type: 'like' | 'dislike') => {
      setFeedback(type);
      // TODO: 실제 피드백 전송 로직
    };

    // 채팅 메시지 렌더링
    const renderChatMessage = (message: ChatMessage) => {
      const isUser = message.type === 'user';
      
      return (
        <div 
          key={message.id}
          className={cn(
            'flex gap-3 p-3',
            isUser ? 'justify-end' : 'justify-start'
          )}
        >
          {!isUser && (
            <div className="w-8 h-8 rounded-full bg-weave-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div className={cn(
            'max-w-[80%] rounded-lg p-3',
            isUser 
              ? 'bg-weave-primary text-white'
              : 'bg-primary-surfaceVariant border border-primary-borderSecondary'
          )}>
            <Typography 
              variant="body2" 
              className={cn(
                'whitespace-pre-wrap',
                isUser ? 'text-white' : 'text-txt-primary'
              )}
            >
              {message.content}
            </Typography>
            
            <div className="flex items-center justify-between mt-2 gap-2">
              <Typography 
                variant="caption" 
                className={cn(
                  'opacity-70',
                  isUser ? 'text-white' : 'text-txt-secondary'
                )}
              >
                {message.timestamp.toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
              
              {message.status === 'generating' && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                  <Typography variant="caption" className="opacity-70">
                    생성 중...
                  </Typography>
                </div>
              )}
              
              {message.status === 'completed' && !isUser && (
                <CheckCircle className="w-3 h-3 text-status-success" />
              )}
            </div>
          </div>
        </div>
      );
    };

    // 문서 항목 렌더링
    const renderDocument = (doc: GeneratedDocument) => {
      const typeConfig = {
        contract: { icon: FileText, label: '계약서' },
        invoice: { icon: FileText, label: '인보이스' },
        report: { icon: FileText, label: '보고서' },
        letter: { icon: MessageSquare, label: '서신' }
      };

      const config = typeConfig[doc.type];
      const Icon = config.icon;

      return (
        <div 
          key={doc.id}
          className="flex items-start gap-3 p-3 rounded-lg border border-primary-borderSecondary hover:border-primary-border transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-weave-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-weave-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Typography variant="body1" className="font-medium text-txt-primary truncate">
                  {doc.title}
                </Typography>
                <Typography variant="body2" className="text-txt-secondary mt-1">
                  {doc.description}
                </Typography>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-txt-tertiary">
                    <Clock className="w-3 h-3" />
                    <Typography variant="caption">
                      {doc.createdAt.toLocaleDateString('ko-KR')}
                    </Typography>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      doc.status === 'completed' && 'bg-status-success',
                      doc.status === 'generating' && 'bg-status-warning animate-pulse',
                      doc.status === 'error' && 'bg-status-error'
                    )} />
                    <Typography variant="caption" className="text-txt-tertiary">
                      {doc.status === 'completed' && '완료'}
                      {doc.status === 'generating' && '생성 중'}
                      {doc.status === 'error' && '오류'}
                    </Typography>
                  </div>
                </div>
              </div>
              
              {doc.status === 'completed' && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {/* TODO: 미리보기 */}}
                  >
                    미리보기
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {/* TODO: 다운로드 */}}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-primary-borderSecondary bg-primary-surface overflow-hidden',
          className
        )}
        {...props}
      >
        {/* 헤더 */}
        <div className="p-4 border-b border-primary-borderSecondary bg-primary-surfaceVariant/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-weave-primary" />
                <Typography variant="h4" className="font-semibold text-txt-primary">
                  {title}
                </Typography>
                <div className="px-2 py-0.5 rounded-full bg-weave-primary/10 text-weave-primary text-xs font-medium">
                  샘플
                </div>
              </div>
              {description && (
                <Typography variant="body2" className="text-txt-secondary">
                  {description}
                </Typography>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {type === 'chat' && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('like')}
                    className={feedback === 'like' ? 'text-status-success' : ''}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('dislike')}
                    className={feedback === 'dislike' ? 'text-status-error' : ''}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                disabled={isLoading}
              >
                <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
                재생성
              </Button>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="max-h-96 overflow-y-auto">
          {type === 'chat' && (
            <div className="space-y-1">
              {(sampleData as ChatMessage[] || sampleChatMessages).map(renderChatMessage)}
            </div>
          )}
          
          {type === 'document' && (
            <div className="p-4 space-y-3">
              {(sampleData as GeneratedDocument[] || sampleDocuments).map(renderDocument)}
            </div>
          )}
          
          {type === 'analysis' && (
            <div className="p-4">
              <Typography variant="body2" className="text-txt-secondary">
                분석 결과가 여기에 표시됩니다...
              </Typography>
            </div>
          )}
        </div>

        {/* 액션 영역 */}
        <div className="p-4 border-t border-primary-borderSecondary bg-primary-surfaceVariant/30">
          <div className="flex items-center justify-between">
            <Typography variant="caption" className="text-txt-secondary">
              이것은 AI 기능의 미리보기입니다
            </Typography>
            
            <Button 
              onClick={onTryDemo}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              직접 사용해보기
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

AiSampleCard.displayName = 'AiSampleCard';

export default AiSampleCard;