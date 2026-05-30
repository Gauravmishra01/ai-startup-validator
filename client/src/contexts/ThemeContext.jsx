/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference, default to light
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme;

      if (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
    } catch (error) {
      console.warn("Failed to read theme preference:", error);
    }
    return "light";
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;

      // Remove old theme class and add new one
      root.classList.remove("light", "dark");
      root.classList.add(theme);

      // Save to localStorage
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
