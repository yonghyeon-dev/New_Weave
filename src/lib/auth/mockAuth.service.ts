import { MockUser, MockAuthService } from './types';
import { getDefaultMockUser } from '@/lib/data/mockUser';

class MockAuthServiceImpl implements MockAuthService {
  private user: MockUser | null = null;
  private authenticated: boolean = false;
  
  // 로컬스토리지 키
  private readonly STORAGE_KEY = 'weave-mock-auth';
  
  constructor() {
    // 브라우저 환경에서만 로컬스토리지 접근
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }
  
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.user = data.user;
        this.authenticated = data.authenticated;
      }
    } catch (error) {
      console.warn('Failed to load mock auth from storage:', error);
    }
  }
  
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        user: this.user,
        authenticated: this.authenticated
      }));
    } catch (error) {
      console.warn('Failed to save mock auth to storage:', error);
    }
  }
  
  getCurrentUser(): MockUser | null {
    return this.user;
  }
  
  async login(): Promise<MockUser> {
    // 모의 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const user = getDefaultMockUser();
    this.user = user;
    this.authenticated = true;
    
    this.saveToStorage();
    
    return user;
  }
  
  logout(): void {
    this.user = null;
    this.authenticated = false;
    
    this.saveToStorage();
  }
  
  isAuthenticated(): boolean {
    return this.authenticated;
  }
  
  // 자동 로그인 (모의 데이터 모드에서 사용)
  autoLogin(): void {
    if (!this.authenticated) {
      this.user = getDefaultMockUser();
      this.authenticated = true;
      this.saveToStorage();
    }
  }
}

// 싱글톤 인스턴스
export const mockAuthService = new MockAuthServiceImpl();