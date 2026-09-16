import type { Ionicons } from "@expo/vector-icons";

export type IoniconName = keyof typeof Ionicons.glyphMap;

export type AppointmentStatus = "pending" | "confirmed" | "rescheduled" | "declined";

export type AccentTone = "blue" | "green" | "purple" | "orange" | "pink";

export interface StatItem {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
  caption: string;
  icon: IoniconName;
  tone: AccentTone;
}

export interface QuickAction {
  id: string;
  label: string;
  shortLabel: string;
  icon: IoniconName;
  tone: AccentTone;
  href: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  detail?: string;
  icon: IoniconName;
  tone: AccentTone;
}

export interface HealthService {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
  tone: AccentTone;
}

export interface HealthTip {
  headline: string;
  ctaLabel: string;
}
