import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { format } from "date-fns";
import { type DateRange, type CalendarNote, getNotesForRange, getNotesForDate } from "@/lib/calendar-utils";

const NOTE_COLORS = [
  "hsl(16, 60%, 48%)",
  "hsl(200, 60%, 50%)",
  "hsl(45, 80%, 55%)",
  "hsl(140, 45%, 45%)",
  "hsl(280, 45%, 55%)",
];

interface CalendarNotesProps {
  range: DateRange;
  notes: CalendarNote[];
  onAddNote: (note: Omit<CalendarNote, "id">) => void;
  onDeleteNote: (id: string) => void;
}

export default function CalendarNotes({ range, notes, onAddNote, onDeleteNote }: CalendarNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <StickyNote className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">Notes</h3>
      </div>

      {rangeLabel && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground mb-3 font-body bg-secondary/60 rounded-md px-3 py-1.5"
        >
          {rangeLabel}
        </motion.div>
      )}

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-0 max-h-48 lg:max-h-64">
        <AnimatePresence>
          {relevantNotes.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground italic font-body"
            >
              {range.start ? "No notes for this selection." : "Select a date to view or add notes."}
            </motion.p>
          )}
          {relevantNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="group flex items-start gap-2 rounded-md p-2 bg-card hover:bg-secondary/40 transition-colors"
            >
              <span
                className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: note.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-body break-words">{note.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{note.date}</p>
              </div>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add note input */}
      {range.start && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <div className="flex gap-1.5">
            {NOTE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className="w-5 h-5 rounded-full transition-transform"
                style={{
                  backgroundColor: c,
                  transform: selectedColor === c ? "scale(1.3)" : "scale(1)",
                  boxShadow: selectedColor === c ? `0 0 0 2px hsl(var(--background)), 0 0 0 3px ${c}` : "none",
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a note..."
              rows={2}
              className="flex-1 resize-none rounded-md border border-input bg-card px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleAdd}
              disabled={!newNote.trim()}
              className="self-end rounded-md bg-primary text-primary-foreground p-2 hover:bg-primary/90 disabled:opacity-40 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
