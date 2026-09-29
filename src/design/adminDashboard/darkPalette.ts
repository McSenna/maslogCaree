import { PALETTE } from "@/theme/palette";
import type { AdminDashboardPalette } from "./paletteTypes";

const { blue, teal, slate, rose, indigo, amber } = PALETTE;

export const dark: AdminDashboardPalette = {
  pageBg: slate[950],
  cardBg: slate[900],
  cardBorder: slate[800],
  divider: slate[800],
  heading: slate[50],
  body: slate[300],
  muted: slate[400],
  subtle: "#7D8CA3",
  primary: blue[400],
  onPrimary: "#0B1220",
  focusRing: blue[300],
  hoverBg: "#16213A",
  positive: "#34D399",
  negative: "#FB7185",
  bannerBg: "#0B1F3A",
  bannerBorder: "#1E3A5F",
  bannerArt: "#1E3A5F",
  bannerArtSoft: "#16304D",
  skeleton: slate[800],
  menuBg: "#111C33",
  menuBorder: slate[800],
  statusActive: "#34D399",
  statusInactive: slate[500],
  tones: {
    blue: {
      cardBg: "rgba(21,101,216,0.14)",
      cardBorder: "rgba(21,101,216,0.30)",
      iconBg: "rgba(21,101,216,0.24)",
      icon: blue[300],
      label: blue[300],
    },
    green: {
      cardBg: "rgba(19,147,132,0.14)",
      cardBorder: "rgba(19,147,132,0.30)",
      iconBg: "rgba(19,147,132,0.24)",
      icon: teal[300],
      label: teal[300],
    },
    pink: {
      cardBg: "rgba(229,72,106,0.13)",
      cardBorder: "rgba(229,72,106,0.28)",
      iconBg: "rgba(229,72,106,0.22)",
      icon: rose[300],
      label: rose[300],
    },
    purple: {
      cardBg: "rgba(91,99,230,0.14)",
      cardBorder: "rgba(91,99,230,0.30)",
      iconBg: "rgba(91,99,230,0.24)",
      icon: indigo[300],
      label: indigo[300],
    },
    amber: {
      cardBg: "rgba(245,158,11,0.13)",
      cardBorder: "rgba(245,158,11,0.28)",
      iconBg: "rgba(245,158,11,0.22)",
      icon: amber[300],
      label: amber[300],
    },
  },
  trends: {
    up: { text: "#86EFAC", bg: "rgba(34,197,94,0.16)" },
    down: { text: "#FDA4AF", bg: "rgba(229,72,106,0.16)" },
  },
  statusTones: {
    success: { bg: "rgba(16,185,129,0.14)", fg: "#6EE7B7", border: "rgba(16,185,129,0.3)" },
    warning: { bg: "rgba(245,158,11,0.16)", fg: "#FCD34D", border: "rgba(245,158,11,0.3)" },
    danger: { bg: "rgba(239,68,68,0.14)", fg: "#FCA5A5", border: "rgba(239,68,68,0.3)" },
    info: { bg: "rgba(37,99,235,0.16)", fg: "#93C5FD", border: "rgba(37,99,235,0.3)" },
    progress: { bg: "rgba(139,92,246,0.16)", fg: "#C4B5FD", border: "rgba(139,92,246,0.3)" },
    neutral: { bg: "rgba(100,116,139,0.18)", fg: "#CBD5E1", border: "rgba(100,116,139,0.3)" },
  },
};
