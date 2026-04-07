import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme, THEMES } from "@/contexts/ThemeContext";
import { useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setThemeId, isDark, toggleDark } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-1">
      {/* Dark/Light toggle */}
      <motion.button
        onClick={toggleDark}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-foreground backdrop-blur-sm"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <motion.div
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.div>
      </motion.button>

      {/* Theme picker */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-foreground backdrop-blur-sm"
        title="Change theme"
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Theme menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -12 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute top-full right-0 mt-2 z-50 bg-card/95 backdrop-blur-lg border border-border/50 rounded-2xl shadow-2xl p-3 min-w-[200px]"
            >
              {THEMES.map((t, idx) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setThemeId(t.id);
                    setOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-body transition-all ${
                    theme.id === t.id
                      ? "bg-gradient-to-r from-primary/30 to-primary/10 text-primary font-semibold shadow-md"
                      : "text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex flex-col items-start flex-1">
                    <span>{t.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {t.mood}
                    </span>
                  </div>
                  {theme.id === t.id && (
                    <motion.div
                      layoutId="activeTheme"
                      className="w-2 h-2 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
