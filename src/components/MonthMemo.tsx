import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { format } from "date-fns";

interface MonthMemoProps {
  currentMonth: Date;
}

function getMemoKey(month: Date): string {
  return `cal-memo-${format(month, "yyyy-MM")}`;
}

export default function MonthMemo({ currentMonth }: MonthMemoProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(getMemoKey(currentMonth));
    setText(saved || "");
  }, [currentMonth]);

  const handleChange = useCallback(
    (val: string) => {
      setText(val);
      if (val.trim()) {
        localStorage.setItem(getMemoKey(currentMonth), val);
      } else {
        localStorage.removeItem(getMemoKey(currentMonth));
      }
    },
    [currentMonth]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/5 to-transparent border border-border rounded-lg p-2 sm:p-3"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <FileText className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary flex-shrink-0" />
        <h3 className="font-display text-xs sm:text-sm font-semibold text-foreground truncate">
          {format(currentMonth, "MMMM")} Notes
        </h3>
      </div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={`Notes for ${format(currentMonth, "MMMM")}...`}
        rows={2}
        className="w-full resize-none rounded-lg border border-input bg-card px-2 sm:px-2.5 py-1.5 text-xs font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm hover:shadow-md transition-shadow"
      />
      <p className="text-xs text-muted-foreground mt-1 italic">Auto-saved</p>
    </motion.div>
  );
}
