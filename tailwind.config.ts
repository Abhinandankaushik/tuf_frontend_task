import type { Config } from "tailwindcss";

export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },

      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        muted: "hsl(var(--muted))",
        destructive: "hsl(var(--destructive))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        "calendar-range": "hsl(var(--calendar-range))",
        "calendar-range-bg": "hsl(var(--calendar-range-bg))",
        "calendar-today": "hsl(var(--calendar-today))",
        "calendar-outside": "hsl(var(--calendar-outside))",
        "calendar-hover": "hsl(var(--calendar-hover))",
        "calendar-note": "hsl(var(--calendar-note))",
      },

      borderRadius: {
        DEFAULT: "var(--radius)",
      },

      boxShadow: {
        calendar: "var(--shadow-calendar)",
        day: "var(--shadow-day)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
        "glow-primary": "0 0 20px rgba(var(--primary), 0.4), 0 0 40px rgba(var(--primary), 0.2)",
        "glow-accent": "0 0 20px rgba(var(--accent), 0.4), 0 0 40px rgba(var(--accent), 0.2)",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      keyframes: {
        "pulse-glow": {
          "0%, 100%": { "box-shadow": "0 0 0 0 rgba(var(--primary), 0.7)" },
          "50%": { "box-shadow": "0 0 0 8px rgba(var(--primary), 0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },

      animation: {
        "pulse-glow": "pulse-glow 2s infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },

  plugins: [],
} satisfies Config;