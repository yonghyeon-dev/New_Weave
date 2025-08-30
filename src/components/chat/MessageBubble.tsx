'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { User, Bot, Copy, Check, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage } from '@/lib/services/chatService';
import LinkPreview, { extractUrlsFromText } from './LinkPreview';
import EmojiReaction from './EmojiReaction';

interface MessageBubbleProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  reactions?: any[];
  onReaction?: (messageId: string, emoji: string) => void;
}

export default function MessageBubble({ message, onRegenerate, reactions, onReaction }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // URL 추출
  const urls = extractUrlsFromText(message.content);
  
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
                  code: ({className, children, ...props}: any) => {
                    const inline = props.inline;
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && match) {
                      return (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: '0.5rem 0',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      );
                    }
                    if (inline) {
                      return <code className="bg-bg-secondary px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                    }
                    return (
                      <pre className="bg-bg-tertiary p-3 rounded-lg overflow-x-auto my-2">
                        <code className="text-sm font-mono text-txt-primary">{children}</code>
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
          <div className={`mt-2 flex items-center justify-between ${
            isUser ? 'text-white/70' : 'text-txt-tertiary'
          }`}>
            <div className="flex items-center gap-2 text-xs">
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
              {message.metadata?.tokens && (
                <span>• {message.metadata.tokens} 토큰</span>
              )}
              {message.metadata?.processingTime && (
                <span>• {(message.metadata.processingTime / 1000).toFixed(1)}초</span>
              )}
            </div>
            
            {/* 액션 버튼들 */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className={`p-1 rounded transition-colors ${
                  isUser 
                    ? 'hover:bg-white/20' 
                    : 'hover:bg-bg-secondary'
                }`}
                title="메시지 복사"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              
              {!isUser && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 rounded hover:bg-bg-secondary transition-colors"
                  title="다시 생성"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </Card>
        
        {/* 이모지 반응 */}
        {!isUser && onReaction && (
          <div className="mt-2">
            <EmojiReaction 
              messageId={message.id} 
              reactions={reactions}
              onReaction={onReaction}
            />
          </div>
        )}
        
        {/* 링크 미리보기 */}
        {!isUser && urls.length > 0 && (
          <div className="mt-2 space-y-2">
            {urls.map((url, index) => (
              <LinkPreview key={index} url={url} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}