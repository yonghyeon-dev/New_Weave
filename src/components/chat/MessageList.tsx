'use client';

import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Typography from '@/components/ui/Typography';
import { ChatMessage } from '@/lib/services/chatService';
import { Bot, MessageSquare } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping?: boolean;
  onExampleClick?: (text: string) => void;
  onRegenerate?: (messageId: string) => void;
  messageReactions?: Map<string, any[]>;
  onReaction?: (messageId: string, emoji: string) => void;
}

export default function MessageList({ messages, isTyping = false, onExampleClick, onRegenerate, messageReactions, onReaction }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 새 메시지가 추가되면 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // 메시지가 없을 때 표시할 컨텐츠
  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="bg-bg-secondary rounded-full p-4 mb-4">
          <MessageSquare className="w-12 h-12 text-txt-tertiary" />
        </div>
        <Typography variant="h3" className="text-lg font-semibold mb-2 text-txt-primary">
          새로운 대화를 시작하세요
        </Typography>
        <Typography variant="body2" className="text-txt-secondary text-center max-w-md">
          AI 어시스턴트와 대화를 시작해보세요. 질문하거나 도움이 필요한 내용을 입력하면 즉시 답변을 받을 수 있습니다.
        </Typography>
        
        {/* 예시 질문들 */}
        <div className="mt-8 space-y-2 w-full max-w-md">
          <Typography variant="body2" className="text-txt-tertiary mb-2">
            예시 질문:
          </Typography>
          <div className="space-y-2">
            <div 
              className="bg-white border border-border-light rounded-lg p-3 cursor-pointer hover:bg-bg-secondary hover:border-weave-primary/30 transition-all group"
              onClick={() => onExampleClick?.("React와 Vue의 차이점을 설명해주세요")}
            >
              <Typography variant="body2" className="text-txt-secondary group-hover:text-txt-primary">
                &ldquo;React와 Vue의 차이점을 설명해주세요&rdquo;
              </Typography>
            </div>
            <div 
              className="bg-white border border-border-light rounded-lg p-3 cursor-pointer hover:bg-bg-secondary hover:border-weave-primary/30 transition-all group"
              onClick={() => onExampleClick?.("Python으로 간단한 웹 서버 만드는 방법을 알려주세요")}
            >
              <Typography variant="body2" className="text-txt-secondary group-hover:text-txt-primary">
                &ldquo;Python으로 간단한 웹 서버 만드는 방법&rdquo;
              </Typography>
            </div>
            <div 
              className="bg-white border border-border-light rounded-lg p-3 cursor-pointer hover:bg-bg-secondary hover:border-weave-primary/30 transition-all group"
              onClick={() => onExampleClick?.("효과적인 프로젝트 관리 방법은 무엇인가요?")}
            >
              <Typography variant="body2" className="text-txt-secondary group-hover:text-txt-primary">
                &ldquo;효과적인 프로젝트 관리 방법은?&rdquo;
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 메시지 목록 */}
      {messages.map((message, index) => (
        <MessageBubble 
          key={message.id} 
          message={message}
          onRegenerate={
            // 마지막 AI 메시지만 재생성 가능
            message.role === 'assistant' && index === messages.length - 1
              ? () => onRegenerate?.(message.id)
              : undefined
          }
          reactions={messageReactions?.get(message.id)}
          onReaction={onReaction}
        />
      ))}
      
      {/* 타이핑 인디케이터 */}
      {isTyping && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center">
            <Bot className="w-4 h-4 text-txt-secondary" />
          </div>
          <div className="bg-white border border-border-light rounded-lg p-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-txt-tertiary rounded-full animate-bounce" 
                   style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-txt-tertiary rounded-full animate-bounce" 
                   style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-txt-tertiary rounded-full animate-bounce" 
                   style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* 스크롤 앵커 */}
      <div ref={bottomRef} />
    </div>
  );
}