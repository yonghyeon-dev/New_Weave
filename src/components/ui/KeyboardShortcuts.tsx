'use client';

import React, { useEffect } from 'react';
import Typography from '@/components/ui/Typography';

export type ViewMode = 'list' | 'detail';

export interface KeyboardShortcutsProps {
  mode: ViewMode;
  onNavigateProject?: (direction: 'prev' | 'next') => void;
  onSelectProject?: () => void;
  onCreateProject?: () => void;
  totalProjects?: number;
  className?: string;
}

/**
 * 통합 키보드 네비게이션 훅
 * List view와 Detail view 모두에서 사용 가능
 */
export function useKeyboardNavigation({
  mode,
  onNavigateProject,
  onSelectProject,
  onCreateProject,
  totalProjects = 0
}: Omit<KeyboardShortcutsProps, 'className'>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 입력 필드에서는 키보드 네비게이션 비활성화
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Cmd+K 또는 Ctrl+K (브라우저 충돌 없음)
      if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopImmediatePropagation(); // 중복 실행 방지
        if (onCreateProject) {
          onCreateProject();
        }
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          event.stopImmediatePropagation(); // 중복 실행 방지
          if (totalProjects > 0 && onNavigateProject) {
            onNavigateProject('prev');
          }
          break;
          
        case 'ArrowDown':
          event.preventDefault();
          event.stopImmediatePropagation(); // 중복 실행 방지
          if (totalProjects > 0 && onNavigateProject) {
            onNavigateProject('next');
          }
          break;
          
        case 'Enter':
          // List view에서만 Enter 키 활성화
          if (mode === 'list' && onSelectProject) {
            event.preventDefault();
            event.stopImmediatePropagation(); // 중복 실행 방지
            onSelectProject();
          }
          break;
          
      }
    };

    // keypress 이벤트도 추가로 차단
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // 단일 이벤트 리스너로 중복 방지
    const options = { 
      capture: true, 
      passive: false  // preventDefault가 확실히 작동하도록
    };
    
    // document에만 이벤트 등록 (window 중복 등록 제거)
    document.addEventListener('keydown', handleKeyDown, options);
    document.addEventListener('keypress', handleKeyPress, options);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, options);
      document.removeEventListener('keypress', handleKeyPress, options);
    };
  }, [mode, onNavigateProject, onSelectProject, onCreateProject, totalProjects]);
}

/**
 * 키보드 단축키 안내 오버레이 컴포넌트
 * 개발 모드에서만 표시
 */
export function KeyboardShortcutsOverlay({ 
  mode, 
  className = ""
}: Pick<KeyboardShortcutsProps, 'mode' | 'className'>) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // 운영체제에 따른 키 조합 표시
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifierKey = isMac ? 'Cmd' : 'Ctrl';
  
  const shortcuts = {
    list: [
      { keys: '↑/↓', description: '프로젝트 탐색' },
      { keys: 'Enter', description: '프로젝트 선택' },
      { keys: `${modifierKey}+K`, description: '새 프로젝트' }
    ],
    detail: [
      { keys: '↑/↓', description: '프로젝트 탐색' },
      { keys: `${modifierKey}+K`, description: '새 프로젝트' }
    ]
  };

  return (
    <div className={`fixed bottom-4 left-4 p-3 bg-gray-800 text-white text-xs rounded-lg opacity-75 z-10 pointer-events-none ${className}`}>
      {shortcuts[mode].map((shortcut, index) => (
        <div key={index} className="whitespace-nowrap">
          <span className="font-semibold">{shortcut.keys}</span>: {shortcut.description}
        </div>
      ))}
    </div>
  );
}

/**
 * 통합 키보드 네비게이션 컴포넌트
 * 훅과 오버레이를 함께 제공
 */
export default function KeyboardShortcuts({
  mode,
  onNavigateProject,
  onSelectProject,
  onCreateProject,
  totalProjects,
  className
}: KeyboardShortcutsProps) {
  // 키보드 네비게이션 훅 사용
  useKeyboardNavigation({
    mode,
    onNavigateProject,
    onSelectProject,
    onCreateProject,
    totalProjects
  });

  // 오버레이 렌더링
  return (
    <KeyboardShortcutsOverlay 
      mode={mode}
      className={className}
    />
  );
}