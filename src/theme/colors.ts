import { dark } from "@/design/adminDashboard/darkPalette";
import { light } from "@/design/adminDashboard/lightPalette";
import { PALETTE } from "./palette";

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
  surfaceMuted: "#F3F7FC",
  surfaceHover: PALETTE.blue[50],
  border: light.cardBorder,
  borderStrong: PALETTE.slate[300],
  divider: light.divider,
  heading: light.heading,
  body: light.body,
  muted: light.muted,
  subtle: light.subtle,
  primary: light.primary,
  primaryHover: PALETTE.blue[700],
  primaryPressed: PALETTE.blue[800],
  primarySoft: PALETTE.blue[50],
  onPrimary: PALETTE.white,
  focusRing: "rgba(21,101,216,0.35)",
  overlay: "rgba(15,23,42,0.45)",
  skeleton: light.skeleton,
  success: light.statusTones.success,
  warning: light.statusTones.warning,
  danger: light.statusTones.danger,
  info: light.statusTones.info,
  progress: light.statusTones.progress,
  neutral: light.statusTones.neutral,
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
  primaryHover: PALETTE.blue[300],
  primaryPressed: PALETTE.blue[500],
  primarySoft: "rgba(21,101,216,0.18)",
  onPrimary: "#0B1220",
  focusRing: "rgba(90,150,242,0.45)",
  overlay: "rgba(2,6,23,0.7)",
  skeleton: dark.skeleton,
  success: dark.statusTones.success,
  warning: dark.statusTones.warning,
  danger: dark.statusTones.danger,
  info: dark.statusTones.info,
  progress: dark.statusTones.progress,
  neutral: dark.statusTones.neutral,
};

export const getThemeColors = (scheme: ColorScheme): ThemeColors =>
  scheme === "dark" ? darkColors : lightColors;
