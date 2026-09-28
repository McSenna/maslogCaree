import { PALETTE } from "@/theme/palette";

export const APPOINTMENT_COLORS = {
  primary: PALETTE.blue[700],
  primaryDeep: "#1E3A8A",
  primaryBright: PALETTE.blue[600],
  surfaceTint: "#EFF6FF",
  surfaceTintStrong: "#E0EAFB",
  white: "#FFFFFF",
  pageBg: "#FFFFFF",
  border: "#DBE4F2",
  borderStrong: "#BFD3F0",
  divider: "#E8EEF8",
  bodyText: "#1E3A8A",
  mutedText: "#64748B",
  placeholder: "#64748B",
  successBg: "#DCFCE7",
  success: "#16A34A",
  actionGreen: "#15803D",
  actionGreenPressed: "#137035",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  dangerBorder: "#FECACA",
  neutralBg: "#EDF1F7",
  track: "#E2E8F0",
} as const;

export const APPOINTMENT_METRICS = {
  fieldHeight: 54,
  optionMinHeight: 54,
  buttonHeight: 52,
  radiusField: 12,
  radiusCard: 16,
  radiusSheet: 22,
} as const;

export const TEXT_LIMIT = 500;
