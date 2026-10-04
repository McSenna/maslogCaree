import { PALETTE } from "@/theme/palette";

export const RECOVERY_COLORS = {
  primary: PALETTE.blue[600],
  primarySoft: PALETTE.blue[50],
  success: PALETTE.success[600],
  successSoft: PALETTE.success[50],
  error: PALETTE.red[600],
  errorSoft: PALETTE.red[50],
  text: PALETTE.slate[800],
  muted: PALETTE.slate[500],
  border: PALETTE.slate[200],
  surface: PALETTE.white,
  background: PALETTE.slate[50],
} as const;

export const RECOVERY_RADIUS = { modal: 24, sheet: 32, control: 14, pill: 999 } as const;
