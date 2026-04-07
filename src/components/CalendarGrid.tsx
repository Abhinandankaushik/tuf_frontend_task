import { AnimatePresence, motion } from "framer-motion";
import CalendarDay from "./CalendarDay";
import {
  getCalendarDays,
  type DateRange,
  type CalendarNote,
} from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/events";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  currentMonth: Date;
  range: DateRange;
  notes: CalendarNote[];
  events: CalendarEvent[];
  onSelectDay: (day: Date) => void;
  direction: number;
  accent: string;
}

export default function CalendarGrid({ currentMonth, range, notes, events, onSelectDay, direction, accent }: CalendarGridProps) {
  const days = getCalendarDays(currentMonth);

  return (
    <div className="w-full" style={{ perspective: "1200px" }}>
      {/* Weekday headers with bounce animation */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-2.5 sm:mb-3.5">
        {WEEKDAYS.map((wd, idx) => (
          <motion.div
            key={wd}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="text-center text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em] py-2 font-body bg-gradient-to-b from-primary/10 to-transparent rounded-lg border border-border/40"
          >
            <span className="hidden sm:inline">{wd}</span>
            <span className="sm:hidden">{wd.slice(0, 1)}</span>
          </motion.div>
        ))}
      </div>

      {/* Day grid with smooth transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentMonth.toISOString()}
          initial={{
            rotateY: direction * 90,
            opacity: 0,
            filter: "blur(10px)",
          }}
          animate={{
            rotateY: 0,
            opacity: 1,
            filter: "blur(0px)",
          }}
          exit={{
            rotateY: direction * -90,
            opacity: 0,
            filter: "blur(10px)",
          }}
          transition={{
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
          className="grid grid-cols-7 gap-1 sm:gap-1.5"
        >
          {days.map((day, idx) => (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: idx * 0.02,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <CalendarDay
                day={day}
                currentMonth={currentMonth}
                range={range}
                notes={notes}
                events={events}
                onSelect={onSelectDay}
                accent={accent}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
