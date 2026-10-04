import { createShadow } from "@/design/shadow";
import { PALETTE } from "@/theme/palette";

export const RESIDENT_COLORS = {
  primary: PALETTE.blue[600],
  primarySoft: PALETTE.blue[50],
  pageBg: PALETTE.canvas,
  cardBg: PALETTE.white,
  border: PALETTE.slate[200],
  divider: PALETTE.slate[200],
  heading: PALETTE.ink,
  body: PALETTE.slate[700],
  muted: PALETTE.slate[600],
  subtle: PALETTE.slate[500],
  danger: PALETTE.red[600],
} as const;

export const CARD = {
  radius: 16,
  radiusSm: 12,
  radiusLg: 18,
} as const;

export const CARD_SHADOW = createShadow({
  color: PALETTE.ink,
  opacity: 0.05,
  radius: 12,
  offsetY: 2,
  elevation: 1,
});
