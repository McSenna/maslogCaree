/**
 * Colour values for the admin announcements screen, the one place they are
 * written down. tailwind.config.js maps each class name (`text-ink`,
 * `bg-brand`, ...) to the matching `--an-*` variable, and
 * `useAnnouncementThemeVars` sets these values on the screen root, so every
 * class follows the app's light or dark theme without a `dark:` twin.
 *
 * Import-free on purpose so tests and the hook can share it.
 */

export type AnnouncementTokenName =
  | "page"
  | "canvas"
  | "ink"
  | "text2"
  | "text3"
  | "body"
  | "placeholder"
  | "brand"
  | "brand-hover"
  | "brand-tint"
  | "brand-on"
  | "avatar"
  | "line"
  | "divider"
  | "field"
  | "shell"
  | "head"
  | "rowopen"
  | "neutral"
  | "navhover"
  | "status-active"
  | "status-draft"
  | "status-expired"
  | "destructive"
  | "destructive-bg"
  | "destructive-border"
  | "toast"
  | "toast-text"
  | "toast-action"
  | "toast-icon"
  | "scrim";

export type AnnouncementPalette = Record<AnnouncementTokenName, string>;

export const ANNOUNCEMENT_LIGHT: AnnouncementPalette = {
  // Behind the cards, the same as the admin dashboard's pageBg (PALETTE.mist).
  page: "#F7FAFE",
  canvas: "#FFFFFF",
  ink: "#1B2120",
  text2: "#5A6563",
  text3: "#4A5553",
  body: "#2E3634",
  // Brief value #6F7A78 measured 4.43:1 on white; nudged to clear 4.5:1.
  placeholder: "#6B7674",
  brand: "#0D6B62",
  "brand-hover": "#09514A",
  "brand-tint": "#E0EEEC",
  "brand-on": "#FFFFFF",
  avatar: "#DDE7E5",
  line: "#E1E5E4",
  divider: "#EBEEED",
  field: "#D5DBDA",
  shell: "#F6F7F7",
  head: "#F8F9F9",
  rowopen: "#FAFBFB",
  neutral: "#EEF1F0",
  navhover: "#ECEFEE",
  "status-active": "#1E8A4C",
  "status-draft": "#9AA4A2",
  "status-expired": "#C25A1B",
  destructive: "#A33A1E",
  "destructive-bg": "#FBEDEA",
  "destructive-border": "#F0C9BE",
  toast: "#1B2120",
  "toast-text": "#FFFFFF",
  "toast-action": "#8FD3C9",
  "toast-icon": "#B7C2C0",
  // Behind the audience sheet and menu: dims the page without blurring it.
  scrim: "rgba(27, 33, 32, 0.4)",
};

// Dark mode matches the admin dashboard: slate-950 page, slate-900 cards,
// slate-800 borders. Only the brand stays teal; it turns light so it still
// reads as text and underline, and `brand-on` flips to dark ink.
export const ANNOUNCEMENT_DARK: AnnouncementPalette = {
  page: "#020617",
  canvas: "#0F172A",
  ink: "#F1F5F9",
  text2: "#94A3B8",
  text3: "#CBD5E1",
  body: "#CBD5E1",
  placeholder: "#7B8AA0",
  brand: "#3FB1A3",
  "brand-hover": "#62C5B8",
  "brand-tint": "#0F2F33",
  "brand-on": "#0B1211",
  avatar: "#1E293B",
  line: "#1E293B",
  divider: "#1A2438",
  field: "#334155",
  shell: "#0F172A",
  head: "#111B2E",
  rowopen: "#16213A",
  neutral: "#1E293B",
  navhover: "#1E293B",
  "status-active": "#40B474",
  "status-draft": "#64748B",
  "status-expired": "#E07B3C",
  destructive: "#F08A6C",
  "destructive-bg": "#2A1512",
  "destructive-border": "#5B2A1F",
  toast: "#334155",
  "toast-text": "#FFFFFF",
  "toast-action": "#8FD3C9",
  "toast-icon": "#B7C2C0",
  scrim: "rgba(0, 0, 0, 0.6)",
};

/** `{ "--an-ink": "#1B2120", ... }` for NativeWind's `vars()`. */
export const toAnnouncementVariables = (palette: AnnouncementPalette): Record<`--an-${string}`, string> =>
  Object.fromEntries(Object.entries(palette).map(([name, value]) => [`--an-${name}`, value]));
