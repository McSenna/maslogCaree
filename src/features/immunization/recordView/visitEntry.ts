// Import-free at runtime except sibling pure modules, so `node --test` can load it.
import { describeFieldValue, hasValue } from "../../../components/medicalRecord/complete/describeValue.ts";
import { formatCalendarDay } from "../../medicalRecordMasterlist/masterlistLabels.ts";
import type { CompletionForm, MedicalRecord } from "../../../services/medicalRecordTypes";
import type { VaccinationEntry, VaccinationField } from "./vaccinationTypes";

type Slot = { key: string; label: string; date?: boolean; long?: boolean };

// Labels match the server's form; the form's own label wins when the form loaded.
const VACCINE_FIELDS: readonly Slot[] = [
  { key: "vaccineType", label: "Vaccine type" },
  { key: "dose", label: "Dose amount" },
  { key: "batchNumber", label: "Batch / lot number" },
  { key: "expiryDate", label: "Expiration date", date: true },
  { key: "route", label: "Route of administration" },
  { key: "administrationSite", label: "Administration site" },
  { key: "nextDoseDate", label: "Next immunisation schedule", date: true },
  { key: "observations", label: "Observation / reaction", long: true },
  { key: "adverseReaction", label: "Adverse reaction", long: true },
];

// Shown in the entry's heading rather than as fields.
const HEADING_KEYS = ["vaccineName", "doseNumber", "administrationDate"];
const NOT_ENTRY_KEYS = new Set(["ledgerSummary"]);

const providerOf = (record: MedicalRecord): string => {
  const account = typeof record.provider === "object" ? record.provider?.fullname : "";
  return account || record.providerName || "Not recorded";
};

/** The vaccine this record holds in its own fields. No vaccine fields means no entry, never a guess. */
export const entriesFromVisitRecord = (record: MedicalRecord, form: CompletionForm | null): VaccinationEntry[] => {
  const details = record.serviceDetails ?? {};
  const known = new Set([...HEADING_KEYS, ...VACCINE_FIELDS.map((slot) => slot.key)]);
  if (![...known].some((key) => hasValue(details[key]))) return [];

  const fieldOf = (key: string) => form?.service.find((field) => field.key === key);
  const fields: VaccinationField[] = VACCINE_FIELDS.map((slot) => ({
    // "Dose" alone reads as the dose number here, which the heading already gives.
    label: slot.key === "dose" ? slot.label : (fieldOf(slot.key)?.label ?? slot.label),
    value: slot.date ? formatCalendarDay(String(details[slot.key] ?? "")) : describeFieldValue(fieldOf(slot.key), details[slot.key]),
    long: slot.long,
  }));
  fields.unshift({ label: "Provider", value: providerOf(record) });
  for (const key of Object.keys(details)) {
    if (known.has(key) || NOT_ENTRY_KEYS.has(key) || !hasValue(details[key])) continue;
    fields.push({ label: fieldOf(key)?.label ?? key, value: describeFieldValue(fieldOf(key), details[key]) });
  }

  const administered = hasValue(details.vaccineName) || hasValue(details.administrationDate);
  const nextDose = String(details.nextDoseDate ?? "");
  return [{
    id: record._id,
    vaccineName: hasValue(details.vaccineName) ? String(details.vaccineName) : "Vaccine not recorded",
    doseLabel: hasValue(details.doseNumber) ? `Dose ${details.doseNumber}` : "Dose not recorded",
    status: administered ? "administered" : "review",
    statusLabel: administered ? "Administered" : "Requires review",
    administered,
    dateLabel: administered ? formatCalendarDay(String(details.administrationDate ?? "")) : "Not administered",
    nextDose: nextDose ? formatCalendarDay(nextDose) : "Not recorded",
    fields,
    note: administered ? undefined : "This record has no vaccine name. A midwife needs to review it.",
  }];
};
