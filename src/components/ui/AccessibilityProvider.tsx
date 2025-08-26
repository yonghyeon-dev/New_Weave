'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// 접근성 설정 타입
export interface AccessibilitySettings {
  // 키보드 네비게이션
  keyboardNavigation: boolean;
  focusVisible: boolean;
  skipLinks: boolean;
  
  // 시각적 접근성
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  
  // 스크린 리더
  announcements: boolean;
  liveRegions: boolean;
  
  // 기타
  autoFocus: boolean;
  tooltipDelay: number;
}

// 기본 설정
const DEFAULT_SETTINGS: AccessibilitySettings = {
  keyboardNavigation: true,
  focusVisible: true,
  skipLinks: true,
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  announcements: true,
  liveRegions: true,
  autoFocus: false,
  tooltipDelay: 500,
};

// 접근성 컨텍스트
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  focusElement: (element: HTMLElement | null) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

// 접근성 훅
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// 키보드 네비게이션 훅
export const useKeyboardNavigation = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
};

// 포커스 관리 훅
export const useFocusManagement = () => {
  const focusTrap = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  };

  const restoreFocus = (previousElement: HTMLElement | null) => {
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
    }
  };

  return { focusTrap, restoreFocus };
};

// 접근성 프로바이더 Props
export interface AccessibilityProviderProps {
  children: React.ReactNode;
  initialSettings?: Partial<AccessibilitySettings>;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  initialSettings = {},
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });

  const [liveRegion, setLiveRegion] = useState<HTMLElement | null>(null);

  // 시스템 설정 감지
  useEffect(() => {
    // 고대비 모드 감지
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    setSettings(prev => ({ ...prev, highContrast: highContrastQuery.matches }));

    // 애니메이션 감소 감지
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSettings(prev => ({ ...prev, reducedMotion: reducedMotionQuery.matches }));

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    highContrastQuery.addEventListener('change', handleHighContrastChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Live region 설정
  useEffect(() => {
    if (settings.liveRegions) {
      const region = document.createElement('div');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      region.id = 'accessibility-live-region';
      document.body.appendChild(region);
      setLiveRegion(region);

      return () => {
        if (document.body.contains(region)) {
          document.body.removeChild(region);
        }
      };
    }
  }, [settings.liveRegions]);

  // CSS 커스텀 프로퍼티 업데이트
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (!settings.focusVisible) {
      root.classList.add('no-focus-visible');
    } else {
      root.classList.remove('no-focus-visible');
    }
  }, [settings]);

  // 설정 업데이트
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // 스크린 리더 알림
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.announcements || !liveRegion) return;

    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;

    // 메시지 초기화
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, 1000);
  };

  // 요소에 포커스
  const focusElement = (element: HTMLElement | null) => {
    if (!element || !settings.keyboardNavigation) return;

    // 약간의 지연을 두어 DOM 업데이트 후 포커스
    setTimeout(() => {
      element.focus();
    }, 0);
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    announce,
    focusElement,
  };

  return (
    <>
      {/* 전역 접근성 스타일 */}
      <style jsx global>{`
        /* 키보드 포커스 스타일 */
        .focus-visible:focus-visible,
        :focus-visible {
          outline: 2px solid #4ECDC4;
          outline-offset: 2px;
          border-radius: 4px;
        }

        .no-focus-visible :focus-visible {
          outline: none;
        }

        /* 고대비 모드 */
        .high-contrast {
          --color-primary: #000000;
          --color-secondary: #ffffff;
          --color-accent: #ffff00;
          --border-width: 2px;
        }

        .high-contrast button,
        .high-contrast input,
        .high-contrast select,
        .high-contrast textarea {
          border: var(--border-width) solid #000000;
        }

        /* 애니메이션 감소 */
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* 큰 텍스트 */
        .large-text {
          font-size: 120%;
        }

        .large-text button,
        .large-text input,
        .large-text select,
        .large-text textarea {
          font-size: inherit;
          padding: 0.75rem 1rem;
          min-height: 44px;
        }

        /* 스크린 리더 전용 */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* 건너뛰기 링크 */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 1000;
          transition: top 0.3s;
        }

        .skip-link:focus {
          top: 6px;
        }

        /* 터치 타겟 최소 크기 */
        button,
        input,
        select,
        textarea,
        a,
        [role="button"],
        [tabindex="0"] {
          min-height: 44px;
          min-width: 44px;
        }
      `}</style>

      <AccessibilityContext.Provider value={contextValue}>
        {/* 건너뛰기 링크 */}
        {settings.skipLinks && (
          <div>
            <a href="#main-content" className="skip-link">
              주요 내용으로 건너뛰기
            </a>
            <a href="#navigation" className="skip-link">
              네비게이션으로 건너뛰기
            </a>
          </div>
        )}

        {children}

        {/* 라이브 리전 */}
        {settings.liveRegions && (
          <div 
            id="accessibility-live-region" 
            aria-live="polite" 
            aria-atomic="true"
            className="sr-only"
          />
        )}
      </AccessibilityContext.Provider>
    </>
  );
};

// 접근성 설정 패널 컴포넌트
export const AccessibilityPanel: React.FC<{ className?: string }> = ({ className }) => {
  const { settings, updateSetting } = useAccessibility();

  return (
    <div className={cn("p-4 bg-bg-primary border border-border-light rounded-lg", className)}>
      <h3 className="text-lg font-semibold mb-4">접근성 설정</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">시각적 접근성</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                className="rounded"
              />
              <span>고대비 모드</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={(e) => updateSetting('largeText', e.target.checked)}
                className="rounded"
              />
              <span>큰 텍스트</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                className="rounded"
              />
              <span>애니메이션 감소</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">키보드 네비게이션</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.keyboardNavigation}
                onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                className="rounded"
              />
              <span>키보드 네비게이션 활성화</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.focusVisible}
                onChange={(e) => updateSetting('focusVisible', e.target.checked)}
                className="rounded"
              />
              <span>포커스 표시기 표시</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.skipLinks}
                onChange={(e) => updateSetting('skipLinks', e.target.checked)}
                className="rounded"
              />
              <span>건너뛰기 링크 표시</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">스크린 리더</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.announcements}
                onChange={(e) => updateSetting('announcements', e.target.checked)}
                className="rounded"
              />
              <span>음성 알림</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.liveRegions}
                onChange={(e) => updateSetting('liveRegions', e.target.checked)}
                className="rounded"
              />
              <span>라이브 리전</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityProvider;