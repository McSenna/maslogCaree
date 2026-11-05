// Import-free at runtime, so `node --test` can load it.
import type { MedicalRecord } from "../../../services/medicalRecordTypes";
import type { VaccinationScope } from "./vaccinationTypes";

export const IMMUNIZATION_SERVICE = "immunization";

type ServiceTagged = Pick<MedicalRecord, "serviceType">;

export const isImmunizationRecord = (record: ServiceTagged | null | undefined): boolean =>
  record?.serviceType === IMMUNIZATION_SERVICE;

export const babyIdOf = (record: Pick<MedicalRecord, "immunizationBabyId">): string | null => {
  const baby = record.immunizationBabyId;
  if (!baby) return null;
  return typeof baby === "string" ? baby : baby._id;
};

export const scopeOf = (record: Pick<MedicalRecord, "immunizationBabyId" | "serviceDetails">): VaccinationScope => {
  if (babyIdOf(record)) return "ledger";
  return record.serviceDetails?.ledgerSummary ? "ledger_visit" : "single_visit";
};

/** The server allows only these two roles to read a baby's dose ledger; everyone else gets a 403. */
export const isLedgerVisit = (record: Pick<MedicalRecord, "immunizationBabyId" | "serviceDetails">): boolean =>
  scopeOf(record) === "ledger_visit";

// Written by the server on every dose save, so this wording is the whole of what it generates.
const GENERATED_PROGRESS = /^Routine immunization checklist: \d+ of \d+ doses documented as administered\.$/;

/**
 * A baby's progress count is not a clinical finding, and the record's summary already shows it.
 * Anything a clinician wrote stays, and other records are returned untouched.
 */
export const withoutGeneratedProgress = <T extends Pick<MedicalRecord, "immunizationBabyId" | "assessment">>(record: T): T =>
  babyIdOf(record) && GENERATED_PROGRESS.test(record.assessment?.trim() ?? "") ? { ...record, assessment: "" } : record;

export const mayReadDoseLedger = (role: string | null | undefined): boolean => role === "midwife" || role === "resident";
