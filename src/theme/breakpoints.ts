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

/**
 * Frame for every signed-in role page. After the 272px sidebar, a 1920px screen
 * leaves exactly this much, so pages run edge to edge instead of sitting in a
 * narrower column with dead gutters either side.
 */
export const ROLE_CONTENT_MAX_WIDTH = 1600;

/**
 * Caps for pages whose content should not stretch to the full frame. Each grows
 * at the wide breakpoint so large screens get more columns or longer lists,
 * while line length stays readable.
 * - reading: one column of running text (notifications)
 * - feed: card lists that go two-up when there is room (announcements, requests)
 * - content: mixed sections with side-by-side cards (help centre, profile)
 */
export const PAGE_MAX_WIDTH = {
  reading: { mobile: 760, wide: 960 },
  feed: { mobile: 880, wide: 1280 },
  content: { mobile: 1120, wide: 1400 },
} as const satisfies Record<string, BreakpointValues<number>>;

export type PageWidthKind = keyof typeof PAGE_MAX_WIDTH;

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
