"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  applyStatusBarStyle,
  applyThemeAttribute,
  resolveTheme,
  ResolvedTheme,
  systemPrefersDark,
  ThemePreference,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Dark is the app's default (matches THEME_INIT_SCRIPT): a first-ever
  // visit with nothing in localStorage stays dark rather than following
  // the OS preference.
  const [theme, setThemeState] = useState<ThemePreference>("dark");
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // ignore
    }
    if (stored === "light" || stored === "dark" || stored === "system") {
      // Deliberate: syncs React state with localStorage (an external system) on
      // mount, after SSR — reading it during render would cause a hydration
      // mismatch since the server never sees localStorage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(stored);
    }
    setSystemDark(systemPrefersDark());

    // The OS status bar (clock/battery) always follows the system's actual
    // Light/Dark Mode, independent of whichever theme is picked in-app.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    applyStatusBarStyle(mq.matches);
    const onChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
      applyStatusBarStyle(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    applyThemeAttribute(theme);
  }, [theme]);

  const setTheme = useCallback((t: ThemePreference) => {
    setThemeState(t);
    try {
      // Store "system" explicitly too, so it's distinguishable from a
      // first-ever visit (nothing stored), which defaults to dark.
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      // ignore
    }
  }, []);

  const resolvedTheme: ResolvedTheme = useMemo(
    () => (theme === "system" ? (systemDark ? "dark" : "light") : theme),
    [theme, systemDark]
  );

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// re-export for convenience where only the resolver is needed
export { resolveTheme };
