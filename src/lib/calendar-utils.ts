import {
  startOfMonth,
  startOfWeek,
  addDays,
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

export interface CalendarNotesStore {
  monthNotes: Record<string, string>;
  dateNotes: Record<string, string>;
  rangeNotes: Record<string, string>;
}

export type NoteMode = "month" | "date" | "range";

export function getCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  // Keep a stable 6-row calendar (42 cells) so month height never jumps.
  const end = addDays(start, 41);
  return eachDayOfInterval({ start, end });
}

export function normalizeRange(range: DateRange): DateRange {
  if (!range.start || !range.end) return range;
  return range.start <= range.end
    ? { start: range.start, end: range.end }
    : { start: range.end, end: range.start };
}

export function getDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getMonthKey(date: Date): string {
  return format(date, "yyyy-MM");
}

export function getRangeKey(start: Date, end: Date): string {
  const ordered = normalizeRange({ start, end });
  return `${getDateKey(ordered.start as Date)}_${getDateKey(ordered.end as Date)}`;
}

export function isInRange(day: Date, range: DateRange): boolean {
  if (!range.start || !range.end) return false;
  const ordered = normalizeRange(range);
  const start = ordered.start as Date;
  const end = ordered.end as Date;
  return isWithinInterval(day, { start, end });
}

export function isStart(day: Date, range: DateRange): boolean {
  if (!range.start) return false;
  const start = range.end && range.end < range.start ? range.end : range.start;
  return isSameDay(day, start);
}

export function isEnd(day: Date, range: DateRange): boolean {
  if (!range.end) return false;
  const end = range.start && range.start > range.end ? range.start : range.end;
  return isSameDay(day, end);
}

export function isInPreviewRange(day: Date, start: Date | null, hover: Date | null): boolean {
  if (!start || !hover) return false;
  const ordered = normalizeRange({ start, end: hover });
  return isWithinInterval(day, { start: ordered.start as Date, end: ordered.end as Date });
}

export const MONTH_IMAGES: Record<number, string> = {};

interface StoredNoteItem {
  text: string;
  color: string;
  sourceRange?: string;
}

function defaultNotesStore(): CalendarNotesStore {
  return {
    monthNotes: {},
    dateNotes: {},
    rangeNotes: {},
  };
}

function parseDateKeyToLocalDate(key: string): Date | null {
  const [y, m, d] = key.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseStoredNoteItems(value: string | undefined): StoredNoteItem[] {
  if (!value || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({
          text: String(item?.text ?? "").trim(),
          color: String(item?.color ?? "16 60% 48%"),
          sourceRange: item?.sourceRange ? String(item.sourceRange) : undefined,
        }))
        .filter((item) => item.text.length > 0);
    }
  } catch {
    // Legacy plain-text format fallback.
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text) => ({ text, color: "16 60% 48%" }));
}

function stringifyStoredNoteItems(items: StoredNoteItem[]): string {
  if (!items.length) return "";
  return JSON.stringify(items.map((item) => ({
    text: item.text,
    color: item.color,
    ...(item.sourceRange ? { sourceRange: item.sourceRange } : {}),
  })));
}

