import { LANDING_COLORS } from "@/config/landingAssets";

export const REG_COLORS = {
  primary: LANDING_COLORS.primaryBlue,
  primarySoft: "#EAF2FE",
  primaryRing: "rgba(8, 102, 245, 0.16)",
  secondary: LANDING_COLORS.green,
  secondarySoft: "#ECFDF3",
  success: LANDING_COLORS.green,
  error: "#DC2626",
  errorSoft: "#FEF2F2",
  errorRing: "rgba(220, 38, 38, 0.14)",
  text: "#0F172A",
  heading: LANDING_COLORS.navy,
  muted: "#5A6B85",
  subtle: "#8A9AB4",
  border: LANDING_COLORS.border,
  borderStrong: "#C6D4E7",
  surface: "#FFFFFF",
  surfaceMuted: "#F6F9FD",
  disabled: "#F1F5F9",
  overlay: "rgba(8, 21, 47, 0.48)",
} as const;

export const REG_RADIUS = {
  modal: 22,
  sheet: 28,
  control: 12,
  card: 16,
  pill: 999,
} as const;

export const REG_METRICS = {
  sheetInputHeight: 52,
  modalInputHeight: 48,
  buttonHeight: { sheet: 52, modal: 46 },
  touchTarget: 44,
} as const;
