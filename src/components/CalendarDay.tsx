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
}

export default function CalendarDay({ day, currentMonth, range, notes, events, onSelect }: CalendarDayProps) {
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
      whileHover={sameMonth ? { scale: 1.1, y: -4 } : {}}
      whileTap={sameMonth ? { scale: 0.92 } : {}}
    >
      <motion.button
        onClick={() => sameMonth && onSelect(day)}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl p-2 sm:p-3 aspect-square transition-all duration-300 font-body text-sm sm:text-base group overflow-hidden",
          !sameMonth && "text-calendar-outside opacity-40 cursor-default",
          sameMonth && !inRange && !today && "text-foreground hover:shadow-lg",
          today && !inRange && "font-bold text-calendar-today shadow-lg shadow-calendar-today/40",
          inRange && !rangeStart && !rangeEnd && "bg-primary/20 text-foreground",
          (rangeStart || rangeEnd) && "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl font-semibold",
        )}
        layout
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
          className="relative z-10 font-semibold"
          whileHover={sameMonth ? { y: -1 } : {}}
        >
          {format(day, "d")}
        </motion.span>

        {/* Holiday emoji with animation */}
        {holiday && (
          <motion.span
            className="absolute -top-1 -right-1 text-lg leading-none z-20"
            title={holiday.name}
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {holiday.emoji}
          </motion.span>
        )}

        {/* Note indicator with pulse */}
        {hasNotes && (
          <motion.span
            className="absolute top-1 left-1 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 z-10 shadow-md"
            animate={{
              boxShadow: ["0 0 8px rgba(96, 165, 250, 0.6)", "0 0 16px rgba(96, 165, 250, 0.3)"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Event chips with stagger animation */}
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {dayEvents.slice(0, 3).map((ev, idx) => (
              <motion.span
                key={ev.id}
                className="w-1.5 h-1.5 rounded-full shadow-md"
                style={{ backgroundColor: `hsl(${ev.color})` }}
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: idx * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </motion.button>
    </motion.div>
  );
}
