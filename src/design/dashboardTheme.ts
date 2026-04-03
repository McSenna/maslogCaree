import type { StoredTheme } from "@/utils/storage";

export type DashboardThemeClasses = {
  screenBg: string;
  scrollBg: string;
  card: string;
  cardElevated: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionSubtitle: string;
  statIconWrap: string;
  chip: string;
  chipText: string;
  sidebarBg: string;
  sidebarBorder: string;
  sidebarText: string;
  sidebarMuted: string;
  bottomNavBg: string;
  bottomNavBorder: string;
  headerBar: string;
  headerTitle: string;
  safeAreaBg: string;
  skeleton: string;
  overlay: string;
  toolbarIcon: string;
};

export function getDashboardThemeClasses(theme: StoredTheme): DashboardThemeClasses {
  const dark: DashboardThemeClasses = {
    screenBg: "bg-slate-950",
    scrollBg: "bg-slate-950",
    card: "rounded-3xl border border-slate-700/60 bg-slate-900/80 shadow-lg shadow-black/40",
    cardElevated: "rounded-3xl border border-slate-600/50 bg-slate-800/90 shadow-xl shadow-black/50",
    border: "border-slate-700/60",
    borderStrong: "border-slate-600/70",
    textPrimary: "text-slate-50",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-500",
    textAccent: "text-sky-400",
    sectionEyebrow: "text-[11px] font-semibold uppercase tracking-widest text-slate-500",
    sectionTitle: "text-lg font-black tracking-tight text-slate-50 md:text-xl",
    sectionSubtitle: "mt-1 text-sm font-medium text-slate-400 md:text-base",
    statIconWrap: "rounded-2xl bg-sky-500/15",
    chip: "rounded-full border border-slate-600/60 bg-slate-800/80 px-3 py-1",
    chipText: "text-xs font-semibold text-sky-400",
    sidebarBg: "border-slate-800 bg-slate-900",
    sidebarBorder: "border-slate-800",
    sidebarText: "text-slate-100",
    sidebarMuted: "text-slate-500",
    bottomNavBg: "#0f172a",
    bottomNavBorder: "rgba(51,65,85,0.6)",
    headerBar: "border-b border-sky-500/20 bg-slate-900",
    headerTitle: "text-slate-50",
    safeAreaBg: "#020617",
    skeleton: "bg-slate-700/60",
    overlay: "bg-black/60",
    toolbarIcon:
      "flex items-center justify-center border border-slate-600/50 bg-slate-800/80 active:opacity-80",
  };

  const light: DashboardThemeClasses = {
    screenBg: "bg-slate-100",
    scrollBg: "bg-slate-100",
    card: "rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5",
    cardElevated: "rounded-3xl border border-slate-100 bg-white shadow-md shadow-slate-900/10",
    border: "border-slate-200",
    borderStrong: "border-slate-300",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-700",
    textMuted: "text-slate-500",
    textAccent: "text-sky-700",
    sectionEyebrow: "text-[11px] font-semibold uppercase tracking-widest text-slate-400",
    sectionTitle: "text-lg font-black tracking-tight text-slate-900 md:text-xl",
    sectionSubtitle: "mt-1 text-sm font-medium text-slate-500 md:text-base",
    statIconWrap: "rounded-2xl bg-mc-primary/10",
    chip: "rounded-full border border-slate-200 bg-white px-3 py-1",
    chipText: "text-xs font-semibold text-mc-primary",
    sidebarBg: "border-slate-200 bg-white",
    sidebarBorder: "border-slate-200",
    sidebarText: "text-slate-900",
    sidebarMuted: "text-slate-500",
    bottomNavBg: "#F8F8FA",
    bottomNavBorder: "rgba(255,255,255,0.9)",
    headerBar: "border-b border-mc-primary/10 bg-mc-primary shadow-md shadow-mc-primary/30",
    headerTitle: "text-white",
    safeAreaBg: "#f1f5f9",
    skeleton: "bg-slate-200",
    overlay: "bg-black/40",
    toolbarIcon:
      "flex items-center justify-center border border-slate-200 bg-white active:opacity-80",
  };

  return theme === "dark" ? dark : light;
}

export const chartColors = {
  primary: "#38BDF8",
  secondary: "#34D399",
  tertiary: "#FBBF24",
  quaternary: "#A78BFA",
  danger: "#FB7185",
  grid: "rgba(148,163,184,0.2)",
  axis: "#94a3b8",
} as const;
