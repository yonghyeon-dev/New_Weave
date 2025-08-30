/**
 * 대화 히스토리 관리 서비스
 * 대화 세션 저장, 조회, 검색 기능
 */

import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 (런타임에만 초기화)
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  : null;

/**
 * 대화 세션 인터페이스
 */
export interface ChatSession {
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
  tags?: ChatTag[];
}

/**
 * 대화 메시지 인터페이스
 */
export interface ChatMessage {
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
 * 대화 태그 인터페이스
 */
export interface ChatTag {
  id: string;
  name: string;
  color: string;
}

/**
 * 검색 결과 인터페이스
 */
export interface SearchResult {
  sessionId: string;
  sessionTitle: string;
  messageId: string;
  messageContent: string;
  messageRole: string;
  createdAt: Date;
  rank: number;
  highlight?: string;
}

/**
 * 대화 히스토리 서비스 클래스
 */
export class ChatHistoryService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
  }

  /**
   * 새 세션 생성
   */
  async createSession(params: {
    type?: ChatSession['type'];
    title?: string;
    metadata?: Record<string, any>;
  }): Promise<ChatSession> {
    const { data, error } = await supabase!
      .from('chat_sessions')
      .insert({
        user_id: this.userId,
        type: params.type || 'general',
        title: params.title,
        metadata: params.metadata || {}
      })
      .select()
      .single();

    if (error) throw error;

    return this.formatSession(data);
  }

  /**
   * 메시지 저장
   */
  async saveMessage(
    sessionId: string,
    message: {
      role: ChatMessage['role'];
      content: string;
      tokensUsed?: number;
      model?: string;
      metadata?: ChatMessage['metadata'];
    }
  ): Promise<ChatMessage> {
    const { data, error } = await supabase!
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: message.role,
        content: message.content,
        tokens_used: message.tokensUsed,
        model: message.model,
        metadata: message.metadata || {}
      })
      .select()
      .single();

    if (error) throw error;

    // 첫 사용자 메시지인 경우 세션 제목 자동 생성
    if (message.role === 'user') {
      await this.updateSessionTitleIfEmpty(sessionId, message.content);
    }

    return this.formatMessage(data);
  }

  /**
   * 세션 제목 자동 업데이트
   */
  private async updateSessionTitleIfEmpty(
    sessionId: string,
    firstMessage: string
  ): Promise<void> {
    const { data: session } = await supabase!
      .from('chat_sessions')
      .select('title')
      .eq('id', sessionId)
      .single();

    if (!session?.title) {
      const title = firstMessage.length > 50 
        ? firstMessage.substring(0, 50) + '...'
        : firstMessage;

      await supabase!
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId);
    }
  }

  /**
   * 세션 목록 조회
   */
  async getSessions(options: {
    limit?: number;
    offset?: number;
    archived?: boolean;
    starred?: boolean;
    type?: ChatSession['type'];
    sortBy?: 'created' | 'updated' | 'lastMessage';
  } = {}): Promise<{
    sessions: ChatSession[];
    total: number;
  }> {
    let query = supabase!
      .from('chat_sessions')
      .select('*, chat_messages(count)', { count: 'exact' })
      .eq('user_id', this.userId);

    // 필터 적용
    if (options.archived !== undefined) {
      query = query.eq('is_archived', options.archived);
    }
    if (options.starred !== undefined) {
      query = query.eq('is_starred', options.starred);
    }
    if (options.type) {
      query = query.eq('type', options.type);
    }

    // 정렬
    const sortColumn = {
      created: 'created_at',
      updated: 'updated_at',
      lastMessage: 'last_message_at'
    }[options.sortBy || 'lastMessage'];
    
    query = query.order(sortColumn, { ascending: false });

    // 페이지네이션
    const limit = options.limit || 20;
    const offset = options.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const sessions = data.map(session => ({
      ...this.formatSession(session),
      messageCount: session.chat_messages?.[0]?.count || 0
    }));

    return {
      sessions,
      total: count || 0
    };
  }

  /**
   * 특정 세션의 메시지 조회
   */
  async getMessages(
    sessionId: string,
    options: {
      limit?: number;
      offset?: number;
      order?: 'asc' | 'desc';
    } = {}
  ): Promise<ChatMessage[]> {
    const limit = options.limit || 50;
    const offset = options.offset || 0;
    const order = options.order || 'asc';

    const { data, error } = await supabase!
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data.map(this.formatMessage);
  }

  /**
   * 대화 검색
   */
  async searchChats(
    query: string,
    options: {
      limit?: number;
      offset?: number;
      sessionId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    } = {}
  ): Promise<SearchResult[]> {
    // 검색 히스토리 저장
    await this.saveSearchHistory(query);

    const { data, error } = await supabase!
      .rpc('search_chat_history', {
        p_user_id: this.userId,
        p_query: query,
        p_limit: options.limit || 20,
        p_offset: options.offset || 0
      });

    if (error) throw error;

    return data.map((item: any) => ({
      sessionId: item.session_id,
      sessionTitle: item.session_title,
      messageId: item.message_id,
      messageContent: item.message_content,
      messageRole: item.message_role,
      createdAt: new Date(item.created_at),
      rank: item.rank,
      highlight: this.highlightSearchResult(item.message_content, query)
    }));
  }

  /**
   * 검색 결과 하이라이트
   */
  private highlightSearchResult(content: string, query: string): string {
    const words = query.split(' ').filter(w => w.length > 1);
    let highlighted = content;
    
    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });

    // 주변 컨텍스트 추출 (검색어 주변 50자)
    const firstMatch = highlighted.indexOf('<mark>');
    if (firstMatch > -1) {
      const start = Math.max(0, firstMatch - 50);
      const end = Math.min(highlighted.length, firstMatch + 100);
      return '...' + highlighted.substring(start, end) + '...';
    }

    return highlighted.substring(0, 100) + '...';
  }

  /**
   * 검색 히스토리 저장
   */
  private async saveSearchHistory(query: string): Promise<void> {
    await supabase!
      .from('chat_search_history')
      .insert({
        user_id: this.userId,
        query
      });
  }

  /**
   * 세션 업데이트
   */
  async updateSession(
    sessionId: string,
    updates: Partial<{
      title: string;
      summary: string;
      isArchived: boolean;
      isStarred: boolean;
      metadata: Record<string, any>;
    }>
  ): Promise<void> {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.summary !== undefined) updateData.summary = updates.summary;
    if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;
    if (updates.isStarred !== undefined) updateData.is_starred = updates.isStarred;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

    const { error } = await supabase!
      .from('chat_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .eq('user_id', this.userId);

    if (error) throw error;
  }

  /**
   * 세션 삭제
   */
  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase!
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', this.userId);

    if (error) throw error;
  }

  /**
   * 메시지 북마크
   */
  async bookmarkMessage(
    messageId: string,
    note?: string
  ): Promise<void> {
    const { error } = await supabase!
      .from('chat_bookmarks')
      .insert({
        user_id: this.userId,
        message_id: messageId,
        note
      });

    if (error) throw error;
  }

  /**
   * 북마크 목록 조회
   */
  async getBookmarks(): Promise<Array<{
    id: string;
    messageId: string;
    note?: string;
    message?: ChatMessage;
    session?: ChatSession;
  }>> {
    const { data, error } = await supabase!
      .from('chat_bookmarks')
      .select(`
        *,
        chat_messages (
          *,
          chat_sessions (*)
        )
      `)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(bookmark => ({
      id: bookmark.id,
      messageId: bookmark.message_id,
      note: bookmark.note,
      message: bookmark.chat_messages ? this.formatMessage(bookmark.chat_messages) : undefined,
      session: bookmark.chat_messages?.chat_sessions 
        ? this.formatSession(bookmark.chat_messages.chat_sessions)
        : undefined
    }));
  }

  /**
   * 태그 관리
   */
  async createTag(name: string, color?: string): Promise<ChatTag> {
    const { data, error } = await supabase!
      .from('chat_tags')
      .insert({
        name,
        color: color || '#3B82F6'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 세션에 태그 추가
   */
  async addTagToSession(sessionId: string, tagId: string): Promise<void> {
    const { error } = await supabase!
      .from('session_tags')
      .insert({
        session_id: sessionId,
        tag_id: tagId
      });

    if (error) throw error;
  }

  /**
   * 통계 조회
   */
  async getStatistics(): Promise<{
    totalSessions: number;
    starredSessions: number;
    archivedSessions: number;
    activeDays: number;
    lastActive?: Date;
  }> {
    const { data, error } = await supabase!
      .from('chat_statistics')
      .select('*')
      .eq('user_id', this.userId)
      .single();

    if (error) throw error;

    return {
      totalSessions: data.total_sessions || 0,
      starredSessions: data.starred_sessions || 0,
      archivedSessions: data.archived_sessions || 0,
      activeDays: data.active_days || 0,
      lastActive: data.last_active ? new Date(data.last_active) : undefined
    };
  }

  /**
   * 최근 검색어 조회
   */
  async getRecentSearches(limit: number = 10): Promise<string[]> {
    const { data, error } = await supabase!
      .from('chat_search_history')
      .select('query')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // 중복 제거
    const uniqueQueries = new Set(data.map(item => item.query));
    return Array.from(uniqueQueries);
  }

  /**
   * 세션 포맷팅
   */
  private formatSession(data: any): ChatSession {
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      type: data.type,
      summary: data.summary,
      metadata: data.metadata,
      isArchived: data.is_archived,
      isStarred: data.is_starred,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastMessageAt: new Date(data.last_message_at)
    };
  }

  /**
   * 메시지 포맷팅
   */
  private formatMessage(data: any): ChatMessage {
    return {
      id: data.id,
      sessionId: data.session_id,
      role: data.role,
      content: data.content,
      tokensUsed: data.tokens_used,
      model: data.model,
      metadata: data.metadata,
      createdAt: new Date(data.created_at)
    };
  }

  /**
   * 세션 내보내기
   */
  async exportSession(
    sessionId: string,
    format: 'json' | 'markdown' | 'pdf' = 'json'
  ): Promise<string | Blob> {
    const session = await supabase!
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    const messages = await this.getMessages(sessionId, { limit: 1000 });

    if (format === 'json') {
      return JSON.stringify({ session: session.data, messages }, null, 2);
    } else if (format === 'markdown') {
      let markdown = `# ${session.data?.title || 'Chat Session'}\n\n`;
      markdown += `**Date**: ${new Date(session.data?.created_at).toLocaleDateString()}\n\n`;
      
      messages.forEach(msg => {
        const role = msg.role === 'user' ? '👤 User' : '🤖 Assistant';
        markdown += `### ${role}\n${msg.content}\n\n`;
      });
      
      return markdown;
    }
    
    // PDF는 별도 라이브러리 필요
    return '';
  }
}

export default ChatHistoryService;