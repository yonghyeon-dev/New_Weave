'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { isHoliday, isWeekend } from '@/lib/data/holidays';
import { cn } from '@/lib/utils';

type ViewMode = 'week' | 'month' | 'year';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'invoice' | 'payment' | 'deadline' | 'meeting' | 'reminder';
  color?: string;
}

interface DashboardCalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export default function DashboardCalendar({ 
  events = [], 
  onDateSelect,
  onEventClick 
}: DashboardCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 날짜 관련 유틸리티
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // 이전 달의 날짜들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getYearMonths = (date: Date) => {
    const year = date.getFullYear();
    const months: Date[] = [];
    for (let i = 0; i < 12; i++) {
      months.push(new Date(year, i, 1));
    }
    return months;
  };

  // 이벤트 가져오기
  const getEventsForDate = (date: Date) => {
    const dateStr = formatDateString(date);
    return events.filter(event => event.date === dateStr);
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 네비게이션 핸들러
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  // 뷰 모드별 타이틀
  const getTitle = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('ko-KR', { month: 'long' });
    
    if (viewMode === 'year') {
      return `${year}년`;
    } else if (viewMode === 'month') {
      return `${year}년 ${month}`;
    } else {
      const weekStart = getWeekDays(currentDate)[0];
      const weekEnd = getWeekDays(currentDate)[6];
      return `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 - ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`;
    }
  };

  // 이벤트 타입별 색상
  const getEventColor = (type: CalendarEvent['type']) => {
    switch(type) {
      case 'invoice': return 'bg-blue-500';
      case 'payment': return 'bg-green-500';
      case 'deadline': return 'bg-red-500';
      case 'meeting': return 'bg-purple-500';
      case 'reminder': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // 월간 뷰 렌더링
  const renderMonthView = () => {
    const days = getMonthDays(currentDate);
    const today = new Date();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* 요일 헤더 */}
        {weekDays.map((day, index) => (
          <div 
            key={day} 
            className={cn(
              "p-2 text-center text-sm font-medium",
              index === 0 && "text-red-500",
              index === 6 && "text-blue-500"
            )}
          >
            {day}
          </div>
        ))}

        {/* 날짜 셀 */}
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="p-2" />;
          }

          const holiday = isHoliday(date);
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const dayEvents = getEventsForDate(date);
          const isWeekendDay = isWeekend(date);

          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={cn(
                "p-2 min-h-[80px] border rounded-lg cursor-pointer transition-colors",
                isToday && "bg-blue-50 border-blue-500",
                isSelected && "ring-2 ring-blue-500",
                !isToday && !isSelected && "hover:bg-gray-50",
                (isWeekendDay || holiday) && "bg-gray-50"
              )}
            >
              <div className={cn(
                "text-sm font-medium mb-1",
                holiday && "text-red-500",
                !holiday && isWeekendDay && date.getDay() === 0 && "text-red-500",
                !holiday && isWeekendDay && date.getDay() === 6 && "text-blue-500"
              )}>
                {date.getDate()}
                {holiday && (
                  <span className="ml-1 text-xs">
                    {holiday.name}
                  </span>
                )}
              </div>
              
              {/* 이벤트 표시 */}
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={cn(
                      "text-xs text-white px-1 py-0.5 rounded truncate cursor-pointer",
                      getEventColor(event.type)
                    )}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2}개
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 주간 뷰 렌더링
  const renderWeekView = () => {
    const days = getWeekDays(currentDate);
    const today = new Date();

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const holiday = isHoliday(date);
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const dayEvents = getEventsForDate(date);
          const isWeekendDay = isWeekend(date);
          const dayName = date.toLocaleString('ko-KR', { weekday: 'short' });

          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={cn(
                "p-3 min-h-[300px] border rounded-lg cursor-pointer transition-colors",
                isToday && "bg-blue-50 border-blue-500",
                isSelected && "ring-2 ring-blue-500",
                !isToday && !isSelected && "hover:bg-gray-50"
              )}
            >
              <div className="mb-2">
                <div className={cn(
                  "text-sm font-medium",
                  holiday && "text-red-500",
                  !holiday && isWeekendDay && date.getDay() === 0 && "text-red-500",
                  !holiday && isWeekendDay && date.getDay() === 6 && "text-blue-500"
                )}>
                  {dayName}
                </div>
                <div className="text-lg font-bold">
                  {date.getDate()}일
                </div>
                {holiday && (
                  <div className="text-xs text-red-500">
                    {holiday.name}
                  </div>
                )}
              </div>

              {/* 이벤트 목록 */}
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={cn(
                      "text-xs text-white p-1 rounded cursor-pointer",
                      getEventColor(event.type)
                    )}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 연간 뷰 렌더링
  const renderYearView = () => {
    const months = getYearMonths(currentDate);
    const today = new Date();

    return (
      <div className="grid grid-cols-3 gap-4">
        {months.map((monthDate) => {
          const monthEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === monthDate.getFullYear() &&
                   eventDate.getMonth() === monthDate.getMonth();
          });
          
          const isCurrentMonth = monthDate.getMonth() === today.getMonth() && 
                                monthDate.getFullYear() === today.getFullYear();

          return (
            <Card
              key={monthDate.toISOString()}
              variant="outlined"
              className={cn(
                "p-4 cursor-pointer transition-colors hover:bg-gray-50",
                isCurrentMonth && "border-blue-500 bg-blue-50"
              )}
              onClick={() => {
                setCurrentDate(monthDate);
                setViewMode('month');
              }}
            >
              <Typography variant="h4" className="mb-2">
                {monthDate.toLocaleString('ko-KR', { month: 'long' })}
              </Typography>
              <div className="text-sm text-gray-500">
                일정 {monthEvents.length}개
              </div>
              
              {/* 이벤트 타입별 요약 */}
              <div className="mt-2 flex flex-wrap gap-1">
                {monthEvents.length > 0 && (
                  <>
                    {['invoice', 'payment', 'deadline'].map(type => {
                      const count = monthEvents.filter(e => e.type === type).length;
                      if (count === 0) return null;
                      
                      return (
                        <div
                          key={type}
                          className={cn(
                            "text-xs text-white px-2 py-1 rounded",
                            getEventColor(type as CalendarEvent['type'])
                          )}
                        >
                          {count}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="p-4 md:p-6">
      {/* 캘린더 헤더 - 모바일 최적화 */}
      <div className="space-y-3 md:space-y-0">
        {/* 상단: 날짜 네비게이션 */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {/* 동적 크기 타이틀 */}
          <div className="flex-1 mx-2 md:mx-4">
            <Typography 
              variant="h3" 
              className="text-center text-sm md:text-base lg:text-lg truncate px-2"
            >
              {getTitle()}
            </Typography>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* 하단: 오늘 버튼 & 뷰 모드 선택 */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="flex-shrink-0"
          >
            오늘
          </Button>

          {/* 뷰 모드 선택 - 모바일 최적화 */}
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'week' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="px-2 md:px-3"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">주간</span>
            </Button>
            <Button
              variant={viewMode === 'month' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="px-2 md:px-3"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">월간</span>
            </Button>
            <Button
              variant={viewMode === 'year' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('year')}
              className="px-2 md:px-3"
            >
              <CalendarRange className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">연간</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 캘린더 본문 */}
      <div className="mt-4">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'year' && renderYearView()}
      </div>

      {/* 범례 */}
      <div className="mt-4 pt-4 border-t flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span>인보이스</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>결제</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>마감일</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded" />
          <span>미팅</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded" />
          <span>리마인더</span>
        </div>
      </div>
    </Card>
  );
}