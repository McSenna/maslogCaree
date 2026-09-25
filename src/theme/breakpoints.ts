export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  tablet: 768,
  desktop: 1024,
  xl: 1280,
  wide: 1440,
} as const;

export type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

export const CONTENT_MAX_WIDTH = 1440;

export const PAGE_PADDING: Record<Breakpoint, number> = {
  mobile: 16,
  tablet: 20,
  desktop: 28,
  wide: 36,
};

export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS.wide) return "wide";
  if (width >= BREAKPOINTS.desktop) return "desktop";
  if (width >= BREAKPOINTS.tablet) return "tablet";
  return "mobile";
};

export type BreakpointValues<T> = { mobile: T } & Partial<Record<Exclude<Breakpoint, "mobile">, T>>;

const CASCADE: Breakpoint[] = ["wide", "desktop", "tablet", "mobile"];

export const pickForBreakpoint = <T,>(breakpoint: Breakpoint, values: BreakpointValues<T>): T => {
  const start = CASCADE.indexOf(breakpoint);
  for (const key of CASCADE.slice(start)) {
    const value = values[key];
    if (value !== undefined) return value;
  }
  return values.mobile;
};

export const gridColumnsFor = (
  availableWidth: number,
  minColumnWidth: number,
  maxColumns: number,
  gap: number
): number => {
  if (availableWidth <= 0 || minColumnWidth <= 0) return 1;
  const fit = Math.floor((availableWidth + gap) / (minColumnWidth + gap));
  return Math.max(1, Math.min(maxColumns, fit));
};

export const snapColumns = (columns: number, options: readonly number[]): number => {
  const allowed = options.filter((option) => option >= 1 && option <= columns);
  return allowed.length ? Math.max(...allowed) : 1;
};
