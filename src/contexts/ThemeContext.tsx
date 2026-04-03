import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import {
  getDashboardThemeClasses,
  type DashboardThemeClasses,
} from "@/design/dashboardTheme";
import { getStoredTheme, setStoredTheme, type StoredTheme } from "@/utils/storage";

type ThemeContextValue = {
  /** User-selected appearance (not used when following system — we use explicit light/dark only for simplicity) */
  theme: StoredTheme;
  resolvedTheme: StoredTheme;
  setTheme: (t: StoredTheme) => void;
  toggleTheme: () => void;
  classes: DashboardThemeClasses;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [theme, setThemeState] = useState<StoredTheme>(
    () => getStoredTheme() ?? "dark"
  );

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      setThemeState(stored);
      return;
    }
    if (system === "light" || system === "dark") {
      setThemeState(system);
    }
  }, [system]);

  const setTheme = useCallback((t: StoredTheme) => {
    setThemeState(t);
    setStoredTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      setStoredTheme(next);
      return next;
    });
  }, []);

  const resolvedTheme = theme;

  const classes = useMemo(
    () => getDashboardThemeClasses(resolvedTheme),
    [resolvedTheme]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      classes,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme, classes]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

export function useOptionalTheme(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
