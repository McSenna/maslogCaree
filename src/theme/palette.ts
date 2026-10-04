/**
 * The MaslogCare palette: the one place raw colour values live. Components do
 * not import it directly; they read semantic roles from `useThemeColors()` or
 * the console palette (`design/adminDashboard`), which are built on it.
 *
 * Brand anchors (2026-10-02 healthcare redesign) and where they sit:
 *   Healthcare Blue  #2D5BFF  blue[600]    primary action, links, focus
 *   Healthcare Green #2BB673  green[500]   healthcare and positive accents
 *   Warm Orange      #FFA726  orange[400]  selective attention, sparingly
 *   Soft Gray        #F5F7FA  canvas       page background
 *   White            #FFFFFF  white        cards and surfaces
 *   Dark Navy        #1F2933  ink          headings and primary text
 *   Gray             #64748B  slate[500]   secondary text on white surfaces
 *   (Dark Navy is also slate[800]; slate[900] and [950] are dark-mode surfaces)
 *   Light Gray       #E2E8F0  slate[200]   card borders and dividers
 *   Success          #22C55E  success[500] Warning #F59E0B amber[500]
 *   Error            #EF4444  red[500]
 *
 * The other steps are derived from those anchors in OKLCH (same hue, stepped
 * lightness) wherever an anchor cannot meet WCAG on its own. Contrast notes:
 * - blue[600] carries white text at 5.2:1 and reads as link text on canvas at 4.8:1.
 * - green[500], orange[400], success[500] and amber[500] are 1.9 to 2.6:1 on
 *   white: fills, dots and tints only. Their text-safe steps are 700 (6.4:1+),
 *   their icon-safe steps 600 (4.5:1+).
 * - red[500] passes 3:1 for icons only; red[600] carries white text at 5.4:1.
 * - slate[500] passes 4.5:1 on white but only 4.4:1 on canvas, so text that
 *   sits on the page uses slate[600].
 * - controlLine is the lightest input border that still passes the 3:1 UI
 *   contrast for a form field's outline (slate[200] is 1.2:1).
 */
export const PALETTE = {
  blue: {
    50: "#F0F4FF",
    100: "#E5ECFF",
    200: "#CAD8FF",
    300: "#A4BDFF",
    400: "#7A9DFF",
    500: "#507BFF",
    600: "#2D5BFF",
    700: "#1E45D9",
    800: "#1836B0",
    900: "#172C80",
  },
  green: {
    50: "#ECF8F2",
    100: "#D3F0E2",
    200: "#A9E2C6",
    300: "#72D3A3",
    400: "#45C186",
    500: "#2BB673",
    600: "#038751",
    700: "#016D40",
    800: "#005330",
  },
  orange: {
    50: "#FFF5E8",
    100: "#FFEBD1",
    200: "#FFD6A3",
    300: "#FFBE66",
    400: "#FFA726",
    600: "#9D6300",
    700: "#8A5300",
  },
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#56657A",
    700: "#3A4757",
    // The dark end is the Dark Navy family: 800 is ink itself, 900 and 950 are
    // the dark theme's card and page.
    800: "#1F2933",
    900: "#19212B",
    950: "#111820",
  },
  success: { 50: "#ECFBF1", 100: "#D3F6DF", 200: "#A7EDBF", 300: "#5FD98A", 500: "#22C55E", 600: "#03893C", 700: "#04703A" },
  amber: { 50: "#FFF7E8", 100: "#FEEBC8", 200: "#FDD68A", 300: "#FBBF4D", 500: "#F59E0B", 600: "#9D6303", 700: "#8A5300" },
  red: { 50: "#FEF2F2", 100: "#FEE2E2", 200: "#FECACA", 300: "#FF8F87", 500: "#EF4444", 600: "#C92E31", 700: "#B42328" },
  /** Dark Navy: headings and primary text on light surfaces. */
  ink: "#1F2933",
  /** Soft Gray: the page background behind white cards. */
  canvas: "#F5F7FA",
  white: "#FFFFFF",
  /** Form-field outline in light mode (3.2:1 on white). */
  controlLine: "#8391A6",
  /**
   * Dark mode neutrals, stepped down from Dark Navy so the dark theme is the
   * same family rather than an inverted light theme. `raised` is ink itself.
   */
  night: {
    page: "#111820",
    surface: "#19212B",
    raised: "#1F2933",
    line: "#2C3846",
    lineStrong: "#3A4757",
    control: "#66768C",
    heading: "#F5F7FA",
    body: "#D3DAE3",
    muted: "#A9B4C2",
    subtle: "#97A3B3",
  },
} as const;

/**
 * A palette colour at the given opacity, for tints over dark surfaces. Taking
 * a token rather than a literal keeps every translucent fill on-palette.
 */
export const withAlpha = (hex: string, alpha: number): string => {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
};

/**
 * `color` laid over `base` at `amount` opacity, as a solid hex. For tints that
 * must stay opaque (CSS variables, contrast tests) yet remain on-palette.
 */
export const mix = (color: string, base: string, amount: number): string => {
  const channels = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  const top = channels(color);
  const bottom = channels(base);
  return `#${top
    .map((value, i) => Math.round(value * amount + bottom[i] * (1 - amount)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
};
