import type { AccentTone } from "@/types/residentDashboard";
import { createShadow } from "@/design/shadow";
import { PALETTE } from "@/theme/palette";

export const RESIDENT_COLORS = {
  primary: PALETTE.blue[600],
  primarySoft: "#EAF2FE",
  pageBg: "#F6F9FE",
  cardBg: "#FFFFFF",
  border: "#E8EEF7",
  divider: "#EFF3F9",
  heading: "#0B1744",
  body: "#334155",
  muted: PALETTE.slate[600],
  subtle: PALETTE.slate[500],
  danger: "#EF4444",
} as const;

export type ToneStyle = {
  bg: string;
  fg: string;
};

export const TONES: Record<AccentTone, ToneStyle> = {
  blue: { bg: "#E8F1FE", fg: PALETTE.blue[600] },
  green: { bg: "#E4F7EC", fg: "#16A34A" },
  purple: { bg: "#EFEBFE", fg: "#7C3AED" },
  orange: { bg: "#FEF0E4", fg: "#F97316" },
  pink: { bg: "#FDE9EE", fg: "#E11D48" },
};

export const CARD = {
  radius: 16,
  radiusSm: 12,
  radiusLg: 18,
} as const;

export const CARD_SHADOW = createShadow({
  color: "#0B1744",
  opacity: 0.05,
  radius: 12,
  offsetY: 2,
  elevation: 1,
});
