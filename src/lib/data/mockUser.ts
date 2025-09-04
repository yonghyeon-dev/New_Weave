import { MockUser } from '@/lib/auth/types';

// 모의 사용자 데이터
export const mockUser: MockUser = {
  id: 'mock-user-001',
  email: 'user@weave.ai',
  name: '사용자',
  avatar_url: undefined,
  role: 'user',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2025-09-03T00:00:00Z'
};

// 여러 모의 사용자 데이터 (향후 확장용)
export const mockUsers: MockUser[] = [
  mockUser,
  {
    id: 'mock-admin-001',
    email: 'admin@weave.ai',
    name: '관리자',
    avatar_url: undefined,
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2025-09-03T00:00:00Z'
  }
];

// 기본 사용자 반환
export const getDefaultMockUser = (): MockUser => mockUser;