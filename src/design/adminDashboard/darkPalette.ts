import { PALETTE, withAlpha } from "../../theme/palette.ts";
import type { AdminDashboardPalette } from "./paletteTypes";

const { blue, green, orange, success, amber, red, night } = PALETTE;

// Translucent brand fills for tints on the dark card; alpha keeps one hue per role.
const tint = {
  blue: (a: number) => withAlpha(blue[600], a),
  green: (a: number) => withAlpha(green[500], a),
  orange: (a: number) => withAlpha(orange[400], a),
  success: (a: number) => withAlpha(success[500], a),
  amber: (a: number) => withAlpha(amber[500], a),
  red: (a: number) => withAlpha(red[500], a),
  slate: (a: number) => withAlpha(PALETTE.slate[500], a),
};

/**
 * MaslogCare palette (dark): surfaces stepped down from Dark Navy, so dark mode
 * is the same family rather than an inverted light theme. Text on the card
 * (#19212B): heading 15.1:1, body 11.5:1, muted 7.7:1, subtle 6.3:1,
 * primary 6.3:1; every status foreground is 7:1 or more.
 */
export const dark: AdminDashboardPalette = {
  pageBg: night.page,
  cardBg: night.surface,
  cardBorder: night.line,
  divider: night.line,
  heading: night.heading,
  body: night.body,
  muted: night.muted,
  subtle: night.subtle,
  primary: blue[400],
  onPrimary: night.page,
  focusRing: blue[300],
  hoverBg: night.raised,
  positive: success[300],
  negative: red[300],
  bannerBg: tint.blue(0.12),
  bannerBorder: tint.blue(0.28),
  bannerArt: tint.blue(0.3),
  bannerArtSoft: tint.blue(0.18),
  skeleton: night.line,
  menuBg: night.raised,
  menuBorder: night.lineStrong,
  statusActive: success[300],
  statusInactive: night.lineStrong,
  tones: {
    primary: { cardBg: night.surface, cardBorder: night.line, iconBg: tint.blue(0.2), icon: blue[300], label: blue[300] },
    care: { cardBg: night.surface, cardBorder: night.line, iconBg: tint.green(0.18), icon: green[300], label: green[300] },
    accent: { cardBg: night.surface, cardBorder: night.line, iconBg: tint.orange(0.16), icon: orange[300], label: orange[300] },
    danger: { cardBg: night.surface, cardBorder: night.line, iconBg: tint.red(0.16), icon: red[300], label: red[300] },
    neutral: { cardBg: night.surface, cardBorder: night.line, iconBg: tint.slate(0.22), icon: night.body, label: night.body },
  },
  trends: {
    up: { text: success[300], bg: tint.success(0.16) },
    down: { text: red[300], bg: tint.red(0.16) },
  },
  statusTones: {
    success: { bg: tint.success(0.14), fg: success[300], border: tint.success(0.32) },
    warning: { bg: tint.amber(0.14), fg: amber[300], border: tint.amber(0.32) },
    danger: { bg: tint.red(0.14), fg: red[300], border: tint.red(0.32) },
    info: { bg: tint.blue(0.16), fg: blue[300], border: tint.blue(0.32) },
    progress: { bg: tint.blue(0.26), fg: blue[200], border: tint.blue(0.45) },
    neutral: { bg: tint.slate(0.2), fg: night.body, border: tint.slate(0.34) },
  },
  roleColors: {
    resident: blue[400],
    bhw: orange[400],
    doctor: green[500],
    midwife: green[200],
    admin: night.body,
  },
};
