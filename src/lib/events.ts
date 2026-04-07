export interface CalendarEvent {
  id: string;
  date: string; // yyyy-MM-dd
  title: string;
  color: string;
}

const STORAGE_KEY = "calendar-events";

export function loadEvents(): CalendarEvent[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveEvents(events: CalendarEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getEventsForDate(events: CalendarEvent[], dateStr: string): CalendarEvent[] {
  return events.filter((e) => e.date === dateStr);
}

export const EVENT_COLORS = [
  { name: "Red", value: "0 72% 51%" },
  { name: "Blue", value: "210 80% 52%" },
  { name: "Green", value: "142 60% 42%" },
  { name: "Orange", value: "25 90% 52%" },
  { name: "Purple", value: "270 60% 55%" },
  { name: "Teal", value: "180 55% 42%" },
];
