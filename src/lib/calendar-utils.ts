import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  format,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarNote {
  id: string;
  date: string; // ISO date string
  text: string;
  color: string;
}

export function getCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function isInRange(day: Date, range: DateRange): boolean {
  if (!range.start || !range.end) return false;
  const start = range.start < range.end ? range.start : range.end;
  const end = range.start < range.end ? range.end : range.start;
  return isWithinInterval(day, { start, end });
}

export function isRangeStart(day: Date, range: DateRange): boolean {
  if (!range.start) return false;
  const start = range.end && range.end < range.start ? range.end : range.start;
  return isSameDay(day, start);
}

export function isRangeEnd(day: Date, range: DateRange): boolean {
  if (!range.end) return false;
  const end = range.start && range.start > range.end ? range.start : range.end;
  return isSameDay(day, end);
}

export const MONTH_IMAGES: Record<number, string> = {};

export function loadNotes(): CalendarNote[] {
  try {
    const saved = localStorage.getItem("calendar-notes");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: CalendarNote[]): void {
  localStorage.setItem("calendar-notes", JSON.stringify(notes));
}

export function getNotesForDate(notes: CalendarNote[], date: Date): CalendarNote[] {
  const dateStr = format(date, "yyyy-MM-dd");
  return notes.filter((n) => n.date === dateStr);
}

export function getNotesForRange(notes: CalendarNote[], range: DateRange): CalendarNote[] {
  if (!range.start || !range.end) return [];
  const start = range.start < range.end ? range.start : range.end;
  const end = range.start < range.end ? range.end : range.start;
  const days = eachDayOfInterval({ start, end });
  const dateStrs = new Set(days.map((d) => format(d, "yyyy-MM-dd")));
  return notes.filter((n) => dateStrs.has(n.date));
}

export { isSameMonth, isSameDay, isToday, format, addMonths, subMonths };
