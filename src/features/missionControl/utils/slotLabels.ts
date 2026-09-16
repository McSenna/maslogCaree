import type { AppointmentRecord, MissionScheduleRecord } from "@/services/appointments";
import { toMinutesOfDay } from "./dateTime";

export const formatSlotLabel = (iso: string): string => {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatPriorityTier = (tier: number | undefined): string => {
  const labels: Record<number, string> = {
    0: "P0 (0–1: Critical)",
    1: "P1 (60+: Elderly)",
    2: "P2 (2–12: Children)",
    3: "P3 (13–17: Teenagers)",
    4: "P4 (18–59: Adults)",
  };
  return tier == null ? "—" : labels[tier] ?? "—";
};

export const formatMissionHours = (mission: MissionScheduleRecord): string => {
  const morning = `${mission.morningStart}–${mission.morningEnd}`;
  const afternoonStart = toMinutesOfDay(mission.afternoonStart);
  const afternoonEnd = toMinutesOfDay(mission.afternoonEnd);
  const hasAfternoon =
    Number.isFinite(afternoonStart) &&
    Number.isFinite(afternoonEnd) &&
    afternoonEnd > afternoonStart;

  return hasAfternoon
    ? `${morning} · ${mission.afternoonStart}–${mission.afternoonEnd}`
    : morning;
};

export const sortMissionTimeline = (appointments: AppointmentRecord[]): AppointmentRecord[] => {
  return [...appointments].sort((a, b) => {
    const left = a.slotStart ? new Date(a.slotStart).getTime() : 0;
    const right = b.slotStart ? new Date(b.slotStart).getTime() : 0;
    return left - right;
  });
};
