import { PALETTE } from "@/theme/palette";
import type { AdminDashboardPalette } from "./paletteTypes";

const { blue, teal, slate, green, rose, indigo, amber } = PALETTE;

export const light: AdminDashboardPalette = {
  pageBg: PALETTE.mist,
  cardBg: PALETTE.white,
  cardBorder: "#E4EBF4",
  divider: "#EDF2F8",
  heading: PALETTE.ink,
  body: slate[700],
  muted: slate[600],
  subtle: slate[500],
  primary: blue[600],
  onPrimary: PALETTE.white,
  focusRing: blue[600],
  hoverBg: "#F1F6FD",
  positive: green[600],
  negative: rose[600],
  bannerBg: blue[50],
  bannerBorder: "#D5E4FA",
  bannerArt: "#B3CFF3",
  bannerArtSoft: "#D1E2F8",
  skeleton: "#E6EDF6",
  menuBg: PALETTE.white,
  menuBorder: "#E4EBF4",
  statusActive: green[600],
  statusInactive: slate[400],
  tones: {
    blue: {
      cardBg: "#F2F7FF",
      cardBorder: "#DAE7FB",
      iconBg: blue[100],
      icon: blue[600],
      label: blue[600],
    },
    green: {
      cardBg: teal[50],
      cardBorder: "#D2EEE9",
      iconBg: teal[100],
      icon: teal[600],
      label: teal[700],
    },
    pink: {
      cardBg: rose[50],
      cardBorder: "#F9DCE3",
      iconBg: rose[100],
      icon: rose[600],
      label: rose[700],
    },
    purple: {
      cardBg: indigo[50],
      cardBorder: "#E0E2FA",
      iconBg: indigo[100],
      icon: indigo[500],
      label: indigo[600],
    },
    amber: {
      cardBg: amber[50],
      cardBorder: "#FBE7C0",
      iconBg: amber[100],
      icon: amber[700],
      label: amber[700],
    },
  },
  trends: {
    up: { text: green[700], bg: green[100] },
    down: { text: rose[700], bg: rose[100] },
  },
  statusTones: {
    success: { bg: "#E7F8F0", fg: "#047857", border: "#BBEBD3" },
    warning: { bg: "#FFF4E0", fg: "#B45309", border: "#FBE0B0" },
    danger: { bg: "#FEF1F1", fg: "#B91C1C", border: "#FBD0D0" },
    info: { bg: blue[50], fg: blue[700], border: "#CFE0FD" },
    progress: { bg: "#F1ECFF", fg: "#6D28D9", border: "#DDD2FD" },
    neutral: { bg: slate[100], fg: "#475569", border: slate[200] },
  },
};
