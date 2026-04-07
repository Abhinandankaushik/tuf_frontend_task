import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { EVENT_COLORS, type CalendarEvent } from "@/lib/events";
import { format } from "date-fns";

interface EventChipInputProps {
  selectedDate: Date | null;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, "id">) => void;
  onDeleteEvent: (id: string) => void;
  compact?: boolean;
}

export default function EventChipInput({ selectedDate, events, onAddEvent, onDeleteEvent, compact = false }: EventChipInputProps) {
  const [title, setTitle] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);

  if (!selectedDate) return null;

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dateEvents = events.filter((e) => e.date === dateStr);

  useEffect(() => {
    setShowForm(false);
  }, [dateStr]);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAddEvent({ date: dateStr, title: title.trim(), color: EVENT_COLORS[colorIdx].value });
    setTitle("");
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`mt-1 border-t border-border/70 ${compact ? "pt-1" : "pt-1.5"}`}>
      <div className={`sticky top-0 z-10 bg-white/60 dark:bg-black/15 backdrop-blur-md rounded-lg border border-border/40 px-2 py-1.5 sm:py-2 flex items-center justify-between ${compact ? "mb-1" : "mb-1.5"}`}>
        <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">
          Events · {format(selectedDate, "MMM d")}
        </span>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-secondary transition-colors text-primary touch-target"
          title="Add event"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </motion.button>
      </div>

      <div className={`space-y-1.5 overflow-y-auto modern-scrollbar pr-1 ${compact ? "max-h-36 sm:max-h-40 mb-1" : "max-h-44 sm:max-h-56 mb-1.5"}`}>
        <AnimatePresence>
          {dateEvents.map((ev) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="group flex items-start gap-2 rounded-xl border border-border/60 bg-background/75 p-2 shadow-sm hover:shadow-md transition-all"
              style={{ boxShadow: `inset 3px 0 0 hsl(${ev.color})` }}
            >
              <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: `hsl(${ev.color})` }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-foreground font-body font-medium break-words">{ev.title}</p>
                <p className="text-[11px] text-muted-foreground/90">{ev.date}</p>
              </div>
              <motion.button
                onClick={() => onDeleteEvent(ev.id)}
                whileHover={{ scale: 1.1 }}
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 touch-target"
                title="Delete event"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
        {dateEvents.length === 0 && !showForm && (
          <p className="text-xs text-muted-foreground italic">No events for this date.</p>
        )}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-0.5"
          >
            <div className="pt-1 pb-1.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Tone</span>
              <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 backdrop-blur-sm px-1.5 py-1.5 overflow-visible">
                {EVENT_COLORS.map((c, i) => (
                  <motion.button
                    key={c.value}
                    onClick={() => setColorIdx(i)}
                    whileHover={{ scale: 1.03 }}
                    className={`${compact ? "w-4 h-4" : "w-5 h-5"} rounded-full transition-all shrink-0`}
                    style={{
                      backgroundColor: `hsl(${c.value})`,
                      boxShadow: colorIdx === i ? `0 0 0 1.5px hsl(var(--background)), 0 0 0 2.5px hsl(${c.value})` : "none",
                    }}
                    title={"Select color"}
                  />
                ))}
              </div>
            </div>
            <div className={`flex gap-1.5 ${compact ? "flex-col" : "flex-col sm:flex-row"}`}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Add event..."
                className="flex-1 rounded-lg border border-border/70 bg-background/85 px-2.5 py-2 text-xs sm:text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
              />
              <button
                onClick={handleAdd}
                disabled={!title.trim()}
                className="rounded-lg bg-primary text-primary-foreground px-2 py-2 text-xs font-body hover:bg-primary/90 disabled:opacity-40 shadow-sm"
              >
                Add
              </button>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
