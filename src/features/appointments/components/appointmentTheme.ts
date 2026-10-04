import { PALETTE } from "@/theme/palette";

// The booking flow's colours in the shared roles: Dark Navy headings and
// labels, slate body text, Healthcare Blue only for selection and actions.
export const APPOINTMENT_COLORS = {
  primary: PALETTE.ink,
  primaryDeep: PALETTE.ink,
  primaryBright: PALETTE.blue[600],
  surfaceTint: PALETTE.blue[50],
  surfaceTintStrong: PALETTE.blue[100],
  white: PALETTE.white,
  pageBg: PALETTE.white,
  border: PALETTE.slate[200],
  borderStrong: PALETTE.controlLine,
  divider: PALETTE.slate[200],
  bodyText: PALETTE.slate[700],
  mutedText: PALETTE.slate[500],
  placeholder: PALETTE.slate[500],
  successBg: PALETTE.success[50],
  success: PALETTE.success[700],
  actionGreen: PALETTE.green[600],
  actionGreenPressed: PALETTE.green[700],
  danger: PALETTE.red[600],
  dangerBg: PALETTE.red[50],
  dangerBorder: PALETTE.red[200],
  neutralBg: PALETTE.slate[100],
  track: PALETTE.slate[200],
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
