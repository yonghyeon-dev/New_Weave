import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/Toast';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mention' | 'task' | 'comment' | 'update';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  relatedId?: string;
  relatedType?: 'project' | 'task' | 'document' | 'invoice' | 'client';
  actionUrl?: string;
  actionLabel?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

interface NotificationConfig {
  userId: string;
  enableSound?: boolean;
  enableDesktop?: boolean;
  enableToast?: boolean;
  soundUrl?: string;
  autoMarkAsRead?: boolean;
  autoMarkAsReadDelay?: number;
  maxNotifications?: number;
  filterTypes?: Notification['type'][];
  onNotification?: (notification: Notification) => void;
  onRead?: (notificationId: string) => void;
  onClear?: () => void;
}

export function useRealtimeNotifications(config: NotificationConfig) {
  const {
    userId,
    enableSound = true,
    enableDesktop = true,
    enableToast = true,
    soundUrl = '/sounds/notification.mp3',
    autoMarkAsRead = false,
    autoMarkAsReadDelay = 5000,
    maxNotifications = 50,
    filterTypes,
    onNotification,
    onRead,
    onClear
  } = config;

  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  // 데스크톱 알림 권한 요청
  const requestDesktopPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setHasPermission(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasPermission(granted);
      return granted;
    }

    return false;
  }, []);

  // 사운드 재생
  const playSound = useCallback(() => {
    if (!enableSound) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = 0.5;
    }

    audioRef.current.play().catch(error => {
      console.error('Failed to play notification sound:', error);
    });
  }, [enableSound, soundUrl]);

  // 데스크톱 알림 표시
  const showDesktopNotification = useCallback((notification: Notification) => {
    if (!enableDesktop || !hasPermission) return;

    const notif = new Notification(notification.title, {
      body: notification.message,
      icon: notification.fromUserAvatar || '/logo.png',
      badge: '/badge.png',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
      silent: !enableSound,
      data: {
        url: notification.actionUrl,
        notificationId: notification.id
      }
    });

    // 클릭 시 액션
    notif.onclick = () => {
      window.focus();
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl;
      }
      markAsRead(notification.id);
      notif.close();
    };

    // 자동 닫기 (긴급이 아닌 경우)
    if (notification.priority !== 'urgent') {
      setTimeout(() => notif.close(), 5000);
    }
  }, [enableDesktop, hasPermission, enableSound]);

  // 토스트 알림 표시
  const showToastNotification = useCallback((notification: Notification) => {
    if (!enableToast) return;

    let variant: 'info' | 'success' | 'warning' | 'error' = 'info';
    
    switch (notification.type) {
      case 'success':
        variant = 'success';
        break;
      case 'warning':
        variant = 'warning';
        break;
      case 'error':
        variant = 'error';
        break;
      case 'mention':
      case 'task':
        variant = 'info';
        break;
    }

    addToast(
      `${notification.title}: ${notification.message}`,
      variant,
      {
        duration: notification.priority === 'urgent' ? 10000 : 5000,
        action: notification.actionUrl ? {
          label: notification.actionLabel || '보기',
          onClick: () => {
            if (notification.actionUrl) {
              window.location.href = notification.actionUrl;
            }
          }
        } : undefined
      }
    );
  }, [enableToast, addToast]);

  // 알림 처리
  const handleNotification = useCallback((notification: Notification) => {
    // 필터링
    if (filterTypes && !filterTypes.includes(notification.type)) {
      return;
    }

    // 알림 추가
    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      // 최대 개수 제한
      if (newNotifications.length > maxNotifications) {
        newNotifications.splice(maxNotifications);
      }
      return newNotifications;
    });

    // 미읽 카운트 업데이트
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }

    // 알림 표시
    playSound();
    showDesktopNotification(notification);
    showToastNotification(notification);

    // 콜백
    onNotification?.(notification);

    // 자동 읽음 처리
    if (autoMarkAsRead && !notification.read) {
      setTimeout(() => {
        markAsRead(notification.id);
      }, autoMarkAsReadDelay);
    }
  }, [filterTypes, maxNotifications, playSound, showDesktopNotification, showToastNotification, onNotification, autoMarkAsRead, autoMarkAsReadDelay]);

  // 알림 읽음 표시
  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );

    setUnreadCount(prev => Math.max(0, prev - 1));

    // 서버에 업데이트 - notifications 테이블이 준비되면 활성화
    // try {
    //   await supabase
    //     .from('notifications')
    //     .update({ read: true, read_at: new Date().toISOString() } as any)
    //     .eq('id', notificationId);
    // } catch (error) {
    //   console.error('Failed to mark notification as read:', error);
    // }

    onRead?.(notificationId);
  }, [supabase, onRead]);

  // 모든 알림 읽음 표시
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );

    setUnreadCount(0);

    // 서버에 업데이트 - notifications 테이블이 준비되면 활성화
    // try {
    //   const unreadIds = notifications
    //     .filter(n => !n.read)
    //     .map(n => n.id);

    //   if (unreadIds.length > 0) {
    //     await supabase
    //       .from('notifications')
    //       .update({ read: true, read_at: new Date().toISOString() })
    //       .in('id', unreadIds);
    //   }
    // } catch (error) {
    //   console.error('Failed to mark all notifications as read:', error);
    // }
  }, [notifications, supabase]);

  // 알림 삭제
  const deleteNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });

    // 서버에서 삭제
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [supabase]);

  // 모든 알림 삭제
  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);
    setUnreadCount(0);

    // 서버에서 삭제
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }

    onClear?.();
  }, [userId, supabase, onClear]);

  // 기존 알림 로드
  const loadExistingNotifications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(maxNotifications);

      if (error) throw error;

      if (data) {
        const notifications = data.map((item: any) => ({
          ...(item as object),
          timestamp: new Date(item.created_at),
          expiresAt: item.expires_at ? new Date(item.expires_at) : undefined
        })) as Notification[];

        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, [userId, maxNotifications, supabase]);

  // 실시간 채널 설정
  useEffect(() => {
    // 데스크톱 알림 권한 요청
    requestDesktopPermission();

    // 기존 알림 로드
    loadExistingNotifications();

    // 실시간 채널 설정
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const notification: Notification = {
            ...payload.new,
            timestamp: new Date(payload.new.created_at),
            expiresAt: payload.new.expires_at ? new Date(payload.new.expires_at) : undefined
          } as Notification;

          handleNotification(notification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setNotifications(prev =>
            prev.map(notif =>
              notif.id === payload.new.id
                ? {
                    ...payload.new,
                    timestamp: new Date(payload.new.created_at),
                    expiresAt: payload.new.expires_at ? new Date(payload.new.expires_at) : undefined
                  } as Notification
                : notif
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setNotifications(prev =>
            prev.filter(notif => notif.id !== payload.old.id)
          );
        }
      );

    channelRef.current = channel;

    // 채널 구독
    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    // 만료된 알림 정리
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setNotifications(prev =>
        prev.filter(notif => !notif.expiresAt || notif.expiresAt > now)
      );
    }, 60000); // 1분마다 체크

    return () => {
      clearInterval(cleanupInterval);
      channel.unsubscribe();
    };
  }, [userId, requestDesktopPermission, loadExistingNotifications, handleNotification, supabase]);

  // 특정 타입의 알림 가져오기
  const getNotificationsByType = useCallback((type: Notification['type']): Notification[] => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // 특정 우선순위의 알림 가져오기
  const getNotificationsByPriority = useCallback((priority: Notification['priority']): Notification[] => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  // 미읽 알림만 가져오기
  const getUnreadNotifications = useCallback((): Notification[] => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    isConnected,
    hasPermission,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByPriority,
    getUnreadNotifications,
    requestDesktopPermission
  };
}