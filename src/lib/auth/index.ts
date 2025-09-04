// 인증 시스템 통합 인덱스

// Context & Hooks
export { AuthProvider, useAuth, useUser, useIsAuthenticated } from './AuthContext';

// Types
export type { MockUser, AuthState, AuthContextType, MockAuthService } from './types';

// Services
export { mockAuthService } from './mockAuth.service';

// Mock Data
export { mockUser, mockUsers, getDefaultMockUser } from '@/lib/data/mockUser';