import type { AppointmentRecord, MissionScheduleRecord } from "@/services/appointments";
import { toMinutesOfDay } from "./dateTime";

/**
 * A slot start → "Tue, Mar 4, 9:30 AM".
 *
 * Carries the weekday because the slot list spans a whole mission day and the
 * date alone reads as an arbitrary number when a dozen of them are stacked.
 */
export function formatSlotLabel(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * The priority tier the server sorted a pending request into.
 *
 * The tiers are the server's, not this screen's — it labels what it was sent
 * rather than deriving a band from the patient's age, so the queue always
 * reads back the same ordering the API actually applied.
 */
export function formatPriorityTier(tier: number | undefined): string {
  const labels: Record<number, string> = {
    0: "P0 (0–1: Critical)",
    1: "P1 (60+: Elderly)",
    2: "P2 (2–12: Children)",
    3: "P3 (13–17: Teenagers)",
    4: "P4 (18–59: Adults)",
  };
  return tier == null ? "—" : labels[tier] ?? "—";
}

/**
 * A mission's opening hours as one line.
 *
 * The afternoon half is shown only when it parses as a real forward range: a
 * schedule created with morning hours alone still carries afternoon fields,
 * and printing an empty or inverted pair would advertise clinic hours that do
 * not exist.
 */
export function formatMissionHours(mission: MissionScheduleRecord): string {
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
}

/**
 * A mission's booked appointments in slot order.
 *
 * An appointment with no slot sorts to the front, where it is visible as
 * something that still needs a time rather than buried at the end of the day.
 */
export function sortMissionTimeline(appointments: AppointmentRecord[]): AppointmentRecord[] {
  return [...appointments].sort((a, b) => {
    const left = a.slotStart ? new Date(a.slotStart).getTime() : 0;
    const right = b.slotStart ? new Date(b.slotStart).getTime() : 0;
    return left - right;
  });
}
