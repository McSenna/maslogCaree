import type { ReactNode } from "react";
import { LANDING_COLORS } from "@/config/landingAssets";
import {
  AppointmentCalendarIcon,
  NotificationBellIcon,
  StethoscopeIcon,
} from "@/components/landing/FeatureIcons";

export type LandingFeature = {
  key: string;
  title: string;
  description: string;
  iconBgColor: string;
  renderIcon: (size: number) => ReactNode;
};

export const LANDING_FEATURES: LandingFeature[] = [
  {
    key: "appointments",
    title: "Book Appointments",
    description: "Schedule and manage your appointments with ease.",
    iconBgColor: LANDING_COLORS.softBlue,
    renderIcon: (size) => (
      <AppointmentCalendarIcon size={size} color={LANDING_COLORS.primaryBlue} />
    ),
  },
  {
    key: "services",
    title: "Access Health Services",
    description: "Connect with healthcare services in your barangay.",
    iconBgColor: LANDING_COLORS.softGreen,
    renderIcon: (size) => <StethoscopeIcon size={size} color={LANDING_COLORS.green} />,
  },
  {
    key: "updates",
    title: "Stay Updated",
    description: "Receive announcements and important reminders.",
    iconBgColor: LANDING_COLORS.softOrange,
    renderIcon: (size) => <NotificationBellIcon size={size} color={LANDING_COLORS.orange} />,
  },
];
