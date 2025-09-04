// 인증 시스템 타입 정의

export interface MockUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: MockUser | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  // 모의 인증 액션
  mockLogin: () => Promise<void>;
  mockLogout: () => void;
  
  // 실제 인증 액션 (향후 확장용)
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => void;
  register?: (email: string, password: string, name: string) => Promise<void>;
}

export interface MockAuthService {
  getCurrentUser: () => MockUser | null;
  login: () => Promise<MockUser>;
  logout: () => void;
  isAuthenticated: () => boolean;
}