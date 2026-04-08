import { AnimatePresence, motion } from "framer-motion";
import CalendarDay from "./CalendarDay";
import {
  getCalendarDays,
  type DateRange,
  type CalendarNotesStore,
} from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/events";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  currentMonth: Date;
  range: DateRange;
  notes: CalendarNotesStore;
  events: CalendarEvent[];
  onSelectDay: (day: Date, isDoubleClick?: boolean) => void;
  hoveredDate: Date | null;
  onHoverDay: (day: Date | null) => void;
  direction: number;
  accent: string;
}

export default function CalendarGrid({ currentMonth, range, notes, events, onSelectDay, hoveredDate, onHoverDay, direction, accent }: CalendarGridProps) {
  const days = getCalendarDays(currentMonth);
  const flipFromRight = direction >= 0;

  return (
    <div className="w-full">
      {/* Weekday headers with bounce animation */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2 mb-2 sm:mb-3 md:mb-4">
        {WEEKDAYS.map((wd, idx) => (
          <motion.div
            key={wd}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="text-center text-[9px] xs:text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-[0.12em] sm:tracking-[0.14em] py-1.5 sm:py-2 font-body bg-gradient-to-b from-primary/10 to-transparent rounded-md sm:rounded-lg border border-border/40"
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
            x: flipFromRight ? 18 : -18,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{
            x: flipFromRight ? -18 : 18,
            opacity: 0,
          }}
          transition={{
            duration: 0.38,
            ease: "easeOut",
          }}
          className="relative"
        >

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2">
            {days.map((day, idx) => (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.22,
                  ease: "easeOut",
                  delay: 0.02 + idx * 0.005,
                }}
                className="w-full"
              >
                <CalendarDay
                  day={day}
                  currentMonth={currentMonth}
                  range={range}
                  hoveredDate={hoveredDate}
                  notes={notes}
                  events={events}
                  onSelect={onSelectDay}
                  onHover={onHoverDay}
                  accent={accent}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
