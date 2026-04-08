import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { THEMES, type CalendarTheme } from "@/lib/themes";

interface ThemeContextType {
  theme: CalendarTheme;
  setThemeId: (id: string) => void;
  isDark: boolean;
  toggleDark: () => void;
  setMonthAccent: (accent: string) => void;
  currentMonthAccent: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(() => {
    const saved = localStorage.getItem("theme-id");
    return saved || "space";
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme-dark");
    return saved ? JSON.parse(saved) : false;
  });

  const [currentMonthAccent, setCurrentMonthAccent] = useState<string>("");

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  function applyTheme(selectedTheme: CalendarTheme, dark: boolean) {
    const modeColors = dark ? selectedTheme.dark : selectedTheme.light;
    const root = document.documentElement;

    Object.entries(modeColors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  useEffect(() => {
    localStorage.setItem("theme-id", themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem("theme-dark", JSON.stringify(isDark));
    applyTheme(theme, isDark);
  }, [isDark, theme]);

  useEffect(() => {
    applyTheme(theme, isDark);
  }, [theme, isDark]);

  const handleSetThemeId = (id: string) => {
    setThemeId(id);
  };

  const handleToggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const handleSetMonthAccent = (accent: string) => {
    setCurrentMonthAccent(accent);
    const root = document.documentElement;
    root.style.setProperty("--accent", accent);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setThemeId: handleSetThemeId,
        isDark,
        toggleDark: handleToggleDark,
        setMonthAccent: handleSetMonthAccent,
        currentMonthAccent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
