import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Invoice = Database['public']['Tables']['invoices']['Row']
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export class InvoicesService {
  private supabase = getSupabaseClient()

  // 인보이스 생성
  async createInvoice(invoice: Omit<InvoiceInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await this.supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 인보이스 목록 조회
  async getInvoices(userId: string, status?: Invoice['status']): Promise<Invoice[]> {
    let query = this.supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          name,
          company,
          email,
          phone
        ),
        projects (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  // 특정 인보이스 조회
  async getInvoiceById(id: string) {
    const { data, error } = await this.supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          name,
          company,
          email,
          phone,
          address,
          business_number,
          tax_type
        ),
        projects (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // 인보이스 번호로 조회
  async getInvoiceByNumber(invoiceNumber: string, userId: string) {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('invoice_number', invoiceNumber)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // 인보이스 업데이트
  async updateInvoice(id: string, updates: InvoiceUpdate) {
    const { data, error } = await this.supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 인보이스 상태 업데이트
  async updateInvoiceStatus(id: string, status: Invoice['status'], paidDate?: string) {
    const updates: InvoiceUpdate = {
      status
    }

    if (status === 'paid' && paidDate) {
      updates.paid_date = paidDate
    }

    const { data, error } = await this.supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 인보이스 삭제
  async deleteInvoice(id: string) {
    const { error } = await this.supabase
      .from('invoices')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // 클라이언트별 인보이스 조회
  async getInvoicesByClient(clientId: string) {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId)
      .order('issue_date', { ascending: false })

    if (error) throw error
    return data
  }

  // 프로젝트별 인보이스 조회
  async getInvoicesByProject(projectId: string) {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('project_id', projectId)
      .order('issue_date', { ascending: false })

    if (error) throw error
    return data
  }

  // 연체 인보이스 조회
  async getOverdueInvoices(userId: string) {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await this.supabase
      .from('invoices')
      .select(`
        *,
        clients (
          name,
          company,
          email,
          phone
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'sent')
      .lt('due_date', today)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  }

  // 인보이스 통계
  async getInvoiceStats(userId: string, year?: number, month?: number) {
    let query = this.supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)

    if (year) {
      const startDate = month 
        ? new Date(year, month - 1, 1).toISOString().split('T')[0]
        : new Date(year, 0, 1).toISOString().split('T')[0]
      
      const endDate = month
        ? new Date(year, month, 0).toISOString().split('T')[0]
        : new Date(year, 11, 31).toISOString().split('T')[0]

      query = query.gte('issue_date', startDate).lte('issue_date', endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      byStatus: {
        draft: 0,
        sent: 0,
        paid: 0,
        overdue: 0,
        cancelled: 0
      },
      averageAmount: 0
    }

    const today = new Date()

    data?.forEach(invoice => {
      // 총액
      stats.totalAmount += invoice.total || 0

      // 상태별 금액
      if (invoice.status === 'paid') {
        stats.paidAmount += invoice.total || 0
        stats.byStatus.paid++
      } else if (invoice.status === 'sent') {
        if (new Date(invoice.due_date) < today) {
          stats.overdueAmount += invoice.total || 0
          stats.byStatus.overdue++
        } else {
          stats.pendingAmount += invoice.total || 0
          stats.byStatus.sent++
        }
      } else {
        stats.byStatus[invoice.status]++
      }
    })

    if (data && data.length > 0) {
      stats.averageAmount = Math.round(stats.totalAmount / data.length)
    }

    return stats
  }

  // 다음 인보이스 번호 생성
  async generateInvoiceNumber(userId: string): Promise<string> {
    const year = new Date().getFullYear()
    
    // 올해 마지막 인보이스 번호 조회
    const { data, error } = await this.supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', userId)
      .like('invoice_number', `INV-${year}-%`)
      .order('invoice_number', { ascending: false })
      .limit(1)

    if (error) throw error

    let nextNumber = 1
    if (data && data.length > 0) {
      const lastNumber = data[0].invoice_number
      const match = lastNumber.match(/INV-\d{4}-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }

    return `INV-${year}-${String(nextNumber).padStart(5, '0')}`
  }

  // 실시간 구독 설정
  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel('invoices_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  // 월별 수익 추이
  async getMonthlyRevenueTrend(userId: string, months: number = 12) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const { data, error } = await this.supabase
      .from('invoices')
      .select('issue_date, total, status')
      .eq('user_id', userId)
      .eq('status', 'paid')
      .gte('issue_date', startDate.toISOString().split('T')[0])
      .lte('issue_date', endDate.toISOString().split('T')[0])
      .order('issue_date', { ascending: true })

    if (error) throw error

    // 월별로 그룹화
    const monthlyData: Record<string, number> = {}

    data?.forEach(invoice => {
      const month = invoice.issue_date.substring(0, 7) // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + (invoice.total || 0)
    })

    // 빈 월 채우기
    const result = []
    const current = new Date(startDate)
    while (current <= endDate) {
      const monthKey = current.toISOString().substring(0, 7)
      result.push({
        month: monthKey,
        revenue: monthlyData[monthKey] || 0
      })
      current.setMonth(current.getMonth() + 1)
    }

    return result
  }
}

// 싱글톤 인스턴스
export const invoicesService = new InvoicesService()