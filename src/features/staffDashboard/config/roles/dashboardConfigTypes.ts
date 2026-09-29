import type { Feather } from "@expo/vector-icons";

import type { MetricProgress } from "@/components/dashboard/admin/MetricCard";
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
  progress?: (data: StaffDashboardData) => MetricProgress | undefined;
  route?: string;
};

export type RoleDashboardConfig = {
  role: StaffRole;
  /** What this role calls the people it sees: "patient" or "resident". */
  personNoun: string;
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
  /** Header shortcut beside "Open queue"; phones reach these screens from the bottom navigation. */
  secondaryAction?: { label: string; icon: keyof typeof Feather.glyphMap; route: string };
  inventoryRoute?: string;
};

export const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;

export const byKey = (breakdown: ServiceBreakdownEntry[], key: string) =>
  breakdown.find((entry) => entry.key === key)?.today ?? 0;

export const progressCaption = (summary: StaffSummary) =>
  `${summary.completedToday} seen, ${summary.waiting} waiting`;

/** Seen out of everyone on today's list, for the progress bar on the "today" card. */
export const todayProgress = (data: StaffDashboardData): MetricProgress | undefined =>
  data.summary.today > 0 ? { value: data.summary.completedToday, total: data.summary.today } : undefined;
