/**
 * Turns form values into the submit payload, and that payload into the API's
 * shape. Import-free (type imports are erased) so `node --test` can load it.
 */
import type {
  AnnouncementAudienceKey,
  AnnouncementFormValues,
  AnnouncementSubmitPayload,
  Audience,
  CreateAnnouncementPayload,
} from "./announcement.types.ts";
import { combineDateTime, endOfDateKey } from "./announcementDates.ts";

const AUDIENCE_KEYS: Record<Audience, AnnouncementAudienceKey> = {
  Patients: "patients",
  Staff: "staff",
  Everyone: "everyone",
};

const API_AUDIENCES: Record<AnnouncementAudienceKey, Audience> = {
  patients: "Patients",
  staff: "Staff",
  everyone: "Everyone",
};

/** Call only after validation passes. */
export const toSubmitPayload = (values: AnnouncementFormValues, isDraft: boolean): AnnouncementSubmitPayload => {
  const scheduledAt = combineDateTime(values.date, values.time);
  if (!scheduledAt) throw new Error("toSubmitPayload needs a valid date and time");

  return {
    title: values.title.trim(),
    message: values.message.trim(),
    location: values.location.trim(),
    audience: AUDIENCE_KEYS[values.audience],
    scheduledAt: scheduledAt.toISOString(),
    showUntil: values.endDate || null,
    isDraft,
  };
};

// The API names the event's timestamp `eventAt` and ends a listing at `expiresAt`.
export const toApiPayload = (payload: AnnouncementSubmitPayload): CreateAnnouncementPayload => ({
  title: payload.title,
  message: payload.message,
  location: payload.location,
  audience: API_AUDIENCES[payload.audience],
  eventAt: payload.scheduledAt,
  expiresAt: payload.showUntil ? endOfDateKey(payload.showUntil)?.toISOString() ?? null : null,
  isDraft: payload.isDraft,
});