export function loadNotes(): CalendarNotesStore {
  try {
    const saved = localStorage.getItem("calendar-notes");
    const baseline = defaultNotesStore();

    if (saved) {
      const parsed = JSON.parse(saved);

      // Backward compatibility: old array format becomes date notes.
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          if (!entry?.date || !entry?.text) continue;
          const prev = baseline.dateNotes[entry.date];
          baseline.dateNotes[entry.date] = prev ? `${prev}\n${entry.text}` : entry.text;
        }
      } else {
        baseline.monthNotes = parsed.monthNotes ?? {};
        baseline.dateNotes = parsed.dateNotes ?? {};
        baseline.rangeNotes = parsed.rangeNotes ?? {};
      }
    }

    // Read flat format: "dd/MM/yyyy - note"
    const flatRaw = localStorage.getItem("calendar-notes-flat");
    if (flatRaw) {
      try {
        const flatEntries = JSON.parse(flatRaw);
        if (Array.isArray(flatEntries)) {
          for (const line of flatEntries) {
            if (typeof line !== "string") continue;
            const [left, ...rest] = line.split(" - ");
            if (!left || rest.length === 0) continue;

            const noteText = rest.join(" - ").trim();
            const [dd, mm, yyyy] = left.split("/").map(Number);
            if (!dd || !mm || !yyyy || !noteText) continue;

            const key = `${String(yyyy).padStart(4, "0")}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
            const existing = parseStoredNoteItems(baseline.dateNotes[key]);
            const merged = [...existing, { text: noteText, color: "16 60% 48%" }];
            baseline.dateNotes[key] = stringifyStoredNoteItems(merged);
          }
        }
      } catch {
        // Ignore malformed flat storage
      }
    }

    return baseline;
  } catch {
    return defaultNotesStore();
  }
}

export function saveNotes(notes: CalendarNotesStore): void {
  localStorage.setItem("calendar-notes", JSON.stringify(notes));

  // Mirror date-wise entries in requested format: dd/MM/yyyy - note.
  const flatEntries: string[] = [];
  for (const [dateKey, value] of Object.entries(notes.dateNotes)) {
    const items = parseStoredNoteItems(value);
    if (!items.length) continue;

    const date = parseDateKeyToLocalDate(dateKey);
    const printableDate = date ? format(date, "dd/MM/yyyy") : dateKey;
    for (const item of items) {
      flatEntries.push(`${printableDate} - ${item.text}`);
    }
  }
  localStorage.setItem("calendar-notes-flat", JSON.stringify(flatEntries));
}

export function getNoteForSelection(notes: CalendarNotesStore, currentMonth: Date, range: DateRange): {
  mode: NoteMode;
  key: string;
  text: string;
} {
  if (!range.start) {
    const key = getMonthKey(currentMonth);
    return { mode: "month", key, text: notes.monthNotes[key] ?? "" };
  }

  if (!range.end) {
    const key = getDateKey(range.start);
    return { mode: "date", key, text: notes.dateNotes[key] ?? "" };
  }

  const key = getRangeKey(range.start, range.end);
  return { mode: "range", key, text: notes.rangeNotes[key] ?? "" };
}

export function saveNoteForSelection(
  notes: CalendarNotesStore,
  mode: NoteMode,
  key: string,
  text: string,
): CalendarNotesStore {
  const next = {
    monthNotes: { ...notes.monthNotes },
    dateNotes: { ...notes.dateNotes },
    rangeNotes: { ...notes.rangeNotes },
  };

  const cleanedText = text.trim();
  const target = mode === "month" ? next.monthNotes : mode === "date" ? next.dateNotes : next.rangeNotes;

  if (!cleanedText) {
    delete target[key];
  } else {
    target[key] = cleanedText;
  }

  // Expand range notes into per-day notes so clicking any date in that range renders the note.
  if (mode === "range") {
    const [startKey, endKey] = key.split("_");
    const start = startKey ? parseDateKeyToLocalDate(startKey) : null;
    const end = endKey ? parseDateKeyToLocalDate(endKey) : null;

    if (start && end) {
      const ordered = normalizeRange({ start, end });
      const days = eachDayOfInterval({ start: ordered.start as Date, end: ordered.end as Date });

      for (const day of days) {
        const dayKey = getDateKey(day);
        const existing = parseStoredNoteItems(next.dateNotes[dayKey]);
        const withoutThisRange = existing.filter((item) => item.sourceRange !== key);

        if (!cleanedText) {
          const persisted = stringifyStoredNoteItems(withoutThisRange);
          if (persisted) next.dateNotes[dayKey] = persisted;
          else delete next.dateNotes[dayKey];
          continue;
        }

        const rangeItems = parseStoredNoteItems(cleanedText).map((item) => ({
          ...item,
          sourceRange: key,
        }));
        const merged = [...withoutThisRange, ...rangeItems];
        next.dateNotes[dayKey] = stringifyStoredNoteItems(merged);
      }
    }
  }

  return next;
}

function hasStoredNoteValue(value: string | undefined): boolean {
  if (!value || !value.trim()) return false;

  // New format: JSON array of { text, color }
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.some((item) => String(item?.text ?? "").trim().length > 0);
    }
  } catch {
    // Legacy plain-text format fallback.
  }

  return value.trim().length > 0;
}

export function hasRangeNoteForDate(notes: CalendarNotesStore, day: Date): boolean {
  const dayKey = getDateKey(day);

  for (const [rangeKey, value] of Object.entries(notes.rangeNotes)) {
    if (!hasStoredNoteValue(value)) continue;

    const [startKey, endKey] = rangeKey.split("_");
    if (!startKey || !endKey) continue;

    // Date keys are yyyy-MM-dd, so string comparison is safe and timezone-free.
    const from = startKey <= endKey ? startKey : endKey;
    const to = startKey <= endKey ? endKey : startKey;

    if (dayKey >= from && dayKey <= to) {
      return true;
    }
  }

  return false;
}

export function hasDateNoteForDate(notes: CalendarNotesStore, day: Date): boolean {
  return parseStoredNoteItems(notes.dateNotes[getDateKey(day)]).length > 0;
}

export { isSameMonth, isSameDay, isToday, format, addMonths, subMonths };
