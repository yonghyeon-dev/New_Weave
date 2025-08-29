import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export class ProjectsService {
  private supabase = getSupabaseClient()

  // 모든 프로젝트 조회
  async getProjects(userId: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        clients (
          id,
          name,
          company
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // 프로젝트 ID로 조회
  async getProjectById(id: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        clients (
          id,
          name,
          company,
          email,
          phone
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // 프로젝트 생성
  async createProject(project: Omit<ProjectInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await this.supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 프로젝트 업데이트
  async updateProject(id: string, updates: ProjectUpdate) {
    const { data, error } = await this.supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 프로젝트 삭제
  async deleteProject(id: string) {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // 상태별 프로젝트 조회
  async getProjectsByStatus(status: Project['status'], userId: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  }

  // 클라이언트별 프로젝트 조회
  async getProjectsByClient(clientId: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // 프로젝트 통계
  async getProjectStats(userId: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('status, budget_estimated, budget_spent, progress')
      .eq('user_id', userId)

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      byStatus: {} as Record<string, number>,
      totalBudget: 0,
      totalSpent: 0,
      averageProgress: 0
    }

    if (data) {
      data.forEach(project => {
        // 상태별 카운트
        stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1
        
        // 예산 합계
        stats.totalBudget += project.budget_estimated || 0
        stats.totalSpent += project.budget_spent || 0
        
        // 진행률 평균
        stats.averageProgress += project.progress || 0
      })

      if (data.length > 0) {
        stats.averageProgress = Math.round(stats.averageProgress / data.length)
      }
    }

    return stats
  }

  // 마감일 임박 프로젝트 조회
  async getUpcomingDeadlines(userId: string, days: number = 7) {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        clients (
          name,
          company
        )
      `)
      .eq('user_id', userId)
      .lte('due_date', futureDate.toISOString())
      .gte('due_date', new Date().toISOString())
      .in('status', ['in_progress', 'review'])
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  }

  // 실시간 구독 설정
  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  // 프로젝트 진행률 업데이트
  async updateProgress(id: string, progress: number) {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100')
    }

    const { data, error } = await this.supabase
      .from('projects')
      .update({ progress })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// 싱글톤 인스턴스
export const projectsService = new ProjectsService()