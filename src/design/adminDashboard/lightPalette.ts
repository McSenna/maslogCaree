import { PALETTE } from "../../theme/palette.ts";
import type { AdminDashboardPalette } from "./paletteTypes";

const { blue, green, orange, slate, success, amber, red } = PALETTE;

/**
 * MaslogCare palette (light), adopted 2026-10-02 for every role. White cards on
 * Soft Gray, Dark Navy text, Healthcare Blue for action and focus. Colour on a
 * card lives in its icon chip and label; card fills stay white.
 *
 * Text contrast on the card / on the page: heading 14.8 / 13.8, body 10.4 / 9.7,
 * muted 5.9 / 5.5, subtle 4.8 on cards only, primary 5.2 / 4.8. Every status
 * and tone foreground is 5.8:1 or more on its own tint.
 */
export const light: AdminDashboardPalette = {
  pageBg: PALETTE.canvas,
  cardBg: PALETTE.white,
  cardBorder: slate[200],
  divider: slate[200],
  heading: PALETTE.ink,
  body: slate[700],
  muted: slate[600],
  subtle: slate[500],
  primary: blue[600],
  onPrimary: PALETTE.white,
  focusRing: blue[600],
  hoverBg: blue[50],
  positive: success[700],
  negative: red[700],
  bannerBg: blue[50],
  bannerBorder: blue[100],
  bannerArt: blue[200],
  bannerArtSoft: blue[100],
  skeleton: slate[200],
  menuBg: PALETTE.white,
  menuBorder: slate[200],
  statusActive: success[600],
  statusInactive: slate[400],
  tones: {
    primary: { cardBg: PALETTE.white, cardBorder: slate[200], iconBg: blue[50], icon: blue[600], label: blue[700] },
    care: { cardBg: PALETTE.white, cardBorder: slate[200], iconBg: green[50], icon: green[600], label: green[700] },
    accent: { cardBg: PALETTE.white, cardBorder: slate[200], iconBg: orange[50], icon: orange[600], label: orange[700] },
    danger: { cardBg: PALETTE.white, cardBorder: slate[200], iconBg: red[50], icon: red[600], label: red[700] },
    neutral: { cardBg: PALETTE.white, cardBorder: slate[200], iconBg: slate[100], icon: slate[600], label: slate[700] },
  },
  trends: {
    up: { text: success[700], bg: success[50] },
    down: { text: red[700], bg: red[50] },
  },
  statusTones: {
    success: { bg: success[50], fg: success[700], border: success[200] },
    warning: { bg: amber[50], fg: amber[700], border: amber[200] },
    danger: { bg: red[50], fg: red[700], border: red[200] },
    info: { bg: blue[50], fg: blue[700], border: blue[200] },
    progress: { bg: blue[100], fg: blue[700], border: blue[300] },
    neutral: { bg: slate[100], fg: slate[700], border: slate[200] },
  },
  // Categorical chart hues, all from the brand set and in each role's badge
  // family (dashboardConstants ROLE_TONE). Donut order is resident, bhw,
  // doctor, midwife, admin (wrapping); neighbours differ in hue or clearly in
  // lightness (doctor and midwife), and every slice is labelled with its count.
  roleColors: {
    resident: blue[600],
    bhw: orange[400],
    doctor: green[600],
    midwife: green[300],
    admin: PALETTE.ink,
  },
};
