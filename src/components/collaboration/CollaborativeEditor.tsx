'use client';

import { useState, useRef, useEffect } from 'react';
import { useConflictResolution } from '@/hooks/useConflictResolution';
import { usePresence } from '@/hooks/usePresence';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';

interface CollaborativeEditorProps {
  documentId: string;
  userId: string;
  userName: string;
  initialContent?: string;
  className?: string;
  onSave?: (content: string) => void;
}

export function CollaborativeEditor({
  documentId,
  userId,
  userName,
  initialContent = '',
  className = '',
  onSave
}: CollaborativeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    document,
    conflicts,
    isSyncing,
    handleTextChange,
    resolveManually
  } = useConflictResolution({
    documentId,
    userId,
    conflictStrategy: 'operational-transform',
    autoResolve: true
  });

  const {
    users,
    setTypingStatus,
    setCurrentDocument,
    getUsersInDocument,
    getTypingUsers
  } = usePresence({
    roomId: `doc-${documentId}`,
    userId,
    userName
  });

  // 문서 업데이트 시 컨텐츠 동기화
  useEffect(() => {
    if (document && document.content !== content) {
      setContent(document.content);
    }
  }, [document]);

  // 현재 문서 설정
  useEffect(() => {
    setCurrentDocument(documentId);
    return () => setCurrentDocument(undefined);
  }, [documentId, setCurrentDocument]);

  // 타이핑 상태 처리
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      setTypingStatus(true, documentId);
    }

    // 타이핑 종료 타이머 재설정
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTypingStatus(false);
    }, 1000);
  };

  // 텍스트 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    // 변경 유형 결정
    let changeType: 'insert' | 'delete' | 'replace' = 'replace';
    if (newContent.length > content.length) {
      changeType = 'insert';
    } else if (newContent.length < content.length) {
      changeType = 'delete';
    }

    setContent(newContent);
    handleTyping();
    
    // 충돌 해결 시스템에 전달
    const changedText = changeType === 'insert' 
      ? newContent.slice(cursorPos - (newContent.length - content.length), cursorPos)
      : content.slice(cursorPos, cursorPos + (content.length - newContent.length));
    
    handleTextChange(changedText, cursorPos, changeType, content);
  };

  // 저장 처리
  const handleSave = () => {
    onSave?.(content);
  };

  const currentUsers = getUsersInDocument(documentId);
  const typingUsers = getTypingUsers(documentId).filter(u => u.userId !== userId);

  return (
    <Card className={`p-4 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Typography variant="h6">
            협업 문서: {documentId}
          </Typography>
          
          {/* 동기화 상태 */}
          {isSyncing && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              동기화 중...
            </div>
          )}
        </div>

        {/* 현재 사용자 */}
        <div className="flex items-center gap-2">
          {currentUsers.map(user => (
            <div
              key={user.userId}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: user.status === 'online' ? '#10B981' : '#F59E0B' }}
              />
              <span className="text-sm">{user.userName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 충돌 경고 */}
      {conflicts.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h6" className="text-yellow-800 dark:text-yellow-200 text-sm">
                편집 충돌 발생
              </Typography>
              <Typography variant="body2" className="text-yellow-600 dark:text-yellow-400">
                {conflicts.length}개의 충돌하는 변경사항이 있습니다.
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => resolveManually('local')}
              >
                내 변경 사용
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resolveManually('remote')}
              >
                원격 변경 사용
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => resolveManually('merge')}
              >
                자동 병합
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 타이핑 중인 사용자 */}
      {typingUsers.length > 0 && (
        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 italic">
          {typingUsers.map(u => u.userName).join(', ')}
          {typingUsers.length === 1 ? '님이' : '님들이'} 입력 중...
        </div>
      )}

      {/* 에디터 */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          className="
            w-full
            min-h-[400px]
            p-4
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-700
            rounded-lg
            resize-none
            font-mono
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
          placeholder="여기에 입력하세요..."
        />
        
        {/* 내 타이핑 표시자 */}
        {isTyping && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded">
            입력 중...
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {content.length} 문자 | {content.split(' ').filter(w => w).length} 단어
        </div>
        
        <Button onClick={handleSave} variant="primary">
          저장
        </Button>
      </div>
    </Card>
  );
}