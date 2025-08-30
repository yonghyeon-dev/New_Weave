import { getSupabaseClient } from '@/lib/supabase/client'

// 타입 정의
export interface Client {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  name: string
  company: string
  business_number?: string | null
  tax_type?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  notes?: string | null
  is_active?: boolean
  metadata?: any
}

export type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'>
export type ClientUpdate = Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>

export class ClientService {
  private supabase = getSupabaseClient()

  // 클라이언트 목록 조회
  async getClients(userId: string): Promise<Client[]> {
    // TODO: clients 테이블이 생성되면 활성화
    return []
  }

  // 클라이언트 단일 조회
  async getClientById(id: string): Promise<Client> {
    // TODO: clients 테이블이 생성되면 활성화
    return {
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '',
      name: 'Client',
      company: 'Company',
      is_active: true
    } as Client
  }

  // 클라이언트 생성
  async createClient(client: Omit<ClientInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    // TODO: clients 테이블이 생성되면 활성화
    return {
      ...client,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Client
  }

  // 클라이언트 업데이트
  async updateClient(id: string, updates: ClientUpdate): Promise<Client> {
    // TODO: clients 테이블이 생성되면 활성화
    return {
      id,
      ...updates,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '',
      name: updates.name || 'Client',
      company: updates.company || 'Company'
    } as Client
  }

  // 클라이언트 삭제
  async deleteClient(id: string): Promise<boolean> {
    // TODO: clients 테이블이 생성되면 활성화
    return true
  }

  // 사업자번호로 클라이언트 검색
  async getClientByBusinessNumber(businessNumber: string, userId: string): Promise<Client | null> {
    // TODO: clients 테이블이 생성되면 활성화
    return null
  }

  // 활성 클라이언트만 조회
  async getActiveClients(userId: string): Promise<Client[]> {
    // TODO: clients 테이블이 생성되면 활성화
    return []
  }

  // 실시간 구독 설정
  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel('clients_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}

// 싱글톤 인스턴스
export const clientService = new ClientService()