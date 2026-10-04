/**
 * Colour values for the admin announcements and users screens, the one place they are
 * written down. tailwind.config.js maps each class name (`text-ink`,
 * `bg-brand`, ...) to the matching `--an-*` variable, and
 * `useAnnouncementThemeVars` sets these values on the screen root, so every
 * class follows the app's light or dark theme without a `dark:` twin.
 *
 * Imports only the import-free palette (by relative path), so tests and the
 * hook can share it.
 */
import { PALETTE, mix, withAlpha } from "./palette.ts";


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

const { blue, slate, success, amber, red, night } = PALETTE;

// Values come from the MaslogCare palette (src/theme/palette.ts) in the same
// roles the console palette gives them, so Announcements and Users read as the
// same product as every other page. Comments name the console role mirrored.
export const ANNOUNCEMENT_LIGHT: AnnouncementPalette = {
  page: PALETTE.canvas, // pageBg
  canvas: PALETTE.white, // cardBg
  ink: PALETTE.ink, // heading
  text2: slate[600], // muted
  text3: slate[700], // body
  body: slate[700],
  placeholder: slate[500], // subtle
  brand: blue[600], // primary
  "brand-hover": blue[700],
  "brand-tint": blue[50], // bannerBg
  "brand-on": PALETTE.white,
  avatar: blue[50],
  line: slate[200], // cardBorder
  divider: slate[200],
  field: PALETTE.controlLine, // controlBorder
  shell: slate[50], // subtleSurface
  head: slate[50], // table header band
  rowopen: blue[50], // hoverBg
  neutral: slate[200], // skeleton
  navhover: blue[50],
  "status-active": success[700],
  "status-draft": amber[700],
  "status-expired": slate[400],
  destructive: red[700], // statusTones.danger
  "destructive-bg": red[50],
  "destructive-border": red[200],
  toast: PALETTE.ink,
  "toast-text": PALETTE.white,
  "toast-action": blue[300],
  "toast-icon": slate[300],
  scrim: withAlpha(PALETTE.ink, 0.28),
  "status-approved": success[700],
  "status-deactivated": slate[400],
  selected: blue[50], // rowSelected
  "selected-border": blue[200], // bannerBorder
  "line-hover": blue[200],
  disabled: slate[300],
};

export const ANNOUNCEMENT_DARK: AnnouncementPalette = {
  page: night.page,
  canvas: night.surface,
  ink: night.heading,
  text2: night.muted,
  text3: night.body,
  body: night.body,
  placeholder: night.subtle,
  brand: blue[400],
  "brand-hover": blue[300],
  "brand-tint": mix(blue[600], night.surface, 0.16),
  "brand-on": night.page,
  avatar: mix(blue[600], night.surface, 0.16),
  line: night.line,
  divider: night.line,
  field: night.control,
  shell: night.raised,
  head: night.raised,
  rowopen: night.raised,
  neutral: night.line,
  navhover: night.raised,
  "status-active": success[300],
  "status-draft": amber[300],
  "status-expired": night.lineStrong,
  destructive: red[300],
  "destructive-bg": mix(red[500], night.surface, 0.14),
  "destructive-border": mix(red[500], night.surface, 0.32),
  toast: night.lineStrong,
  "toast-text": PALETTE.white,
  "toast-action": blue[200],
  "toast-icon": night.body,
  scrim: withAlpha(night.page, 0.6),
  "status-approved": success[300],
  "status-deactivated": night.lineStrong,
  selected: mix(blue[600], night.surface, 0.16),
  "selected-border": mix(blue[600], night.surface, 0.4),
  "line-hover": night.lineStrong,
  disabled: night.lineStrong,
};

/** `{ "--an-ink": "#1B2120", ... }` for NativeWind's `vars()`. */
export const toAnnouncementVariables = (palette: AnnouncementPalette): Record<`--an-${string}`, string> =>
  Object.fromEntries(Object.entries(palette).map(([name, value]) => [`--an-${name}`, value]));
