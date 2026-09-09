import { useMemo } from "react";
import type { Feather } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppointmentRecord } from "@/services/appointments";

/** Below this the two content columns stack. */
export const TWO_COLUMN_WIDTH = 1100;
/** Below this the appointments table becomes cards. */
export const TABLE_WIDTH = 820;
/** Below this the four stat cards become a 2 x 2 grid. */
export const FOUR_CARD_WIDTH = 900;

export const QUEUE_RADIUS = { panel: 16, card: 14, control: 12, pill: 999 } as const;

/**
 * The four statuses this system actually stores.
 *
 * Deliberately the schema's own words rather than a friendlier set: the API
 * only ever returns these four, and inventing "Processing" or "Completed" tabs
 * would promise a workflow nothing writes to.
 */
export type AppointmentStatus = AppointmentRecord["status"];

export const STATUS_ORDER: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "rescheduled",
  "declined",
];

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Approved",
  rescheduled: "Rescheduled",
  declined: "Declined",
};

export type StatTone = "blue" | "green" | "purple" | "amber";

export type StatCardSpec = {
  key: string;
  label: string;
  tone: StatTone;
  icon: keyof typeof Feather.glyphMap;
  /** The quiet line under the figure. */
  caption: string;
};

/**
 * The four figures on the header row.
 *
 * Each is countable from the appointment record itself. "Current Queue" and
 * "Completed Today" from the original design are absent on purpose — this
 * system has no queue subsystem and no completed state, and a card showing a
 * number nothing computes is worse than no card.
 */
export const STAT_CARDS: StatCardSpec[] = [
  { key: "today", label: "Today's Appointments", tone: "blue", icon: "calendar", caption: "booked for today" },
  { key: "pending", label: "Pending Requests", tone: "amber", icon: "clock", caption: "awaiting a slot" },
  { key: "upcoming", label: "Upcoming", tone: "green", icon: "trending-up", caption: "scheduled ahead" },
  { key: "declined", label: "Declined", tone: "purple", icon: "x-circle", caption: "not scheduled" },
];

export function useQueuePalette() {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === "dark";

    return {
      isDark,
      pageBg: isDark ? "#020617" : "#F7FAFE",
      panelBg: isDark ? "#0F172A" : "#FFFFFF",
      panelBorder: isDark ? "#1E293B" : "#E4ECF5",
      divider: isDark ? "#1E293B" : "#EEF3FA",
      heading: isDark ? "#F8FAFC" : "#0F2A65",
      body: isDark ? "#CBD5E1" : "#334155",
      muted: isDark ? "#94A3B8" : "#64748B",
      subtle: isDark ? "#64748B" : "#94A3B8",
      primary: isDark ? "#60A5FA" : "#1F7AF8",
      primarySoft: isDark ? "rgba(37,99,235,0.16)" : "#EAF4FF",
      /** Stat-card icon wells. */
      tones: {
        blue: { bg: isDark ? "rgba(37,99,235,0.16)" : "#EAF2FF", fg: isDark ? "#93C5FD" : "#1F7AF8" },
        green: { bg: isDark ? "rgba(16,185,129,0.14)" : "#E7F8F0", fg: isDark ? "#6EE7B7" : "#10B981" },
        purple: { bg: isDark ? "rgba(139,92,246,0.16)" : "#F1ECFF", fg: isDark ? "#C4B5FD" : "#8B5CF6" },
        amber: { bg: isDark ? "rgba(245,158,11,0.14)" : "#FFF4E0", fg: isDark ? "#FCD34D" : "#F59E0B" },
      } as Record<StatTone, { bg: string; fg: string }>,
      /** Status pills — soft fills, never saturated blocks. */
      statuses: {
        pending: { bg: isDark ? "rgba(245,158,11,0.16)" : "#FFF4E0", fg: isDark ? "#FCD34D" : "#B45309", dot: "#F59E0B" },
        confirmed: { bg: isDark ? "rgba(16,185,129,0.14)" : "#E7F8F0", fg: isDark ? "#6EE7B7" : "#047857", dot: "#10B981" },
        rescheduled: { bg: isDark ? "rgba(37,99,235,0.16)" : "#EAF2FF", fg: isDark ? "#93C5FD" : "#1D4ED8", dot: "#1F7AF8" },
        declined: { bg: isDark ? "rgba(239,68,68,0.14)" : "#FEF1F1", fg: isDark ? "#FCA5A5" : "#B91C1C", dot: "#EF4444" },
      } as Record<AppointmentStatus, { bg: string; fg: string; dot: string }>,
      skeleton: isDark ? "#1E293B" : "#EDF2F9",
    };
  }, [resolvedTheme]);
}

export type QueuePalette = ReturnType<typeof useQueuePalette>;

/**
 * "Maria Teresa Dela Cruz" → "MT".
 *
 * The first two given names rather than first-and-surname: Filipino names
 * routinely carry a compound surname ("Dela Cruz"), so taking the last word
 * picks up "Cruz" and two patients in the same family become indistinguishable
 * in the avatar. The forenames separate them.
 */
export function initialsOf(name: string | null | undefined): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  return words
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}
