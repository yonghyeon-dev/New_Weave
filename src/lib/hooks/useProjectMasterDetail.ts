'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ProjectTableRow } from '@/lib/types/project-table.types';

export type DetailTabType = 'overview' | 'contract' | 'billing' | 'documents';

export interface MasterDetailState {
  // 프로젝트 관련 상태
  projects: ProjectTableRow[];
  selectedProject: ProjectTableRow | null;
  selectedProjectIndex: number;
  
  // UI 상태
  isCreateModalOpen: boolean;
  activeDetailTab: DetailTabType;
  isLoading: boolean;
  
  // 검색 및 필터
  searchQuery: string;
  filteredProjects: ProjectTableRow[];
}

export interface MasterDetailActions {
  // 프로젝트 선택 관리
  selectProject: (project: ProjectTableRow) => void;
  selectProjectByIndex: (index: number) => void;
  navigateProject: (direction: 'prev' | 'next') => void;
  clearSelection: () => void;
  
  // 프로젝트 생성 관리
  openCreateModal: () => void;
  closeCreateModal: () => void;
  addNewProject: (project: ProjectTableRow) => void;
  
  // 프로젝트 수정 관리
  updateProject: (project: ProjectTableRow) => void;
  deleteProject: (projectId: string) => void;
  
  // UI 상태 관리
  setActiveDetailTab: (tab: DetailTabType) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  
  // 데이터 관리
  refreshProjects: (projects: ProjectTableRow[]) => void;
}

/**
 * 프로젝트 마스터-디테일 뷰의 중앙화된 상태 관리 훅
 * 
 * 특징:
 * - 단일 진실의 원천 (Single Source of Truth)
 * - 불변성 보장 (Immutable State Updates)
 * - 메모화된 파생 상태 (Memoized Derived State)
 * - 타입 안전성 보장 (Type Safety)
 */
