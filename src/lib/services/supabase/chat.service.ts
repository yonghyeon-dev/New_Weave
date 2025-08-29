import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
type ChatSessionInsert = Database['public']['Tables']['chat_sessions']['Insert']
type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert']

export class ChatService {
  private supabase = getSupabaseClient()

  // 채팅 세션 생성
  async createSession(userId: string, type: ChatSession['type'] = 'general', title?: string) {
    const { data, error } = await this.supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        type,
        title,
        metadata: {}
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 채팅 세션 목록 조회
  async getSessions(userId: string, type?: ChatSession['type']) {
    let query = this.supabase
      .from('chat_sessions')
      .select(`
        *,
        chat_messages (
          id,
          content,
          role,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // 특정 세션 조회
  async getSessionById(sessionId: string) {
    const { data, error } = await this.supabase
      .from('chat_sessions')
      .select(`
        *,
        chat_messages (
          *
        )
      `)
      .eq('id', sessionId)
      .single()

    if (error) throw error
    return data
  }

  // 메시지 추가
  async addMessage(sessionId: string, message: Omit<ChatMessageInsert, 'id' | 'created_at' | 'session_id'>) {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        ...message
      })
      .select()
      .single()

    if (error) throw error

    // 세션 업데이트 시간 갱신
    await this.supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId)

    return data
  }

  // 세션의 메시지 조회
  async getMessages(sessionId: string, limit: number = 100) {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) throw error
    return data
  }

  // 세션 제목 업데이트
  async updateSessionTitle(sessionId: string, title: string) {
    const { data, error } = await this.supabase
      .from('chat_sessions')
      .update({ title })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 세션 삭제
  async deleteSession(sessionId: string) {
    const { error } = await this.supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)

    if (error) throw error
    return true
  }

  // 메시지 검색
  async searchMessages(userId: string, query: string, sessionId?: string) {
    const { data, error } = await this.supabase
      .rpc('search_chat_messages', {
        user_uuid: userId,
        search_query: query,
        session_uuid: sessionId
      })

    if (error) throw error
    return data
  }

  // 최근 세션 조회
  async getRecentSessions(userId: string, limit: number = 20) {
    const { data, error } = await this.supabase
      .rpc('get_recent_chat_sessions', {
        user_uuid: userId,
        limit_count: limit
      })

    if (error) throw error
    return data
  }

  // 메시지 반응 추가
  async addReaction(messageId: string, userId: string, reaction: string) {
    const { data, error } = await this.supabase
      .from('chat_message_reactions')
      .insert({
        message_id: messageId,
        user_id: userId,
        reaction
      })
      .select()
      .single()

    if (error && error.code !== '23505') throw error // 23505 = unique violation (이미 존재)
    return data
  }

  // 메시지 반응 제거
  async removeReaction(messageId: string, userId: string, reaction: string) {
    const { error } = await this.supabase
      .from('chat_message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('reaction', reaction)

    if (error) throw error
    return true
  }

  // 세션 요약 저장
  async saveSessionSummary(sessionId: string, summary: string, keyTopics: string[]) {
    const { data, error } = await this.supabase
      .from('chat_session_summaries')
      .upsert({
        session_id: sessionId,
        summary,
        key_topics: keyTopics
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 문서 컨텍스트 추가
  async addContextDocument(sessionId: string, documentId: string) {
    const { data, error } = await this.supabase
      .from('chat_context_documents')
      .insert({
        session_id: sessionId,
        document_id: documentId
      })
      .select()
      .single()

    if (error && error.code !== '23505') throw error // 이미 존재하는 경우 무시
    return data
  }

  // 실시간 메시지 구독
  subscribeToMessages(sessionId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`chat_messages:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe()
  }

  // 타입별 세션 통계
  async getSessionStats(userId: string) {
    const { data, error } = await this.supabase
      .from('chat_sessions')
      .select('type')
      .eq('user_id', userId)

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      byType: {
        general: 0,
        tax: 0,
        rag: 0
      }
    }

    data?.forEach(session => {
      if (session.type) {
        stats.byType[session.type]++
      }
    })

    return stats
  }
}

// 싱글톤 인스턴스
export const chatService = new ChatService()