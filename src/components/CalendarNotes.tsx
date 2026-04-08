import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { EVENT_COLORS } from "@/lib/events";
import {
  type DateRange,
  type CalendarNotesStore,
  type NoteMode,
  getNoteForSelection,
  normalizeRange,
  parseStoredNoteItems,
  stringifyStoredNoteItems,
} from "@/lib/calendar-utils";

interface CalendarNotesProps {
  currentMonth: Date;
  range: DateRange;
  notes: CalendarNotesStore;
  onSaveNote: (mode: NoteMode, key: string, text: string) => void;
}

export default function CalendarNotes({ currentMonth, range, notes, onSaveNote }: CalendarNotesProps) {
  const selection = useMemo(
    () => getNoteForSelection(notes, currentMonth, range),
    [notes, currentMonth, range],
  );
  const [draft, setDraft] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const savedNotes = useMemo(
    () => parseStoredNoteItems(selection.text).map((item) => ({
      text: item.text,
      color: item.color || EVENT_COLORS[0].value,
    })),
    [selection.text],
  );

  useEffect(() => {
    setDraft("");
    setShowForm(false);
    setColorIdx(0);
  }, [selection.key]);

  const title = selection.mode === "month"
    ? `Month Notes · ${format(currentMonth, "MMMM yyyy")}`
    : selection.mode === "date"
    ? `Date Notes · ${format(range.start as Date, "MMM d, yyyy")}`
    : `Range Notes · ${format((normalizeRange(range).start as Date), "MMM d")} - ${format((normalizeRange(range).end as Date), "MMM d, yyyy")}`;

  const handleSave = () => {
    if (!draft.trim()) return;
    const next = [...savedNotes, { text: draft.trim(), color: EVENT_COLORS[colorIdx].value }];
    onSaveNote(selection.mode, selection.key, stringifyStoredNoteItems(next));
    setDraft("");
    setColorIdx(0);
    setShowForm(false);
  };

  const handleDeleteNoteAt = (index: number) => {
    const next = savedNotes.filter((_, i) => i !== index);
    onSaveNote(selection.mode, selection.key, next.length ? stringifyStoredNoteItems(next) : "");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-1 border-t border-border/70 pt-1.5">
      <div className="sticky top-0 z-10 bg-white/60 dark:bg-black/15 backdrop-blur-md rounded-lg border border-border/40 px-2 py-1.5 sm:py-2 flex items-center justify-between mb-1.5">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate pr-2">{title}</h3>
        <div className="flex items-center gap-1">
          <motion.button
            onClick={() => setShowForm((prev) => !prev)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-secondary transition-colors text-primary touch-target"
            title="Add note"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-1.5 overflow-y-auto modern-scrollbar pr-1 max-h-44 sm:max-h-56 mb-1.5">
        {savedNotes.length === 0 && !showForm && (
          <p className="text-xs text-muted-foreground italic">No notes for this selection.</p>
        )}
        {savedNotes.map((note, idx) => (
          <motion.div
            key={`${selection.key}-${idx}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="group flex items-start gap-2 rounded-xl border border-border/60 bg-background/75 p-2 shadow-sm hover:shadow-md transition-all"
            style={{ boxShadow: `inset 3px 0 0 hsl(${note.color})` }}
          >
            <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: `hsl(${note.color})` }} />
            <p className="flex-1 min-w-0 text-xs sm:text-sm text-foreground whitespace-pre-wrap [overflow-wrap:anywhere] leading-relaxed">
              {note.text}
            </p>
            <motion.button
              onClick={() => handleDeleteNoteAt(idx)}
              whileHover={{ scale: 1.1 }}
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 touch-target"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        ))}
      </div>

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
                      className="w-5 h-5 rounded-full transition-all shrink-0"
                      style={{
                        backgroundColor: `hsl(${c.value})`,
                        boxShadow: colorIdx === i ? `0 0 0 1.5px hsl(var(--background)), 0 0 0 2.5px hsl(${c.value})` : "none",
                      }}
                      title={"Select tone"}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-1.5 flex-col sm:flex-row">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  placeholder="Add note..."
                  className="flex-1 rounded-lg border border-border/70 bg-background/85 px-2.5 py-2 text-xs sm:text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
                />
                <button
                  onClick={handleSave}
                  disabled={!draft.trim()}
                  className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors"
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
