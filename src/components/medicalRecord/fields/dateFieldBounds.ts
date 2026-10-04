// Import-free so `node --test` can load it.
import type { DateBounds } from "../../../features/auth/components/datePicker/calendarBounds.ts";
import { todayIso } from "../../../features/auth/components/datePicker/calendarBounds.ts";
import type { MedicalField } from "../../../services/medicalRecordTypes.ts";

/**
 * Days a medical date field may take. "past": today or earlier (a dose given).
 * "after_visit": the visit day or later (a follow-up), where the visit day is
 * the record's own date, or today for a visit being completed now.
 */
export const boundsForField = (field: Pick<MedicalField, "when">, visitDay: string | null, now: Date = new Date()): DateBounds => {
  if (field.when === "past") return { min: null, max: todayIso(now) };
  if (field.when === "after_visit") return { min: visitDay || todayIso(now), max: null };
  return { min: null, max: null };
};

/** The month a picker opens on when the field is still empty. */
export const openingMonth = (bounds: DateBounds, now: Date = new Date()) => {
  const start = bounds.min && bounds.min > todayIso(now) ? bounds.min : todayIso(now);
  return { year: Number(start.slice(0, 4)), monthIndex: Number(start.slice(5, 7)) - 1 };
};
