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
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch clients:', error)
      return []
    }

    return data || []
  }

  // 클라이언트 단일 조회
  async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Failed to fetch client by id:', error)
      return null
    }

    return data
  }

  // 클라이언트 생성
  async createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> {
    const insertData: any = clientData;
    const { data, error } = await this.supabase
      .from('clients')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Failed to create client:', error)
      return null
    }

    return data
  }

  // 클라이언트 업데이트
  async updateClient(id: string, updates: ClientUpdate): Promise<Client | null> {
    const { data, error } = await (this.supabase
      .from('clients') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update client:', error)
      return null
    }

    return data
  }

  // 클라이언트 삭제
  async deleteClient(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete client:', error)
      return false
    }

    return true
  }

  // 사업자번호로 클라이언트 검색
  async getClientByBusinessNumber(businessNumber: string, userId: string): Promise<Client | null> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('business_number', businessNumber)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Failed to fetch client by business number:', error)
      return null
    }

    return data
  }

  // 활성 클라이언트만 조회
  async getActiveClients(userId: string): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch active clients:', error)
      return []
    }

    return data || []
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