'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Typography from './Typography';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

// 날짜 타입 정의
export type DateValue = Date | null;
export type DateRange = [Date | null, Date | null];

// Props 인터페이스
export interface CalendarProps {
  value?: DateValue | DateRange;
  onChange?: (value: DateValue | DateRange) => void;
  mode?: 'single' | 'range';
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  showToday?: boolean;
  locale?: string;
  className?: string;
}

// 달력 유틸리티 함수들
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatMonth = (year: number, month: number, locale = 'ko-KR') => {
  return new Date(year, month).toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long' 
  });
};

const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
};

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  mode = 'single',
  minDate,
  maxDate,
  disabled = false,
  showToday = true,
  locale = 'ko-KR',
  className,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(
    value instanceof Date ? value.getFullYear() : today.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    value instanceof Date ? value.getMonth() : today.getMonth()
  );

  // 키보드 네비게이션을 위한 포커스된 날짜
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 클릭 핸들러
  const handleDateClick = (day: number) => {
    if (disabled) return;
    
    const clickedDate = new Date(currentYear, currentMonth, day);
    
    // minDate, maxDate 체크
    if (minDate && clickedDate < minDate) return;
    if (maxDate && clickedDate > maxDate) return;

    if (mode === 'single') {
      onChange?.(clickedDate);
    } else if (mode === 'range') {
      const currentRange = value as DateRange;
      if (!currentRange || !currentRange[0] || currentRange[1]) {
        // 새로운 범위 시작
        onChange?.([clickedDate, null]);
      } else {
        // 범위 완성
        const start = currentRange[0];
        if (clickedDate >= start) {
          onChange?.([start, clickedDate]);
        } else {
          onChange?.([clickedDate, start]);
        }
      }
    }
  };

  // 월 네비게이션
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setFocusedDate(today);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent, day?: number) => {
    if (disabled) return;

    const currentFocused = focusedDate || (day ? new Date(currentYear, currentMonth, day) : today);
    let newFocused = new Date(currentFocused);

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newFocused.setDate(newFocused.getDate() - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newFocused.setDate(newFocused.getDate() + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newFocused.setDate(newFocused.getDate() - 7);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newFocused.setDate(newFocused.getDate() + 7);
        break;
      case 'Home':
        event.preventDefault();
        goToToday();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (day) {
          handleDateClick(day);
        }
        return;
    }

    // 월이 바뀌면 currentMonth와 currentYear 업데이트
    if (newFocused.getMonth() !== currentMonth) {
      setCurrentMonth(newFocused.getMonth());
      setCurrentYear(newFocused.getFullYear());
    }
    
    setFocusedDate(newFocused);
  };

  // 날짜 버튼 스타일 계산
  const getDateButtonClass = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const isSelected = mode === 'single' 
      ? isSameDay(date, value as Date)
      : false;
    
    const isInRange = mode === 'range' && value instanceof Array
      ? isDateInRange(date, value[0], value[1])
      : false;

    const isRangeStart = mode === 'range' && value instanceof Array
      ? isSameDay(date, value[0])
      : false;

    const isRangeEnd = mode === 'range' && value instanceof Array
      ? isSameDay(date, value[1])
      : false;

    const isToday = isSameDay(date, today);
    const isFocused = isSameDay(date, focusedDate);
    
    const isDisabled = 
      (minDate && date < minDate) ||
      (maxDate && date > maxDate);

    return cn(
      "w-10 h-10 text-sm font-normal rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-weave-primary focus:ring-offset-2",
      {
        // 기본 상태
        "text-txt-primary hover:bg-bg-secondary": !isDisabled && !isSelected && !isInRange,
        // 선택된 날짜
        "bg-weave-primary text-white hover:bg-weave-primary-hover": isSelected || isRangeStart || isRangeEnd,
        // 범위 안의 날짜
        "bg-weave-primary-light text-weave-primary-dark": isInRange && !isRangeStart && !isRangeEnd,
        // 오늘
        "ring-2 ring-weave-primary ring-inset": isToday && !isSelected,
        // 포커스된 날짜
        "ring-2 ring-weave-primary ring-offset-2": isFocused,
        // 비활성화된 날짜
        "text-txt-disabled cursor-not-allowed": isDisabled,
        // 호버 효과
        "hover:scale-105": !isDisabled,
      }
    );
  };

  return (
    <div 
      className={cn("p-4 bg-bg-primary border border-border-light rounded-lg shadow-sm", className)}
      role="application"
      aria-label="날짜 선택 달력"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          disabled={disabled}
          aria-label="이전 월"
          className="p-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Typography variant="h4" className="text-txt-primary">
            {formatMonth(currentYear, currentMonth, locale)}
          </Typography>
          {showToday && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              disabled={disabled}
              aria-label="오늘로 이동"
              className="p-1"
            >
              <Home className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          disabled={disabled}
          aria-label="다음 월"
          className="p-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "h-10 flex items-center justify-center text-sm font-medium",
              {
                "text-status-error": index === 0, // 일요일
                "text-weave-primary": index === 6, // 토요일
                "text-txt-secondary": index !== 0 && index !== 6,
              }
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div 
        className="grid grid-cols-7 gap-1"
        onKeyDown={(e) => handleKeyDown(e)}
        tabIndex={0}
        role="grid"
        aria-label="달력 날짜"
      >
        {/* 빈 칸 */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="w-10 h-10" />
        ))}
        
        {/* 날짜들 */}
        {days.map((day) => {
          const date = new Date(currentYear, currentMonth, day);
          const isDisabled = 
            (minDate && date < minDate) ||
            (maxDate && date > maxDate);

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              onKeyDown={(e) => handleKeyDown(e, day)}
              disabled={disabled || isDisabled}
              className={getDateButtonClass(day)}
              aria-label={`${currentYear}년 ${currentMonth + 1}월 ${day}일`}
              tabIndex={isSameDay(new Date(currentYear, currentMonth, day), focusedDate) ? 0 : -1}
              role="gridcell"
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 도움말 텍스트 */}
      <div className="mt-4 text-xs text-txt-tertiary space-y-1">
        <p>• 키보드 화살표로 날짜 이동 가능</p>
        <p>• Home 키로 오늘로 이동</p>
        <p>• Enter/Space로 날짜 선택</p>
      </div>
    </div>
  );
};

export default Calendar;