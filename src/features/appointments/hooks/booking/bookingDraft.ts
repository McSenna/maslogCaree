import { classifyBookingFailure, classifyWeeklyFailure, validateBooking, type BookingFailure } from "./bookingRules";
import type { BookingErrors } from "./bookingTypes";
import { validateWeeklyBooking } from "./childDetailsRules";

export type BookingDraft = {
  serviceType: string | null;
  weekly: boolean;
  scheduleId: string | null;
  slotStart: string | null;
  dateKey: string | null;
  reason: string;
  notes: string;
  childName: string;
  childDob: string;
  confirmed: boolean;
};

type FailureLike = Parameters<typeof classifyBookingFailure>[0];

export const validateDraft = (draft: BookingDraft): BookingErrors =>
  draft.weekly ? validateWeeklyBooking(draft) : validateBooking(draft);

export const classifyDraftFailure = (draft: BookingDraft, failure: FailureLike): BookingFailure =>
  draft.weekly ? classifyWeeklyFailure(failure) : classifyBookingFailure(failure);

/**
 * What is sent: a weekly service (immunization) carries the child and the day
 * only, never a time, reason or notes; a mission service carries what it always did.
 */
export const draftBody = (draft: BookingDraft, requestKey: string) =>
  draft.weekly
    ? {
        consultationType: draft.serviceType as string,
        childName: draft.childName.trim().replace(/\s+/g, " "),
        childDateOfBirth: draft.childDob,
        appointmentDate: draft.dateKey as string,
        requestKey,
      }
    : {
        consultationType: draft.serviceType as string,
        description: draft.reason.trim(),
        additionalNotes: draft.notes.trim(),
        missionScheduleId: draft.scheduleId as string,
        slotStart: draft.slotStart as string,
        requestKey,
      };

export const isDraftComplete = (draft: BookingDraft): boolean =>
  Object.keys(validateDraft(draft)).length === 0;
