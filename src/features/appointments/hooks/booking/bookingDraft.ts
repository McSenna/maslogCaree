import {
  classifyBookingFailure,
  classifyQueuedFailure,
  classifyWeeklyFailure,
  validateQueuedBooking,
  validateRegularBooking,
  type BookingFailure,
} from "./bookingRules";
import type { BookingErrors } from "./bookingTypes";
import { validateWeeklyBooking } from "./childDetailsRules";

export type BookingDraft = {
  serviceType: string | null;
  weekly: boolean;
  /** BP checking and prenatal: the resident picks a date and time on their own schedule. */
  regular: boolean;
  slotStart: string | null;
  dateKey: string | null;
  reason: string;
  notes: string;
  childName: string;
  childDob: string;
  confirmed: boolean;
};

type FailureLike = Parameters<typeof classifyBookingFailure>[0];

// Every service that is neither weekly nor regular is a queued doctor service
// (general checkup, consultation): requested now, given a time by the queue.
const isQueuedDraft = (draft: BookingDraft): boolean => !draft.regular && !draft.weekly;

export const validateDraft = (draft: BookingDraft): BookingErrors => {
  if (draft.regular) return validateRegularBooking(draft);
  return draft.weekly ? validateWeeklyBooking(draft) : validateQueuedBooking(draft);
};

export const classifyDraftFailure = (draft: BookingDraft, failure: FailureLike): BookingFailure => {
  if (draft.weekly) return classifyWeeklyFailure(failure);
  return isQueuedDraft(draft) ? classifyQueuedFailure(failure) : classifyBookingFailure(failure);
};

/**
 * What is sent: BP checking and prenatal carry the chosen date and start with
 * the reason; a weekly service (immunization) carries the child and the day
 * only; a queued doctor service carries the reason and notes and never a time.
 */
export const draftBody = (draft: BookingDraft, requestKey: string) => {
  const consultationType = draft.serviceType as string;
  if (draft.regular) {
    return {
      consultationType,
      description: draft.reason.trim(),
      additionalNotes: draft.notes.trim(),
      appointmentDate: draft.dateKey as string,
      slotStart: draft.slotStart as string,
      requestKey,
    };
  }
  if (draft.weekly) {
    return {
      consultationType,
      childName: draft.childName.trim().replace(/\s+/g, " "),
      childDateOfBirth: draft.childDob,
      appointmentDate: draft.dateKey as string,
      requestKey,
    };
  }
  return { consultationType, description: draft.reason.trim(), additionalNotes: draft.notes.trim(), requestKey };
};
