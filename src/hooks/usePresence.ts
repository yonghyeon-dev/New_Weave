import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/Toast';

export interface UserPresence {
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  currentPage?: string;
  currentDocument?: string;
  isTyping?: boolean;
  typingIn?: string;
  device?: {
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
  };
  location?: {
    city?: string;
    country?: string;
    timezone?: string;
  };
}

interface PresenceConfig {
  roomId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  heartbeatInterval?: number;
  awayTimeout?: number;
  offlineTimeout?: number;
  enableDeviceInfo?: boolean;
  enableLocationInfo?: boolean;
  onUserJoin?: (user: UserPresence) => void;
  onUserLeave?: (user: UserPresence) => void;
  onUserStatusChange?: (user: UserPresence) => void;
}

export function usePresence(config: PresenceConfig) {
  const {
    roomId,
    userId,
    userName,
    userEmail,
    userAvatar,
    heartbeatInterval = 30000, // 30초
    awayTimeout = 300000, // 5분
    offlineTimeout = 900000, // 15분
    enableDeviceInfo = true,
    enableLocationInfo = false,
    onUserJoin,
    onUserLeave,
    onUserStatusChange
  } = config;

  const { addToast } = useToast();
  const [users, setUsers] = useState<Map<string, UserPresence>>(new Map());
  const [myPresence, setMyPresence] = useState<UserPresence | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout>();
  const activityTimerRef = useRef<NodeJS.Timeout>();
  const supabase = createClient();

  // 디바이스 정보 가져오기
  const getDeviceInfo = useCallback(() => {
    if (!enableDeviceInfo) return undefined;

    const userAgent = navigator.userAgent;
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    
    if (/Mobile|Android|iPhone/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/iPad|Tablet/i.test(userAgent)) {
      deviceType = 'tablet';
    }

    // 브라우저 감지
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // OS 감지
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { type: deviceType, browser, os };
  }, [enableDeviceInfo]);

  // 위치 정보 가져오기 (비동기)
  const getLocationInfo = useCallback(async () => {
    if (!enableLocationInfo) return undefined;

    try {
      // Timezone 가져오기
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // IP 기반 위치 정보 (API 호출 필요)
      // 여기서는 간단히 timezone만 반환
      return {
        timezone,
        // city와 country는 외부 API 호출이 필요함
      };
    } catch (error) {
      console.error('Failed to get location info:', error);
      return undefined;
    }
  }, [enableLocationInfo]);

  // Presence 업데이트
  const updatePresence = useCallback(async (status: UserPresence['status'], additionalInfo?: Partial<UserPresence>) => {
    if (!channelRef.current) return;

    const locationInfo = await getLocationInfo();
    const presence: UserPresence = {
      userId,
      userName,
      userEmail,
      userAvatar,
      status,
      lastSeen: new Date(),
      currentPage: window.location.pathname,
      device: getDeviceInfo(),
      location: locationInfo,
      ...additionalInfo
    };

    setMyPresence(presence);

    // Supabase Presence 업데이트
    await channelRef.current.track(presence);
  }, [userId, userName, userEmail, userAvatar, getDeviceInfo, getLocationInfo]);

  // 하트비트 전송
  const sendHeartbeat = useCallback(() => {
    updatePresence('online', { lastSeen: new Date() });
  }, [updatePresence]);

  // 상태 변경
  const setStatus = useCallback((status: UserPresence['status']) => {
    updatePresence(status);
    
    if (status === 'offline') {
      // 오프라인 상태로 전환 시 채널 나가기
      channelRef.current?.untrack();
    }
  }, [updatePresence]);

  // 타이핑 상태 업데이트
  const setTypingStatus = useCallback((isTyping: boolean, documentId?: string) => {
    updatePresence(myPresence?.status || 'online', {
      isTyping,
      typingIn: isTyping ? documentId : undefined
    });
  }, [myPresence, updatePresence]);

  // 현재 문서 업데이트
  const setCurrentDocument = useCallback((documentId?: string) => {
    updatePresence(myPresence?.status || 'online', {
      currentDocument: documentId
    });
  }, [myPresence, updatePresence]);

  // 사용자 활동 감지
  const handleUserActivity = useCallback(() => {
    // Away 타이머 재설정
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }

    // 현재 상태가 away면 online으로 변경
    if (myPresence?.status === 'away') {
      setStatus('online');
    }

    // Away 타이머 설정
    activityTimerRef.current = setTimeout(() => {
      setStatus('away');
    }, awayTimeout);
  }, [myPresence, awayTimeout, setStatus]);

  // 사용자 목록 업데이트
  const updateUserList = useCallback((presenceState: any) => {
    const newUsers = new Map<string, UserPresence>();
    let onlineUserCount = 0;

    Object.keys(presenceState).forEach(key => {
      const presences = presenceState[key];
      if (Array.isArray(presences) && presences.length > 0) {
        // 가장 최근 presence 사용
        const latestPresence = presences[presences.length - 1];
        const userPresence = latestPresence as UserPresence;
        
        if (userPresence.userId !== userId) {
          newUsers.set(userPresence.userId, userPresence);
          
          if (userPresence.status === 'online' || userPresence.status === 'away' || userPresence.status === 'busy') {
            onlineUserCount++;
          }
        }
      }
    });

    // 변경 사항 감지
    users.forEach((oldUser, id) => {
      if (!newUsers.has(id)) {
        // 사용자가 떠남
        onUserLeave?.(oldUser);
      }
    });

    newUsers.forEach((newUser, id) => {
      if (!users.has(id)) {
        // 새 사용자가 접속
        onUserJoin?.(newUser);
        addToast(`${newUser.userName}님이 접속했습니다.`, 'info');
      } else {
        const oldUser = users.get(id)!;
        if (oldUser.status !== newUser.status) {
          // 상태 변경
          onUserStatusChange?.(newUser);
        }
      }
    });

    setUsers(newUsers);
    setOnlineCount(onlineUserCount);
  }, [userId, users, onUserJoin, onUserLeave, onUserStatusChange, addToast]);

  // 초기화 및 채널 설정
  useEffect(() => {
    const channel = supabase.channel(`presence:${roomId}`);
    channelRef.current = channel;

    // Presence 이벤트 리스너
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        updateUserList(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const state = channel.presenceState();
        updateUserList(state);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const state = channel.presenceState();
        updateUserList(state);
      });

    // 채널 구독
    channel.subscribe(async (status) => {
      setIsConnected(status === 'SUBSCRIBED');
      
      if (status === 'SUBSCRIBED') {
        // 초기 presence 설정
        await updatePresence('online');
        
        // 하트비트 시작
        heartbeatTimerRef.current = setInterval(sendHeartbeat, heartbeatInterval);
      }
    });

    // 활동 이벤트 리스너
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // 페이지 가시성 변경 감지
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setStatus('away');
      } else {
        setStatus('online');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 브라우저 닫기 전 처리
    const handleBeforeUnload = () => {
      setStatus('offline');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // 정리
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
      
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      channel.unsubscribe();
    };
  }, [roomId, userId, updatePresence, sendHeartbeat, handleUserActivity, updateUserList, heartbeatInterval, setStatus, supabase]);

  // 특정 상태의 사용자 가져오기
  const getUsersByStatus = useCallback((status: UserPresence['status']): UserPresence[] => {
    const result: UserPresence[] = [];
    users.forEach(user => {
      if (user.status === status) {
        result.push(user);
      }
    });
    return result;
  }, [users]);

  // 특정 문서에 있는 사용자 가져오기
  const getUsersInDocument = useCallback((documentId: string): UserPresence[] => {
    const result: UserPresence[] = [];
    users.forEach(user => {
      if (user.currentDocument === documentId) {
        result.push(user);
      }
    });
    return result;
  }, [users]);

  // 타이핑 중인 사용자 가져오기
  const getTypingUsers = useCallback((documentId?: string): UserPresence[] => {
    const result: UserPresence[] = [];
    users.forEach(user => {
      if (user.isTyping) {
        if (!documentId || user.typingIn === documentId) {
          result.push(user);
        }
      }
    });
    return result;
  }, [users]);

  return {
    users: Array.from(users.values()),
    myPresence,
    onlineCount,
    isConnected,
    setStatus,
    setTypingStatus,
    setCurrentDocument,
    getUsersByStatus,
    getUsersInDocument,
    getTypingUsers
  };
}