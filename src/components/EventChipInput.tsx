import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { EVENT_COLORS, type CalendarEvent } from "@/lib/events";
import { format } from "date-fns";
import type { DateRange } from "@/lib/calendar-utils";

interface EventChipInputProps {
  range: DateRange;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, "id">) => void;
  onDeleteEvent: (id: string) => void;
}

export default function EventChipInput({ range, events, onAddEvent, onDeleteEvent }: EventChipInputProps) {
  const [title, setTitle] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);

  if (!range.start) return null;

  const targetDate = range.end || range.start;
  const dateStr = format(targetDate, "yyyy-MM-dd");
  const dateEvents = events.filter((e) => e.date === dateStr);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAddEvent({ date: dateStr, title: title.trim(), color: EVENT_COLORS[colorIdx].value });
    setTitle("");
    setShowForm(false);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">
          Events · {format(targetDate, "MMM d")}
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-1 rounded-full hover:bg-secondary transition-colors text-primary"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Existing event chips */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        <AnimatePresence>
          {dateEvents.map((ev) => (
            <motion.span
              key={ev.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-medium text-white"
              style={{ backgroundColor: `hsl(${ev.color})` }}
            >
              {ev.title}
              <button onClick={() => onDeleteEvent(ev.id)} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {dateEvents.length === 0 && !showForm && (
          <span className="text-xs text-muted-foreground italic font-body">No events</span>
        )}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-1.5 mb-2">
              {EVENT_COLORS.map((c, i) => (
                <button
                  key={c.value}
                  onClick={() => setColorIdx(i)}
                  className="w-5 h-5 rounded-full transition-transform border-2"
                  style={{
                    backgroundColor: `hsl(${c.value})`,
                    transform: colorIdx === i ? "scale(1.3)" : "scale(1)",
                    borderColor: colorIdx === i ? "hsl(var(--foreground))" : "transparent",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Event title..."
                className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleAdd}
                disabled={!title.trim()}
                className="rounded-md bg-primary text-primary-foreground px-2 py-1 text-xs font-body hover:bg-primary/90 disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
