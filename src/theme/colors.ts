import { dark } from "@/design/adminDashboard/darkPalette";
import { light } from "@/design/adminDashboard/lightPalette";
import { PALETTE, mix, withAlpha } from "./palette";

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
  /** Form-field outlines for the invalid and valid states (3:1 or more on the surface). */
  errorLine: string;
  successLine: string;
  overlay: string;
  skeleton: string;
  /** Data tables: the heading band, a hovered or selected row, and the hairline between rows. */
  tableHeader: string;
  rowHover: string;
  rowSelected: string;
  rowDivider: string;
  success: Tone;
  warning: Tone;
  danger: Tone;
  info: Tone;
  progress: Tone;
  neutral: Tone;
};

const { blue, slate, night } = PALETTE;

const lightColors: ThemeColors = {
  scheme: "light",
  page: light.pageBg,
  surface: light.cardBg,
  surfaceMuted: slate[50],
  surfaceHover: blue[50],
  border: light.cardBorder,
  borderStrong: PALETTE.controlLine,
  divider: light.divider,
  heading: light.heading,
  body: light.body,
  muted: light.muted,
  subtle: light.subtle,
  primary: light.primary,
  primaryHover: blue[700],
  primaryPressed: blue[800],
  primarySoft: blue[50],
  onPrimary: PALETTE.white,
  // Solid, not translucent: a ring must reach 3:1 against the surface it sits on.
  focusRing: light.focusRing,
  errorLine: PALETTE.red[500],
  successLine: PALETTE.success[600],
  overlay: withAlpha(PALETTE.ink, 0.5),
  skeleton: light.skeleton,
  tableHeader: slate[50],
  rowHover: slate[50],
  rowSelected: blue[50],
  // A step lighter than the card border, so rows read as one block inside it.
  rowDivider: slate[100],
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
  surfaceMuted: night.raised,
  surfaceHover: night.raised,
  border: dark.cardBorder,
  borderStrong: night.control,
  divider: dark.divider,
  heading: dark.heading,
  body: dark.body,
  muted: dark.muted,
  subtle: dark.subtle,
  primary: dark.primary,
  primaryHover: blue[300],
  primaryPressed: blue[500],
  primarySoft: withAlpha(blue[600], 0.18),
  onPrimary: dark.onPrimary,
  focusRing: dark.focusRing,
  errorLine: PALETTE.red[500],
  successLine: PALETTE.success[300],
  overlay: withAlpha(night.page, 0.72),
  skeleton: dark.skeleton,
  tableHeader: night.raised,
  rowHover: night.raised,
  rowSelected: mix(blue[600], night.surface, 0.16),
  rowDivider: night.line,
  success: dark.statusTones.success,
  warning: dark.statusTones.warning,
  danger: dark.statusTones.danger,
  info: dark.statusTones.info,
  progress: dark.statusTones.progress,
  neutral: dark.statusTones.neutral,
};

export const getThemeColors = (scheme: ColorScheme): ThemeColors =>
  scheme === "dark" ? darkColors : lightColors;
