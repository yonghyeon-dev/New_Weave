// 한국 공휴일 데이터 (2024-2025)
export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  isSubstitute?: boolean; // 대체공휴일 여부
}

export const holidays2024: Holiday[] = [
  { date: '2024-01-01', name: '신정' },
  { date: '2024-02-09', name: '설날 연휴' },
  { date: '2024-02-10', name: '설날' },
  { date: '2024-02-11', name: '설날 연휴' },
  { date: '2024-02-12', name: '설날 대체공휴일', isSubstitute: true },
  { date: '2024-03-01', name: '삼일절' },
  { date: '2024-04-10', name: '22대 국회의원 선거' },
  { date: '2024-05-05', name: '어린이날' },
  { date: '2024-05-06', name: '어린이날 대체공휴일', isSubstitute: true },
  { date: '2024-05-15', name: '부처님오신날' },
  { date: '2024-06-06', name: '현충일' },
  { date: '2024-08-15', name: '광복절' },
  { date: '2024-09-16', name: '추석 연휴' },
  { date: '2024-09-17', name: '추석' },
  { date: '2024-09-18', name: '추석 연휴' },
  { date: '2024-10-03', name: '개천절' },
  { date: '2024-10-09', name: '한글날' },
  { date: '2024-12-25', name: '크리스마스' }
];

export const holidays2025: Holiday[] = [
  { date: '2025-01-01', name: '신정' },
  { date: '2025-01-28', name: '설날 연휴' },
  { date: '2025-01-29', name: '설날' },
  { date: '2025-01-30', name: '설날 연휴' },
  { date: '2025-03-01', name: '삼일절' },
  { date: '2025-03-03', name: '삼일절 대체공휴일', isSubstitute: true },
  { date: '2025-05-05', name: '어린이날' },
  { date: '2025-05-06', name: '부처님오신날' },
  { date: '2025-06-06', name: '현충일' },
  { date: '2025-08-15', name: '광복절' },
  { date: '2025-10-05', name: '추석 연휴' },
  { date: '2025-10-06', name: '추석' },
  { date: '2025-10-07', name: '추석 연휴' },
  { date: '2025-10-08', name: '추석 대체공휴일', isSubstitute: true },
  { date: '2025-10-03', name: '개천절' },
  { date: '2025-10-09', name: '한글날' },
  { date: '2025-12-25', name: '크리스마스' }
];

export function getHolidays(year: number): Holiday[] {
  switch(year) {
    case 2024:
      return holidays2024;
    case 2025:
      return holidays2025;
    default:
      // 기본적인 공휴일만 반환 (음력 공휴일 제외)
      const basicHolidays: Holiday[] = [
        { date: `${year}-01-01`, name: '신정' },
        { date: `${year}-03-01`, name: '삼일절' },
        { date: `${year}-05-05`, name: '어린이날' },
        { date: `${year}-06-06`, name: '현충일' },
        { date: `${year}-08-15`, name: '광복절' },
        { date: `${year}-10-03`, name: '개천절' },
        { date: `${year}-10-09`, name: '한글날' },
        { date: `${year}-12-25`, name: '크리스마스' }
      ];
      return basicHolidays;
  }
}

export function isHoliday(date: Date): Holiday | null {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const holidays = getHolidays(year);
  return holidays.find(h => h.date === dateStr) || null;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 일요일(0) 또는 토요일(6)
}