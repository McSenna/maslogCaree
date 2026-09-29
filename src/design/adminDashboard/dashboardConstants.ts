import { createShadow } from "@/design/shadow";
import { ROLE_CONTENT_MAX_WIDTH } from "@/theme/breakpoints";
import { PALETTE } from "@/theme/palette";
export const ROLE_COLORS: Record<string, string> = {
  admin: PALETTE.blue[600],
  doctor: "#22C55E",
  midwife: "#EC4899",
  bhw: "#F59E0B",
  resident: "#8B5CF6",
};

/**
 * Text colours for role badges. `ROLE_COLORS` are chart hues and are too light
 * to read as 10–11px text on their tints (amber was 1.9:1); these are the same
 * hues darkened (light theme) or lightened (dark theme) to pass AA.
 */
export const ROLE_TEXT_COLORS: Record<"light" | "dark", Record<string, string>> = {
  light: {
    admin: "#1152B4",
    doctor: "#15803D",
    midwife: "#BE185D",
    bhw: "#92400E",
    resident: "#6D28D9",
  },
  dark: {
    admin: "#8CB8F8",
    doctor: "#86EFAC",
    midwife: "#F9A8D4",
    bhw: "#FCD34D",
    resident: "#C4B5FD",
  },
};

export const ROLE_BADGE_TINTS: Record<string, string> = {
  admin: "#E5F0FF",
  doctor: "#E3FBEC",
  midwife: "#FDE9F3",
  bhw: "#FDF1DC",
  resident: "#F0EBFE",
};

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  doctor: "Doctor",
  midwife: "Midwife",
  bhw: "BHW",
  resident: "Resident",
};

export const DASHBOARD_BREAKPOINTS = {
  mobile: 768,
  fourMetricColumns: 1000,
  twoPanelColumns: 700,
  threePanelColumns: 1100,
} as const;

/** Dashboards share the frame every role page uses (see ROLE_CONTENT_MAX_WIDTH). */
export const DASHBOARD_MAX_WIDTH = ROLE_CONTENT_MAX_WIDTH;

/** Content width at which staff dashboards place the queue beside the upcoming and activity panels. */
export const DASHBOARD_WIDE_LAYOUT_MIN_WIDTH = 1280;

export const DASHBOARD_CARD_SHADOW = createShadow({
  color: "#0F172A",
  opacity: 0.04,
  radius: 12,
  offsetY: 2,
  elevation: 1,
});

export const DASHBOARD_RADIUS = {
  card: 16,
  pill: 9999,
} as const;
