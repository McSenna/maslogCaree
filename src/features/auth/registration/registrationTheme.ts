import { LANDING_COLORS } from "@/config/landingAssets";
import { PALETTE, withAlpha } from "@/theme/palette";

export const REG_COLORS = {
  primary: LANDING_COLORS.primaryBlue,
  primarySoft: PALETTE.blue[50],
  primaryRing: withAlpha(PALETTE.blue[600], 0.16),
  secondary: LANDING_COLORS.green,
  secondarySoft: PALETTE.green[50],
  success: PALETTE.green[600],
  // `success` is 3.3:1 on white: fine for icons and borders, too light for small text.
  successText: PALETTE.success[600],
  error: PALETTE.red[600],
  errorSoft: PALETTE.red[50],
  errorRing: withAlpha(PALETTE.red[600], 0.14),
  text: PALETTE.slate[800],
  heading: LANDING_COLORS.navy,
  muted: PALETTE.slate[600],
  subtle: PALETTE.slate[500],
  border: LANDING_COLORS.border,
  borderStrong: PALETTE.slate[300],
  // 3:1 against white, for controls whose border is their only outline (OTP boxes).
  controlBorder: PALETTE.controlLine,
  surface: PALETTE.white,
  surfaceMuted: PALETTE.slate[50],
  disabled: PALETTE.slate[100],
  overlay: withAlpha(PALETTE.ink, 0.48),
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
