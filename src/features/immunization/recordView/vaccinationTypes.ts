export type VaccinationField = {
  label: string;
  value: string;
  /** Free text that needs the full width: remarks and reactions. */
  long?: boolean;
};

export type VaccinationStatus = "administered" | "deferred" | "review" | "voided" | "draft";

/** One row in Vaccination History and one entry in Vaccination Details: both tabs read this. */
export type VaccinationEntry = {
  id: string;
  vaccineName: string;
  doseLabel: string;
  status: VaccinationStatus;
  statusLabel: string;
  administered: boolean;
  /** The date given, "Not recorded", or a plain statement that it was not given. */
  dateLabel: string;
  nextDose: string;
  fields: VaccinationField[];
  /** Why a dose that is not administered appears in the list. */
  note?: string;
};

/** A labeled run of entries on Vaccination Details. */
export type VaccinationGroup = { title: string; entries: VaccinationEntry[] };

/**
 * ledger: a baby's program record, read from the dose ledger.
 * ledger_visit: a completed visit whose doses stay in the ledger; the server resolves its baby.
 * single_visit: a record that holds its own vaccine fields.
 */
export type VaccinationScope = "ledger" | "ledger_visit" | "single_visit";

export type PersonSummary = {
  title: string;
  rows: { label: string; value: string }[];
  /** Said in place of rows when no person is linked to the record. */
  emptyText?: string;
};

export type VaccinationPeople = { parent: PersonSummary; baby: PersonSummary };
