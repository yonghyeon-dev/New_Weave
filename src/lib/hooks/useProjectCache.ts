/**
 * 프로젝트 캐시 관리를 위한 React Hook
 * 
 * 캐싱 기반 DB 시스템과 React 컴포넌트를 연결하는 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Project, 
  projectCache, 
  ProjectCacheStorage,
  CacheMetadata 
} from '../storage/ProjectCacheStorage';

export interface UseProjectCacheReturn {
  // 데이터
  projects: Project[];
  project: Project | null;
  stats: {
    total: number;
    inProgress: number;
    completed: number;
    averageProgress: number;
  };
  metadata: CacheMetadata | null;
  
  // 상태
  loading: boolean;
  error: string | null;
  
  // 액션들
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  getProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
  searchProjects: (query: string) => Promise<void>;
  filterByStatus: (status: Project['status'] | 'all') => Promise<void>;
  
  // 캐시 관리
  clearCache: () => Promise<void>;
  exportCache: () => Promise<{projects: Project[], metadata: CacheMetadata}>;
  importCache: (data: {projects: Project[], metadata?: CacheMetadata}) => Promise<void>;
}

export const useProjectCache = (): UseProjectCacheReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    averageProgress: 0
  });
  const [metadata, setMetadata] = useState<CacheMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 프로젝트 목록 새로고침
  const refreshProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allProjects, projectStats, cacheMetadata] = await Promise.all([
        projectCache.getAllProjects(),
        projectCache.getProjectStats(),
        projectCache.getCacheMetadata()
      ]);
      
      setProjects(allProjects);
      setStats(projectStats);
      setMetadata(cacheMetadata);
      
      console.log(`📊 Loaded ${allProjects.length} projects from cache`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 로드 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error refreshing projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 프로젝트 생성
  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const newProject = await projectCache.saveProject(projectData);
      
      // 목록 새로고침
      await refreshProjects();
      
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 생성 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error creating project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [refreshProjects]);
  
  // 프로젝트 업데이트
  const updateProject = useCallback(async (id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedProject = await projectCache.updateProject(id, updates);
      
      if (updatedProject) {
        // 목록 새로고침
        await refreshProjects();
        
        // 현재 조회된 프로젝트가 업데이트된 프로젝트라면 갱신
        if (project?.id === id) {
          setProject(updatedProject);
        }
      }
      
      return updatedProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 업데이트 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error updating project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [refreshProjects, project]);
  
  // 프로젝트 삭제
  const deleteProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const success = await projectCache.deleteProject(id);
      
      if (success) {
        // 목록 새로고침
        await refreshProjects();
        
        // 현재 조회된 프로젝트가 삭제된 프로젝트라면 초기화
        if (project?.id === id) {
          setProject(null);
        }
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 삭제 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error deleting project:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshProjects, project]);
  
  // 단일 프로젝트 조회
  const getProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const foundProject = await projectCache.getProject(id);
      setProject(foundProject);
      
      if (!foundProject) {
        setError(`프로젝트를 찾을 수 없습니다: ${id}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 조회 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error getting project:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 프로젝트 검색
  const searchProjects = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!query.trim()) {
        await refreshProjects();
        return;
      }
      
      const searchResults = await projectCache.searchProjects(query);
      setProjects(searchResults);
      
      console.log(`🔍 Found ${searchResults.length} projects for query: "${query}"`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 검색 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error searching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshProjects]);
  
  // 상태별 필터링
  const filterByStatus = useCallback(async (status: Project['status'] | 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      if (status === 'all') {
        await refreshProjects();
        return;
      }
      
      const filteredProjects = await projectCache.getProjectsByStatus(status);
      setProjects(filteredProjects);
      
      console.log(`📂 Filtered ${filteredProjects.length} projects with status: ${status}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 필터링 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error filtering projects:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshProjects]);
  
  // 캐시 초기화
  const clearCache = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await projectCache.clearCache();
      
      // 상태 초기화
      setProjects([]);
      setProject(null);
      setStats({
        total: 0,
        inProgress: 0,
        completed: 0,
        averageProgress: 0
      });
      setMetadata(null);
      
      console.log('✅ Cache cleared successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '캐시 초기화 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error clearing cache:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 캐시 내보내기
  const exportCache = useCallback(async () => {
    try {
      setError(null);
      const exportData = await projectCache.exportCache();
      console.log(`📤 Exported ${exportData.projects.length} projects`);
      return exportData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '캐시 내보내기 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error exporting cache:', err);
      throw err;
    }
  }, []);
  
  // 캐시 가져오기
  const importCache = useCallback(async (data: {projects: Project[], metadata?: CacheMetadata}) => {
    try {
      setLoading(true);
      setError(null);
      
      await projectCache.importCache(data);
      await refreshProjects();
      
      console.log(`📥 Imported ${data.projects.length} projects`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '캐시 가져오기 중 오류 발생';
      setError(errorMessage);
      console.error('❌ Error importing cache:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshProjects]);
  
  // 초기 로드
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);
  
  return {
    // 데이터
    projects,
    project,
    stats,
    metadata,
    
    // 상태
    loading,
    error,
    
    // 액션들
    createProject,
    updateProject,
    deleteProject,
    getProject,
    refreshProjects,
    searchProjects,
    filterByStatus,
    
    // 캐시 관리
    clearCache,
    exportCache,
    importCache
  };
};