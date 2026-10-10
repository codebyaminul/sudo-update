"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type TerminalTheme = "matrix" | "amber" | "cyan" | "synthwave";

interface ThemeContextType {
  theme: TerminalTheme;
  setTheme: (theme: TerminalTheme) => void;
  scanlines: boolean;
  toggleScanlines: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "matrix",
  setTheme: () => {},
  scanlines: true,
  toggleScanlines: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<TerminalTheme>("matrix");
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("sudo_theme") as TerminalTheme) || "matrix";
    const savedScanlines = localStorage.getItem("sudo_scanlines") !== "false";
    
    setThemeState(savedTheme);
    setScanlines(savedScanlines);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: TerminalTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("sudo_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleScanlines = () => {
    setScanlines((prev) => {
      const next = !prev;
      localStorage.setItem("sudo_scanlines", String(next));
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, scanlines, toggleScanlines }}>
      {scanlines && (
        <div
          className="fixed inset-0 terminal-scanlines z-50 pointer-events-none opacity-40"
          aria-hidden="true"
        />
      )}
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
