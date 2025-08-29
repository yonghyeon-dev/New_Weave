/**
 * 대화 히스토리 컴포넌트
 * 과거 대화 세션 목록 표시 및 관리
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  Search, 
  Calendar, 
  Star, 
  Archive, 
  Trash2, 
  MoreVertical,
  Filter,
  ChevronRight,
  Clock,
  Tag,
  Download,
  BrainCircuit,
  Calculator,
  Briefcase
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 대화 세션 인터페이스
 */
interface ChatSession {
  id: string;
  userId: string;
  title?: string;
  type: 'general' | 'tax' | 'rag';
  summary?: string;
  metadata?: Record<string, any>;
  isArchived: boolean;
  isStarred: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  messageCount?: number;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

/**
 * 대화 메시지 인터페이스
 */
interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokensUsed?: number;
  model?: string;
  metadata?: {
    attachments?: string[];
    calculations?: any;
    sources?: any[];
  };
  createdAt: Date;
}

/**
 * 검색 결과 인터페이스
 */
interface SearchResult {
  sessionId: string;
  sessionTitle: string;
  messageId: string;
  messageContent: string;
  messageRole: string;
  createdAt: Date;
  rank: number;
  highlight?: string;
}

interface ChatHistoryProps {
  onSessionSelect?: (sessionId: string) => void;
  currentSessionId?: string;
  onNewChat?: () => void;
}

/**
 * 대화 히스토리 컴포넌트
 */
