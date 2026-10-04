import type { Feather } from "@expo/vector-icons";
import { PALETTE, withAlpha } from "@/theme/palette";

export type LeaderTier = "top" | "mid";

export type LeaderCardProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
  name?: string;
  tier: LeaderTier;
  isTablet: boolean;
};

export type LeaderTierProps = Omit<LeaderCardProps, "tier"> & {
  avatarSize: number;
  displayName: string;
};

export const CARD_SHADOW = {
  boxShadow: `0px 4px 12px ${withAlpha(PALETTE.ink, 0.08)}`,
  elevation: 6,
} as const;
