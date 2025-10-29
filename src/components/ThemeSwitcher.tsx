"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { actualTheme, setTheme, mounted } = useTheme();

  // Avoid hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <button
        className="w-14 h-7 rounded-full bg-gray-300 relative transition-colors duration-300"
        aria-label="Toggle theme"
        disabled
      >
        <span className="absolute left-1 top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm transition-transform duration-300">
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
      className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${
        actualTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
      }`}
      aria-label={`Switch to ${actualTheme === "dark" ? "light" : "dark"} theme`}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm transition-transform duration-300 ${
          actualTheme === "dark" ? "translate-x-7" : "translate-x-1"
        }`}
      >
        {actualTheme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
