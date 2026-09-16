import { PROFILE_COLORS } from "./profileTheme";

export const COVER_GRADIENT = ["#1D4ED8", "#2563EB", "#38BDF8"] as const;

export const COVER_HEIGHT = { compact: 104, wide: 168 } as const;

export const AVATAR_SIZE = { compact: 96, wide: 132 } as const;

export const PROFILE_MAX_WIDTH = 1180;

export const SOCIAL_COLORS = {
  ...PROFILE_COLORS,
  coverText: "#FFFFFF",
  tabActive: PROFILE_COLORS.primary,
  tabInactive: PROFILE_COLORS.muted,
  tabIndicator: PROFILE_COLORS.primary,
  statValue: PROFILE_COLORS.navy,
  verifiedBg: PROFILE_COLORS.greenSoft,
  verifiedText: PROFILE_COLORS.greenDeep,
  verifiedBorder: "#A7F3D0",
  pendingBg: "#FFFBEB",
  pendingText: "#B45309",
  pendingBorder: "#FDE68A",
} as const;
