import { createClient, getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Client = Database['public']['Tables']['clients']['Row']
type ClientInsert = Database['public']['Tables']['clients']['Insert']
type ClientUpdate = Database['public']['Tables']['clients']['Update']

export class ClientsService {
  private supabase = getSupabaseClient()

  // 모든 클라이언트 조회
  async getClients(userId: string) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // 클라이언트 ID로 조회
  async getClientById(id: string) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // 클라이언트 생성
  async createClient(client: Omit<ClientInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await this.supabase
      .from('clients')
      .insert(client)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 클라이언트 업데이트
  async updateClient(id: string, updates: ClientUpdate) {
    const { data, error } = await this.supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 클라이언트 삭제
  async deleteClient(id: string) {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // 사업자번호로 클라이언트 검색
  async getClientByBusinessNumber(businessNumber: string, userId: string) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('business_number', businessNumber)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  }

  // 클라이언트 검색
  async searchClients(query: string, userId: string) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,company.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // 클라이언트별 프로젝트 수 및 총 수익 계산
  async getClientStats(clientId: string) {
    // 프로젝트 수 조회
    const { data: projects, error: projectError } = await this.supabase
      .from('projects')
      .select('id, budget_estimated')
      .eq('client_id', clientId)

    if (projectError) throw projectError

    // 인보이스 총액 조회
    const { data: invoices, error: invoiceError } = await this.supabase
      .from('invoices')
      .select('total, status')
      .eq('client_id', clientId)
      .eq('status', 'paid')

    if (invoiceError) throw invoiceError

    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0
    const totalProjects = projects?.length || 0

    return {
      totalProjects,
      totalRevenue
    }
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
export const clientsService = new ClientsService()