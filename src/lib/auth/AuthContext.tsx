'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, AuthState, MockUser } from './types';
import { mockAuthService } from './mockAuth.service';
// Mock 인증 시스템을 위한 AuthContext

// 기본 상태
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

// AuthContext 생성
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  
  // 모의 로그인 함수
  const mockLogin = async (): Promise<void> => {
    try {
      const user = await mockAuthService.login();
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error) {
      console.error('Mock login failed:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };
  
  // 모의 로그아웃 함수
  const mockLogout = (): void => {
    mockAuthService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };
  
  // 인증 상태 초기화
  useEffect(() => {
    const initializeAuth = async () => {
      // 모의 데이터 모드 확인
      const isUsingMockData = 
        process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
        !process.env.NEXT_PUBLIC_SUPABASE_URL;
      
      if (isUsingMockData) {
        // 모의 데이터 모드: 자동 로그인
        mockAuthService.autoLogin();
        const currentUser = mockAuthService.getCurrentUser();
        const isAuthenticated = mockAuthService.isAuthenticated();
        
        setAuthState({
          isAuthenticated,
          user: currentUser,
          loading: false,
        });
      } else {
        // 실제 인증 모드: 추후 Supabase 연동
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };
    
    initializeAuth();
  }, []);
  
  const contextValue: AuthContextType = {
    ...authState,
    mockLogin,
    mockLogout,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth 훅
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 편의 훅들
export function useUser(): MockUser | null {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}