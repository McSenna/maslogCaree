import type { StoredTheme } from "@/utils/storage";

/**
 * Colour system for the Admin dashboard.
 *
 * The exact hex values live here rather than in Tailwind classes because the
 * dashboard is specified against a fixed healthcare palette (a near-white,
 * cool-blue page rather than the app's plain white) and the same tokens have to
 * drive SVG fills in the donut and the banner artwork, where classes do not
 * apply. The dark set exists only so the app-wide theme toggle keeps working.
 */

export type MetricTone = "blue" | "green" | "pink" | "purple";

export type TrendDirection = "up" | "down";

export type TrendTone = {
  /** Text and arrow colour — dark enough to pass contrast on `bg`. */
  text: string;
  /** Pill fill. */
  bg: string;
};

export type ToneStyle = {
  /** Card surface behind the whole metric card (desktop). */
  cardBg: string;
  cardBorder: string;
  /** Rounded square holding the icon. */
  iconBg: string;
  icon: string;
  /** Metric label colour. */
  label: string;
};

export type AdminDashboardPalette = {
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  divider: string;
  heading: string;
  body: string;
  muted: string;
  subtle: string;
  primary: string;
  positive: string;
  negative: string;
  bannerBg: string;
  bannerBorder: string;
  bannerArt: string;
  bannerArtSoft: string;
  skeleton: string;
  menuBg: string;
  menuBorder: string;
  statusActive: string;
  statusInactive: string;
  tones: Record<MetricTone, ToneStyle>;
  /** Trend-pill fills, keyed by direction rather than by metric. */
  trends: Record<TrendDirection, TrendTone>;
};

const light: AdminDashboardPalette = {
  pageBg: "#F8FBFF",
  cardBg: "#FFFFFF",
  cardBorder: "#E7EEF7",
  divider: "#EEF3FA",
  heading: "#0F2557",
  body: "#334155",
  muted: "#64748B",
  subtle: "#94A3B8",
  primary: "#1677FF",
  positive: "#22C55E",
  negative: "#F43F5E",
  bannerBg: "#EAF3FF",
  bannerBorder: "#D7E7FC",
  bannerArt: "#B6D4F5",
  bannerArtSoft: "#D3E6FB",
  skeleton: "#E8EFF8",
  menuBg: "#FFFFFF",
  menuBorder: "#E7EEF7",
  statusActive: "#22C55E",
  statusInactive: "#94A3B8",
  tones: {
    blue: {
      cardBg: "#F1F7FF",
      cardBorder: "#DCEAFD",
      iconBg: "#DBEAFE",
      icon: "#1677FF",
      label: "#1677FF",
    },
    green: {
      cardBg: "#F1FBF5",
      cardBorder: "#D6F2E1",
      iconBg: "#DCFCE7",
      icon: "#16A34A",
      label: "#16A34A",
    },
    pink: {
      cardBg: "#FFF3F5",
      cardBorder: "#FBDCE3",
      iconBg: "#FFE4E9",
      icon: "#F43F5E",
      label: "#F43F5E",
    },
    purple: {
      cardBg: "#F6F4FF",
      cardBorder: "#E5DEFB",
      iconBg: "#EDE9FE",
      icon: "#8B5CF6",
      label: "#8B5CF6",
    },
  },
  trends: {
    up: { text: "#15803D", bg: "#DCFCE7" },
    down: { text: "#BE123C", bg: "#FFE4E6" },
  },
};

const dark: AdminDashboardPalette = {
  pageBg: "#020617",
  cardBg: "#0F172A",
  cardBorder: "#1E293B",
  divider: "#1E293B",
  heading: "#F8FAFC",
  body: "#CBD5E1",
  muted: "#94A3B8",
  subtle: "#64748B",
  primary: "#60A5FA",
  positive: "#34D399",
  negative: "#FB7185",
  bannerBg: "#0B1F3A",
  bannerBorder: "#1E3A5F",
  bannerArt: "#1E3A5F",
  bannerArtSoft: "#16304D",
  skeleton: "#1E293B",
  menuBg: "#111C33",
  menuBorder: "#1E293B",
  statusActive: "#34D399",
  statusInactive: "#64748B",
  tones: {
    blue: {
      cardBg: "rgba(22,119,255,0.12)",
      cardBorder: "rgba(22,119,255,0.28)",
      iconBg: "rgba(22,119,255,0.22)",
      icon: "#60A5FA",
      label: "#60A5FA",
    },
    green: {
      cardBg: "rgba(34,197,94,0.12)",
      cardBorder: "rgba(34,197,94,0.28)",
      iconBg: "rgba(34,197,94,0.22)",
      icon: "#34D399",
      label: "#34D399",
    },
    pink: {
      cardBg: "rgba(244,63,94,0.12)",
      cardBorder: "rgba(244,63,94,0.28)",
      iconBg: "rgba(244,63,94,0.22)",
      icon: "#FB7185",
      label: "#FB7185",
    },
    purple: {
      cardBg: "rgba(139,92,246,0.12)",
      cardBorder: "rgba(139,92,246,0.28)",
      iconBg: "rgba(139,92,246,0.22)",
      icon: "#A78BFA",
      label: "#A78BFA",
    },
  },
  trends: {
    up: { text: "#86EFAC", bg: "rgba(34,197,94,0.16)" },
    down: { text: "#FDA4AF", bg: "rgba(244,63,94,0.16)" },
  },
};

export function getAdminDashboardPalette(theme: StoredTheme): AdminDashboardPalette {
  return theme === "dark" ? dark : light;
}

/** Shared by the donut, its legend and the recent-user role badges. */
export const ROLE_COLORS: Record<string, string> = {
  admin: "#1677FF",
  doctor: "#22C55E",
  midwife: "#EC4899",
  bhw: "#F59E0B",
  resident: "#8B5CF6",
};

/** Soft fills for the role badges, keyed to ROLE_COLORS. */
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

/** Layout tiers. Driven by the width actually available to the dashboard. */
export const DASHBOARD_BREAKPOINTS = {
  /** Below this the dashboard uses its dedicated mobile content order. */
  mobile: 768,
  /** Two metric columns become four. */
  fourMetricColumns: 1000,
  /** Panels can sit two across. */
  twoPanelColumns: 700,
  /** Panels can sit three across without cramping the recent-user rows. */
  threePanelColumns: 1100,
} as const;

/**
 * Subtle elevation shared by the admin dashboard's cards, matching the
 * User Management surfaces so the two screens read as one product.
 */
export const DASHBOARD_CARD_SHADOW = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.04,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;

/** Radius scale, matching User Management: soft cards, fully rounded pills. */
export const DASHBOARD_RADIUS = {
  card: 16,
  pill: 9999,
} as const;
