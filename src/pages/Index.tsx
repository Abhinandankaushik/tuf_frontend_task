import { motion } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";
import WallCalendar from "@/components/WallCalendar";

const Index = () => {
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-start justify-center transition-colors duration-500 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
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
          className="relative z-10 pt-8"
        >
          <WallCalendar />
        </motion.div>
      </main>
    </ThemeProvider>
  );
};

export default Index;
