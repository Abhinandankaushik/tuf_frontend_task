import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { format } from "date-fns";
import { type DateRange, type CalendarNote, getNotesForRange, getNotesForDate } from "@/lib/calendar-utils";

const NOTE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--ring))",
  "hsl(var(--foreground))",
  "hsl(var(--muted-foreground))",
];

interface CalendarNotesProps {
  range: DateRange;
  notes: CalendarNote[];
  onAddNote: (note: Omit<CalendarNote, "id">) => void;
  onDeleteNote: (id: string) => void;
  compact?: boolean;
}

export default function CalendarNotes({ range, notes, onAddNote, onDeleteNote, compact = false }: CalendarNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [showForm, setShowForm] = useState(false);

  const relevantNotes = range.start && range.end
    ? getNotesForRange(notes, range)
    : range.start
    ? getNotesForDate(notes, range.start)
    : [];

  const handleAdd = () => {
    if (!newNote.trim() || !range.start) return;
    const targetDate = range.end || range.start;
    onAddNote({
      date: format(targetDate, "yyyy-MM-dd"),
      text: newNote.trim(),
      color: selectedColor,
    });
    setNewNote("");
    setShowForm(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const rangeLabel = range.start && range.end
    ? `${format(range.start < range.end ? range.start : range.end, "MMM d")} — ${format(range.start < range.end ? range.end : range.start, "MMM d, yyyy")}`
    : range.start
    ? format(range.start, "MMMM d, yyyy")
    : null;

  const hasRelevantNotes = relevantNotes.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-white/65 dark:bg-black/15 backdrop-blur-md rounded-lg border border-border/40 px-2.5 py-2 mb-3 sm:mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
            <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">Notes</h3>
          </div>
          {range.start && (
            <motion.button
              onClick={() => setShowForm((prev) => !prev)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
              title={showForm ? "Close note input" : "Add note"}
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </div>

      {rangeLabel && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm text-muted-foreground mb-3 font-body bg-secondary/60 rounded-md px-2.5 sm:px-3 py-1.5 truncate"
        >
          {rangeLabel}
        </motion.div>
      )}

      {/* Notes list */}
      {!hasRelevantNotes && range.start && (
        <p className="text-[11px] text-muted-foreground/85 italic mb-2">No notes for this selection.</p>
      )}
      {!range.start && (
        <p className="text-[11px] text-muted-foreground/85 italic mb-2">Select a date to view or add notes.</p>
      )}

      <div
        className={`${hasRelevantNotes ? "overflow-y-auto space-y-2 mb-3 sm:mb-4 min-h-0 modern-scrollbar pr-1" : "max-h-0 overflow-hidden mb-0"} ${compact ? "max-h-36 sm:max-h-44 lg:max-h-52" : "max-h-40 sm:max-h-52 lg:max-h-64"}`}
      >
        <AnimatePresence>
          {relevantNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="group flex items-start gap-2 rounded-xl p-2.5 bg-background/75 border border-border/60 shadow-sm hover:shadow-md transition-all"
              style={{ boxShadow: `inset 3px 0 0 ${note.color}` }}
            >
              <span
                className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: note.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-foreground font-body font-medium break-words leading-relaxed">{note.text}</p>
                <p className="text-[11px] text-muted-foreground/90 mt-0.5 tracking-wide">{note.date}</p>
              </div>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 flex-shrink-0 touch-target"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add note input */}
      {range.start && showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`space-y-2 border-t border-border pt-3 sm:pt-4 ${compact ? "" : ""}`}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Tone</span>
            <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 backdrop-blur-sm px-1.5 py-1">
              {NOTE_COLORS.map((c) => (
                <motion.button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  whileHover={{ scale: 1.08 }}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all"
                  style={{
                    backgroundColor: c,
                    boxShadow: selectedColor === c ? `0 0 0 1.5px hsl(var(--background)), 0 0 0 2.5px ${c}` : "none",
                  }}
                  title={"Select color"}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a note..."
              rows={compact ? 1 : 2}
              className={`flex-1 resize-none rounded-lg border border-border/70 bg-background/85 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm ${compact ? "min-h-10" : "min-h-12 sm:min-h-14"}`}
            />
            <button
              onClick={handleAdd}
              disabled={!newNote.trim()}
              className="rounded-lg bg-primary text-primary-foreground p-2 hover:bg-primary/90 disabled:opacity-40 transition-colors touch-target sm:self-end shadow-sm"
              title="Add note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
