import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import CalendarNotes from "./CalendarNotes";
import MonthMemo from "./MonthMemo";
import EventChipInput from "./EventChipInput";
import ThemeSwitcher from "./ThemeSwitcher";
import { useTheme } from "@/contexts/ThemeContext";
import { getMonthImage, getMonthAccent } from "@/lib/themes";
import { loadEvents, saveEvents, type CalendarEvent } from "@/lib/events";
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  loadNotes,
  saveNotes,
  type DateRange,
  type CalendarNote,
} from "@/lib/calendar-utils";

export default function WallCalendar() {
  const { theme, setMonthAccent } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<CalendarNote[]>(loadNotes);
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents);
  const [direction, setDirection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const heroImage = useMemo(() => getMonthImage(theme, currentMonth.getMonth()), [theme, currentMonth]);
  const accent = useMemo(() => getMonthAccent(theme, currentMonth.getMonth()), [theme, currentMonth]);

  // Update accent color when month/theme changes
  useEffect(() => {
    setMonthAccent(accent);
  }, [accent, setMonthAccent]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentMonth((m) => addMonths(m, 1));
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentMonth((m) => subMonths(m, 1));
  }, []);

  const goToday = useCallback(() => {
    setDirection(0);
    setCurrentMonth(new Date());
    setRange({ start: null, end: null });
  }, []);

  const handleSelectDay = useCallback((day: Date) => {
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: day, end: null };
      }
      if (isSameDay(day, prev.start)) {
        return { start: day, end: day };
      }
      return { start: prev.start, end: day };
    });
  }, []);

  const handleAddNote = useCallback((note: Omit<CalendarNote, "id">) => {
    const newNote: CalendarNote = { ...note, id: crypto.randomUUID() };
    setNotes((prev) => {
      const updated = [...prev, newNote];
      saveNotes(updated);
      return updated;
    });
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotes(updated);
      return updated;
    });
  }, []);

  const handleAddEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = { ...event, id: crypto.randomUUID() };
    setEvents((prev) => {
      const updated = [...prev, newEvent];
      saveEvents(updated);
      return updated;
    });
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEvents(updated);
      return updated;
    });
  }, []);

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-card rounded-2xl shadow-calendar overflow-hidden border border-border"
      >
        {/* Hero Image with parallax mood */}
        <div
          className="relative overflow-hidden cursor-crosshair"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => setMousePos({ x: 0.5, y: 0.5 })}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={heroImage}
              src={heroImage}
              alt={format(currentMonth, "MMMM yyyy")}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="w-full h-48 sm:h-64 lg:h-80 object-cover"
              style={{
                transform: `scale(1.05) translate(${(mousePos.x - 0.5) * -12}px, ${(mousePos.y - 0.5) * -8}px)`,
                transition: "transform 0.3s ease-out",
              }}
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />

          {/* Theme mood label */}
          <div className="absolute top-4 left-4 bg-foreground/50 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs font-body font-medium flex items-center gap-1.5">
            <span>{theme.emoji}</span>
            <span className="capitalize">{theme.mood}</span>
          </div>

          {/* Year overlay */}
          <div className="absolute top-4 right-4 bg-foreground/50 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-display font-semibold">
            {format(currentMonth, "yyyy")}
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-between px-4 sm:px-8 py-6 border-b border-border/50 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
        >
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={goPrev}
              whileHover={{ scale: 1.15, backgroundColor: "var(--secondary)" }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="p-2.5 rounded-full hover:bg-secondary transition-colors text-foreground backdrop-blur-sm bg-secondary/30"
              title="Previous month"
            >
              <motion.div animate={{ x: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ChevronLeft className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>

          {/* Month title with animation */}
          <motion.div
            key={currentMonth.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center flex-1"
          >
            <motion.h1
              className="font-display text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent"
              animate={{ scale: [0.95, 1] }}
              transition={{ duration: 0.4 }}
            >
              {format(currentMonth, "MMMM")}
            </motion.h1>
            <motion.p className="text-sm text-muted-foreground mt-1 font-body">
              {format(currentMonth, "EEEE, d MMMM yyyy")}
            </motion.p>
          </motion.div>

          {/* Right navigation */}
          <div className="flex items-center gap-1.5">
            <motion.button
              onClick={goToday}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="p-2.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground backdrop-blur-sm bg-secondary/30"
              title="Go to today"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8 }}>
                <RotateCcw className="w-5 h-5" />
              </motion.div>
            </motion.button>
            <ThemeSwitcher />
            <motion.button
              onClick={goNext}
              whileHover={{ scale: 1.15, backgroundColor: "var(--secondary)" }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="p-2.5 rounded-full hover:bg-secondary transition-colors text-foreground backdrop-blur-sm bg-secondary/30"
              title="Next month"
            >
              <motion.div animate={{ x: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row">
          {/* Calendar Grid */}
          <div className="flex-1 px-4 sm:px-8 py-4 sm:py-6">
            <CalendarGrid
              currentMonth={currentMonth}
              range={range}
              notes={notes}
              events={events}
              onSelectDay={handleSelectDay}
              direction={direction}
            />

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground font-body"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary" />
                Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-calendar-range-bg border border-primary/20" />
                In range
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-sm">🎉</span>
                Holiday
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-calendar-note" />
                Note
              </span>
            </motion.div>
          </div>

          {/* Notes Sidebar */}
          <div className="lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l border-border px-4 sm:px-6 py-4 sm:py-6 bg-secondary/20">
            <CalendarNotes
              range={range}
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
            <EventChipInput
              range={range}
              events={events}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>

        {/* Month Memo */}
        <div className="px-4 sm:px-8 pb-4 sm:pb-6">
          <MonthMemo currentMonth={currentMonth} />
        </div>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-4 font-body">
        Click a date to start a range · Click another to complete it · All data persists in your browser
      </p>
    </div>
  );
}
