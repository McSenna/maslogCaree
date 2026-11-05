/**
 * When the form validates and what it compares against. Import-free (type
 * imports are erased) so `node --test` can load it.
 */
import type {
  AnnouncementFormErrors,
  AnnouncementFormField,
  AnnouncementFormValues,
} from "./announcement.types.ts";
import { type AnnouncementBaseline, validateAnnouncementForm } from "./announcementRules.ts";

// The order fields appear in the dialog, so focus lands on the first problem a reader meets.
const FIELD_ORDER: AnnouncementFormField[] = ["title", "message", "location", "audience", "date", "time", "endDate", "isDraft"];

export const firstInvalidField = (errors: AnnouncementFormErrors): AnnouncementFormField | null =>
  FIELD_ORDER.find((field) => errors[field]) ?? null;

export const hasUnsavedChanges = (values: AnnouncementFormValues, initial: AnnouncementFormValues): boolean =>
  (Object.keys(initial) as AnnouncementFormField[]).some((field) => values[field] !== initial[field]);

// A new date can invalidate a time or an end date that was fine a moment ago.
const FIELDS_AFFECTED: Partial<Record<AnnouncementFormField, AnnouncementFormField[]>> = {
  date: ["time", "endDate"],
};

/** Rechecks the field that was left, keeping every other field's current error. */
export const errorsAfterBlur = (
  field: AnnouncementFormField,
  values: AnnouncementFormValues,
  current: AnnouncementFormErrors,
  now: Date = new Date(),
  baseline: AnnouncementBaseline | null = null
): AnnouncementFormErrors => {
  const fresh = validateAnnouncementForm(values, now, baseline);
  const next = { ...current };
  // An empty field the person has not reached yet is not a mistake.
  const affected = (FIELDS_AFFECTED[field] ?? []).filter((other) => values[other]);
  for (const name of [field, ...affected]) {
    if (fresh[name]) next[name] = fresh[name];
    else delete next[name];
  }
  return next;
};
