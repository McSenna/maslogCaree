// Import-free at runtime (types and relative modules), so `node --test` can load it.
import { ROLE_LABELS, SOURCE_LABELS, formatVisitDate } from "../medicalRecordMasterlist/masterlistLabels.ts";
import type { StaffRole } from "../medicalRecordMasterlist/types";
import type { MedicalRecord } from "../../services/medicalRecordTypes";

export type BabyWithoutRecord = { _id: string; name: string; temporaryName: boolean; dateOfBirth: string };
export type ResidentRecordFilters = { service: string; range: string };

const PREVIEW_PREFIX = "baby-";
const NOT_RECORDED = "Not recorded";

/**
 * A registered baby has no record until a first dose is saved. This stands in for
 * one so the mother still gets a row and the schedule. It is never sent to the server.
 */
export const babyPreviewRecord = (baby: BabyWithoutRecord): MedicalRecord => ({
  _id: `${PREVIEW_PREFIX}${baby._id}`,
  serviceType: "immunization",
  immunizationBabyId: { _id: baby._id, name: baby.name, dateOfBirth: baby.dateOfBirth },
  assessment: "",
  completedAt: "",
});

export const isBabyPreview = (record: Pick<MedicalRecord, "_id">): boolean => record._id.startsWith(PREVIEW_PREFIX);

/** These rows have no date, provider or text to match, so any filter but the service leaves them out. */
const showsBabies = (filters: ResidentRecordFilters, search: string): boolean =>
  !search && !filters.range && (!filters.service || filters.service === "immunization");

/** The babies lead the first page: their next step is the soonest thing on it. */
export const rowsForPage = (
  page: number,
  records: MedicalRecord[],
  babies: BabyWithoutRecord[],
  filters: ResidentRecordFilters,
  search: string
): MedicalRecord[] =>
  page === 1 && showsBabies(filters, search) ? [...babies.map(babyPreviewRecord), ...records] : records;

export const totalWithBabies = (
  total: number,
  babies: BabyWithoutRecord[],
  filters: ResidentRecordFilters,
  search: string
): number => total + (showsBabies(filters, search) ? babies.length : 0);

const babyOf = (record: MedicalRecord) =>
  typeof record.immunizationBabyId === "object" ? record.immunizationBabyId : null;

export const babyNameOf = (record: MedicalRecord): string => babyOf(record)?.name ?? "";

const providerOf = (record: MedicalRecord) => {
  const provider = typeof record.provider === "object" ? record.provider : null;
  const roleKey = (provider?.role || record.providerRole || "") as StaffRole;
  return { name: provider?.fullname || record.providerName || "", role: ROLE_LABELS[roleKey] ?? "" };
};

/** For the table, where a role would push the name out of a narrow column. */
export const providerNameOf = (record: MedicalRecord): string => {
  if (isBabyPreview(record)) return NOT_RECORDED;
  const { name, role } = providerOf(record);
  return name || role || NOT_RECORDED;
};

export const providerLineOf = (record: MedicalRecord): string => {
  if (isBabyPreview(record)) return NOT_RECORDED;
  const { name, role } = providerOf(record);
  if (name && role) return `${name} (${role})`;
  return name || role || NOT_RECORDED;
};

export const visitDateOf = (record: MedicalRecord): string => {
  if (isBabyPreview(record)) return "No doses yet";
  return formatVisitDate(record.source ?? "appointment", record.completedAt);
};

export const sourceLabelOf = (record: MedicalRecord): string => SOURCE_LABELS[record.source ?? "appointment"];
