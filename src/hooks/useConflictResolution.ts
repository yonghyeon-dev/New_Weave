import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/Toast';

// Operational Transform (OT) 기반 충돌 해결
interface Operation {
  id: string;
  userId: string;
  timestamp: number;
  version: number;
  type: 'insert' | 'delete' | 'replace';
  position: number;
  content?: string;
  length?: number;
  oldContent?: string;
}

interface Document {
  id: string;
  content: string;
  version: number;
  lastModified: number;
  checksum: string;
}

interface ConflictResolutionConfig {
  documentId: string;
  userId: string;
  onConflict?: (operations: Operation[]) => void;
  onResolved?: (document: Document) => void;
  autoResolve?: boolean;
  conflictStrategy?: 'last-write-wins' | 'operational-transform' | 'three-way-merge';
}

export function useConflictResolution(config: ConflictResolutionConfig) {
  const {
    documentId,
    userId,
    onConflict,
    onResolved,
    autoResolve = true,
    conflictStrategy = 'operational-transform'
  } = config;

  const { addToast } = useToast();
  const [document, setDocument] = useState<Document | null>(null);
  const [pendingOperations, setPendingOperations] = useState<Operation[]>([]);
  const [conflicts, setConflicts] = useState<Operation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const operationQueueRef = useRef<Operation[]>([]);
  const supabase = createClient();

  // 체크섬 계산
  const calculateChecksum = useCallback((content: string): string => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }, []);

  // Operational Transform 적용
  const transformOperation = useCallback((op1: Operation, op2: Operation): Operation => {
    // op2가 먼저 적용되었을 때 op1을 변환
    let transformedOp = { ...op1 };

    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position > op2.position) {
        transformedOp.position += op2.content?.length || 0;
      } else if (op1.position === op2.position) {
        // 같은 위치에 삽입: userId로 우선순위 결정
        if (op1.userId > op2.userId) {
          transformedOp.position += op2.content?.length || 0;
        }
      }
    } else if (op1.type === 'insert' && op2.type === 'delete') {
      if (op1.position > op2.position) {
        transformedOp.position -= Math.min(op2.length || 0, op1.position - op2.position);
      }
    } else if (op1.type === 'delete' && op2.type === 'insert') {
      if (op1.position >= op2.position) {
        transformedOp.position += op2.content?.length || 0;
      }
    } else if (op1.type === 'delete' && op2.type === 'delete') {
      if (op1.position > op2.position) {
        transformedOp.position -= Math.min(op2.length || 0, op1.position - op2.position);
      } else if (op1.position === op2.position) {
        // 같은 위치에서 삭제: 길이 조정
        const overlap = Math.min(op1.length || 0, op2.length || 0);
        transformedOp.length = (op1.length || 0) - overlap;
      }
    }

    return transformedOp;
  }, []);

  // 작업 적용
  const applyOperation = useCallback((doc: Document, op: Operation): Document => {
    let newContent = doc.content;
    
    switch (op.type) {
      case 'insert':
        newContent = 
          newContent.slice(0, op.position) + 
          (op.content || '') + 
          newContent.slice(op.position);
        break;
        
      case 'delete':
        newContent = 
          newContent.slice(0, op.position) + 
          newContent.slice(op.position + (op.length || 0));
        break;
        
      case 'replace':
        newContent = 
          newContent.slice(0, op.position) + 
          (op.content || '') + 
          newContent.slice(op.position + (op.length || 0));
        break;
    }

    return {
      ...doc,
      content: newContent,
      version: doc.version + 1,
      lastModified: Date.now(),
      checksum: calculateChecksum(newContent)
    };
  }, [calculateChecksum]);

  // 3-way 병합
  const threeWayMerge = useCallback((base: string, local: string, remote: string): string => {
    // 간단한 3-way merge 구현
    // 실제로는 diff3 알고리즘 사용이 필요함
    
    if (local === remote) return local;
    if (base === local) return remote;
    if (base === remote) return local;
    
    // 충돌 발생: 마커를 삽입하여 표시
    return `<<<<<<< LOCAL\n${local}\n=======\n${remote}\n>>>>>>> REMOTE`;
  }, []);

  // 충돌 감지
  const detectConflict = useCallback((localOp: Operation, remoteOp: Operation): boolean => {
    // 같은 영역을 수정하는지 확인
    const localStart = localOp.position;
    const localEnd = localOp.position + (localOp.length || localOp.content?.length || 0);
    const remoteStart = remoteOp.position;
    const remoteEnd = remoteOp.position + (remoteOp.length || remoteOp.content?.length || 0);
    
    // 겹치는 영역이 있으면 충돌
    return !(localEnd < remoteStart || remoteEnd < localStart);
  }, []);

  // 충돌 해결
  const resolveConflicts = useCallback(async (localOps: Operation[], remoteOps: Operation[]) => {
    if (!document) return;
    
    setIsSyncing(true);
    let resolvedDoc = { ...document };
    
    try {
      switch (conflictStrategy) {
        case 'last-write-wins':
          // 가장 최근 작업이 이김
          const allOps = [...localOps, ...remoteOps].sort((a, b) => a.timestamp - b.timestamp);
          for (const op of allOps) {
            resolvedDoc = applyOperation(resolvedDoc, op);
          }
          break;
          
        case 'operational-transform':
          // OT를 사용한 충돌 해결
          const transformedLocalOps = [...localOps];
          const transformedRemoteOps = [...remoteOps];
          
          // 로컬 작업을 원격 작업에 대해 변환
          for (let i = 0; i < transformedLocalOps.length; i++) {
            for (let j = 0; j < transformedRemoteOps.length; j++) {
              transformedLocalOps[i] = transformOperation(
                transformedLocalOps[i], 
                transformedRemoteOps[j]
              );
            }
          }
          
          // 변환된 작업 적용
          for (const op of [...transformedRemoteOps, ...transformedLocalOps]) {
            resolvedDoc = applyOperation(resolvedDoc, op);
          }
          break;
          
        case 'three-way-merge':
          // 3-way merge 사용
          // 이를 위해서는 base 버전이 필요함
          addToast('3-way merge는 현재 개발 중입니다.', 'info');
          break;
      }
      
      setDocument(resolvedDoc);
      onResolved?.(resolvedDoc);
      
      // 서버에 해결된 문서 저장
      await saveDocument(resolvedDoc);
      
      addToast('충돌이 자동으로 해결되었습니다.', 'success');
    } catch (error) {
      console.error('Conflict resolution failed:', error);
      addToast('충돌 해결에 실패했습니다.', 'error');
      
      // 충돌을 사용자에게 알림
      setConflicts([...localOps, ...remoteOps]);
      onConflict?.([...localOps, ...remoteOps]);
    } finally {
      setIsSyncing(false);
    }
  }, [document, conflictStrategy, applyOperation, transformOperation, onResolved, onConflict, addToast]);

  // 문서 저장
  const saveDocument = useCallback(async (doc: Document) => {
    try {
      const { error } = await supabase
        .from('documents')
        .upsert({
          id: doc.id,
          content: doc.content,
          version: doc.version,
          last_modified: new Date(doc.lastModified).toISOString(),
          checksum: doc.checksum
        } as any);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save document:', error);
      throw error;
    }
  }, [supabase]);

  // 로컬 변경 사항 브로드캐스트
  const broadcastOperation = useCallback((operation: Operation) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'operation',
        payload: operation
      });
    }
    
    // 로컬 큐에도 추가
    operationQueueRef.current.push(operation);
  }, []);

  // 텍스트 변경 처리
  const handleTextChange = useCallback((newContent: string, position: number, changeType: 'insert' | 'delete' | 'replace', oldContent?: string) => {
    if (!document) return;
    
    const operation: Operation = {
      id: `${userId}-${Date.now()}`,
      userId,
      timestamp: Date.now(),
      version: document.version,
      type: changeType,
      position,
      content: changeType === 'delete' ? undefined : newContent,
      length: changeType === 'delete' ? newContent.length : oldContent?.length,
      oldContent
    };
    
    // 로컬 적용
    const newDoc = applyOperation(document, operation);
    setDocument(newDoc);
    
    // 브로드캐스트
    broadcastOperation(operation);
  }, [document, userId, applyOperation, broadcastOperation]);

  // 수동 충돌 해결
  const resolveManually = useCallback((resolution: 'local' | 'remote' | 'merge') => {
    if (conflicts.length === 0) return;
    
    switch (resolution) {
      case 'local':
        // 로컬 변경사항 유지
        setConflicts([]);
        addToast('로컬 변경사항을 선택했습니다.', 'info');
        break;
        
      case 'remote':
        // 원격 변경사항 적용
        if (document) {
          const remoteOps = conflicts.filter(op => op.userId !== userId);
          let newDoc = { ...document };
          for (const op of remoteOps) {
            newDoc = applyOperation(newDoc, op);
          }
          setDocument(newDoc);
          saveDocument(newDoc);
        }
        setConflicts([]);
        addToast('원격 변경사항을 선택했습니다.', 'info');
        break;
        
      case 'merge':
        // 병합 시도
        const localOps = conflicts.filter(op => op.userId === userId);
        const remoteOps = conflicts.filter(op => op.userId !== userId);
        resolveConflicts(localOps, remoteOps);
        break;
    }
  }, [conflicts, document, userId, applyOperation, saveDocument, resolveConflicts, addToast]);

  return {
    document,
    conflicts,
    isSyncing,
    pendingOperations,
    handleTextChange,
    resolveManually,
    broadcastOperation
  };
}