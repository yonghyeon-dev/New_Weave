import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Reminder = Database['public']['Tables']['reminders']['Row']
type ReminderInsert = Database['public']['Tables']['reminders']['Insert']
type ReminderUpdate = Database['public']['Tables']['reminders']['Update']

export class RemindersService {
  private supabase = getSupabaseClient()

  // 리마인더 생성
  async createReminder(reminder: Omit<ReminderInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await this.supabase
      .from('reminders')
      .insert(reminder)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 리마인더 목록 조회
  async getReminders(userId: string, status?: Reminder['status']) {
    let query = this.supabase
      .from('reminders')
      .select(`
        *,
        projects (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .order('due_date', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // 특정 리마인더 조회
  async getReminderById(id: string) {
    const { data, error } = await this.supabase
      .from('reminders')
      .select(`
        *,
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

  // 리마인더 업데이트
  async updateReminder(id: string, updates: ReminderUpdate) {
    const { data, error } = await this.supabase
      .from('reminders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 리마인더 상태 업데이트
  async updateReminderStatus(id: string, status: Reminder['status']) {
    const { data, error } = await this.supabase
      .from('reminders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 리마인더 삭제
  async deleteReminder(id: string) {
    const { error } = await this.supabase
      .from('reminders')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // 프로젝트별 리마인더 조회
  async getRemindersByProject(projectId: string) {
    const { data, error } = await this.supabase
      .from('reminders')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  }

  // 오늘 마감 리마인더 조회
  async getTodayReminders(userId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data, error } = await this.supabase
      .from('reminders')
      .select(`
        *,
        projects (
          name
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('due_date', today.toISOString())
      .lt('due_date', tomorrow.toISOString())
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  }

  // 기한 지난 리마인더 조회
  async getOverdueReminders(userId: string) {
    const now = new Date().toISOString()

    const { data, error } = await this.supabase
      .from('reminders')
      .select(`
        *,
        projects (
          name
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .lt('due_date', now)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  }

  // 다가오는 리마인더 조회
  async getUpcomingReminders(userId: string, days: number = 7) {
    const now = new Date()
    const future = new Date()
    future.setDate(future.getDate() + days)

    const { data, error } = await this.supabase
      .from('reminders')
      .select(`
        *,
        projects (
          name
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('due_date', now.toISOString())
      .lte('due_date', future.toISOString())
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  }

  // 우선순위별 리마인더 조회
  async getRemindersByPriority(userId: string, priority: Reminder['priority']) {
    const { data, error } = await this.supabase
      .from('reminders')
      .select(`
        *,
        projects (
          name
        )
      `)
      .eq('user_id', userId)
      .eq('priority', priority)
      .eq('status', 'pending')
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  }

  // 리마인더 통계
  async getReminderStats(userId: string) {
    const { data, error } = await this.supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    const now = new Date()
    const stats = {
      total: data?.length || 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      overdue: 0,
      today: 0,
      upcoming: 0,
      byPriority: {
        high: 0,
        medium: 0,
        low: 0
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const weekLater = new Date(today)
    weekLater.setDate(weekLater.getDate() + 7)

    data?.forEach(reminder => {
      // 상태별
      if (reminder.status === 'pending') {
        stats.pending++
        
        const dueDate = new Date(reminder.due_date)
        
        // 기한 지남
        if (dueDate < now) {
          stats.overdue++
        }
        // 오늘
        else if (dueDate >= today && dueDate < tomorrow) {
          stats.today++
        }
        // 다가오는 (7일 이내)
        else if (dueDate < weekLater) {
          stats.upcoming++
        }

        // 우선순위별
        if (reminder.priority) {
          stats.byPriority[reminder.priority]++
        }
      } else if (reminder.status === 'completed') {
        stats.completed++
      } else if (reminder.status === 'cancelled') {
        stats.cancelled++
      }
    })

    return stats
  }

  // 리마인더 일괄 생성 (반복 리마인더용)
  async createRecurringReminders(
    baseReminder: Omit<ReminderInsert, 'id' | 'created_at' | 'updated_at' | 'due_date'>,
    startDate: Date,
    endDate: Date,
    intervalDays: number
  ) {
    const reminders: ReminderInsert[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      reminders.push({
        ...baseReminder,
        due_date: currentDate.toISOString()
      })
      currentDate.setDate(currentDate.getDate() + intervalDays)
    }

    const { data, error } = await this.supabase
      .from('reminders')
      .insert(reminders)
      .select()

    if (error) throw error
    return data
  }

  // 실시간 구독 설정
  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel('reminders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reminders',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  // 리마인더 완료 처리
  async completeReminder(id: string) {
    return this.updateReminderStatus(id, 'completed')
  }

  // 리마인더 취소 처리
  async cancelReminder(id: string) {
    return this.updateReminderStatus(id, 'cancelled')
  }
}

// 싱글톤 인스턴스
export const remindersService = new RemindersService()