const ChatHistory: React.FC<ChatHistoryProps> = ({
  onSessionSelect,
  currentSessionId,
  onNewChat
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'starred' | 'archived'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'general' | 'tax' | 'rag'>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  /**
   * 세션 목록 조회
   */
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        limit: '20',
        offset: String(offset)
      });

      if (filter === 'starred') params.append('starred', 'true');
      if (filter === 'archived') params.append('archived', 'true');
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(`/api/chat/history?${params}`);
      const data = await response.json();

      if (data.success) {
        if (offset === 0) {
          setSessions(data.data.sessions || data.data);
        } else {
          setSessions(prev => [...prev, ...(data.data.sessions || data.data)]);
        }
        setTotalCount(data.data.total || 0);
        setFilteredSessions(data.data.sessions || data.data);
      }
    } catch (error) {
      console.error('세션 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [offset, filter, typeFilter]);

  /**
   * 대화 검색
   */
  const searchChats = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`/api/chat/history?search=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data || []);
      }
    } catch (error) {
      console.error('검색 오류:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * 세션 업데이트
   */
  const updateSession = async (sessionId: string, updates: Partial<ChatSession>) => {
    try {
      const response = await fetch('/api/chat/history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, ...updates })
      });

      if (response.ok) {
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { ...session, ...updates }
            : session
        ));
      }
    } catch (error) {
      console.error('세션 업데이트 오류:', error);
    }
  };

  /**
   * 세션 삭제
   */
  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/history?sessionId=${sessionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('세션 삭제 오류:', error);
    }
  };

  /**
   * 세션 타입 아이콘
   */
  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'tax':
        return <Calculator className="w-4 h-4 text-green-600" />;
      case 'rag':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      default:
        return <BrainCircuit className="w-4 h-4 text-purple-600" />;
    }
  };

  /**
   * 세션 타입 라벨
   */
  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'tax':
        return '세무 상담';
      case 'rag':
        return 'RAG 검색';
      default:
        return '일반 대화';
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // 검색 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      searchChats(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchChats]);

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* 헤더 */}
      <div className="p-4 border-b border-border-light bg-bg-primary">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h3" className="text-lg font-semibold text-txt-primary">
            대화 히스토리
          </Typography>
          <Button
            variant="primary"
            size="sm"
            onClick={onNewChat}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            새 대화
          </Button>
        </div>

        {/* 검색바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
          <Input
            placeholder="대화 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* 필터 */}
        <div className="flex gap-2 mt-3">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            전체
          </Button>
          <Button
            variant={filter === 'starred' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('starred')}
            className="flex items-center gap-1"
          >
            <Star className="w-3 h-3" />
            즐겨찾기
          </Button>
          <Button
            variant={filter === 'archived' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('archived')}
            className="flex items-center gap-1"
          >
            <Archive className="w-3 h-3" />
            보관함
          </Button>
        </div>

        {/* 타입 필터 */}
        <div className="flex gap-2 mt-2">
          <Button
            variant={typeFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('all')}
          >
            모든 유형
          </Button>
          <Button
            variant={typeFilter === 'general' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('general')}
          >
            일반
          </Button>
          <Button
            variant={typeFilter === 'tax' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('tax')}
          >
            세무
          </Button>
          <Button
            variant={typeFilter === 'rag' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('rag')}
          >
            RAG
          </Button>
        </div>
      </div>

      {/* 세션 목록 또는 검색 결과 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <Typography variant="body2" className="text-txt-tertiary">
              불러오는 중...
            </Typography>
          </div>
        ) : searchQuery && searchResults.length > 0 ? (
          // 검색 결과
          <div className="space-y-2">
            <Typography variant="body2" className="text-txt-secondary mb-2">
              검색 결과 ({searchResults.length}개)
            </Typography>
            {searchResults.map((result) => (
              <Card
                key={result.messageId}
                className="p-3 hover:bg-bg-tertiary cursor-pointer transition-colors"
                onClick={() => onSessionSelect?.(result.sessionId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Typography variant="body2" className="font-medium text-txt-primary mb-1">
                      {result.sessionTitle || '제목 없음'}
                    </Typography>
                    <div 
                      className="text-sm text-txt-secondary mb-2"
                      dangerouslySetInnerHTML={{ __html: result.highlight || result.messageContent }}
                    />
                    <div className="flex items-center gap-2 text-xs text-txt-tertiary">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(result.createdAt), { 
                        addSuffix: true,
                        locale: ko 
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // 세션 목록
          <div className="space-y-2">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8">
                <Typography variant="body2" className="text-txt-tertiary">
                  {searchQuery ? '검색 결과가 없습니다.' : '대화 내역이 없습니다.'}
                </Typography>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <Card
                  key={session.id}
                  className={`p-3 hover:bg-bg-tertiary cursor-pointer transition-colors ${
                    currentSessionId === session.id ? 'bg-bg-tertiary border-weave-primary' : ''
                  }`}
                  onClick={() => onSessionSelect?.(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getSessionIcon(session.type)}
                        <Typography variant="body2" className="font-medium text-txt-primary">
                          {session.title || '제목 없음'}
                        </Typography>
                        {session.isStarred && (
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      
                      {session.summary && (
                        <Typography variant="body2" className="text-txt-secondary text-sm mb-2 line-clamp-2">
                          {session.summary}
                        </Typography>
                      )}

                      <div className="flex items-center gap-3 text-xs text-txt-tertiary">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(session.lastMessageAt), { 
                            addSuffix: true,
                            locale: ko 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {session.messageCount || 0}개
                        </span>
                        <span className="px-2 py-0.5 bg-bg-tertiary rounded text-xs">
                          {getSessionTypeLabel(session.type)}
                        </span>
                      </div>

                      {session.tags && session.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {session.tags.map(tag => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ 
                                backgroundColor: `${tag.color}20`,
                                color: tag.color
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 액션 메뉴 */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSession(session.id, { isStarred: !session.isStarred });
                        }}
                        className="p-1 hover:bg-bg-secondary rounded"
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            session.isStarred 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-txt-tertiary'
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSession(session.id, { isArchived: !session.isArchived });
                        }}
                        className="p-1 hover:bg-bg-secondary rounded"
                      >
                        <Archive 
                          className={`w-4 h-4 ${
                            session.isArchived 
                              ? 'text-blue-500' 
                              : 'text-txt-tertiary'
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(session.id);
                        }}
                        className="p-1 hover:bg-bg-secondary rounded"
                      >
                        <Trash2 className="w-4 h-4 text-txt-tertiary hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* 삭제 확인 */}
                  {showDeleteConfirm === session.id && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                      <Typography variant="body2" className="text-red-700 mb-2">
                        이 대화를 삭제하시겠습니까?
                      </Typography>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(null);
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                          }}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
            
            {/* 더 보기 버튼 */}
            {sessions.length < totalCount && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOffset(prev => prev + 20)}
              >
                더 보기 ({sessions.length}/{totalCount})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 통계 */}
      <div className="p-4 border-t border-border-light bg-bg-primary">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <Typography variant="body2" className="text-txt-tertiary text-xs">
              전체
            </Typography>
            <Typography variant="body1" className="text-txt-primary font-semibold">
              {totalCount}
            </Typography>
          </div>
          <div>
            <Typography variant="body2" className="text-txt-tertiary text-xs">
              즐겨찾기
            </Typography>
            <Typography variant="body1" className="text-txt-primary font-semibold">
              {sessions.filter(s => s.isStarred).length}
            </Typography>
          </div>
          <div>
            <Typography variant="body2" className="text-txt-tertiary text-xs">
              보관함
            </Typography>
            <Typography variant="body1" className="text-txt-primary font-semibold">
              {sessions.filter(s => s.isArchived).length}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;