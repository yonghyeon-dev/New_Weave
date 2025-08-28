// 채팅 서비스 - Gemini AI 통합 및 세션 관리

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    totalTokens: number;
    model: string;
  };
}

export interface StreamChunk {
  type: 'content' | 'metadata' | 'error' | 'done';
  data: any;
  timestamp: number;
}

// 로컬 스토리지 키
const STORAGE_KEY = 'weave_chat_sessions';
const CURRENT_SESSION_KEY = 'weave_current_session';

export class ChatService {
  private static instance: ChatService;
  
  private constructor() {}
  
  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }
  
  // 새 세션 생성
  createSession(): ChatSession {
    const session: ChatSession = {
      id: this.generateId(),
      messages: [],
      context: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        totalTokens: 0,
        model: 'gemini-2.5-flash-lite'
      }
    };
    
    this.saveSession(session);
    return session;
  }
  
  // 현재 세션 가져오기
  getCurrentSession(): ChatSession | null {
    if (typeof window === 'undefined') return null;
    
    const sessionId = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!sessionId) return null;
    
    return this.getSession(sessionId);
  }
  
  // 세션 ID로 가져오기
  getSession(sessionId: string): ChatSession | null {
    if (typeof window === 'undefined') return null;
    
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }
  
  // 모든 세션 가져오기
  getAllSessions(): ChatSession[] {
    if (typeof window === 'undefined') return [];
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    try {
      const sessions = JSON.parse(data);
      // Date 객체 복원
      return sessions.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
    } catch {
      return [];
    }
  }
  
  // 세션 저장
  saveSession(session: ChatSession): void {
    if (typeof window === 'undefined') return;
    
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    
    // 최대 10개 세션만 유지
    if (sessions.length > 10) {
      sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      sessions.length = 10;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    localStorage.setItem(CURRENT_SESSION_KEY, session.id);
  }
  
  // 메시지 추가
  addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const session = this.getSession(sessionId);
    if (!session) throw new Error('Session not found');
    
    const newMessage: ChatMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    session.messages.push(newMessage);
    session.updatedAt = new Date();
    
    // 토큰 카운트 업데이트 (추정)
    if (message.metadata?.tokens) {
      session.metadata.totalTokens += message.metadata.tokens;
    }
    
    this.saveSession(session);
    return newMessage;
  }
  
  // 세션 삭제
  deleteSession(sessionId: string): void {
    if (typeof window === 'undefined') return;
    
    const sessions = this.getAllSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // 현재 세션이 삭제되면 초기화
    const currentId = localStorage.getItem(CURRENT_SESSION_KEY);
    if (currentId === sessionId) {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  }
  
  // 모든 세션 삭제
  clearAllSessions(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }
  
  // 컨텍스트 윈도우 관리 (최근 10개 메시지)
  getContextMessages(sessionId: string): ChatMessage[] {
    const session = this.getSession(sessionId);
    if (!session) return [];
    
    // 시스템 메시지 제외하고 최근 10개
    const recentMessages = session.messages
      .filter(m => m.role !== 'system')
      .slice(-10);
    
    return recentMessages;
  }
  
  // 대화 요약 (긴 대화용)
  async summarizeConversation(sessionId: string): Promise<string> {
    const session = this.getSession(sessionId);
    if (!session || session.messages.length < 20) return '';
    
    // 20개 이상 메시지가 있을 때 요약 생성
    // 실제 구현에서는 Gemini API 호출
    const oldMessages = session.messages.slice(0, -10);
    const summary = `이전 대화 요약: ${oldMessages.length}개의 메시지가 있었습니다.`;
    
    return summary;
  }
  
  // ID 생성
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // 세션 내보내기
  exportSession(sessionId: string): string {
    const session = this.getSession(sessionId);
    if (!session) throw new Error('Session not found');
    
    let markdown = `# 대화 기록\n\n`;
    markdown += `**일시**: ${session.createdAt.toLocaleString()}\n`;
    markdown += `**모델**: ${session.metadata.model}\n`;
    markdown += `**총 토큰**: ${session.metadata.totalTokens}\n\n`;
    markdown += `---\n\n`;
    
    session.messages.forEach(msg => {
      const role = msg.role === 'user' ? '👤 사용자' : '🤖 AI';
      markdown += `### ${role}\n`;
      markdown += `*${msg.timestamp.toLocaleTimeString()}*\n\n`;
      markdown += `${msg.content}\n\n`;
    });
    
    return markdown;
  }
}

// 싱글톤 인스턴스 export
export const chatService = ChatService.getInstance();