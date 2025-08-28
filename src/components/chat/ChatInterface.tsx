'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { chatService, ChatMessage, ChatSession } from '@/lib/services/chatService';
import { Trash2, Download, RefreshCw, Menu, X } from 'lucide-react';

export default function ChatInterface() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // 초기화
  useEffect(() => {
    initializeChat();
  }, []);
  
  const initializeChat = () => {
    // 현재 세션 가져오기 또는 새로 생성
    let currentSession = chatService.getCurrentSession();
    
    if (!currentSession) {
      currentSession = chatService.createSession();
    }
    
    setSession(currentSession);
    setMessages(currentSession.messages);
    
    // 모든 세션 로드
    const allSessions = chatService.getAllSessions();
    setSessions(allSessions);
  };
  
  // 메시지 전송
  const sendMessage = async (content: string) => {
    if (!session || isLoading) return;
    
    // 사용자 메시지 추가
    const userMessage = chatService.addMessage(session.id, {
      role: 'user',
      content
    });
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setCurrentResponse('');
    
    // AbortController 생성 (응답 중단용)
    const controller = new AbortController();
    setAbortController(controller);
    
    try {
      // 컨텍스트 메시지 가져오기
      const contextMessages = chatService.getContextMessages(session.id);
      
      // API 요청
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          message: content,
          messages: contextMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          sessionId: session.id
        }),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error('API 응답 오류');
      }
      
      // SSE 스트림 처리
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let metadata: any = null;
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'content') {
                  accumulatedContent += data.data;
                  setCurrentResponse(accumulatedContent);
                } else if (data.type === 'metadata') {
                  metadata = data.data;
                } else if (data.type === 'error') {
                  throw new Error(data.data);
                } else if (data.type === 'done') {
                  // 완료 처리
                  break;
                }
              } catch (e) {
                console.error('Parse error:', e);
              }
            }
          }
        }
      }
      
      // AI 응답 메시지 저장
      if (accumulatedContent) {
        const aiMessage = chatService.addMessage(session.id, {
          role: 'assistant',
          content: accumulatedContent,
          metadata: metadata || {
            model: 'gemini-2.5-flash-lite',
            processingTime: Date.now() - userMessage.timestamp.getTime()
          }
        });
        
        setMessages(prev => [...prev, aiMessage]);
        
        // 세션 업데이트
        const updatedSession = chatService.getSession(session.id);
        if (updatedSession) {
          setSession(updatedSession);
          setSessions(chatService.getAllSessions());
        }
      }
      
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Chat error:', error);
        
        // 에러 메시지 추가
        const errorMessage = chatService.addMessage(session.id, {
          role: 'assistant',
          content: '죄송합니다. 응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
          metadata: {
            error: true
          }
        });
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setCurrentResponse('');
      setAbortController(null);
    }
  };
  
  // 응답 중단
  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setIsTyping(false);
      
      // 중단된 응답도 저장
      if (currentResponse) {
        const aiMessage = chatService.addMessage(session!.id, {
          role: 'assistant',
          content: currentResponse + '\n\n*(응답이 중단되었습니다)*',
          metadata: {
            interrupted: true
          }
        });
        
        setMessages(prev => [...prev, aiMessage]);
        setCurrentResponse('');
      }
    }
  };
  
  // 새 대화 시작
  const startNewChat = () => {
    const newSession = chatService.createSession();
    setSession(newSession);
    setMessages([]);
    setSessions(chatService.getAllSessions());
    setShowSidebar(false);
  };
  
  // 세션 전환
  const switchSession = (sessionId: string) => {
    const targetSession = chatService.getSession(sessionId);
    if (targetSession) {
      setSession(targetSession);
      setMessages(targetSession.messages);
      setShowSidebar(false);
    }
  };
  
  // 현재 대화 삭제
  const clearCurrentChat = () => {
    if (!session) return;
    
    if (confirm('현재 대화를 삭제하시겠습니까?')) {
      chatService.deleteSession(session.id);
      initializeChat();
    }
  };
  
  // 메시지 재생성
  const regenerateMessage = async (messageId: string) => {
    if (!session || isLoading) return;
    
    // 마지막 사용자 메시지 찾기
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;
    
    // AI 응답 제거
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex >= 0) {
      const newMessages = messages.slice(0, messageIndex);
      setMessages(newMessages);
      
      // 세션 업데이트
      const updatedSession = chatService.getSession(session.id);
      if (updatedSession) {
        updatedSession.messages = newMessages;
        chatService.saveSession(updatedSession);
      }
      
      // 다시 생성
      await sendMessage(lastUserMessage.content);
    }
  };
  
  // 대화 내보내기
  const exportChat = () => {
    if (!session) return;
    
    const markdown = chatService.exportSession(session.id);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${session.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flex h-full">
      {/* 사이드바 - 대화 목록 (모바일에서는 오버레이) */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-bg-secondary to-white border-r border-border-light
        transform transition-transform duration-200 ease-in-out shadow-xl lg:shadow-none
        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-border-light bg-white/50 backdrop-blur">
          <Typography variant="h4" className="text-txt-primary font-semibold mb-3">
            AI 챗봇
          </Typography>
          <Button
            variant="primary"
            onClick={startNewChat}
            className="w-full shadow-sm"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 대화 시작
            </span>
          </Button>
        </div>
        
        <div className="overflow-y-auto p-4">
          <Typography variant="body2" className="text-txt-secondary font-semibold mb-3">
            대화 목록
          </Typography>
          
          <div className="space-y-2">
            {sessions.map(s => {
              const isActive = s.id === session?.id;
              const firstMessage = s.messages.find(m => m.role === 'user')?.content || '새 대화';
              const messageCount = s.messages.length;
              
              return (
                <div
                  key={s.id}
                  onClick={() => switchSession(s.id)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200 border
                    ${isActive 
                      ? 'bg-gradient-to-r from-weave-primary to-weave-primary-light text-white border-weave-primary shadow-md transform scale-[1.02]' 
                      : 'bg-white hover:bg-bg-secondary border-border-light hover:border-weave-primary/30 hover:shadow-sm'
                    }
                  `}
                >
                  <Typography variant="body2" className={`font-medium truncate mb-1 ${
                    isActive ? 'text-white' : 'text-txt-primary'
                  }`}>
                    {firstMessage.slice(0, 40)}...
                  </Typography>
                  <div className="flex items-center justify-between mt-2">
                    <Typography variant="body2" className={`text-xs ${
                      isActive ? 'text-white/90' : 'text-txt-tertiary'
                    }`}>
                      {new Date(s.updatedAt).toLocaleDateString('ko-KR', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                    <Typography variant="body2" className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-bg-secondary text-txt-secondary'
                    }`}>
                      {messageCount}개
                    </Typography>
                  </div>
                </div>
              );
            })}
            
            {sessions.length === 0 && (
              <div className="text-center py-8">
                <Typography variant="body2" className="text-txt-tertiary">
                  아직 대화가 없습니다
                </Typography>
                <Typography variant="body2" className="text-txt-tertiary text-sm mt-1">
                  위의 버튼을 눌러 시작하세요
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 모바일 사이드바 오버레이 */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col h-full">
        {/* 헤더 */}
        <div className="bg-white border-b border-border-light p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-bg-secondary rounded-lg transition-colors"
              >
                {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <Typography variant="h3" className="text-lg font-semibold">
                AI 챗봇
              </Typography>
              
              {session && (
                <Typography variant="body2" className="text-txt-tertiary">
                  {session.metadata.totalTokens} 토큰 사용
                </Typography>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={exportChat}
                disabled={!messages.length}
                className="p-2"
                title="대화 내보내기"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={clearCurrentChat}
                disabled={!messages.length}
                className="p-2"
                title="대화 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={startNewChat}
                className="p-2"
                title="새 대화"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* 메시지 목록 */}
        <MessageList
          messages={[
            ...messages,
            ...(currentResponse ? [{
              id: 'temp',
              role: 'assistant' as const,
              content: currentResponse,
              timestamp: new Date()
            }] : [])
          ]}
          isTyping={isTyping && !currentResponse}
          onExampleClick={(text) => setInputMessage(text)}
          onRegenerate={regenerateMessage}
        />
        
        {/* 메시지 입력 */}
        <MessageInput
          onSendMessage={(msg) => {
            sendMessage(msg);
            setInputMessage('');
          }}
          onStopGeneration={stopGeneration}
          isLoading={isLoading}
          disabled={!session}
          value={inputMessage}
          onChange={setInputMessage}
        />
      </div>
    </div>
  );
}