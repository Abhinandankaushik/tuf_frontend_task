import { motion } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";
import WallCalendar from "@/components/WallCalendar";

const RING_SIZES = [280, 420, 560];
const TIME_SHARDS = Array.from({ length: 9 }, (_, i) => ({
  left: `${8 + i * 10}%`,
  delay: i * 0.55,
  duration: 7 + (i % 3) * 1.4,
}));

const Index = () => {
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-start justify-center transition-colors duration-500 relative overflow-hidden px-2 sm:px-3 md:px-4">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 dark:hidden"
            style={{
              background:
                "radial-gradient(65% 55% at 15% 20%, hsl(var(--primary) / 0.28) 0%, transparent 62%), radial-gradient(55% 45% at 85% 75%, hsl(var(--accent) / 0.24) 0%, transparent 60%)",
            }}
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.03, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute inset-0 dark:hidden"
            style={{
              background:
                "linear-gradient(115deg, transparent 16%, hsl(var(--foreground) / 0.05) 36%, transparent 58%)",
            }}
            animate={{ x: ["-18%", "18%", "-18%"], opacity: [0.15, 0.32, 0.15] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute -top-24 -left-12 sm:-left-24 w-[70vw] max-w-[780px] h-56 sm:h-72 rounded-full blur-3xl"
            style={{
              background: "linear-gradient(110deg, hsl(var(--primary) / 0.42), hsl(var(--accent) / 0.28), transparent 78%)",
            }}
            animate={{ x: [0, 80, 0], y: [0, -18, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute -bottom-24 -right-12 sm:-right-24 w-[68vw] max-w-[760px] h-52 sm:h-72 rounded-full blur-3xl"
            style={{
              background: "linear-gradient(250deg, hsl(var(--accent) / 0.35), hsl(var(--ring) / 0.25), transparent 76%)",
            }}
            animate={{ x: [0, -70, 0], y: [0, 14, 0], rotate: [0, -7, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[86vw] max-w-[980px] aspect-square rounded-full blur-2xl"
            style={{
              background:
                "conic-gradient(from 0deg, hsl(var(--primary) / 0.22), transparent 26%, hsl(var(--accent) / 0.24) 46%, transparent 68%, hsl(var(--ring) / 0.2) 100%)",
            }}
            animate={{ rotate: [0, 360], opacity: [0.52, 0.72, 0.52] }}
            transition={{ rotate: { duration: 36, repeat: Infinity, ease: "linear" }, opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78vw] max-w-[860px] aspect-square rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, hsl(var(--primary) / 0.08) 30%, transparent 68%)",
            }}
            animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.45, 0.65, 0.45] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {RING_SIZES.map((size, idx) => (
            <motion.div
              key={size}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
              style={{ width: size, height: size }}
              animate={{
                rotate: idx % 2 === 0 ? [0, 360] : [360, 0],
                scale: [1, 1.025, 1],
                opacity: [0.28, 0.5, 0.28],
              }}
              transition={{
                rotate: { duration: 18 + idx * 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 6 + idx * 1.2, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 5 + idx * 1.1, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          ))}

          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(90deg, transparent 0 22px, hsl(var(--primary) / 0.045) 22px 23px)",
            }}
            animate={{ x: [0, 24, 0], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, hsl(var(--foreground) / 0.05) 0 1px, transparent 1px 100%), radial-gradient(circle at 80% 80%, hsl(var(--foreground) / 0.04) 0 1px, transparent 1px 100%)",
              backgroundSize: "3px 3px, 4px 4px",
            }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {TIME_SHARDS.map((shard, idx) => (
            <motion.span
              key={`${shard.left}-${idx}`}
              className="absolute top-[-12%] w-[2px] h-24 rounded-full"
              style={{
                left: shard.left,
                background: "linear-gradient(to bottom, transparent, hsl(var(--accent) / 0.65), transparent)",
              }}
              animate={{ y: [0, "120vh"], opacity: [0, 0.8, 0] }}
              transition={{
                duration: shard.duration,
                delay: shard.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 pt-1 sm:pt-2 md:pt-3 w-full"
        >
          <WallCalendar />
        </motion.div>
      </main>
    </ThemeProvider>
  );
};

export default Index;
