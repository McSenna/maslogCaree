import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getDashboardThemeClasses,
  type DashboardThemeClasses,
} from "@/design/dashboardTheme";
import {
  getStoredTheme,
  hydrateStoredTheme,
  setStoredTheme,
  type StoredTheme,
} from "@/utils/storage";

type ThemeContextValue = {
  theme: StoredTheme;
  resolvedTheme: StoredTheme;
  setTheme: (t: StoredTheme) => void;
  toggleTheme: () => void;
  classes: DashboardThemeClasses;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<StoredTheme>(
    () => getStoredTheme() ?? "light"
  );

  // On web the synchronous read above already has the right theme. On native it
  // starts empty until SecureStore answers, so apply the saved choice once it does
  // (unless the user already picked one), and only persist the default for first-time users.
  const userPickedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void hydrateStoredTheme().then((saved) => {
      if (cancelled || userPickedRef.current) return;
      if (saved) setThemeState(saved);
      else setStoredTheme("light");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setTheme = useCallback((t: StoredTheme) => {
    userPickedRef.current = true;
    setThemeState(t);
    setStoredTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    userPickedRef.current = true;
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
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};

export const useOptionalTheme = (): ThemeContextValue | null => {
  return useContext(ThemeContext);
};
