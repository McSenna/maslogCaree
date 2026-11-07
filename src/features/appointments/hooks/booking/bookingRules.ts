/**
 * Booking decisions with no React or app imports, so `node --test` can load them.
 * The server re-checks all of these; they only give the resident early feedback.
 */
import type { BookingErrors } from "./bookingTypes.ts";

type DayLike = { dateKey: string; openPositions: number };

export type BookingFailure = "slot_unavailable" | "duplicate" | "connection" | "other";

type FailureLike = { code?: string; status?: number; isNetworkError?: boolean; isTimeoutError?: boolean };

type QueuedBookingInput = {
  serviceType: string | null;
  reason: string;
  confirmed: boolean;
};

/** A queued doctor service (general checkup, consultation): no date or time, the queue assigns them. */
export const validateQueuedBooking = (input: QueuedBookingInput): BookingErrors => {
  const errors: BookingErrors = {};
  if (!input.serviceType) errors.serviceType = "Choose the service you need.";
  if (!input.reason.trim()) errors.reason = "Describe your reason for the visit or your symptoms.";
  if (!input.confirmed) errors.confirmed = "Confirm that your appointment details are correct.";
  return errors;
};

type RegularBookingInput = {
  serviceType: string | null;
  dateKey: string | null;
  slotStart: string | null;
  reason: string;
  confirmed: boolean;
};

/** BP checking and prenatal: a date and an open time from their own schedule, then the reason. */
export const validateRegularBooking = (input: RegularBookingInput): BookingErrors => {
  const errors: BookingErrors = {};
  if (!input.serviceType) errors.serviceType = "Choose the service you need.";
  if (!input.dateKey) errors.slot = "Choose a date with open times.";
  else if (!input.slotStart) errors.slot = "Choose an open time on that date.";
  if (!input.reason.trim()) errors.reason = "Describe your reason for the visit or your symptoms.";
  if (!input.confirmed) errors.confirmed = "Confirm that your appointment details are correct.";
  return errors;
};

/** One key per booking attempt; the server returns the first booking for a repeated key. */
export const createBookingRequestKey = (): string =>
  `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

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

/** A queued request holds no time, so nothing it is refused for means "pick another time". */
export const classifyQueuedFailure = (failure: FailureLike): BookingFailure => {
  if (failure.code === "SLOT_UNAVAILABLE" || failure.code === "VALIDATION_ERROR") return "other";
  return classifyBookingFailure(failure);
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

/** Anything the resident chose or typed, which closing the form would lose. */
export const hasBookingInput = (draft: {
  serviceType: string | null;
  slotStart: string | null;
  dateKey: string | null;
  reason: string;
  notes: string;
  childName: string;
  childDob: string;
  confirmed: boolean;
}): boolean =>
  Boolean(
    draft.serviceType ||
      draft.slotStart ||
      draft.dateKey ||
      draft.reason.trim() ||
      draft.notes.trim() ||
      draft.childName.trim() ||
      draft.childDob.trim() ||
      draft.confirmed
  );
