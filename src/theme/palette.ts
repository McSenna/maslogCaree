/**
 * The raw colour ramps every theme file draws from. Components should not
 * import these directly; they read semantic roles from `useThemeColors()` or
 * the admin surface palette, which are built on top of these values.
 *
 * Contrast notes (WCAG 2.1):
 * - `blue[600]` carries white text at 5.4:1 and reads as link text on white
 *   and on `page` at 5.2:1.
 * - `slate[500]` is the lightest grey that still passes 4.5:1 as body-size
 *   text on white and on the tinted page background. Anything lighter
 *   (`slate[400]`) is for icons, borders and disabled states only.
 * - `teal[700]` carries white text at 5.5:1.
 */
export const PALETTE = {
  blue: {
    50: "#EEF5FF",
    100: "#DCEAFE",
    200: "#BBD5FC",
    300: "#8CB8F8",
    400: "#5A96F2",
    500: "#2F78EA",
    600: "#1565D8",
    700: "#1152B4",
    800: "#12438D",
    900: "#123A72",
  },
  teal: {
    50: "#EFFAF8",
    100: "#CDF1EB",
    200: "#9DE2D7",
    300: "#5FCBBE",
    400: "#2BAF9F",
    500: "#139384",
    600: "#0D8174",
    700: "#0F766E",
    800: "#115E57",
    900: "#134E48",
  },
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#56657A",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },
  /** Deep navy used for headings on light surfaces. */
  ink: "#0F2557",
  /** Tinted off-white used behind cards on light surfaces. */
  mist: "#F7FAFE",
  white: "#FFFFFF",
  green: { 50: "#ECFDF3", 100: "#DCFCE7", 500: "#22C55E", 600: "#16A34A", 700: "#15803D", 300: "#86EFAC" },
  amber: { 50: "#FFF7E6", 100: "#FEF3C7", 500: "#F59E0B", 600: "#D97706", 700: "#B45309", 300: "#FCD34D" },
  red: { 50: "#FEF2F2", 100: "#FEE2E2", 500: "#EF4444", 600: "#DC2626", 700: "#B91C1C", 300: "#FCA5A5" },
  rose: { 50: "#FFF1F3", 100: "#FFE4E8", 500: "#E5486A", 600: "#D23259", 700: "#BE123C", 300: "#FDA4AF" },
  indigo: { 50: "#F2F3FF", 100: "#E4E6FD", 500: "#5B63E6", 600: "#4B50D6", 300: "#A5ABF8" },
} as const;
