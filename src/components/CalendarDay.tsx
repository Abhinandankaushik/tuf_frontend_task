import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  isSameMonth,
  isToday,
  isInRange,
  isRangeStart,
  isRangeEnd,
  format,
  type DateRange,
  type CalendarNote,
} from "@/lib/calendar-utils";
import { getHoliday } from "@/lib/holidays";
import { getEventsForDate, type CalendarEvent } from "@/lib/events";

interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  range: DateRange;
  notes: CalendarNote[];
  events: CalendarEvent[];
  onSelect: (day: Date) => void;
  accent: string;
}

export default function CalendarDay({ day, currentMonth, range, notes, events, onSelect, accent }: CalendarDayProps) {
  const sameMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);
  const inRange = isInRange(day, range);
  const rangeStart = isRangeStart(day, range);
  const rangeEnd = isRangeEnd(day, range);
  const holiday = getHoliday(day);
  const dateStr = format(day, "yyyy-MM-dd");
  const dayNotes = notes.filter((n) => n.date === dateStr);
  const dayEvents = getEventsForDate(events, dateStr);
  const hasNotes = dayNotes.length > 0;

  const isSpecial = today || rangeStart || rangeEnd;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: 0.02,
        ease: "easeOut",
      }}
      whileHover={sameMonth ? { scale: 1.05, y: -2 } : {}}
      whileTap={sameMonth ? { scale: 0.92 } : {}}
    >
      <motion.button
        onClick={() => sameMonth && onSelect(day)}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl p-1.5 sm:p-2 aspect-square transition-all duration-300 font-body text-sm sm:text-base group overflow-hidden backdrop-blur-sm border",
          !sameMonth && "text-muted-foreground/45 cursor-default border-transparent",
          sameMonth && !inRange && !today && "text-foreground border-border/60 bg-background/45 hover:shadow-md hover:border-primary/35 hover:bg-background/70",
          today && !inRange && "font-bold text-white shadow-lg border-primary/40",
          inRange && !rangeStart && !rangeEnd && "bg-white/30 dark:bg-white/10 text-foreground border-primary/25 backdrop-blur-sm",
          (rangeStart || rangeEnd) && "text-white shadow-xl font-semibold",
        )}
        layout
        style={
          (rangeStart || rangeEnd)
            ? {
                background: `linear-gradient(135deg, hsl(${accent}), hsl(${accent.split(' ')[0]} ${parseInt(accent.split(' ')[1]) - 10}% ${parseInt(accent.split(' ')[2]) - 5}%))`,
                boxShadow: `0 8px 24px hsl(${accent})/30`,
              }
            : today && !inRange
            ? {
                backgroundColor: `hsl(${accent})/40`,
              }
            : undefined
        }
      >
        {/* Animated background glow */}
        {isSpecial && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-xl"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Hover ripple effect */}
        <motion.span
          className="absolute inset-0 rounded-xl bg-white/10"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={sameMonth ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3 }}
        />

        {/* Day number */}
        <motion.span
          className="relative z-10 font-semibold text-[13px] sm:text-sm rounded-full px-1.5 sm:px-2 py-0.5"
          whileHover={sameMonth ? { y: -1 } : {}}
          style={{
            backgroundColor: sameMonth ? "hsl(var(--background) / 0.35)" : "transparent",
          }}
        >
          {format(day, "d")}
        </motion.span>

        {/* Holiday marker */}
        {holiday && (
          <motion.span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full z-20"
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
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full z-10"
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
            className="absolute top-1 left-1 text-[9px] leading-none px-1 py-0.5 rounded-md text-white z-10"
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
