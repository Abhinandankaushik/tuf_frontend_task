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
      className="mt-4 bg-card border border-border rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm font-semibold text-foreground">
          {format(currentMonth, "MMMM")} Notes
        </h3>
      </div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={`Write notes for ${format(currentMonth, "MMMM yyyy")}...`}
        rows={3}
        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </motion.div>
  );
}
