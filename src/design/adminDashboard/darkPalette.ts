import { PALETTE } from "@/theme/palette";
import type { AdminDashboardPalette } from "./paletteTypes";

const { blue, teal, slate, rose, indigo } = PALETTE;

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
  },
  trends: {
    up: { text: "#86EFAC", bg: "rgba(34,197,94,0.16)" },
    down: { text: "#FDA4AF", bg: "rgba(229,72,106,0.16)" },
  },
};
