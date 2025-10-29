"use client";

import { useTheme } from "../providers/ThemeProvider";

export function ThemeSwitcher() {
  const { actualTheme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        style={{ backgroundColor: "hsl(var(--color-muted))" }}
        className="w-14 h-7 rounded-full relative transition-colors duration-300"
        aria-label="Toggle theme"
        disabled
      >
        <span
          style={{ backgroundColor: "white" }}
          className="absolute left-1 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm transition-transform duration-300"
        >
          ☀️
        </span>
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(actualTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor:
          actualTheme === "dark"
            ? "hsl(var(--color-muted))"
            : "hsl(var(--color-muted))",
      }}
      className="w-14 h-7 rounded-full relative transition-colors duration-300"
      aria-label={`Switch to ${
        actualTheme === "dark" ? "light" : "dark"
      } theme`}
    >
      <span
        style={{ backgroundColor: "white" }}
        className={`absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm transition-transform duration-300 ${
          actualTheme === "dark" ? "translate-x-7" : "translate-x-1"
        }`}
      >
        {actualTheme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
