import type { RescheduleOptionsResponse } from "@/types/appointments.types";

import { missionDayChoices, weeklyDayChoices, type DayChoice } from "../components/reschedule/dayChoices";

type Options = Pick<RescheduleOptionsResponse, "schedules" | "days" | "scheduling" | "assignsEarliestSlot">;

export const isSameInstant = (a: string | null | undefined, b: string | null | undefined): boolean =>
  a != null && b != null && new Date(a).getTime() === new Date(b).getTime();

/** The first day with room, so a date is already chosen when the dialog opens. */
export const firstBookableId = (choices: DayChoice[]): string | null =>
  (choices.find((choice) => choice.openCount > 0) ?? choices[0])?.id ?? null;

/** Mission dates for mission services; a weekly service's own days for immunization. */
export const dayChoicesOf = (options: Options): DayChoice[] =>
  options.scheduling === "weekly" ? weeklyDayChoices(options.days ?? []) : missionDayChoices(options.schedules ?? []);

/**
 * The time the move would get. A weekly or first-slot service shows the first
 * open start of the chosen day (the server assigns it on save); others use the
 * start the resident tapped.
 */
export const chosenStartOf = (options: Options, dayId: string | null, tapped: string | null): string | null => {
  if (!dayId) return null;
  if (options.scheduling === "weekly") return options.days?.find((day) => day.dateKey === dayId)?.nextStart ?? null;
  const schedule = options.schedules.find((row) => row.missionScheduleId === dayId);
  return options.assignsEarliestSlot ? (schedule?.availableSlotStarts[0] ?? null) : tapped;
};

/** What the server needs: only the day for a weekly service, the mission and start otherwise. */
export const rescheduleBodyOf = (options: Options, dayId: string, start: string) =>
  options.scheduling === "weekly" ? { appointmentDate: dayId } : { missionScheduleId: dayId, slotStart: start };
