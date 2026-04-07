import { motion } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";
import WallCalendar from "@/components/WallCalendar";

const Index = () => {
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-start justify-center transition-colors duration-500 relative overflow-hidden px-2 sm:px-3 md:px-4">
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
          className="relative z-10 pt-3 sm:pt-5 md:pt-8 w-full"
        >
          <WallCalendar />
        </motion.div>
      </main>
    </ThemeProvider>
  );
};

export default Index;
