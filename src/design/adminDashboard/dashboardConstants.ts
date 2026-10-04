import { createShadow } from "@/design/shadow";
import { dark } from "./darkPalette";
import { light } from "./lightPalette";
import type { AdminDashboardPalette, MetricTone, RoleColorKey } from "./paletteTypes";
import { ROLE_CONTENT_MAX_WIDTH } from "@/theme/breakpoints";
import { PALETTE } from "@/theme/palette";

/**
 * Which tone each role wears on badges, everywhere (dashboard, users, profile).
 * Clinical staff share care green, health workers wear the accent, residents
 * the primary blue, admins stay neutral.
 */
export const ROLE_TONE: Record<RoleColorKey, MetricTone> = {
  admin: "neutral",
  doctor: "care",
  midwife: "care",
  bhw: "accent",
  resident: "primary",
};

const roleMap = <T,>(pick: (role: RoleColorKey) => T) =>
  Object.fromEntries((Object.keys(ROLE_TONE) as RoleColorKey[]).map((role) => [role, pick(role)])) as Record<string, T>;

/** Text colours for role badges: the tone's label step (AA on its tint in both themes). */
export const ROLE_TEXT_COLORS: Record<"light" | "dark", Record<string, string>> = {
  light: roleMap((role) => light.tones[ROLE_TONE[role]].label),
  dark: roleMap((role) => dark.tones[ROLE_TONE[role]].label),
};

export const ROLE_BADGE_TINTS: Record<string, string> = roleMap((role) => light.tones[ROLE_TONE[role]].iconBg);

const ROLE_COLOR_KEYS: readonly string[] = ["admin", "doctor", "midwife", "bhw", "resident"];

const isRoleColorKey = (role: string): role is RoleColorKey => ROLE_COLOR_KEYS.includes(role);

/** The chart hue for a role in this theme, or the primary colour for an unknown role. */
export const roleColorOf = (palette: AdminDashboardPalette, role: string): string =>
  isRoleColorKey(role) ? palette.roleColors[role] : palette.primary;

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
  color: PALETTE.slate[800],
  opacity: 0.04,
  radius: 12,
  offsetY: 2,
  elevation: 1,
});

export const DASHBOARD_RADIUS = {
  card: 16,
  pill: 9999,
} as const;
