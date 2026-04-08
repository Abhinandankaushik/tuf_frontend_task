import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  isSameMonth,
  isToday,
  isInRange,
  isSameDay,
  isStart,
  isEnd,
  isInPreviewRange,
  format,
  getDateKey,
  hasDateNoteForDate,
  hasRangeNoteForDate,
  type DateRange,
  type CalendarNotesStore,
} from "@/lib/calendar-utils";
import { getHoliday } from "@/lib/holidays";
import { getEventsForDate, type CalendarEvent } from "@/lib/events";

interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  range: DateRange;
  hoveredDate: Date | null;
  notes: CalendarNotesStore;
  events: CalendarEvent[];
  onSelect: (day: Date, isDoubleClick?: boolean) => void;
  onHover: (day: Date | null) => void;
  accent: string;
}

export default function CalendarDay({ day, currentMonth, range, hoveredDate, notes, events, onSelect, onHover, accent }: CalendarDayProps) {
  const sameMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);
  const inRange = isInRange(day, range);
  const rangeStart = isStart(day, range);
  const rangeEnd = isEnd(day, range);
  const previewRange = !range.end && isInPreviewRange(day, range.start, hoveredDate);
  const holiday = getHoliday(day);
  const dateStr = getDateKey(day);
  const dayEvents = getEventsForDate(events, dateStr);
  const hasNotes = hasDateNoteForDate(notes, day) || hasRangeNoteForDate(notes, day);
  const [accentHueRaw, accentSatRaw, accentLightRaw] = accent.split(" ");
  const accentHue = Number.parseInt(accentHueRaw, 10) || 220;
  const accentSat = Number.parseInt(accentSatRaw, 10) || 70;
  const accentLight = Number.parseInt(accentLightRaw, 10) || 56;

  const isSpecial = today || rangeStart || rangeEnd || previewRange;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: 0.02,
        ease: "easeOut",
      }}
      whileHover={sameMonth ? { scale: 1.02, y: -1 } : {}}
      whileTap={sameMonth ? { scale: 0.98 } : {}}
    >
      <motion.button
        onClick={(e) => sameMonth && onSelect(day, e.detail >= 2)}
        onMouseEnter={() => sameMonth && onHover(day)}
        onFocus={() => sameMonth && onHover(day)}
        onMouseLeave={() => onHover(null)}
        onBlur={() => onHover(null)}
        className={cn(
          "relative isolate w-full h-[clamp(2.4rem,8.2vw,3.9rem)] sm:h-[clamp(2.9rem,7.2vw,4.4rem)] md:h-[clamp(3.2rem,6.2vw,4.8rem)] flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-1 sm:p-1.5 md:p-2 transition-all duration-300 font-body text-xs sm:text-sm md:text-base group overflow-hidden border",
          !sameMonth && "cursor-default text-slate-400 dark:text-slate-500 bg-slate-100/35 dark:bg-slate-900/30 border-slate-200/45 dark:border-slate-800/55",
          sameMonth && !inRange && !today && "text-slate-900 dark:text-slate-100 border-white/65 dark:border-white/15 bg-white/42 dark:bg-slate-900/38 hover:bg-white/56 dark:hover:bg-slate-900/52 hover:border-primary/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_6px_18px_rgba(15,23,42,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_22px_rgba(0,0,0,0.32)]",
          today && !inRange && "font-bold text-slate-900 dark:text-white border-primary/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_18px_rgba(59,130,246,0.24)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_22px_rgba(37,99,235,0.33)]",
          inRange && !rangeStart && !rangeEnd && "text-slate-900 dark:text-slate-100 bg-primary/14 dark:bg-primary/22 border-primary/30",
          previewRange && !inRange && !rangeStart && !rangeEnd && "bg-primary/10 border-primary/24 border-dashed",
          (rangeStart || rangeEnd) && "text-white shadow-[0_10px_24px_rgba(37,99,235,0.34)] font-semibold",
          rangeStart && range.end && !isSameDay(range.start as Date, range.end as Date) && "rounded-r-md sm:rounded-r-lg",
          rangeEnd && range.start && !isSameDay(range.start as Date, range.end as Date) && "rounded-l-md sm:rounded-l-lg",
        )}
        layout
        style={
          (rangeStart || rangeEnd)
            ? {
                background: `linear-gradient(140deg, hsl(${accentHue} ${Math.max(accentSat - 8, 25)}% ${Math.max(accentLight - 8, 24)}%), hsl(${accentHue} ${Math.min(accentSat + 6, 96)}% ${Math.min(accentLight + 3, 70)}%))`,
                boxShadow: `0 10px 24px hsl(${accentHue} ${accentSat}% ${accentLight}% / 0.36)`,
              }
            : today && !inRange
            ? {
                background: `linear-gradient(145deg, hsl(${accentHue} ${Math.max(accentSat - 22, 20)}% ${Math.min(accentLight + 26, 90)}% / 0.86), hsl(${accentHue} ${Math.max(accentSat - 10, 22)}% ${Math.min(accentLight + 14, 84)}% / 0.8))`,
              }
            : undefined
        }
      >
        {sameMonth && !rangeStart && !rangeEnd && (
          <span className="pointer-events-none absolute inset-[1px] rounded-[10px] sm:rounded-[14px] bg-[linear-gradient(150deg,rgba(255,255,255,0.26),rgba(255,255,255,0.08)_42%,rgba(255,255,255,0.01)_72%)] dark:bg-[linear-gradient(150deg,rgba(255,255,255,0.11),rgba(255,255,255,0.03)_42%,rgba(255,255,255,0.005)_72%)]" />
        )}

        {/* Animated background glow */}
        {isSpecial && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-2xl"
            animate={{
              opacity: [0.12, 0.28, 0.12],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Hover ripple effect */}
        <motion.span
          className="absolute inset-0 rounded-2xl bg-white/24 dark:bg-white/8"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={sameMonth ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3 }}
        />

        {/* Day number */}
        <motion.span
          className="relative z-10 font-semibold text-[11px] sm:text-sm rounded-full px-1.5 sm:px-2 py-0.5 tracking-tight"
          whileHover={sameMonth ? { y: -1 } : {}}
        >
          {format(day, "d")}
        </motion.span>

        {/* Holiday marker */}
        {holiday && (
          <motion.span
            className="absolute top-1 right-1 w-2 h-2 rounded-full z-20 ring-2 ring-white/85 dark:ring-black/55"
            style={{ backgroundColor: `hsl(${accent})` }}
            title={holiday.name}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Note indicator with pulse */}
        {hasNotes && (
          <motion.span
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 sm:w-6 h-1 rounded-full z-10"
            style={{ backgroundColor: `hsl(${accent})` }}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {dayEvents.length > 0 && (
          <span
            className="absolute top-1 left-1 text-[8px] sm:text-[9px] leading-none px-1.5 py-0.5 rounded-full text-white z-10 border border-white/40"
            style={{ backgroundColor: `hsl(${accent})` }}
            title={`${dayEvents.length} events`}
          >
            {dayEvents.length}
          </span>
        )}

      </motion.button>
    </motion.div>
  );
}
