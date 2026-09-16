import type { ComponentProps } from "react";
import type { Feather } from "@expo/vector-icons";

export type IconName = ComponentProps<typeof Feather>["name"];

export const formatWhen = (appt: { slotStart?: string | null; createdAt?: string }) => {
  const raw = appt.slotStart || appt.createdAt;
  if (!raw) return "Date not set";
  return new Date(raw).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: appt.slotStart ? "numeric" : undefined,
    minute: appt.slotStart ? "2-digit" : undefined,
  });
};

export const STATUS_ICON: Record<string, IconName> = {
  pending: "clock",
  confirmed: "check-circle",
  rescheduled: "rotate-ccw",
  declined: "x-circle",
  processing: "activity",
  completed: "check-circle",
};

export const STATUS_TONE: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", icon: "#D97706" },
  confirmed: { bg: "bg-teal-50", text: "text-teal-700", icon: "#0D9488" },
  rescheduled: { bg: "bg-violet-50", text: "text-violet-700", icon: "#7C3AED" },
  declined: { bg: "bg-rose-50", text: "text-rose-700", icon: "#E11D48" },
  processing: { bg: "bg-violet-50", text: "text-violet-700", icon: "#7C3AED" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "#059669" },
  default: { bg: "bg-slate-100", text: "text-slate-700", icon: "#475569" },
};

export type StatTone = "blue" | "amber" | "teal";

export const STAT_TONE: Record<StatTone, { bg: string; icon: string; value: string }> = {
  blue: { bg: "bg-blue-50", icon: "#2D5BFF", value: "text-blue-600" },
  amber: { bg: "bg-amber-50", icon: "#D97706", value: "text-amber-600" },
  teal: { bg: "bg-teal-50", icon: "#0D9488", value: "text-teal-600" },
};
