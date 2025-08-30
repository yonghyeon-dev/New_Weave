import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

interface OfflineConfig {
  enableSync?: boolean;
  syncInterval?: number;
  showNotifications?: boolean;
}

interface OfflineState {
  isOnline: boolean;
  isSupported: boolean;
  pendingRequests: number;
  lastSyncTime: Date | null;
}

export function useOffline(config: OfflineConfig = {}) {
  const {
    enableSync = true,
    syncInterval = 30000, // 30 seconds
    showNotifications = true
  } = config;

  const { addToast } = useToast();
  
  const [state, setState] = useState<OfflineState>({
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    isSupported: false,
    pendingRequests: 0,
    lastSyncTime: null
  });

  // Service Worker 등록
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        setState(prev => ({ ...prev, isSupported: true }));
        
        // 업데이트 체크
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                if (showNotifications) {
                  addToast('새로운 버전이 있습니다. 새로고침하여 업데이트하세요.', 'info');
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }, [addToast, showNotifications]);

  // 온라인/오프라인 상태 감지
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      
      if (showNotifications) {
        addToast('인터넷 연결이 복구되었습니다.', 'success');
      }
      
      // 자동 동기화
      if (enableSync) {
        syncPendingData();
      }
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      
      if (showNotifications) {
        addToast('오프라인 모드로 전환되었습니다.', 'warning');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker 등록
    registerServiceWorker();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enableSync, showNotifications, addToast, registerServiceWorker]);

  // 대기중인 데이터 동기화
  const syncPendingData = useCallback(async () => {
    if (!state.isOnline) return;

    try {
      // IndexedDB에서 대기중인 데이터 가져오기
      const pendingData = await getPendingDataFromIndexedDB();
      
      if (pendingData.length > 0) {
        setState(prev => ({ ...prev, pendingRequests: pendingData.length }));
        
        // 서버로 데이터 전송
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pendingData)
        });

        if (response.ok) {
          await clearPendingDataFromIndexedDB();
          setState(prev => ({
            ...prev,
            pendingRequests: 0,
            lastSyncTime: new Date()
          }));
          
          if (showNotifications) {
            addToast(`${pendingData.length}개의 변경사항이 동기화되었습니다.`, 'success');
          }
        }
      }
    } catch (error) {
      console.error('Sync failed:', error);
      if (showNotifications) {
        addToast('동기화 중 오류가 발생했습니다.', 'error');
      }
    }
  }, [state.isOnline, showNotifications, addToast]);

  // 주기적 동기화
  useEffect(() => {
    if (!enableSync || !state.isOnline) return;

    const interval = setInterval(syncPendingData, syncInterval);
    return () => clearInterval(interval);
  }, [enableSync, state.isOnline, syncInterval, syncPendingData]);

  // 수동 동기화 트리거
  const triggerSync = useCallback(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_DATA'
      });
    }
    syncPendingData();
  }, [syncPendingData]);

  // 오프라인 데이터 저장
  const saveOfflineData = useCallback(async (data: any) => {
    try {
      await saveToIndexedDB(data);
      setState(prev => ({ ...prev, pendingRequests: prev.pendingRequests + 1 }));
      
      if (!state.isOnline && showNotifications) {
        addToast('변경사항이 로컬에 저장되었습니다. 온라인 시 동기화됩니다.', 'info');
      }
    } catch (error) {
      console.error('Failed to save offline data:', error);
      if (showNotifications) {
        addToast('오프라인 저장 실패', 'error');
      }
    }
  }, [state.isOnline, showNotifications, addToast]);

  return {
    ...state,
    syncPendingData,
    triggerSync,
    saveOfflineData
  };
}

// IndexedDB Helper Functions
const DB_NAME = 'WeaveOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'pendingData';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function saveToIndexedDB(data: any): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  
  const dataWithTimestamp = {
    ...data,
    timestamp: new Date().toISOString(),
    synced: false
  };
  
  store.add(dataWithTimestamp);
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getPendingDataFromIndexedDB(): Promise<any[]> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const data = request.result.filter((item: any) => !item.synced);
      resolve(data);
    };
    request.onerror = () => reject(request.error);
  });
}

async function clearPendingDataFromIndexedDB(): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  
  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}