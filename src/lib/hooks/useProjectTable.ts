'use client';

import { useState, useMemo, useCallback } from 'react';
import type { 
  ProjectTableColumn, 
  ProjectTableRow, 
  ProjectTableConfig,
  TableFilterState,
  TableSortState 
} from '@/lib/types/project-table.types';

// 기본 컬럼 설정 - 시스템 중앙화 원칙에 따라 단일 진실의 원천
const DEFAULT_COLUMNS: ProjectTableColumn[] = [
  {
    id: 'no',
    key: 'no',
    label: 'No',
    sortable: true,
    filterable: false,
    width: 80,
    visible: true,
    order: 0,
    type: 'text'
  },
  {
    id: 'name',
    key: 'name',
    label: '프로젝트명',
    sortable: true,
    filterable: true,
    width: 200,
    visible: true,
    order: 1,
    type: 'text'
  },
  {
    id: 'registrationDate',
    key: 'registrationDate',
    label: '등록일',
    sortable: true,
    filterable: false,
    width: 120,
    visible: true,
    order: 3,
    type: 'date'
  },
  {
    id: 'client',
    key: 'client',
    label: '클라이언트',
    sortable: true,
    filterable: true,
    width: 150,
    visible: true,
    order: 2,
    type: 'text'
  },
  {
    id: 'status',
    key: 'status',
    label: '상태',
    sortable: true,
    filterable: true,
    width: 100,
    visible: true,
    order: 7,
    type: 'status'
  },
  {
    id: 'progress',
    key: 'progress',
    label: '진행률',
    sortable: true,
    filterable: false,
    width: 110,
    visible: true,
    order: 4,
    type: 'progress'
  },
  {
    id: 'paymentProgress',
    key: 'paymentProgress',
    label: '수급현황',
    sortable: true,
    filterable: false,
    width: 110,
    visible: true,
    order: 6,
    type: 'payment_progress'
  },
  {
    id: 'dueDate',
    key: 'dueDate',
    label: '마감일',
    sortable: true,
    filterable: false,
    width: 120,
    visible: true,
    order: 5,
    type: 'date'
  },
  {
    id: 'modifiedDate',
    key: 'modifiedDate',
    label: '수정일',
    sortable: true,
    filterable: false,
    width: 120,
    visible: true, // 기본 표시로 변경
    order: 8,
    type: 'date'
  }
];

const DEFAULT_FILTERS: TableFilterState = {
  searchQuery: '',
  statusFilter: 'all',
  customFilters: {}
};

const DEFAULT_SORT: TableSortState = {
  column: 'no',
  direction: 'desc'
};

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 20,
  total: 0
};

// 로컬스토리지 키 - 설정 영속화
const STORAGE_KEY = 'weave-project-table-config';

