import { useMemo } from "react";
import type { Feather } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getAdminDashboardPalette,
  type AdminDashboardPalette,
  type MetricTone,
  type StatusToneName,
} from "@/design/adminDashboardTheme";
import type { AppointmentRecord } from "@/services/appointments";
import { getStatusLabel, getStatusMeta } from "@/components/status/appointmentStatusModel";
import { PALETTE, withAlpha } from "@/theme/palette";

export const TWO_COLUMN_WIDTH = 1100;
// Window width: below this the sidebar leaves the full-width table too narrow for its seven columns.
export const TABLE_WIDTH = 1100;
export const FOUR_CARD_WIDTH = 900;

export const QUEUE_RADIUS = { panel: 16, card: 14, control: 12, pill: 999 } as const;

export type AppointmentStatus = AppointmentRecord["status"];

export const STATUS_ORDER: AppointmentStatus[] = ["pending", "completed", "declined"];

export const ACTIVE_QUEUE_STATUSES: AppointmentStatus[] = ["confirmed", "rescheduled", "processing"];

const ALL_STATUSES: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "rescheduled",
  "processing",
  "completed",
  "declined",
  "cancelled",
];

export const STATUS_LABELS = Object.fromEntries(
  ALL_STATUSES.map((status) => [status, getStatusLabel(status, "staff")])
) as Record<AppointmentStatus, string>;

export type StatTone = MetricTone;

export type StatCardSpec = {
  key: string;
  label: string;
  tone: StatTone;
  icon: keyof typeof Feather.glyphMap;
  caption: string;
};

export const STAT_CARDS: StatCardSpec[] = [
  { key: "today", label: "Today's Appointments", tone: "primary", icon: "calendar", caption: "booked for today" },
  { key: "pending", label: "Pending Requests", tone: "accent", icon: "clock", caption: "awaiting a slot" },
  { key: "upcoming", label: "Upcoming", tone: "care", icon: "trending-up", caption: "scheduled ahead" },
  { key: "declined", label: "Declined", tone: "danger", icon: "x-circle", caption: "not scheduled" },
];

// Each status reads its tone from the one status model, so badges, rows and
// sheets can never disagree about what colour "pending" is.
const statusStyle = (palette: AdminDashboardPalette, status: AppointmentStatus) => {
  const meta = getStatusMeta(status);
  const tone = palette.statusTones[meta.tone as StatusToneName];
  return { bg: tone.bg, fg: tone.fg, dot: meta.dot };
};

export const useQueuePalette = () => {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === "dark";
    const base = getAdminDashboardPalette(resolvedTheme);

    return {
      isDark,
      pageBg: base.pageBg,
      rowHover: base.hoverBg,
      panelBg: base.cardBg,
      panelBorder: base.cardBorder,
      divider: base.divider,
      heading: base.heading,
      body: base.body,
      muted: base.muted,
      subtle: base.subtle,
      primary: base.primary,
      primarySoft: isDark ? withAlpha(PALETTE.blue[600], 0.18) : PALETTE.blue[50],
      tones: Object.fromEntries(
        Object.entries(base.tones).map(([tone, style]) => [tone, { bg: style.iconBg, fg: style.icon }])
      ) as Record<StatTone, { bg: string; fg: string }>,
      statuses: Object.fromEntries(
        ALL_STATUSES.map((status) => [status, statusStyle(base, status)])
      ) as Record<AppointmentStatus, { bg: string; fg: string; dot: string }>,
      skeleton: base.skeleton,
    };
  }, [resolvedTheme]);
};

export type QueuePalette = ReturnType<typeof useQueuePalette>;

export const initialsOf = (name: string | null | undefined): string => {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  return words
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
};
