/**
 * Colour values for the admin announcements and users screens, the one place they are
 * written down. tailwind.config.js maps each class name (`text-ink`,
 * `bg-brand`, ...) to the matching `--an-*` variable, and
 * `useAnnouncementThemeVars` sets these values on the screen root, so every
 * class follows the app's light or dark theme without a `dark:` twin.
 *
 * Imports only the import-free palette, so tests and the hook can share it.
 */

import { PALETTE } from "./palette.ts";

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
  | "status-approved"
  | "status-deactivated"
  | "selected"
  | "selected-border"
  | "line-hover"
  | "disabled"
  | "destructive"
  | "destructive-bg"
  | "destructive-border"
  | "toast"
  | "toast-text"
  | "toast-action"
  | "toast-icon"
  | "scrim";

export type AnnouncementPalette = Record<AnnouncementTokenName, string>;

// Values follow the admin dashboard palette (src/design/adminDashboard), the
// design source for every admin page, so Announcements and Users read as the
// same product as the Dashboard. Comments name the dashboard role each mirrors.
const { blue, slate, green, amber } = PALETTE;

export const ANNOUNCEMENT_LIGHT: AnnouncementPalette = {
  page: PALETTE.mist, // pageBg
  canvas: PALETTE.white, // cardBg
  ink: PALETTE.ink, // heading
  text2: slate[600], // muted
  text3: slate[700], // body
  body: slate[700],
  placeholder: slate[500], // subtle
  brand: blue[600], // primary
  "brand-hover": blue[700],
  "brand-tint": blue[50],
  "brand-on": PALETTE.white,
  avatar: blue[50], // bannerBg: blue[100] left initials at 4.4:1
  line: "#E4EBF4", // cardBorder
  divider: "#EDF2F8",
  field: slate[300], // controlBorder
  shell: "#F8FBFF", // subtleSurface
  head: "#EDF2F8", // table header band
  rowopen: "#F1F6FD", // hoverBg
  neutral: "#E6EDF6", // skeleton
  navhover: "#F1F6FD",
  "status-active": green[600],
  "status-draft": amber[700],
  "status-expired": slate[400],
  destructive: "#B91C1C", // statusTones.danger
  "destructive-bg": "#FEF1F1",
  "destructive-border": "#FBD0D0",
  toast: PALETTE.ink,
  "toast-text": PALETTE.white,
  "toast-action": blue[200],
  "toast-icon": slate[300],
  scrim: "rgba(15, 23, 42, 0.20)", // MODAL_BACKDROP_LIGHT
  "status-approved": blue[600],
  "status-deactivated": slate[400],
  selected: blue[50], // rowSelected
  "selected-border": "#D5E4FA", // bannerBorder
  "line-hover": blue[200],
  disabled: slate[300],
};

export const ANNOUNCEMENT_DARK: AnnouncementPalette = {
  page: slate[950],
  canvas: slate[900],
  ink: slate[50],
  text2: slate[400],
  text3: slate[300],
  body: slate[300],
  placeholder: "#7D8CA3",
  brand: blue[400],
  "brand-hover": blue[300],
  "brand-tint": "#0B1F3A",
  "brand-on": "#0B1220",
  avatar: "#0B1F3A",
  line: slate[800],
  divider: slate[800],
  field: slate[700],
  shell: "#111C33",
  head: slate[800],
  rowopen: "#16213A",
  neutral: slate[800],
  navhover: "#16213A",
  "status-active": "#34D399",
  "status-draft": amber[300],
  "status-expired": slate[500],
  destructive: "#FB7185",
  "destructive-bg": "#2A1218",
  "destructive-border": "#5B1F2A",
  toast: slate[700],
  "toast-text": PALETTE.white,
  "toast-action": blue[300],
  "toast-icon": slate[300],
  scrim: "rgba(15, 23, 42, 0.45)", // MODAL_BACKDROP_DARK
  "status-approved": blue[300],
  "status-deactivated": slate[500],
  selected: "#0B1F3A",
  "selected-border": "#1E3A5F",
  "line-hover": slate[600],
  disabled: slate[700],
};

/** `{ "--an-ink": "#1B2120", ... }` for NativeWind's `vars()`. */
export const toAnnouncementVariables = (palette: AnnouncementPalette): Record<`--an-${string}`, string> =>
  Object.fromEntries(Object.entries(palette).map(([name, value]) => [`--an-${name}`, value]));
