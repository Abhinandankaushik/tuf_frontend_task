import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Moon, Sun, PanelRightOpen, PanelRightClose, Minimize2, Maximize2 } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import CalendarNotes from "./CalendarNotes";
import EventChipInput from "./EventChipInput";
import { useTheme } from "@/contexts/ThemeContext";
import { THEMES } from "@/lib/themes";
import { fetchEventsForMonth, loadEvents, mergeUniqueEvents, saveEvents, type CalendarEvent } from "@/lib/events";
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  loadNotes,
  saveNotes,
  saveNoteForSelection,
  type DateRange,
  type CalendarNotesStore,
  type NoteMode,
} from "@/lib/calendar-utils";

const ALL_IMAGES = THEMES.flatMap((t) => t.images);
const ALL_ACCENTS = THEMES.flatMap((t) => t.accents);

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export default function WallCalendar() {
  const { isDark, toggleDark } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<CalendarNotesStore>(loadNotes);
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [heroImage, setHeroImage] = useState(() => pickRandom(ALL_IMAGES));
  const [accent, setAccent] = useState(() => pickRandom(ALL_ACCENTS));
  const [imageRetry, setImageRetry] = useState(0);
  const [notesOpen, setNotesOpen] = useState(true);
  const [notesCompact, setNotesCompact] = useState(false);
  const [sidePanelView, setSidePanelView] = useState<"notes" | "events">("notes");
  const [yearInput, setYearInput] = useState(() => String(new Date().getFullYear()));

  // Pick a new random hero image + accent whenever month changes.
  useEffect(() => {
    setHeroImage(pickRandom(ALL_IMAGES));
    setAccent(pickRandom(ALL_ACCENTS));
    setImageRetry(0);

    // Keep notes panel visible on desktop when changing months.
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setNotesOpen(true);
    }
  }, [currentMonth]);

  // Fetch current-month events, cache in localStorage, and keep unique event list.
  useEffect(() => {
    let active = true;
    const loadMonthEvents = async () => {
      const monthEvents = await fetchEventsForMonth(currentMonth);
      if (!active) return;

      setEvents((prev) => {
        const merged = mergeUniqueEvents(prev, monthEvents);
        saveEvents(merged);
        return merged;
      });
    };

    loadMonthEvents();
    return () => {
      active = false;
    };
  }, [currentMonth]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentMonth((m) => addMonths(m, 1));
    setImageRetry(0); // Reset retry for new image
    setHoveredDate(null);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentMonth((m) => subMonths(m, 1));
    setImageRetry(0); // Reset retry for new image
    setHoveredDate(null);
  }, []);

  const goToday = useCallback(() => {
    setDirection(0);
    setCurrentMonth(new Date());
    setRange({ start: null, end: null });
    setImageRetry(0); // Reset retry counter for fresh image load
    setHoveredDate(null);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setDirection(0);
    setCurrentMonth((m) => {
      const next = new Date(m);
      next.setFullYear(year);
      return next;
    });
    setImageRetry(0);
  }, []);

  useEffect(() => {
    setYearInput(String(currentMonth.getFullYear()));
  }, [currentMonth]);

  const applyYearInput = useCallback(() => {
    const parsedYear = Number(yearInput);
    if (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      setYearInput(String(currentMonth.getFullYear()));
      return;
    }
    handleYearChange(parsedYear);
  }, [currentMonth, handleYearChange, yearInput]);

  const clampYear = useCallback((year: number) => {
    return Math.min(2100, Math.max(1900, year));
  }, []);

  const handleSelectDay = useCallback((day: Date) => {
    setSelectedDate(day);
    setNotesOpen(true);
    setSidePanelView("notes");
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        setHoveredDate(null);
        return { start: day, end: null };
      }
      if (isSameDay(day, prev.start)) {
        setHoveredDate(null);
        return { start: day, end: day };
      }
      setHoveredDate(null);
      if (day < prev.start) {
        return { start: day, end: prev.start };
      }
      return { start: prev.start, end: day };
    });
  }, []);

  const handleHoverDay = useCallback((day: Date | null) => {
    if (!range.start || range.end) {
      if (day === null) setHoveredDate(null);
      return;
    }
    setHoveredDate(day);
  }, [range.start, range.end]);

  const handleSaveSelectionNote = useCallback((mode: NoteMode, key: string, text: string) => {
    setNotes((prev) => {
      const updated = saveNoteForSelection(prev, mode, key, text);
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

  const handleImageLoad = useCallback(() => {
    setImageRetry(0);
  }, []);

  const handleImageError = useCallback(() => {
    if (imageRetry < 2) {
      setTimeout(() => {
        setImageRetry((prev) => prev + 1);
      }, 800);
    }
  }, [imageRetry]);

  const iconButtonClass =
    "h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-xl transition-all text-foreground/85 hover:text-foreground dark:text-white/85 dark:hover:text-white backdrop-blur-sm hover:backdrop-blur-md border border-black/10 dark:border-white/15 inline-flex items-center justify-center touch-target";

  return (
    <div className="w-full max-w-7xl mx-auto px-1.5 sm:px-3 lg:px-4 py-2 sm:py-4 md:py-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-card/40 backdrop-blur-xl rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden border border-white/10 dark:border-white/5 h-full flex flex-col"
      >
        {/* Premium Hero Image Section */}
        <div
          className="relative overflow-hidden w-full h-40 sm:h-52 md:h-60 lg:h-72 group"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => setMousePos({ x: 0.5, y: 0.5 })}
        >
          {/* Fallback gradient layer - themed accent */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              background: `linear-gradient(135deg, hsl(${accent}), hsl(${accent.split(' ')[0]} ${Math.max(parseInt(accent.split(' ')[1]) - 20, 0)}% ${Math.min(parseInt(accent.split(' ')[2]) + 15, 95)}%))`,
            }}
          />

          <AnimatePresence mode="popLayout">
            <motion.img
              key={`${heroImage}-${imageRetry}`}
              src={heroImage}
              alt={format(currentMonth, "MMMM yyyy")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-full object-cover relative z-10"
              style={{
                transform: `scale(1.05) translate(${(mousePos.x - 0.5) * -12}px, ${(mousePos.y - 0.5) * -8}px)`,
                transition: "transform 0.3s ease-out",
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </AnimatePresence>

          {/* Premium Dark Gradient Overlay - Light top to darker bottom */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />
          
          {/* Accent Color Enhancement - subtle glow */}
          <div 
            className="absolute inset-0 z-15 opacity-25 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, transparent 0%, hsl(${accent})/30 100%)`,
            }}
          />

          {/* Month & Year Information - overlaid on image */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-30 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display">
              {format(currentMonth, "MMMM")}
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-1 font-body">
              {format(currentMonth, "EEEE, d MMM")}
            </p>
          </motion.div>

          {/* Year Badge with accent color */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-white backdrop-blur-sm border"
            style={{
              backgroundColor: `hsl(${accent})/70`,
              borderColor: `hsl(${accent})/90`,
            }}
          >
            {format(currentMonth, "yyyy")}
          </motion.div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 px-2.5 sm:px-5 md:px-8 py-3 sm:py-4 md:py-5 border-b border-white/5 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-sm"
        >
          {/* Navigation buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <motion.button
              onClick={goPrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={iconButtonClass}
              style={{
                backgroundColor: `hsl(${accent})/15`,
              }}
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            <motion.button
              onClick={goToday}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={iconButtonClass}
              style={{
                backgroundColor: `hsl(${accent})/15`,
              }}
              title="Go to today"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            <motion.button
              onClick={goNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={iconButtonClass}
              style={{
                backgroundColor: `hsl(${accent})/15`,
              }}
              title="Next month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/15 bg-gradient-to-br from-white/80 to-white/55 dark:from-white/10 dark:to-white/5 px-2.5 sm:px-3 py-1.5 shadow-lg shadow-black/5 dark:shadow-black/25 backdrop-blur-md">
              <label htmlFor="calendar-year-input" className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-[0.12em]">
                Jump Year
              </label>
              <input
                id="calendar-year-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const currentValue = Number(yearInput);
                    const baseYear = Number.isInteger(currentValue) ? currentValue : currentMonth.getFullYear();
                    const nextYear = clampYear(baseYear + (e.key === "ArrowUp" ? 1 : -1));
                    setYearInput(String(nextYear));
                    handleYearChange(nextYear);
                    return;
                  }
                  if (e.key === "Enter") applyYearInput();
                }}
                onBlur={applyYearInput}
                className="h-8 sm:h-9 w-20 sm:w-24 rounded-xl border border-black/10 dark:border-white/15 bg-background/80 px-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-inner shadow-black/5 dark:shadow-black/30 focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Enter calendar year"
              />
              <button
                onClick={applyYearInput}
                className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-xl bg-primary text-primary-foreground text-[11px] sm:text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35"
                title="Apply year"
              >
                Go
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <motion.button
              onClick={toggleDark}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={iconButtonClass}
              style={{
                backgroundColor: `hsl(${accent})/18`,
              }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </motion.button>

            <motion.button
              onClick={() => setNotesOpen((prev) => !prev)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={iconButtonClass}
              style={{
                backgroundColor: `hsl(${accent})/18`,
              }}
              title={notesOpen ? "Hide notes" : "Show notes"}
            >
              {notesOpen ? <PanelRightClose className="w-4 h-4 sm:w-5 sm:h-5" /> : <PanelRightOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
            </motion.button>

            <motion.button
              onClick={() => setNotesCompact((prev) => !prev)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={iconButtonClass}
              style={{
                backgroundColor: `hsl(${accent})/18`,
              }}
              title={notesCompact ? "Expand notes" : "Compact notes"}
            >
              {notesCompact ? <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row gap-0 flex-1 min-h-0">
          {/* Calendar Grid */}
          <div className="flex-1 px-2.5 sm:px-5 md:px-8 py-3 sm:py-5 md:py-6 order-first lg:order-none min-h-0">
            <CalendarGrid
              currentMonth={currentMonth}
              range={range}
              notes={notes}
              events={events}
              onSelectDay={handleSelectDay}
              hoveredDate={hoveredDate}
              onHoverDay={handleHoverDay}
              direction={direction}
              accent={accent}
            />

          </div>

          {/* Notes Sidebar - Responsive open/close */}
          <AnimatePresence initial={false}>
            {notesOpen && (
              <motion.div
                initial={{ opacity: 0, x: 24, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 24, height: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={`border-t lg:border-t-0 lg:border-l border-white/10 dark:border-white/5 px-2.5 sm:px-5 md:px-8 py-3 sm:py-5 md:py-6 bg-white/40 dark:bg-white/5 backdrop-blur-xl lg:overflow-y-auto modern-scrollbar min-h-0 overflow-x-visible w-full ${notesCompact ? "lg:w-72" : "lg:w-80"}`}
              >
                <div className="mb-3 p-1 rounded-xl border border-border/60 bg-background/55 backdrop-blur-sm inline-flex gap-1 w-full">
                  <button
                    onClick={() => setSidePanelView("notes")}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${sidePanelView === "notes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => setSidePanelView("events")}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${sidePanelView === "events" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
                  >
                    Events
                  </button>
                </div>

                {sidePanelView === "notes" ? (
                  <CalendarNotes
                    currentMonth={currentMonth}
                    range={range}
                    notes={notes}
                    onSaveNote={handleSaveSelectionNote}
                    compact={notesCompact}
                  />
                ) : (
                  <EventChipInput
                    selectedDate={selectedDate}
                    events={events}
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                    compact={notesCompact}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