export function useProjectTable(initialData: ProjectTableRow[] = []) {
  // 저장된 설정 불러오기 (중앙화된 설정 관리)
  const loadSavedConfig = useCallback((): ProjectTableConfig => {
    // SSR 호환성: 브라우저 환경에서만 localStorage 접근
    if (typeof window === 'undefined') {
      return {
        columns: DEFAULT_COLUMNS,
        filters: DEFAULT_FILTERS,
        sort: DEFAULT_SORT,
        pagination: DEFAULT_PAGINATION
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedConfig = JSON.parse(saved);
        return {
          ...parsedConfig,
          // 새로운 컬럼이 추가된 경우를 대비한 병합 로직
          columns: mergeColumns(parsedConfig.columns || [], DEFAULT_COLUMNS),
          pagination: { ...DEFAULT_PAGINATION, ...parsedConfig.pagination }
        };
      }
    } catch (error) {
      console.error('Failed to load saved table config:', error);
    }
    
    return {
      columns: DEFAULT_COLUMNS,
      filters: DEFAULT_FILTERS,
      sort: DEFAULT_SORT,
      pagination: DEFAULT_PAGINATION
    };
  }, []);

  const [config, setConfig] = useState<ProjectTableConfig>(() => loadSavedConfig());
  const [data, setData] = useState<ProjectTableRow[]>(initialData);

  // 설정 저장 (중앙화된 설정 영속화)
  const saveConfig = useCallback((newConfig: ProjectTableConfig) => {
    // SSR 호환성: 브라우저 환경에서만 localStorage 접근
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.error('Failed to save table config:', error);
    }
  }, []);

  // 설정 업데이트 핸들러
  const updateConfig = useCallback((newConfig: ProjectTableConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  }, [saveConfig]);

  // 데이터 업데이트 핸들러
  const updateData = useCallback((newData: ProjectTableRow[]) => {
    setData(newData);
    updateConfig({
      ...config,
      pagination: {
        ...config.pagination,
        total: newData.length
      }
    });
  }, [config, updateConfig]);

  // 필터링된 데이터 (메모이제이션으로 성능 최적화)
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // 검색 필터 적용
    if (config.filters.searchQuery.trim()) {
      const query = config.filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(row => {
        return Object.values(row).some(value => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    }

    // 상태 필터 적용
    if (config.filters.statusFilter !== 'all') {
      filtered = filtered.filter(row => 
        row.status === config.filters.statusFilter
      );
    }

    // 사용자 정의 필터 적용
    Object.entries(config.filters.customFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(row => 
          row[key as keyof ProjectTableRow] === value
        );
      }
    });

    return filtered;
  }, [data, config.filters]);

  // 정렬된 데이터 (메모이제이션으로 성능 최적화)
  const sortedData = useMemo(() => {
    if (!config.sort.column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[config.sort.column as keyof ProjectTableRow];
      const bValue = b[config.sort.column as keyof ProjectTableRow];

      // null/undefined 처리
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;

      // 타입별 정렬 로직
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        // No 컬럼의 경우 숫자 부분을 추출하여 숫자 정렬
        if (config.sort.column === 'no' && aValue.includes('_') && bValue.includes('_')) {
          const aNum = parseInt(aValue.split('_')[1] || '0');
          const bNum = parseInt(bValue.split('_')[1] || '0');
          comparison = aNum - bNum;
        } else {
          comparison = aValue.localeCompare(bValue, 'ko-KR');
        }
      } else {
        // 날짜나 기타 타입의 경우
        const aStr = String(aValue);
        const bStr = String(bValue);
        comparison = aStr.localeCompare(bStr, 'ko-KR');
      }

      return config.sort.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, config.sort]);

  // 페이지네이션된 데이터
  const paginatedData = useMemo(() => {
    const { page, pageSize } = config.pagination;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, config.pagination]);

  // 컬럼 설정 초기화
  const resetColumnConfig = useCallback(() => {
    const resetConfig: ProjectTableConfig = {
      ...config,
      columns: DEFAULT_COLUMNS.map(col => ({ ...col }))
    };
    updateConfig(resetConfig);
  }, [config, updateConfig]);

  // 필터 초기화
  const resetFilters = useCallback(() => {
    const resetConfig: ProjectTableConfig = {
      ...config,
      filters: { ...DEFAULT_FILTERS },
      pagination: { ...config.pagination, page: 1 }
    };
    updateConfig(resetConfig);
  }, [config, updateConfig]);

  return {
    // 데이터
    data: sortedData,
    paginatedData,
    filteredCount: filteredData.length,
    totalCount: data.length,
    
    // 설정
    config,
    updateConfig,
    
    // 데이터 조작
    updateData,
    
    // 유틸리티
    resetColumnConfig,
    resetFilters
  };
}

// 컬럼 병합 유틸리티 - 새 컬럼이 추가되었을 때 기존 설정과 병합
function mergeColumns(
  savedColumns: ProjectTableColumn[], 
  defaultColumns: ProjectTableColumn[]
): ProjectTableColumn[] {
  const savedColumnMap = new Map(savedColumns.map(col => [col.id, col]));
  
  return defaultColumns.map(defaultCol => {
    const savedCol = savedColumnMap.get(defaultCol.id);
    return savedCol ? { ...defaultCol, ...savedCol } : defaultCol;
  });
}