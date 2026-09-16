export const ROLE_COLORS: Record<string, string> = {
  admin: "#1677FF",
  doctor: "#22C55E",
  midwife: "#EC4899",
  bhw: "#F59E0B",
  resident: "#8B5CF6",
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

export const DASHBOARD_CARD_SHADOW = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.04,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;

export const DASHBOARD_RADIUS = {
  card: 16,
  pill: 9999,
} as const;
