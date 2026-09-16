import type { Feather } from "@expo/vector-icons";

import type { MetricTone } from "@/design/adminDashboardTheme";
import type {
  ServiceBreakdownEntry,
  StaffDashboardData,
  StaffSummary,
} from "@/services/staffDashboardService";

export type StaffRole = "doctor" | "bhw" | "midwife" | "admin";

export type MetricSpec = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  tone: MetricTone;
  value: (data: StaffDashboardData) => number;
  description: (data: StaffDashboardData) => string;
};

export type RoleDashboardConfig = {
  role: StaffRole;
  badge: string;
  tagline: string;
  metrics: MetricSpec[];
  chart: {
    title: string;
    subtitle: string;
    icon: keyof typeof Feather.glyphMap;
    kind: "bars" | "lines";
  };
  showServiceSplit: boolean;
  activityTitle: string;
  activitySubtitle: string;
  queueRoute: string;
};

export const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;

export const byKey = (breakdown: ServiceBreakdownEntry[], key: string) =>
  breakdown.find((entry) => entry.key === key)?.today ?? 0;

export const progressCaption = (summary: StaffSummary) =>
  `${summary.waiting} waiting · ${summary.completedToday} completed`;
