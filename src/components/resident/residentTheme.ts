import type { AccentTone } from "@/types/residentDashboard";

/**
 * The Resident Dashboard palette, taken from the target design.
 *
 * Declared as tokens rather than Tailwind classes because the same values also
 * drive icon colours and SVG-ish decorative fills, where a className does not
 * reach. One source, so a card and the glyph inside it can never disagree.
 */
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
  /** Pastel fill behind the icon. */
  bg: string;
  /** Icon colour — dark enough to read on `bg`. */
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

/**
 * Pill colours, keyed by the status the database stores.
 *
 * `unknown` is the fallback for a value this build has not seen, so a new
 * status added server-side renders neutrally instead of crashing or borrowing
 * another status's colour.
 */
export const STATUS_STYLES: Record<string, StatusStyle> = {
  pending: { bg: "#FEF3C7", fg: "#B45309" },
  confirmed: { bg: "#DCFCE7", fg: "#15803D" },
  rescheduled: { bg: "#DBEAFE", fg: "#1D4ED8" },
  declined: { bg: "#FEE2E2", fg: "#B91C1C" },
  unknown: { bg: "#E8EEF7", fg: "#475569" },
};

/** Card geometry, matching the design's soft, low-elevation surfaces. */
export const CARD = {
  radius: 16,
  radiusSm: 12,
  radiusLg: 18,
} as const;

export const CARD_SHADOW = {
  shadowColor: "#0B1744",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;
