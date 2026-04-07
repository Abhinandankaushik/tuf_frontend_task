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
  onSelectDay: (day: Date) => void;
  hoveredDate: Date | null;
  onHoverDay: (day: Date | null) => void;
  direction: number;
  accent: string;
}

export default function CalendarGrid({ currentMonth, range, notes, events, onSelectDay, hoveredDate, onHoverDay, direction, accent }: CalendarGridProps) {
  const days = getCalendarDays(currentMonth);
  const flipFromRight = direction >= 0;

  return (
    <div className="w-full" style={{ perspective: "1800px" }}>
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
            rotateY: flipFromRight ? -72 : 72,
            x: flipFromRight ? 26 : -26,
            scale: 0.97,
            opacity: 0,
            filter: "blur(6px)",
          }}
          animate={{
            rotateY: 0,
            x: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
          }}
          exit={{
            rotateY: flipFromRight ? 72 : -72,
            x: flipFromRight ? -26 : 26,
            scale: 0.97,
            opacity: 0,
            filter: "blur(6px)",
          }}
          transition={{
            duration: 0.74,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: flipFromRight ? "left center" : "right center",
            backfaceVisibility: "hidden",
          }}
          className="relative"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            initial={{ opacity: 0.38 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0.34 }}
            transition={{ duration: 0.5 }}
            style={{
              background: flipFromRight
                ? "linear-gradient(90deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 42%)"
                : "linear-gradient(270deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 42%)",
            }}
          />

          {/* Paper-curl edge highlight for a realistic page-turn feel */}
          <motion.div
            className="pointer-events-none absolute top-0 bottom-0 z-20"
            initial={{ opacity: 0.85, scaleX: 0.65, x: flipFromRight ? -6 : 6 }}
            animate={{ opacity: 0.08, scaleX: 1, x: 0 }}
            exit={{ opacity: 0.72, scaleX: 0.6, x: flipFromRight ? 6 : -6 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              width: "14px",
              left: flipFromRight ? "0" : "auto",
              right: flipFromRight ? "auto" : "0",
              background: flipFromRight
                ? "linear-gradient(90deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.45) 42%, rgba(255,255,255,0) 100%)"
                : "linear-gradient(270deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.45) 42%, rgba(255,255,255,0) 100%)",
              filter: "blur(0.2px)",
            }}
          />

          <motion.div
            className="pointer-events-none absolute top-0 bottom-0 z-10"
            initial={{ opacity: 0.7, x: flipFromRight ? -8 : 8 }}
            animate={{ opacity: 0.04, x: 0 }}
            exit={{ opacity: 0.62, x: flipFromRight ? 8 : -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              width: "30px",
              left: flipFromRight ? "0" : "auto",
              right: flipFromRight ? "auto" : "0",
              background: flipFromRight
                ? "linear-gradient(90deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0) 100%)"
                : "linear-gradient(270deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0) 100%)",
            }}
          />

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2">
            {days.map((day, idx) => (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9, rotateX: -24 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: 0.06 + idx * 0.008,
                }}
                style={{ transformStyle: "preserve-3d" }}
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
