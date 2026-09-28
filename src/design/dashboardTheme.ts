import type { StoredTheme } from "@/utils/storage";

/**
 * NativeWind class strings exposed as `useTheme().classes`. Only the keys some
 * screen reads are kept; colour values live in `src/theme/palette.ts`, and the
 * slate steps here are the Tailwind equivalents of the same ramp.
 */
export type DashboardThemeClasses = {
  scrollBg: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  skeleton: string;
};

const dark: DashboardThemeClasses = {
  scrollBg: "bg-slate-950",
  card: "rounded-3xl border border-slate-700/60 bg-slate-900/80 shadow-lg shadow-black/40",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  // slate-400: slate-500 is only 4.2:1 on the dark page, below AA for body text.
  textMuted: "text-slate-400",
  textAccent: "text-sky-400",
  skeleton: "bg-slate-700/60",
};

const light: DashboardThemeClasses = {
  scrollBg: "bg-white",
  card: "rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5",
  textPrimary: "text-slate-900",
  textSecondary: "text-slate-700",
  textMuted: "text-slate-500",
  textAccent: "text-sky-700",
  skeleton: "bg-slate-200",
};

export const getDashboardThemeClasses = (theme: StoredTheme): DashboardThemeClasses =>
  theme === "dark" ? dark : light;
