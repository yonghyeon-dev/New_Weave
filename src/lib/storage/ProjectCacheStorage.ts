/**
 * 프로젝트 저장을 위한 캐싱 기반 DB 시스템
 * 
 * 목적: Mock 모드에서도 프로젝트 데이터를 로컬에 저장하고 관리할 수 있는
 * 캐싱 기반 저장소 시스템
 */

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled' | 'on_hold';
  progress: number;
  created_at: string;
  updated_at: string;
  due_date: string;
  description?: string;
  budget?: number;
  payment_status?: 'pending' | 'partial' | 'completed';
}

export interface CacheMetadata {
  lastUpdated: Date;
  version: number;
  syncStatus: 'local' | 'synced' | 'conflict';
  itemCount: number;
}

export class ProjectCacheStorage {
  private static instance: ProjectCacheStorage;
  private readonly STORAGE_KEY = 'weave-project-cache';
  private readonly METADATA_KEY = 'weave-project-cache-metadata';
  private readonly VERSION = 1;
  
  private constructor() {}
  
  static getInstance(): ProjectCacheStorage {
    if (!ProjectCacheStorage.instance) {
      ProjectCacheStorage.instance = new ProjectCacheStorage();
    }
    return ProjectCacheStorage.instance;
  }
  
  // 프로젝트 저장
  async saveProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: this.generateProjectId(),
      created_at: now,
      updated_at: now
    };
    
    const existingProjects = await this.getAllProjects();
    const updatedProjects = [...existingProjects, newProject];
    
    await this.saveToStorage(updatedProjects);
    
    console.log(`✅ Project saved to cache: ${newProject.name} (${newProject.id})`);
    return newProject;
  }
  
  // 프로젝트 업데이트
  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<Project | null> {
    const projects = await this.getAllProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      console.warn(`⚠️ Project not found: ${id}`);
      return null;
    }
    
    const updatedProject: Project = {
      ...projects[projectIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    projects[projectIndex] = updatedProject;
    await this.saveToStorage(projects);
    
    console.log(`✅ Project updated in cache: ${updatedProject.name} (${id})`);
    return updatedProject;
  }
  
  // 프로젝트 삭제
  async deleteProject(id: string): Promise<boolean> {
    const projects = await this.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) {
      console.warn(`⚠️ Project not found for deletion: ${id}`);
      return false;
    }
    
    await this.saveToStorage(filteredProjects);
    console.log(`✅ Project deleted from cache: ${id}`);
    return true;
  }
  
  // 단일 프로젝트 조회
  async getProject(id: string): Promise<Project | null> {
    const projects = await this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }
  
  // 모든 프로젝트 조회
  async getAllProjects(): Promise<Project[]> {
    return new Promise((resolve) => {
      try {
        if (typeof window === 'undefined') {
          resolve([]);
          return;
        }
        
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
          resolve([]);
          return;
        }
        
        const projects = JSON.parse(stored) as Project[];
        
        // 데이터 유효성 검증
        const validProjects = projects.filter(p => 
          p.id && p.name && p.status && typeof p.progress === 'number'
        );
        
        // ID 기준 내림차순 정렬 (최신이 위에)
        const sortedProjects = validProjects.sort((a, b) => b.id.localeCompare(a.id));
        
        resolve(sortedProjects);
      } catch (error) {
        console.error('❌ Error loading projects from cache:', error);
        resolve([]);
      }
    });
  }
  
  // 프로젝트 검색
  async searchProjects(query: string): Promise<Project[]> {
    const projects = await this.getAllProjects();
    const searchTerm = query.toLowerCase();
    
    const filteredProjects = projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm) ||
      project.client.toLowerCase().includes(searchTerm) ||
      project.status.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm)
    );
    
    // ID 기준 내림차순 정렬 유지 (getAllProjects에서 이미 정렬되었지만 명시적으로)
    return filteredProjects.sort((a, b) => b.id.localeCompare(a.id));
  }
  
  // 상태별 프로젝트 필터링
  async getProjectsByStatus(status: Project['status']): Promise<Project[]> {
    const projects = await this.getAllProjects();
    const filteredProjects = projects.filter(p => p.status === status);
    
    // ID 기준 내림차순 정렬 유지
    return filteredProjects.sort((a, b) => b.id.localeCompare(a.id));
  }
  
  // 프로젝트 통계
  async getProjectStats(): Promise<{
    total: number;
    inProgress: number;
    completed: number;
    averageProgress: number;
  }> {
    const projects = await this.getAllProjects();
    
    const stats = {
      total: projects.length,
      inProgress: projects.filter(p => p.status === 'in_progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      averageProgress: 0
    };
    
    if (projects.length > 0) {
      stats.averageProgress = Math.round(
        projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
      );
    }
    
    return stats;
  }
  
  // 캐시 메타데이터 조회
  async getCacheMetadata(): Promise<CacheMetadata> {
    return new Promise((resolve) => {
      try {
        if (typeof window === 'undefined') {
          resolve(this.getDefaultMetadata());
          return;
        }
        
        const stored = localStorage.getItem(this.METADATA_KEY);
        if (!stored) {
          resolve(this.getDefaultMetadata());
          return;
        }
        
        const metadata = JSON.parse(stored) as CacheMetadata;
        resolve({
          ...metadata,
          lastUpdated: new Date(metadata.lastUpdated)
        });
      } catch (error) {
        console.error('❌ Error loading cache metadata:', error);
        resolve(this.getDefaultMetadata());
      }
    });
  }
  
  // 캐시 초기화
  async clearCache(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.METADATA_KEY);
    console.log('✅ Project cache cleared');
  }
  
  // 캐시 내보내기 (백업용)
  async exportCache(): Promise<{projects: Project[], metadata: CacheMetadata}> {
    const projects = await this.getAllProjects();
    const metadata = await this.getCacheMetadata();
    
    return { projects, metadata };
  }
  
  // 캐시 가져오기 (복원용)
  async importCache(data: {projects: Project[], metadata?: CacheMetadata}): Promise<void> {
    await this.saveToStorage(data.projects);
    console.log(`✅ Imported ${data.projects.length} projects to cache`);
  }
  
  // Private 메서드들
  private async saveToStorage(projects: Project[]): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (typeof window === 'undefined') {
          resolve();
          return;
        }
        
        // 프로젝트 저장
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
        
        // 메타데이터 업데이트
        const metadata: CacheMetadata = {
          lastUpdated: new Date(),
          version: this.VERSION,
          syncStatus: 'local',
          itemCount: projects.length
        };
        
        localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
        resolve();
      } catch (error) {
        console.error('❌ Error saving projects to cache:', error);
        resolve();
      }
    });
  }
  
  private generateProjectId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `WEAVE_${String(timestamp).slice(-6)}_${random}`;
  }
  
  private getDefaultMetadata(): CacheMetadata {
    return {
      lastUpdated: new Date(),
      version: this.VERSION,
      syncStatus: 'local',
      itemCount: 0
    };
  }
}

// 전역 인스턴스 접근을 위한 헬퍼 함수들
export const projectCache = ProjectCacheStorage.getInstance();

// 편의 함수들
export const saveProject = (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => 
  projectCache.saveProject(project);

export const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>) => 
  projectCache.updateProject(id, updates);

export const deleteProject = (id: string) => 
  projectCache.deleteProject(id);

export const getProject = (id: string) => 
  projectCache.getProject(id);

export const getAllProjects = () => 
  projectCache.getAllProjects();

export const getProjectStats = () => 
  projectCache.getProjectStats();