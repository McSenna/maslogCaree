import type { AccentTone } from "@/types/residentDashboard";
import { createShadow } from "@/design/shadow";

export const RESIDENT_COLORS = {
  primary: "#0B63F6",
  primarySoft: "#EAF2FE",
  pageBg: "#F6F9FE",
  cardBg: "#FFFFFF",
  border: "#E8EEF7",
  divider: "#EFF3F9",
  heading: "#0B1744",
  body: "#334155",
  muted: "#64748B",
  subtle: "#94A3B8",
  danger: "#EF4444",
} as const;

export type ToneStyle = {
  bg: string;
  fg: string;
};

export const TONES: Record<AccentTone, ToneStyle> = {
  blue: { bg: "#E8F1FE", fg: "#0B63F6" },
  green: { bg: "#E4F7EC", fg: "#16A34A" },
  purple: { bg: "#EFEBFE", fg: "#7C3AED" },
  orange: { bg: "#FEF0E4", fg: "#F97316" },
  pink: { bg: "#FDE9EE", fg: "#E11D48" },
};

export type StatusStyle = { bg: string; fg: string };

export const STATUS_STYLES: Record<string, StatusStyle> = {
  pending: { bg: "#FEF3C7", fg: "#B45309" },
  confirmed: { bg: "#DCFCE7", fg: "#15803D" },
  rescheduled: { bg: "#DBEAFE", fg: "#1D4ED8" },
  declined: { bg: "#FEE2E2", fg: "#B91C1C" },
  unknown: { bg: "#E8EEF7", fg: "#475569" },
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
