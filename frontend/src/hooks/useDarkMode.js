import { useState, useEffect } from "react";

export function useDarkMode() {
  // Get initial mode from localStorage or default to "system"
  const getInitialMode = () => {
    const savedMode = localStorage.getItem("themeMode");
    if (
      savedMode === "dark" ||
      savedMode === "light" ||
      savedMode === "system"
    ) {
      return savedMode;
    }
    return "system"; // default if nothing saved
  };

  const [mode, setMode] = useState(getInitialMode);

  // Helper to check if dark mode should be active (based on current mode and system preference)
  const isDarkModeActive = () => {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    // system mode: check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDarkMode, setIsDarkMode] = useState(isDarkModeActive());

  // Sync isDarkMode state whenever mode changes or system preference changes
  useEffect(() => {
    const updateDarkMode = () => {
      setIsDarkMode(isDarkModeActive());
    };

    updateDarkMode();

    // Listen to system preference changes only if mode is "system"
    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateDarkMode);
      return () => mediaQuery.removeEventListener("change", updateDarkMode);
    }
  }, [mode]);

  // Apply or remove dark class on <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Set mode and persist it
  const setThemeMode = (newMode) => {
    if (newMode === "dark" || newMode === "light" || newMode === "system") {
      setMode(newMode);
      localStorage.setItem("themeMode", newMode);
    } else {
      console.warn(`Invalid theme mode: ${newMode}`);
    }
  };

  return { mode, setThemeMode, isDarkMode };
}
