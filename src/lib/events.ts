export interface CalendarEvent {
  id: string;
  date: string; // yyyy-MM-dd
  title: string;
  color: string;
}

const STORAGE_KEY = "calendar-events";
const MONTH_CACHE_PREFIX = "calendar-events-month-cache";
const API_BASE = "https://date.nager.at/api/v3/PublicHolidays";

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

function getMonthKey(monthDate: Date): string {
  const year = monthDate.getFullYear();
  const month = String(monthDate.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function detectCountryCode(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const region = locale.split("-").pop()?.toUpperCase();
    if (region && /^[A-Z]{2}$/.test(region)) return region;
  } catch {
    // ignore locale detection failure
  }
  return "IN";
}

function hashToColorIndex(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % EVENT_COLORS.length;
}

function mapHolidayToEvent(holiday: { date: string; localName?: string; name: string; }, countryCode: string): CalendarEvent {
  const title = holiday.localName || holiday.name;
  const color = EVENT_COLORS[hashToColorIndex(title)].value;
  return {
    id: `api-${countryCode}-${holiday.date}-${title}`,
    date: holiday.date,
    title,
    color,
  };
}

export async function fetchEventsForMonth(monthDate: Date): Promise<CalendarEvent[]> {
  const monthKey = getMonthKey(monthDate);
  const cacheKey = `${MONTH_CACHE_PREFIX}-${monthKey}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached) as CalendarEvent[];
    }
  } catch {
    // Fall through to rebuild cache from API/user data
  }

  const allUserEvents = loadEvents();
  const monthUserEvents = allUserEvents.filter((event) => event.date.startsWith(monthKey));

  const year = monthDate.getFullYear();
  const monthNumber = monthDate.getMonth() + 1;
  const countryCode = detectCountryCode();

  try {
    const response = await fetch(`${API_BASE}/${year}/${countryCode}`);
    if (!response.ok) {
      localStorage.setItem(cacheKey, JSON.stringify(monthUserEvents));
      return monthUserEvents;
    }

    const holidays = (await response.json()) as Array<{ date: string; localName?: string; name: string }>;
    const monthApiEvents = holidays
      .filter((h) => Number(h.date.split("-")[1]) === monthNumber)
      .map((h) => mapHolidayToEvent(h, countryCode));

    const merged = mergeUniqueEvents(monthUserEvents, monthApiEvents);
    localStorage.setItem(cacheKey, JSON.stringify(merged));
    return merged;
  } catch {
    localStorage.setItem(cacheKey, JSON.stringify(monthUserEvents));
    return monthUserEvents;
  }
}

export function mergeUniqueEvents(base: CalendarEvent[], incoming: CalendarEvent[]): CalendarEvent[] {
  const seen = new Set<string>();
  const merged: CalendarEvent[] = [];

  for (const event of [...base, ...incoming]) {
    const key = `${event.date}::${event.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(event);
  }

  return merged;
}

export const EVENT_COLORS = [
  { name: "Red", value: "0 72% 51%" },
  { name: "Blue", value: "210 80% 52%" },
  { name: "Green", value: "142 60% 42%" },
  { name: "Orange", value: "25 90% 52%" },
  { name: "Purple", value: "270 60% 55%" },
  { name: "Teal", value: "180 55% 42%" },
];
