import type { ReactNode } from "react";
import { LANDING_COLORS } from "@/config/landingAssets";
import { LANDING_FEATURE_COPY, type LandingFeatureCopy } from "@/config/landingContent";
import {
  AppointmentCalendarIcon,
  NotificationBellIcon,
  StethoscopeIcon,
} from "@/components/landing/FeatureIcons";

export type LandingFeature = LandingFeatureCopy & {
  iconBgColor: string;
  renderIcon: (size: number) => ReactNode;
};

const FEATURE_VISUALS: Record<LandingFeatureCopy["key"], Omit<LandingFeature, keyof LandingFeatureCopy>> = {
  request: {
    iconBgColor: LANDING_COLORS.softBlue,
    renderIcon: (size) => (
      <AppointmentCalendarIcon size={size} color={LANDING_COLORS.primaryBlue} />
    ),
  },
  priority: {
    iconBgColor: LANDING_COLORS.softGreen,
    renderIcon: (size) => <StethoscopeIcon size={size} color={LANDING_COLORS.green} />,
  },
  schedule: {
    iconBgColor: LANDING_COLORS.softOrange,
    renderIcon: (size) => <NotificationBellIcon size={size} color={LANDING_COLORS.orange} />,
  },
};

export const LANDING_FEATURES: LandingFeature[] = LANDING_FEATURE_COPY.map((copy) => ({
  ...copy,
  ...FEATURE_VISUALS[copy.key],
}));
