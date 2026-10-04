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

// Tailwind's slate scale is the palette's neutral ramp (tailwind.config.js), so
// these classes are the same colours the token-based screens use: Soft Gray
// page, white 16px cards, Dark Navy headings, muted text that passes AA on the page.
const dark: DashboardThemeClasses = {
  scrollBg: "bg-slate-950",
  card: "rounded-lg border border-slate-700 bg-slate-900",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  textAccent: "text-blue-300",
  skeleton: "bg-slate-700/60",
};

const light: DashboardThemeClasses = {
  scrollBg: "bg-background",
  card: "rounded-lg border border-slate-200 bg-white",
  textPrimary: "text-slate-800",
  textSecondary: "text-slate-700",
  textMuted: "text-slate-600",
  textAccent: "text-blue-700",
  skeleton: "bg-slate-200",
};

export const getDashboardThemeClasses = (theme: StoredTheme): DashboardThemeClasses =>
  theme === "dark" ? dark : light;
