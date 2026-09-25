import { dark } from "@/design/adminDashboard/darkPalette";
import { light } from "@/design/adminDashboard/lightPalette";

export type ColorScheme = "light" | "dark";

export type Tone = { bg: string; fg: string; border: string };

export type ThemeColors = {
  scheme: ColorScheme;
  page: string;
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  divider: string;
  heading: string;
  body: string;
  muted: string;
  subtle: string;
  primary: string;
  primaryHover: string;
  primaryPressed: string;
  primarySoft: string;
  onPrimary: string;
  focusRing: string;
  overlay: string;
  skeleton: string;
  success: Tone;
  warning: Tone;
  danger: Tone;
  info: Tone;
  progress: Tone;
  neutral: Tone;
};

const lightColors: ThemeColors = {
  scheme: "light",
  page: light.pageBg,
  surface: light.cardBg,
  surfaceMuted: "#F4F8FD",
  surfaceHover: "#F5F9FF",
  border: light.cardBorder,
  borderStrong: "#CBD5E1",
  divider: light.divider,
  heading: light.heading,
  body: light.body,
  muted: light.muted,
  subtle: light.subtle,
  primary: light.primary,
  primaryHover: "#0E66E0",
  primaryPressed: "#0B57C2",
  primarySoft: "#EAF3FF",
  onPrimary: "#FFFFFF",
  focusRing: "rgba(22,119,255,0.35)",
  overlay: "rgba(15,23,42,0.45)",
  skeleton: light.skeleton,
  success: { bg: "#E7F8F0", fg: "#047857", border: "#BBEBD3" },
  warning: { bg: "#FFF4E0", fg: "#B45309", border: "#FBE0B0" },
  danger: { bg: "#FEF1F1", fg: "#B91C1C", border: "#FBD0D0" },
  info: { bg: "#EAF2FF", fg: "#1D4ED8", border: "#CFE0FD" },
  progress: { bg: "#F1ECFF", fg: "#6D28D9", border: "#DDD2FD" },
  neutral: { bg: "#F1F5F9", fg: "#475569", border: "#E2E8F0" },
};

const darkColors: ThemeColors = {
  scheme: "dark",
  page: dark.pageBg,
  surface: dark.cardBg,
  surfaceMuted: "#111C33",
  surfaceHover: "#0B1220",
  border: dark.cardBorder,
  borderStrong: "#334155",
  divider: dark.divider,
  heading: dark.heading,
  body: dark.body,
  muted: dark.muted,
  subtle: dark.subtle,
  primary: dark.primary,
  primaryHover: "#7DB6FB",
  primaryPressed: "#3B8EF0",
  primarySoft: "rgba(37,99,235,0.16)",
  onPrimary: "#0B1220",
  focusRing: "rgba(96,165,250,0.45)",
  overlay: "rgba(2,6,23,0.7)",
  skeleton: dark.skeleton,
  success: { bg: "rgba(16,185,129,0.14)", fg: "#6EE7B7", border: "rgba(16,185,129,0.3)" },
  warning: { bg: "rgba(245,158,11,0.16)", fg: "#FCD34D", border: "rgba(245,158,11,0.3)" },
  danger: { bg: "rgba(239,68,68,0.14)", fg: "#FCA5A5", border: "rgba(239,68,68,0.3)" },
  info: { bg: "rgba(37,99,235,0.16)", fg: "#93C5FD", border: "rgba(37,99,235,0.3)" },
  progress: { bg: "rgba(139,92,246,0.16)", fg: "#C4B5FD", border: "rgba(139,92,246,0.3)" },
  neutral: { bg: "rgba(100,116,139,0.18)", fg: "#CBD5E1", border: "rgba(100,116,139,0.3)" },
};

export const getThemeColors = (scheme: ColorScheme): ThemeColors =>
  scheme === "dark" ? darkColors : lightColors;