export function useProjectMasterDetail(initialProjects: ProjectTableRow[] = []): {
  state: MasterDetailState;
  actions: MasterDetailActions;
} {
  // 기본 상태
  const [projects, setProjects] = useState<ProjectTableRow[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<ProjectTableRow | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTabType>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 파생 상태: 필터링된 프로젝트 목록
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    
    const query = searchQuery.toLowerCase();
    return projects.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.client.toLowerCase().includes(query) ||
      project.no.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  // 파생 상태: 선택된 프로젝트의 인덱스
  const selectedProjectIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return filteredProjects.findIndex(p => p.id === selectedProject.id);
  }, [filteredProjects, selectedProject]);

  // 액션: 프로젝트 선택 (개선된 탭 상태 관리)
  const selectProject = useCallback((project: ProjectTableRow) => {
    console.log('🎯 Selecting project:', {
      id: project.id,
      no: project.no,
      name: project.name,
      currentlySelected: selectedProject?.no
    });
    
    const previousProjectId = selectedProject?.id;
    setSelectedProject(project);
    
    // 다른 프로젝트를 선택하는 경우에만 탭 리셋
    if (previousProjectId !== project.id) {
      setActiveDetailTab('overview');
      console.log('📑 Resetting tab to overview (different project selected)');
    } else {
      console.log('📑 Keeping current tab (same project re-selected)');
    }
  }, [selectedProject]);

  // 액션: 인덱스로 프로젝트 선택
  const selectProjectByIndex = useCallback((index: number) => {
    if (index >= 0 && index < filteredProjects.length) {
      const project = filteredProjects[index];
      setSelectedProject(project);
      setActiveDetailTab('overview');
    }
  }, [filteredProjects]);

  // 액션: 프로젝트 네비게이션 (이전/다음)
  const navigateProject = useCallback((direction: 'prev' | 'next') => {
    const currentIndex = selectedProjectIndex;
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredProjects.length - 1;
    } else {
      newIndex = currentIndex < filteredProjects.length - 1 ? currentIndex + 1 : 0;
    }

    selectProjectByIndex(newIndex);
  }, [selectedProjectIndex, filteredProjects.length, selectProjectByIndex]);

  // 액션: 선택 해제
  const clearSelection = useCallback(() => {
    setSelectedProject(null);
    setActiveDetailTab('overview');
  }, []);

  // 액션: 생성 모달 열기
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  // 액션: 생성 모달 닫기
  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  // 액션: 새 프로젝트 추가
  const addNewProject = useCallback((newProject: ProjectTableRow) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject); // 새로 생성된 프로젝트 자동 선택
    setIsCreateModalOpen(false);
  }, []);

  // 액션: 프로젝트 업데이트
  const updateProject = useCallback((updatedProject: ProjectTableRow) => {
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
    
    // 현재 선택된 프로젝트가 업데이트된 경우 상태 동기화
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  }, [selectedProject]);

  // 액션: 프로젝트 삭제
  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    // 삭제된 프로젝트가 현재 선택된 프로젝트인 경우 선택 해제
    if (selectedProject?.id === projectId) {
      clearSelection();
    }
  }, [selectedProject, clearSelection]);

  // 액션: 로딩 상태 설정
  const handleSetLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // 액션: 프로젝트 목록 새로고침 (개선된 상태 동기화)
  const refreshProjects = useCallback((newProjects: ProjectTableRow[]) => {
    console.log('🔄 Refreshing Projects:', {
      newProjectsCount: newProjects.length,
      currentSelected: selectedProject?.no,
      newProjectNumbers: newProjects.map(p => p.no)
    });
    
    // 현재 선택된 프로젝트의 ID를 미리 저장
    const currentSelectedId = selectedProject?.id;
    const currentSelectedNo = selectedProject?.no;
    
    // 프로젝트 목록을 먼저 업데이트
    setProjects(newProjects);
    
    // 선택된 프로젝트가 있었다면 새 목록에서 찾아서 다시 선택
    if (currentSelectedId && currentSelectedNo) {
      // ID로 먼저 찾기 (정확한 매칭)
      let updatedProject = newProjects.find(p => p.id === currentSelectedId);
      
      // ID로 찾지 못했다면 No(프로젝트 번호)로 찾기 (fallback)
      if (!updatedProject) {
        updatedProject = newProjects.find(p => p.no === currentSelectedNo);
        console.log('🔍 Project not found by ID, searching by No:', currentSelectedNo);
      }
      
      if (updatedProject) {
        console.log('✅ Re-selecting project after refresh:', {
          id: updatedProject.id,
          no: updatedProject.no,
          name: updatedProject.name
        });
        
        // 즉시 재선택 (비동기 처리 방지)
        setSelectedProject(updatedProject);
        // 탭도 현재 상태 유지 (초기화하지 않음)
      } else {
        console.log('❌ Selected project not found in refreshed data, clearing selection');
        clearSelection();
      }
    }
  }, [selectedProject, clearSelection]);

  // 상태와 액션 반환 (메모화)
  const state: MasterDetailState = useMemo(() => ({
    projects,
    selectedProject,
    selectedProjectIndex,
    isCreateModalOpen,
    activeDetailTab,
    isLoading,
    searchQuery,
    filteredProjects,
  }), [
    projects,
    selectedProject,
    selectedProjectIndex,
    isCreateModalOpen,
    activeDetailTab,
    isLoading,
    searchQuery,
    filteredProjects,
  ]);

  const actions: MasterDetailActions = useMemo(() => ({
    selectProject,
    selectProjectByIndex,
    navigateProject,
    clearSelection,
    openCreateModal,
    closeCreateModal,
    addNewProject,
    updateProject,
    deleteProject,
    setActiveDetailTab,
    setSearchQuery,
    setLoading: handleSetLoading,
    refreshProjects,
  }), [
    selectProject,
    selectProjectByIndex,
    navigateProject,
    clearSelection,
    openCreateModal,
    closeCreateModal,
    addNewProject,
    updateProject,
    deleteProject,
    setActiveDetailTab,
    setSearchQuery,
    handleSetLoading,
    refreshProjects,
  ]);

  return { state, actions };
}