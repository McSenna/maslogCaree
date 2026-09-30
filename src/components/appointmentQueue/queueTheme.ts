import { useMemo } from "react";
import type { Feather } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { AppointmentRecord } from "@/services/appointments";
import { getStatusLabel } from "@/components/status/appointmentStatusModel";
import { PALETTE } from "@/theme/palette";

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

export type StatTone = "blue" | "green" | "purple" | "amber";

export type StatCardSpec = {
  key: string;
  label: string;
  tone: StatTone;
  icon: keyof typeof Feather.glyphMap;
  caption: string;
};

export const STAT_CARDS: StatCardSpec[] = [
  { key: "today", label: "Today's Appointments", tone: "blue", icon: "calendar", caption: "booked for today" },
  { key: "pending", label: "Pending Requests", tone: "amber", icon: "clock", caption: "awaiting a slot" },
  { key: "upcoming", label: "Upcoming", tone: "green", icon: "trending-up", caption: "scheduled ahead" },
  { key: "declined", label: "Declined", tone: "purple", icon: "x-circle", caption: "not scheduled" },
];

export const useQueuePalette = () => {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === "dark";
    const base = getAdminDashboardPalette(resolvedTheme);

    return {
      isDark,
      pageBg: base.pageBg,
      rowHover: isDark ? "#0B1220" : PALETTE.blue[50],
      panelBg: base.cardBg,
      panelBorder: base.cardBorder,
      divider: base.divider,
      heading: base.heading,
      body: base.body,
      muted: base.muted,
      subtle: base.subtle,
      primary: base.primary,
      primarySoft: isDark ? "rgba(21,101,216,0.18)" : PALETTE.blue[50],
      tones: {
        blue: { bg: isDark ? "rgba(21,101,216,0.18)" : PALETTE.blue[50], fg: isDark ? PALETTE.blue[300] : PALETTE.blue[600] },
        green: { bg: isDark ? "rgba(19,147,132,0.16)" : PALETTE.teal[50], fg: isDark ? PALETTE.teal[300] : PALETTE.teal[600] },
        purple: { bg: isDark ? "rgba(139,92,246,0.16)" : "#F1ECFF", fg: isDark ? "#C4B5FD" : "#8B5CF6" },
        amber: { bg: isDark ? "rgba(245,158,11,0.14)" : "#FFF4E0", fg: isDark ? "#FCD34D" : "#F59E0B" },
      } as Record<StatTone, { bg: string; fg: string }>,
      statuses: {
        pending: { bg: isDark ? "rgba(245,158,11,0.16)" : "#FFF4E0", fg: isDark ? "#FCD34D" : "#B45309", dot: "#F59E0B" },
        confirmed: { bg: isDark ? "rgba(16,185,129,0.14)" : "#E7F8F0", fg: isDark ? "#6EE7B7" : "#047857", dot: "#10B981" },
        rescheduled: { bg: isDark ? "rgba(37,99,235,0.16)" : "#EAF2FF", fg: isDark ? "#93C5FD" : PALETTE.blue[700], dot: PALETTE.blue[600] },
        declined: { bg: isDark ? "rgba(239,68,68,0.14)" : "#FEF1F1", fg: isDark ? "#FCA5A5" : "#B91C1C", dot: "#EF4444" },
        processing: { bg: isDark ? "rgba(139,92,246,0.16)" : "#F1ECFF", fg: isDark ? "#C4B5FD" : "#6D28D9", dot: "#8B5CF6" },
        completed: { bg: isDark ? "rgba(16,185,129,0.14)" : "#E7F8F0", fg: isDark ? "#6EE7B7" : "#047857", dot: "#10B981" },
        cancelled: { bg: isDark ? "rgba(100,116,139,0.18)" : "#F1F5F9", fg: isDark ? "#CBD5E1" : "#475569", dot: "#64748B" },
      } satisfies Record<AppointmentStatus, { bg: string; fg: string; dot: string }>,
      skeleton: isDark ? "#1E293B" : "#EDF2F9",
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
