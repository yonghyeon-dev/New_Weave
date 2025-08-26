'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Badge from './Badge';
import { 
  Filter, 
  X, 
  ChevronDown, 
  SortAsc, 
  SortDesc,
  RotateCcw,
  Search
} from 'lucide-react';

// 필터 옵션 타입
export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

// 정렬 옵션 타입
export interface SortOption {
  id: string;
  label: string;
  field: string;
  direction?: 'asc' | 'desc';
}

// 활성 필터 타입
export interface ActiveFilter {
  id: string;
  type: string;
  label: string;
  value: string | string[];
}

// FilterBar Props
export interface FilterBarProps {
  // 검색
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  
  // 필터
  filterOptions?: Record<string, FilterOption[]>;
  activeFilters?: ActiveFilter[];
  onFilterChange?: (filters: ActiveFilter[]) => void;
  
  // 정렬
  sortOptions?: SortOption[];
  currentSort?: { field: string; direction: 'asc' | 'desc' };
  onSortChange?: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
  
  // UI 설정
  className?: string;
  compact?: boolean;
  showClearAll?: boolean;
  resultCount?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchValue = '',
  searchPlaceholder = '검색...',
  onSearchChange,
  showSearch = true,
  
  filterOptions = {},
  activeFilters = [],
  onFilterChange,
  
  sortOptions = [],
  currentSort,
  onSortChange,
  
  className,
  compact = false,
  showClearAll = true,
  resultCount,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // 필터 제거
  const removeFilter = (filterId: string) => {
    const newFilters = activeFilters.filter(f => f.id !== filterId);
    onFilterChange?.(newFilters);
  };

  // 모든 필터 제거
  const clearAllFilters = () => {
    onFilterChange?.([]);
  };

  // 정렬 방향 토글
  const toggleSortDirection = (field: string) => {
    if (currentSort?.field === field) {
      const newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
      onSortChange?.({ field, direction: newDirection });
    } else {
      onSortChange?.({ field, direction: 'asc' });
    }
    setIsSortOpen(false);
  };

  const hasActiveFilters = activeFilters.length > 0;
  const hasActiveSort = currentSort?.field;

  return (
    <div className={cn(
      "space-y-4",
      { "space-y-2": compact },
      className
    )}>
      {/* 상단 컨트롤 바 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* 검색 */}
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 text-sm border border-border-light rounded-lg bg-bg-primary text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-weave-primary"
              />
            </div>
          )}

          {/* 필터 버튼 */}
          {Object.keys(filterOptions).length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "flex items-center gap-2",
                  { "bg-weave-primary-light border-weave-primary text-weave-primary": hasActiveFilters }
                )}
              >
                <Filter className="w-4 h-4" />
                필터
                {hasActiveFilters && (
                  <Badge variant="secondary" className="bg-weave-primary text-white px-2 py-0.5 text-xs">
                    {activeFilters.length}
                  </Badge>
                )}
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  { "rotate-180": isFilterOpen }
                )} />
              </Button>

              {/* 필터 드롭다운 */}
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-bg-primary border border-border-light rounded-lg shadow-lg z-10 p-4">
                  <div className="space-y-4">
                    {Object.entries(filterOptions).map(([category, options]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-txt-primary mb-2 capitalize">
                          {category}
                        </h4>
                        <div className="space-y-2">
                          {options.map((option) => {
                            const isActive = activeFilters.some(f => f.id === option.id);
                            return (
                              <label
                                key={option.id}
                                className="flex items-center justify-between cursor-pointer hover:bg-bg-secondary p-2 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        const newFilter: ActiveFilter = {
                                          id: option.id,
                                          type: category,
                                          label: option.label,
                                          value: option.value
                                        };
                                        onFilterChange?.([...activeFilters, newFilter]);
                                      } else {
                                        removeFilter(option.id);
                                      }
                                    }}
                                    className="rounded border-border-medium"
                                  />
                                  <span className="text-sm text-txt-primary">
                                    {option.label}
                                  </span>
                                </div>
                                {option.count !== undefined && (
                                  <span className="text-xs text-txt-tertiary">
                                    ({option.count})
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 정렬 버튼 */}
          {sortOptions.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={cn(
                  "flex items-center gap-2",
                  { "bg-weave-primary-light border-weave-primary text-weave-primary": hasActiveSort }
                )}
              >
                {currentSort?.direction === 'desc' ? (
                  <SortDesc className="w-4 h-4" />
                ) : (
                  <SortAsc className="w-4 h-4" />
                )}
                정렬
                {hasActiveSort && (
                  <span className="text-xs">
                    ({sortOptions.find(s => s.field === currentSort.field)?.label})
                  </span>
                )}
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  { "rotate-180": isSortOpen }
                )} />
              </Button>

              {/* 정렬 드롭다운 */}
              {isSortOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-bg-primary border border-border-light rounded-lg shadow-lg z-10 py-2">
                  {sortOptions.map((option) => {
                    const isActive = currentSort?.field === option.field;
                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleSortDirection(option.field)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2 text-left hover:bg-bg-secondary transition-colors",
                          { "bg-weave-primary-light text-weave-primary": isActive }
                        )}
                      >
                        <span className="text-sm">{option.label}</span>
                        {isActive && (
                          <div className="flex items-center gap-1">
                            {currentSort?.direction === 'desc' ? (
                              <SortDesc className="w-4 h-4" />
                            ) : (
                              <SortAsc className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 결과 개수 및 초기화 */}
        <div className="flex items-center gap-3">
          {resultCount !== undefined && (
            <span className="text-sm text-txt-secondary whitespace-nowrap">
              {resultCount.toLocaleString()}개 결과
            </span>
          )}

          {showClearAll && (hasActiveFilters || hasActiveSort) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearAllFilters();
                onSortChange?.({ field: '', direction: 'asc' });
              }}
              className="flex items-center gap-2 text-txt-tertiary hover:text-txt-primary"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </Button>
          )}
        </div>
      </div>

      {/* 활성 필터 칩들 */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-txt-secondary">활성 필터:</span>
          {activeFilters.map((filter) => (
            <div
              key={filter.id}
              onClick={() => removeFilter(filter.id)}
              className="cursor-pointer"
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-2 bg-weave-primary-light text-weave-primary-dark border border-weave-primary hover:bg-weave-primary hover:text-white transition-colors"
              >
                <span>{filter.label}</span>
                <X className="w-3 h-3" />
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* 외부 클릭 감지 */}
      {(isFilterOpen || isSortOpen) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setIsFilterOpen(false);
            setIsSortOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default FilterBar;