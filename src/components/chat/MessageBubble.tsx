'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/lib/services/chatService';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* 아바타 */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-weave-primary text-white' : 'bg-bg-secondary text-txt-secondary'
      }`}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      
      {/* 메시지 버블 */}
      <div className={`flex-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <Card className={`p-4 rounded-lg ${
          isUser 
            ? 'bg-weave-primary text-white border-weave-primary' 
            : 'bg-white border-border-light'
        }`}>
          {/* 메시지 내용 */}
          {isUser ? (
            <Typography variant="body1" className="whitespace-pre-wrap">
              {message.content}
            </Typography>
          ) : (
            <div className="prose prose-sm max-w-none text-txt-primary">
              <ReactMarkdown
                components={{
                  // 마크다운 스타일 커스터마이징
                  h1: ({children}) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                  h2: ({children}) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
                  h3: ({children}) => <h3 className="text-base font-semibold mb-1">{children}</h3>,
                  p: ({children}) => <p className="mb-2">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                  li: ({children}) => <li className="mb-1">{children}</li>,
                  code: ({inline, children}) => {
                    if (inline) {
                      return <code className="bg-bg-secondary px-1 py-0.5 rounded text-sm">{children}</code>
                    }
                    return (
                      <pre className="bg-bg-secondary p-2 rounded overflow-x-auto">
                        <code className="text-sm">{children}</code>
                      </pre>
                    )
                  },
                  a: ({children, href}) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" 
                       className="text-weave-primary hover:underline">
                      {children}
                    </a>
                  ),
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-border-light pl-4 my-2 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
          {/* 타임스탬프 및 메타데이터 */}
          <div className={`mt-2 flex items-center gap-2 text-xs ${
            isUser ? 'text-white/70' : 'text-txt-tertiary'
          }`}>
            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            {message.metadata?.tokens && (
              <span>• {message.metadata.tokens} 토큰</span>
            )}
            {message.metadata?.processingTime && (
              <span>• {(message.metadata.processingTime / 1000).toFixed(1)}초</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}