import { useState, useCallback, useRef } from 'react';
import { useOffline } from './useOffline';

interface OptimisticUpdateConfig<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error, previousData: T) => void;
  retryCount?: number;
  retryDelay?: number;
  enableOfflineQueue?: boolean;
}

interface OptimisticState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isPending: boolean;
  version: number;
}

export function useOptimisticUpdate<T>(
  initialData: T | null = null,
  config: OptimisticUpdateConfig<T> = {}
) {
  const {
    onSuccess,
    onError,
    retryCount = 3,
    retryDelay = 1000,
    enableOfflineQueue = true
  } = config;

  const { isOnline, saveOfflineData } = useOffline();
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    isPending: false,
    version: 0
  });

  const rollbackDataRef = useRef<T | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  // 낙관적 업데이트 실행
  const executeOptimisticUpdate = useCallback(async (
    optimisticData: T | ((prev: T | null) => T),
    serverUpdate: () => Promise<T>,
    options: {
      immediate?: boolean;
      rollbackOnError?: boolean;
      showIndicator?: boolean;
    } = {}
  ) => {
    const {
      immediate = true,
      rollbackOnError = true,
      showIndicator = true
    } = options;

    // 현재 데이터 백업 (롤백용)
    rollbackDataRef.current = state.data;

    // 낙관적 업데이트 즉시 적용
    if (immediate) {
      const newData = typeof optimisticData === 'function'
        ? (optimisticData as (prev: T | null) => T)(state.data)
        : optimisticData;

      setState(prev => ({
        ...prev,
        data: newData,
        isPending: showIndicator,
        version: prev.version + 1
      }));
    }

    // 로딩 상태 설정
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 오프라인 처리
      if (!isOnline && enableOfflineQueue) {
        const queueData = {
          type: 'optimistic_update',
          data: typeof optimisticData === 'function'
            ? (optimisticData as (prev: T | null) => T)(state.data)
            : optimisticData,
          timestamp: new Date().toISOString()
        };

        await saveOfflineData(queueData);
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPending: false
        }));

        return;
      }

      // 서버 업데이트 실행
      const serverData = await executeWithRetry(serverUpdate, retryCount, retryDelay);

      // 서버 응답으로 데이터 업데이트
      setState(prev => ({
        ...prev,
        data: serverData,
        isLoading: false,
        isPending: false,
        error: null,
        version: prev.version + 1
      }));

      // 성공 콜백
      if (onSuccess) {
        onSuccess(serverData);
      }

      return serverData;
    } catch (error) {
      const err = error as Error;
      
      // 에러 상태 설정
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPending: false,
        error: err
      }));

      // 롤백 처리
      if (rollbackOnError && rollbackDataRef.current !== null) {
        setState(prev => ({
          ...prev,
          data: rollbackDataRef.current,
          version: prev.version + 1
        }));

        // 에러 콜백
        if (onError) {
          onError(err, rollbackDataRef.current);
        }
      }

      throw err;
    }
  }, [state.data, isOnline, enableOfflineQueue, saveOfflineData, onSuccess, onError, retryCount, retryDelay]);

  // 재시도 로직
  const executeWithRetry = async <R>(
    fn: () => Promise<R>,
    retriesLeft: number,
    delay: number
  ): Promise<R> => {
    try {
      return await fn();
    } catch (error) {
      if (retriesLeft <= 0) {
        throw error;
      }

      return new Promise((resolve, reject) => {
        retryTimeoutRef.current = setTimeout(async () => {
          try {
            const result = await executeWithRetry(fn, retriesLeft - 1, delay * 2);
            resolve(result);
          } catch (retryError) {
            reject(retryError);
          }
        }, delay);
      });
    }
  };

  // 수동 롤백
  const rollback = useCallback(() => {
    if (rollbackDataRef.current !== null) {
      setState(prev => ({
        ...prev,
        data: rollbackDataRef.current,
        version: prev.version + 1
      }));
    }
  }, []);

  // 데이터 리셋
  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
      isPending: false,
      version: 0
    });
    rollbackDataRef.current = null;
  }, [initialData]);

  // 클린업
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  return {
    ...state,
    executeOptimisticUpdate,
    rollback,
    reset,
    cleanup
  };
}

// Supabase와 통합된 낙관적 업데이트 Hook
export function useSupabaseOptimistic<T extends { id: string }>(
  service: any,
  initialData: T[] = []
) {
  const [items, setItems] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline, saveOfflineData } = useOffline();

  // 낙관적 생성
  const optimisticCreate = useCallback(async (
    newItem: Omit<T, 'id'>,
    options = { immediate: true }
  ) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticItem = { ...newItem, id: tempId } as T;

    // 즉시 UI 업데이트
    if (options.immediate) {
      setItems(prev => [...prev, optimisticItem]);
    }

    try {
      if (!isOnline) {
        await saveOfflineData({
          type: 'create',
          table: service.tableName,
          data: newItem
        });
        return optimisticItem;
      }

      const createdItem = await service.create(newItem);
      
      // 임시 아이템을 실제 아이템으로 교체
      setItems(prev => prev.map(item =>
        item.id === tempId ? createdItem : item
      ));

      return createdItem;
    } catch (error) {
      // 롤백
      setItems(prev => prev.filter(item => item.id !== tempId));
      throw error;
    }
  }, [isOnline, saveOfflineData, service]);

  // 낙관적 업데이트
  const optimisticUpdate = useCallback(async (
    id: string,
    updates: Partial<T>,
    options = { immediate: true }
  ) => {
    const previousItem = items.find(item => item.id === id);
    
    if (!previousItem) {
      throw new Error('Item not found');
    }

    // 즉시 UI 업데이트
    if (options.immediate) {
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ));
    }

    try {
      if (!isOnline) {
        await saveOfflineData({
          type: 'update',
          table: service.tableName,
          id,
          data: updates
        });
        return { ...previousItem, ...updates };
      }

      const updatedItem = await service.update(id, updates);
      
      // 서버 응답으로 업데이트
      setItems(prev => prev.map(item =>
        item.id === id ? updatedItem : item
      ));

      return updatedItem;
    } catch (error) {
      // 롤백
      setItems(prev => prev.map(item =>
        item.id === id ? previousItem : item
      ));
      throw error;
    }
  }, [items, isOnline, saveOfflineData, service]);

  // 낙관적 삭제
  const optimisticDelete = useCallback(async (
    id: string,
    options = { immediate: true }
  ) => {
    const previousItem = items.find(item => item.id === id);
    
    if (!previousItem) {
      throw new Error('Item not found');
    }

    // 즉시 UI 업데이트
    if (options.immediate) {
      setItems(prev => prev.filter(item => item.id !== id));
    }

    try {
      if (!isOnline) {
        await saveOfflineData({
          type: 'delete',
          table: service.tableName,
          id
        });
        return;
      }

      await service.delete(id);
    } catch (error) {
      // 롤백
      setItems(prev => [...prev, previousItem]);
      throw error;
    }
  }, [items, isOnline, saveOfflineData, service]);

  // 데이터 로드
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await service.getAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  return {
    items,
    isLoading,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    loadData,
    setItems
  };
}