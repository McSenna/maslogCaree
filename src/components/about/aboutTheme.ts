import { LANDING_COLORS } from "@/config/landingAssets";
import type { LearnMoreTone } from "@/config/learnMoreContent";

export const TONE_PALETTE: Record<LearnMoreTone, { bg: string; fg: string; border: string }> = {
  blue: { bg: LANDING_COLORS.softBlue, fg: LANDING_COLORS.primaryBlue, border: "#C9DEFF" },
  green: { bg: LANDING_COLORS.softGreen, fg: LANDING_COLORS.green, border: "#BFE7CD" },
  orange: { bg: LANDING_COLORS.softOrange, fg: LANDING_COLORS.orange, border: "#FADFB0" },
};

export const ABOUT_RADIUS = {
  modal: 22,
  card: 16,
  image: 18,
  chip: 999,
} as const;

export const CONTENT_GUTTER = { compact: 18, wide: 26 } as const;
