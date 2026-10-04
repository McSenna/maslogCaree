// Import-free (types only) so `node --test` can load it.
import type { CompletionForm, MedicalField, MedicalRecordInput } from "@/services/medicalRecordTypes";
import type { FormValues } from "@/components/medicalRecord/form/formValues";

import type { EncodableSource, EncodedRecord, ResidentIdentity, StaffRole } from "./types";

export type VisitValues = {
  visitDate: string;
  source: EncodableSource;
  providerName: string;
  providerRole: StaffRole | "";
  visitReason: string;
};

export const EMPTY_VISIT: VisitValues = {
  visitDate: "",
  source: "historical_masterlist",
  providerName: "",
  providerRole: "",
  visitReason: "",
};

// Visit fields drawn with the same inputs as the medical form.
export const VISIT_FIELDS: MedicalField[] = [
  { key: "visitDate", label: "Visit date", type: "date", required: true, helper: "The date written on the record." },
  {
    key: "source",
    label: "Where the record came from",
    type: "select",
    required: true,
    options: [
      { value: "historical_masterlist", label: "Historical record (paper)" },
      { value: "walk_in", label: "Walk-in" },
      { value: "medical_mission", label: "Medical mission" },
      { value: "manual_entry", label: "Manual entry" },
    ],
  },
  { key: "providerName", label: "Provider name", type: "text", maxLength: 120, helper: "Who gave the care, as written on the record." },
  {
    key: "providerRole",
    label: "Provider role",
    type: "select",
    options: [
      { value: "doctor", label: "Doctor" },
      { value: "midwife", label: "Midwife" },
      { value: "bhw", label: "BHW" },
      { value: "admin", label: "Admin" },
    ],
  },
  { key: "visitReason", label: "Reason for visit", type: "textarea", maxLength: 500 },
];

const CALENDAR_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

const todayKey = (now: Date): string =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

export const validateVisit = (
  visit: VisitValues,
  resident: ResidentIdentity | null,
  now: Date = new Date()
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const day = visit.visitDate.trim();
  const parsed = CALENDAR_DAY.test(day) ? new Date(`${day}T00:00:00.000Z`) : null;
  if (!day) {
    errors.visitDate = "Choose the visit date.";
  } else if (!parsed || Number.isNaN(parsed.getTime()) || !parsed.toISOString().startsWith(day)) {
    errors.visitDate = "That date could not be read. Choose it again from the calendar.";
  } else if (day > todayKey(now)) {
    errors.visitDate = "The visit date must be today or earlier.";
  } else if (resident?.dateOfBirth && day < resident.dateOfBirth) {
    errors.visitDate = "The visit date is before this resident's birth date.";
  }
  if (visit.providerName.length > 120) errors.providerName = "Keep the provider name to 120 characters.";
  if (visit.visitReason.length > 500) errors.visitReason = "Keep the reason to 500 characters.";
  return errors;
};

/** Why the chosen resident cannot be saved yet, or "" when it can. */
export const residentProblem = (resident: ResidentIdentity | null, confirmed: boolean): string => {
  if (!resident) return "Choose the resident this record belongs to.";
  if (!confirmed) return "Confirm that the name and birth date match the paper record.";
  return "";
};

const anyError = (errors: Record<string, string>) => Object.values(errors).some(Boolean);

/** The form sections that still show an error, in the order they appear. */
export const sectionsNeedingFixes = (errors: {
  resident: string;
  visit: Record<string, string>;
  medical: Record<string, string>;
  medicalLabel: string;
  reason: string;
}): string[] =>
  [
    errors.resident ? "Resident" : "",
    errors.visit.visitDate ? "Visit date" : "",
    errors.visit.serviceType ? "Service" : "",
    errors.visit.providerName || errors.visit.visitReason ? "Visit details" : "",
    anyError(errors.medical) ? errors.medicalLabel : "",
    errors.reason ? "Reason for change" : "",
  ].filter(Boolean);

/** Paper records often have readings and no written assessment, so it is optional here. */
export const relaxForEncoding = (form: CompletionForm): CompletionForm => ({
  ...form,
  common: form.common.map((field) => (field.key === "assessment" ? { ...field, required: false } : field)),
});

const hasText = (value: string | undefined) => Boolean(value && value.trim());

export const hasMedicalDetail = (input: MedicalRecordInput): boolean =>
  [input.assessment, input.findings, input.diagnosis, input.recommendations, input.notes].some(hasText) ||
  Object.keys(input.serviceDetails ?? {}).length > 0;

const dayOf = (value: string | null | undefined) => (value ? String(value).slice(0, 10) : "");

/** Form values from a saved record, for editing. */
export const valuesFromRecord = (form: CompletionForm, record: EncodedRecord): FormValues => {
  const values: FormValues = {};
  const details = record.serviceDetails ?? {};
  for (const field of [...form.common, ...form.service, ...form.followUp]) {
    const raw = field.key in details ? details[field.key] : (record as Record<string, unknown>)[field.key];
    if (field.type === "boolean") values[field.key] = raw === true;
    else if (field.type === "date") values[field.key] = dayOf(typeof raw === "string" ? raw : "");
    else values[field.key] = raw === null || raw === undefined ? "" : String(raw);
  }
  return values;
};

export const visitFromRecord = (record: EncodedRecord): VisitValues => ({
  visitDate: dayOf(record.completedAt),
  source: record.source && record.source !== "appointment" ? record.source : "historical_masterlist",
  providerName: record.providerName ?? "",
  providerRole: (record.providerRole as StaffRole | undefined) ?? "",
  visitReason: record.visitReason ?? "",
});

/** One key per saved record, so a double tap or a retry saves it once. */
export const newRequestKey = (random: () => number = Math.random): string =>
  `mr-${Date.now().toString(36)}-${Math.floor(random() * 1e9).toString(36)}`;
