import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
  selectionStart?: number;
  selectionEnd?: number;
  timestamp: number;
}

interface UserCursor {
  userId: string;
  userName: string;
  userColor: string;
  position: CursorPosition;
  isActive: boolean;
  lastActivity: number;
}

interface RealtimeCursorConfig {
  roomId: string;
  userId: string;
  userName: string;
  userColor?: string;
  throttleMs?: number;
  inactivityTimeout?: number;
  enableSmoothing?: boolean;
}

export function useRealtimeCursor(config: RealtimeCursorConfig) {
  const {
    roomId,
    userId,
    userName,
    userColor = generateUserColor(userId),
    throttleMs = 50,
    inactivityTimeout = 30000, // 30초
    enableSmoothing = true
  } = config;

  const [cursors, setCursors] = useState<Map<string, UserCursor>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastBroadcastRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const smoothedPositionsRef = useRef<Map<string, CursorPosition>>(new Map());

  const supabase = createClient();

  // 커서 위치 브로드캐스트
  const broadcastCursor = useCallback((position: CursorPosition) => {
    const now = Date.now();
    
    // 스로틀링
    if (now - lastBroadcastRef.current < throttleMs) {
      return;
    }

    lastBroadcastRef.current = now;

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'cursor',
        payload: {
          userId,
          userName,
          userColor,
          position: {
            ...position,
            timestamp: now
          }
        }
      });
    }
  }, [userId, userName, userColor, throttleMs]);

  // 마우스 이동 처리
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const position: CursorPosition = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    };

    // 타겟 엘리먼트 정보 추가
    const target = e.target as HTMLElement;
    if (target.id) {
      position.elementId = target.id;
    }

    // 텍스트 선택 정보 추가
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      position.selectionStart = range.startOffset;
      position.selectionEnd = range.endOffset;
    }

    broadcastCursor(position);
  }, [broadcastCursor]);

  // 커서 비활성화 처리
  const handleInactivity = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'cursor-inactive',
        payload: { userId }
      });
    }
  }, [userId]);

  // 부드러운 커서 이동 애니메이션
  const smoothCursorMovement = useCallback(() => {
    if (!enableSmoothing) return;

    setCursors(currentCursors => {
      const newCursors = new Map(currentCursors);
      
      newCursors.forEach((cursor, id) => {
        const smoothedPos = smoothedPositionsRef.current.get(id);
        if (!smoothedPos) {
          smoothedPositionsRef.current.set(id, cursor.position);
          return;
        }

        // 선형 보간 (Lerp)
        const lerp = (start: number, end: number, factor: number) => {
          return start + (end - start) * factor;
        };

        const smoothingFactor = 0.3;
        const newX = lerp(smoothedPos.x, cursor.position.x, smoothingFactor);
        const newY = lerp(smoothedPos.y, cursor.position.y, smoothingFactor);

        const newPosition = {
          ...cursor.position,
          x: newX,
          y: newY
        };

        smoothedPositionsRef.current.set(id, newPosition);
        newCursors.set(id, {
          ...cursor,
          position: newPosition
        });
      });

      return newCursors;
    });

    animationFrameRef.current = requestAnimationFrame(smoothCursorMovement);
  }, [enableSmoothing]);

  // 실시간 채널 설정
  useEffect(() => {
    const channel = supabase.channel(`cursor:${roomId}`);
    channelRef.current = channel;

    // 커서 업데이트 수신
    channel.on('broadcast', { event: 'cursor' }, ({ payload }) => {
      if (payload.userId !== userId) {
        setCursors(prev => {
          const newCursors = new Map(prev);
          newCursors.set(payload.userId, {
            userId: payload.userId,
            userName: payload.userName,
            userColor: payload.userColor,
            position: payload.position,
            isActive: true,
            lastActivity: Date.now()
          });
          return newCursors;
        });
      }
    });

    // 비활성 커서 처리
    channel.on('broadcast', { event: 'cursor-inactive' }, ({ payload }) => {
      if (payload.userId !== userId) {
        setCursors(prev => {
          const newCursors = new Map(prev);
          const cursor = newCursors.get(payload.userId);
          if (cursor) {
            newCursors.set(payload.userId, {
              ...cursor,
              isActive: false
            });
          }
          return newCursors;
        });
      }
    });

    // 사용자 떠남 처리
    channel.on('presence', { event: 'leave' }, ({ key }) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.delete(key);
        smoothedPositionsRef.current.delete(key);
        return newCursors;
      });
    });

    // 연결 상태 추적
    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
      
      if (status === 'SUBSCRIBED') {
        // Presence 트래킹 시작
        channel.track({
          userId,
          userName,
          userColor,
          online_at: new Date().toISOString()
        });
      }
    });

    // 이벤트 리스너 등록
    document.addEventListener('mousemove', handleMouseMove);
    
    // 비활성 타이머
    let inactivityTimer: NodeJS.Timeout;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleInactivity, inactivityTimeout);
    };

    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);

    // 부드러운 애니메이션 시작
    if (enableSmoothing) {
      animationFrameRef.current = requestAnimationFrame(smoothCursorMovement);
    }

    // 오래된 커서 정리
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.forEach((cursor, id) => {
          if (now - cursor.lastActivity > inactivityTimeout * 2) {
            newCursors.delete(id);
            smoothedPositionsRef.current.delete(id);
          }
        });
        return newCursors;
      });
    }, 10000); // 10초마다 정리

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', resetInactivityTimer);
      document.removeEventListener('keypress', resetInactivityTimer);
      clearTimeout(inactivityTimer);
      clearInterval(cleanupInterval);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      channel.unsubscribe();
    };
  }, [roomId, userId, userName, userColor, handleMouseMove, handleInactivity, inactivityTimeout, enableSmoothing, smoothCursorMovement, supabase]);

  // 특정 엘리먼트에서의 커서 위치 가져오기
  const getCursorOnElement = useCallback((elementId: string): UserCursor[] => {
    const result: UserCursor[] = [];
    cursors.forEach(cursor => {
      if (cursor.position.elementId === elementId && cursor.isActive) {
        result.push(cursor);
      }
    });
    return result;
  }, [cursors]);

  // 활성 사용자 수 가져오기
  const getActiveUserCount = useCallback((): number => {
    let count = 0;
    cursors.forEach(cursor => {
      if (cursor.isActive) count++;
    });
    return count;
  }, [cursors]);

  return {
    cursors: Array.from(cursors.values()),
    isConnected,
    getCursorOnElement,
    getActiveUserCount,
    broadcastCursor
  };
}

// 사용자별 고유 색상 생성
function generateUserColor(userId: string): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
    '#6366F1', // indigo
    '#84CC16', // lime
  ];
  
  // userId 해시를 기반으로 색상 선택
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}