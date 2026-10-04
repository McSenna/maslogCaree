import type { Feather } from "@expo/vector-icons";
import { PALETTE, withAlpha } from "@/theme/palette";
import type { StatusTone, ToneStyle } from "./adminDashboard/paletteTypes";
import { createShadow } from "./shadow";

export const CARD_SHADOW = createShadow({
  color: PALETTE.slate[800],
  opacity: 0.04,
  radius: 12,
  offsetY: 2,
  elevation: 1,
});

/** Dropdowns and row menus (SelectMenu's lift), so every admin menu floats the same way. */
export const MENU_SHADOW = createShadow({
  color: PALETTE.slate[800],
  opacity: 0.12,
  radius: 16,
  offsetY: 2,
  elevation: 6,
});

export const MODAL_SHADOW = {
  ...createShadow({
    color: PALETTE.slate[800],
    opacity: 0.12,
    radius: 24,
    offsetY: 16,
    elevation: 16,
  }),
  boxShadow: `0 25px 50px -12px ${withAlpha(PALETTE.ink, 0.18)}, 0 0 0 1px ${withAlpha(PALETTE.ink, 0.05)}`,
};

export const MODAL_BACKDROP_LIGHT = withAlpha(PALETTE.ink, 0.28);
export const MODAL_BACKDROP_DARK = withAlpha(PALETTE.night.page, 0.6);

export const CONTROL_HEIGHT = 48;

export const RADIUS = {
  card: 16,
  panel: 14,
  control: 10,
  pill: 9999,
} as const;

export type BadgeTone = {
  label: string;
  text: string;
  bg: string;
  dot?: string;
  border?: string;
  icon?: keyof typeof Feather.glyphMap;
};

/**
 * A labelled badge in one of the shared status tones, so a feature's own
 * states (stock levels, account status, log severity) look exactly like the
 * appointment statuses rather than inventing a new badge.
 */
export const statusBadge = (label: string, tone: StatusTone, icon: BadgeTone["icon"]): BadgeTone => ({
  label,
  text: tone.fg,
  bg: tone.bg,
  dot: tone.fg,
  border: tone.border,
  icon,
});

/** A labelled badge in one of the metric tones (categories, roles). */
export const toneBadge = (label: string, tone: ToneStyle): BadgeTone => ({
  label,
  text: tone.label,
  bg: tone.iconBg,
  dot: tone.icon,
});
