"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [systemPreference, setSystemPreference] = useState<"light" | "dark">(
    "light"
  );
  const [mounted, setMounted] = useState(false);

  const actualTheme: "light" | "dark" =
    theme === "system" ? systemPreference : theme;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const systemPref = mediaQuery.matches ? "dark" : "light";

    startTransition(() => {
      setSystemPreference(systemPref);
      if (savedTheme) {
        setThemeState(savedTheme);
      }
      setMounted(true);
    });

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);
  }, [actualTheme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
