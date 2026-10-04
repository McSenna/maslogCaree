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
