/**
 * Booking decisions with no React or app imports, so `node --test` can load them.
 * The server re-checks all of these; they only give the resident early feedback.
 */
import type { BookingErrors } from "./bookingTypes.ts";

type BookingInput = {
  serviceType: string | null;
  scheduleId: string | null;
  slotStart: string | null;
  reason: string;
  confirmed: boolean;
};

type ScheduleLike = { missionScheduleId: string; availableSlotStarts: string[] };

type DayLike = { dateKey: string; openPositions: number };

export type BookingSelection = { scheduleId: string | null; slotStart: string | null };

export type BookingFailure = "slot_unavailable" | "duplicate" | "connection" | "other";

type FailureLike = { code?: string; status?: number; isNetworkError?: boolean; isTimeoutError?: boolean };

export const validateBooking = (input: BookingInput): BookingErrors => {
  const errors: BookingErrors = {};
  if (!input.serviceType) errors.serviceType = "Choose the service you need.";
  if (!input.scheduleId || !input.slotStart) errors.slot = "Choose a date and an open time.";
  if (!input.reason.trim()) errors.reason = "Describe your reason for the visit or your symptoms.";
  if (!input.confirmed) errors.confirmed = "Confirm that your appointment details are correct.";
  return errors;
};

/** One key per booking attempt; the server returns the first booking for a repeated key. */
export const createBookingRequestKey = (): string =>
  `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

/** After the open times reload, keep what the resident chose if it is still open. */
export const keepOpenSelection = (
  schedules: ScheduleLike[],
  scheduleId: string | null,
  slotStart: string | null
): BookingSelection => {
  const chosen = schedules.find((schedule) => schedule.missionScheduleId === scheduleId);
  if (chosen && chosen.availableSlotStarts.length > 0) {
    return { scheduleId: chosen.missionScheduleId, slotStart: chosen.availableSlotStarts.includes(slotStart ?? "") ? slotStart : null };
  }
  const firstOpen = schedules.find((schedule) => schedule.availableSlotStarts.length > 0);
  return { scheduleId: firstOpen?.missionScheduleId ?? null, slotStart: null };
};

// A refused time (taken, passed, or off the day's list) always means the list
// the resident saw is out of date, so all of them reload it.
const SLOT_CODES = new Set(["SLOT_UNAVAILABLE", "VALIDATION_ERROR"]);

export const classifyBookingFailure = (failure: FailureLike): BookingFailure => {
  if (failure.code === "DUPLICATE_BOOKING") return "duplicate";
  if (failure.code && SLOT_CODES.has(failure.code)) return "slot_unavailable";
  if (failure.isNetworkError || failure.isTimeoutError) return "connection";
  if (failure.status != null && failure.status >= 500) return "connection";
  return "other";
};

/**
 * A weekly service (immunization) shares VALIDATION_ERROR between child details
 * and the day, so only a full day (SLOT_UNAVAILABLE) counts as a refused time.
 */
export const classifyWeeklyFailure = (failure: FailureLike): BookingFailure => {
  if (failure.code === "SLOT_UNAVAILABLE") return "slot_unavailable";
  return failure.code === "VALIDATION_ERROR" ? "other" : classifyBookingFailure(failure);
};

/** Keeps the chosen day while it still has room; otherwise the earliest day with room (the smart default). */
export const keepOpenDay = (days: DayLike[], dateKey: string | null): string | null => {
  const chosen = days.find((day) => day.dateKey === dateKey);
  if (chosen && chosen.openPositions > 0) return chosen.dateKey;
  return days.find((day) => day.openPositions > 0)?.dateKey ?? null;
};
