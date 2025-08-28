'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import Button from '@/components/ui/Button';
import { Send, Paperclip, X, StopCircle } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onStopGeneration?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function MessageInput({ 
  onSendMessage, 
  onStopGeneration,
  isLoading = false,
  disabled = false,
  placeholder = "메시지를 입력하세요...",
  value,
  onChange
}: MessageInputProps) {
  const [localMessage, setLocalMessage] = useState('');
  const message = value !== undefined ? value : localMessage;
  const setMessage = onChange || setLocalMessage;
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 메시지 전송
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || isLoading) return;
    
    onSendMessage(trimmedMessage);
    setMessage('');
    setAttachedFile(null);
    
    // textarea 높이 리셋
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  // Enter 키 처리 (Shift+Enter는 줄바꿈)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Textarea 자동 높이 조절
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // 자동 높이 조절
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };
  
  // 파일 첨부
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
      }
      setAttachedFile(file);
    }
  };
  
  // 파일 제거
  const removeFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="border-t border-border-light bg-white p-4">
      {/* 첨부 파일 표시 */}
      {attachedFile && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-bg-secondary rounded-lg">
          <Paperclip className="w-4 h-4 text-txt-secondary" />
          <span className="text-sm text-txt-primary flex-1 truncate">
            {attachedFile.name}
          </span>
          <button
            onClick={removeFile}
            className="p-1 hover:bg-bg-tertiary rounded transition-colors"
          >
            <X className="w-4 h-4 text-txt-secondary" />
          </button>
        </div>
      )}
      
      {/* 입력 영역 */}
      <div className="flex items-end gap-2">
        {/* 파일 첨부 버튼 (향후 구현) */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileAttach}
          accept="image/*,.pdf"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading}
          className="p-2 text-txt-secondary hover:bg-bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden"
          title="파일 첨부 (준비중)"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        {/* 텍스트 입력 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className="w-full px-4 py-2 pr-12 border border-border-light rounded-lg resize-none
                     focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent
                     disabled:bg-bg-secondary disabled:cursor-not-allowed
                     text-txt-primary placeholder-txt-tertiary"
            style={{ minHeight: '40px', maxHeight: '200px' }}
          />
          
          {/* 글자 수 표시 */}
          {message.length > 0 && (
            <div className="absolute bottom-2 right-12 text-xs text-txt-tertiary">
              {message.length}
            </div>
          )}
        </div>
        
        {/* 전송/중지 버튼 */}
        {isLoading ? (
          <Button
            variant="secondary"
            onClick={onStopGeneration}
            className="px-3 py-2"
            title="생성 중지"
          >
            <StopCircle className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="px-3 py-2"
            title="메시지 전송"
          >
            <Send className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      {/* 안내 메시지 */}
      <div className="mt-2 text-xs text-txt-tertiary">
        <span>Enter로 전송, Shift+Enter로 줄바꿈</span>
        {isLoading && (
          <span className="ml-2">• AI가 응답을 생성 중입니다...</span>
        )}
      </div>
    </div>
  );
}