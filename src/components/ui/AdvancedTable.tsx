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
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);

  // 컬럼 순서 변경 핸들러 (설정 패널용)
  const handleColumnSettingsReorder = (result: DropResult) => {
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

  // 테이블 헤더 드래그앤드롭 핸들러 (실시간)
  const handleColumnReorder = (result: DropResult) => {
    // 드래그 종료 시 상태 초기화
    setDraggedColumnId(null);
    
    if (!result.destination) return;
    
    // 드래그앤드롭이 테이블 헤더에서 발생한 경우
    if (result.source.droppableId === 'table-header') {
      const visibleColumnsCopy = [...visibleColumns];
      const [reorderedColumn] = visibleColumnsCopy.splice(result.source.index, 1);
      visibleColumnsCopy.splice(result.destination.index, 0, reorderedColumn);

      // 전체 컬럼 배열에서 order 값 업데이트
      const updatedColumns = config.columns.map(col => {
        const newIndex = visibleColumnsCopy.findIndex(vc => vc.id === col.id);
        return newIndex !== -1 ? { ...col, order: newIndex } : col;
      });

      onConfigChange({
        ...config,
        columns: updatedColumns
      });
    } else {
      // 설정 패널에서 발생한 경우 기존 로직 사용
      handleColumnSettingsReorder(result);
    }
  };

  // 드래그 시작 핸들러
  const handleDragStart = (start: any) => {
    if (start.source.droppableId === 'table-header') {
      const draggedColumn = visibleColumns[start.source.index];
      setDraggedColumnId(draggedColumn.id);
    }
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
          <div className="w-full max-w-[100px] min-w-[80px]">
            <div className="h-2 md:h-2.5 bg-bg-secondary rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-weave-primary transition-all duration-300"
                style={{ width: `${value || 0}%` }}
              />
            </div>
            <div className="text-center">
              <span className="text-[10px] md:text-xs text-txt-secondary font-medium">
                {value || 0}%
              </span>
            </div>
          </div>
        );
      case 'payment_progress':
        return (
          <div className="w-full max-w-[100px] min-w-[80px]">
            <div className="h-2 md:h-2.5 bg-bg-secondary rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${value || 0}%` }}
              />
            </div>
            <div className="text-center">
              <span className="text-[10px] md:text-xs text-green-600 font-medium">
                {value || 0}%
              </span>
            </div>
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
            
            <DragDropContext onDragEnd={handleColumnSettingsReorder}>
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
          <DragDropContext 
            onDragStart={handleDragStart}
            onDragEnd={handleColumnReorder}
          >
            <Droppable 
              droppableId="table-header" 
              direction="horizontal"
              renderClone={(provided, snapshot, rubric) => {
                const column = visibleColumns[rubric.source.index];
                return (
                  <TableHead
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="select-none opacity-90 shadow-2xl scale-110 bg-bg-primary border-2 border-weave-primary z-[1000] rounded-md"
                    style={{
                      width: column.width,
                      ...provided.draggableProps.style,
                    }}
                  >
                    <div className="flex items-center gap-2 px-2">
                      <span className="flex-shrink-0 font-medium">{column.label}</span>
                      {column.sortable && (
                        <div className="flex flex-col flex-shrink-0">
                          <SortAsc className="w-3 h-3 text-txt-tertiary" />
                          <SortDesc className="w-3 h-3 -mt-1 text-txt-tertiary" />
                        </div>
                      )}
                    </div>
                  </TableHead>
                );
              }}
            >
              {(provided, snapshot) => (
                <TableHeader>
                  <TableRow
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {visibleColumns.map((column, index) => (
                      <Draggable 
                        key={column.id} 
                        draggableId={column.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <>
                            <TableHead 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`select-none transition-all duration-200 cursor-move group ${
                                snapshot.isDragging 
                                  ? 'opacity-40 bg-weave-primary-light border-2 border-dashed border-weave-primary' 
                                  : 'hover:bg-bg-secondary hover:shadow-sm'
                              }`}
                              style={{ 
                                width: column.width,
                                minWidth: column.width,
                                maxWidth: column.width,
                                ...(!snapshot.isDragging && provided.draggableProps.style)
                              }}
                            >
                              <div 
                                className="flex items-center gap-2 relative"
                                onClick={(e) => {
                                  // 드래그 중이 아닐 때만 정렬 실행
                                  if (!snapshot.isDragging && column.sortable) {
                                    handleSort(column.key as string);
                                  }
                                }}
                              >
                                <span className="flex-shrink-0">{column.label}</span>
                                {column.sortable && (
                                  <div className="flex flex-col flex-shrink-0">
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
                                
                                {/* 드래그 인디케이터 (호버 시에만 표시) */}
                                {!snapshot.isDragging && (
                                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical className="w-3 h-3 text-txt-tertiary" />
                                  </div>
                                )}
                              </div>
                            </TableHead>
                          </>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableRow>
                </TableHeader>
              )}
            </Droppable>
          </DragDropContext>
          <TableBody>
            {loading ? (
              // 로딩 스켈레톤 행들
              Array.from({ length: 8 }, (_, index) => (
                <TableRow key={`loading-${index}`}>
                  {visibleColumns.map((column) => (
                    <TableCell 
                      key={`loading-${column.id}-${index}`}
                      className={`transition-all duration-200 ${
                        draggedColumnId === column.id 
                          ? 'opacity-40 bg-weave-primary-light border-x-2 border-dashed border-weave-primary' 
                          : ''
                      }`}
                      style={{
                        width: column.width,
                        minWidth: column.width,
                        maxWidth: column.width,
                      }}
                    >
                      <div className="animate-pulse">
                        {(column.type === 'progress' || column.type === 'payment_progress') ? (
                          <div className="w-full max-w-[100px] min-w-[80px]">
                            <div className="h-2 md:h-2.5 bg-gray-200 rounded-full mb-1"></div>
                            <div className="text-center">
                              <div className="h-2 bg-gray-200 rounded w-6 mx-auto"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-4 bg-gray-200 rounded" style={{ 
                            width: column.type === 'status' ? '60px' :
                                   column.type === 'date' ? '80px' :
                                   column.type === 'currency' ? '90px' : '120px' 
                          }}></div>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              sortedData.map((row) => (
                <TableRow 
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className="cursor-pointer"
                >
                  {visibleColumns.map((column) => (
                    <TableCell 
                      key={column.id}
                      className={`transition-all duration-200 ${
                        draggedColumnId === column.id 
                          ? 'opacity-40 bg-weave-primary-light border-x-2 border-dashed border-weave-primary' 
                          : ''
                      }`}
                      style={{
                        width: column.width,
                        minWidth: column.width,
                        maxWidth: column.width,
                      }}
                    >
                      {formatCellValue(row[column.key], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && sortedData.length === 0 && (
          <div className="text-center py-12">
            <Typography variant="body1" className="text-txt-secondary">
              검색 결과가 없습니다.
            </Typography>
          </div>
        )}
      </Card>
    </div>
  );
}