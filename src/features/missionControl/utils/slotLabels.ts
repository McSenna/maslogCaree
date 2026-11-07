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
