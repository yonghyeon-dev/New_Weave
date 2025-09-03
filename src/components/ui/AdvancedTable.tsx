'use client';

import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  Settings, 
  Filter, 
  Search, 
  Eye, 
  EyeOff, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import type { 
  ProjectTableColumn, 
  ProjectTableRow, 
  ProjectTableConfig,
  TableFilterState,
  TableSortState 
} from '@/lib/types/project-table.types';

export interface AdvancedTableProps {
  data: ProjectTableRow[];
  config: ProjectTableConfig;
  onConfigChange: (config: ProjectTableConfig) => void;
  onRowClick?: (row: ProjectTableRow) => void;
  loading?: boolean;
}

export function AdvancedTable({ 
  data, 
  config, 
  onConfigChange, 
  onRowClick,
  loading = false 
}: AdvancedTableProps) {
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // 컬럼 순서 변경 핸들러
  const handleColumnReorder = (result: DropResult) => {
    if (!result.destination) return;

    const newColumns = [...config.columns];
    const [reorderedColumn] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, reorderedColumn);

    // order 값 업데이트
    const updatedColumns = newColumns.map((col, index) => ({
      ...col,
      order: index
    }));

    onConfigChange({
      ...config,
      columns: updatedColumns
    });
  };

  // 컬럼 가시성 토글
  const handleColumnVisibilityToggle = (columnId: string) => {
    const updatedColumns = config.columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );

    onConfigChange({
      ...config,
      columns: updatedColumns
    });
  };

  // 정렬 핸들러
  const handleSort = (columnKey: string) => {
    const newSort: TableSortState = {
      column: columnKey,
      direction: 
        config.sort.column === columnKey && config.sort.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    };

    onConfigChange({
      ...config,
      sort: newSort
    });
  };

  // 필터 적용
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // 검색 필터
    if (config.filters.searchQuery) {
      const query = config.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(row =>
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(query)
        )
      );
    }

    // 상태 필터
    if (config.filters.statusFilter !== 'all') {
      filtered = filtered.filter(row => 
        row.status === config.filters.statusFilter
      );
    }

    return filtered;
  }, [data, config.filters]);

  // 정렬 적용
  const sortedData = useMemo(() => {
    if (!config.sort.column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[config.sort.column as keyof ProjectTableRow];
      const bValue = b[config.sort.column as keyof ProjectTableRow];

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return config.sort.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, config.sort]);

  // 보이는 컬럼만 필터링 및 정렬
  const visibleColumns = config.columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  // 셀 값 포맷팅
  const formatCellValue = (value: any, column: ProjectTableColumn) => {
    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString('ko-KR') : '-';
      case 'currency':
        return `${Number(value).toLocaleString()}원`;
      case 'progress':
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-weave-primary transition-all duration-300"
                style={{ width: `${value || 0}%` }}
              />
            </div>
            <span className="text-sm text-txt-secondary">{value || 0}%</span>
          </div>
        );
      case 'status':
        const statusColors = {
          planning: 'bg-gray-100 text-gray-700',
          in_progress: 'bg-blue-100 text-blue-700',
          review: 'bg-yellow-100 text-yellow-700',
          completed: 'bg-green-100 text-green-700',
          on_hold: 'bg-orange-100 text-orange-700',
          cancelled: 'bg-red-100 text-red-700'
        };
        const statusLabels = {
          planning: '기획',
          in_progress: '진행중',
          review: '검토',
          completed: '완료',
          on_hold: '보류',
          cancelled: '취소'
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
            {statusLabels[value as keyof typeof statusLabels] || value}
          </span>
        );
      default:
        return value || '-';
    }
  };

  return (
    <div className="space-y-4">
      {/* 테이블 컨트롤 */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* 검색 */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
              <input
                type="text"
                placeholder="프로젝트 검색..."
                value={config.filters.searchQuery}
                onChange={(e) => onConfigChange({
                  ...config,
                  filters: { ...config.filters, searchQuery: e.target.value }
                })}
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              필터
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              컬럼 설정
              {showColumnSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* 필터 패널 */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border-light">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-2">
                  상태
                </label>
                <select
                  value={config.filters.statusFilter}
                  onChange={(e) => onConfigChange({
                    ...config,
                    filters: { 
                      ...config.filters, 
                      statusFilter: e.target.value as any 
                    }
                  })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-weave-primary"
                >
                  <option value="all">모든 상태</option>
                  <option value="planning">기획</option>
                  <option value="in_progress">진행중</option>
                  <option value="review">검토</option>
                  <option value="completed">완료</option>
                  <option value="on_hold">보류</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 컬럼 설정 패널 */}
        {showColumnSettings && (
          <div className="mt-4 pt-4 border-t border-border-light">
            <Typography variant="body2" className="mb-3 text-txt-secondary">
              컬럼을 드래그하여 순서를 변경하고, 체크박스로 표시/숨김을 설정하세요.
            </Typography>
            
            <DragDropContext onDragEnd={handleColumnReorder}>
              <Droppable droppableId="columns">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 max-h-60 overflow-y-auto"
                  >
                    {config.columns
                      .sort((a, b) => a.order - b.order)
                      .map((column, index) => (
                        <Draggable 
                          key={column.id} 
                          draggableId={column.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 p-3 bg-bg-secondary rounded-lg ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center justify-center w-6 h-6 text-txt-tertiary hover:text-txt-secondary cursor-grab"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>
                              
                              <button
                                onClick={() => handleColumnVisibilityToggle(column.id)}
                                className="flex items-center justify-center w-6 h-6 text-txt-tertiary hover:text-txt-secondary"
                              >
                                {column.visible ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </button>
                              
                              <span className={`flex-1 text-sm ${
                                column.visible ? 'text-txt-primary' : 'text-txt-tertiary'
                              }`}>
                                {column.label}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </Card>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead 
                  key={column.id}
                  className="cursor-pointer select-none"
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <SortAsc className={`w-3 h-3 ${
                          config.sort.column === column.key && config.sort.direction === 'asc'
                            ? 'text-weave-primary' 
                            : 'text-txt-tertiary'
                        }`} />
                        <SortDesc className={`w-3 h-3 -mt-1 ${
                          config.sort.column === column.key && config.sort.direction === 'desc'
                            ? 'text-weave-primary' 
                            : 'text-txt-tertiary'
                        }`} />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow 
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className="cursor-pointer"
              >
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    {formatCellValue(row[column.key], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {sortedData.length === 0 && (
          <div className="text-center py-12">
            <Typography variant="body1" className="text-txt-secondary">
              {loading ? '데이터를 불러오는 중...' : '검색 결과가 없습니다.'}
            </Typography>
          </div>
        )}
      </Card>
    </div>
  );
}