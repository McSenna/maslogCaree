// Form rules for adding and editing master list records. Import-free so
// `node --test` can load it; the server repeats every check.
import type { MasterResidentInput, MasterResidentRecord } from "./masterList.types.ts";

export type MasterFormField = keyof MasterResidentInput;
export type MasterFormErrors = Partial<Record<MasterFormField, string>>;

export const SEX_CHOICES = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
] as const;

export const CIVIL_STATUS_CHOICES = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
] as const;

// Sex, birth date and civil status start blank: a wrong guess on an official
// record is worse than an empty field. The barangay is the one safe default.
export const emptyMasterForm = (barangay: string): MasterResidentInput => ({
  masterResidentId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  dateOfBirth: "",
  sex: "",
  civilStatus: "",
  barangay,
  address: "",
});

export const formFromRecord = (record: MasterResidentRecord): MasterResidentInput => ({
  masterResidentId: record.masterResidentId,
  firstName: record.firstName,
  middleName: record.middleName,
  lastName: record.lastName,
  suffix: record.suffix,
  dateOfBirth: record.dateOfBirth,
  sex: record.sex,
  civilStatus: record.civilStatus,
  barangay: record.barangay,
  address: record.address,
});

const NAME = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;
const RECORD_ID = /^[A-Za-z0-9-]{3,40}$/;
const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const isPastCalendarDate = (value: string, today: Date) => {
  if (!CALENDAR_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value) && date <= today;
};

const nameError = (value: string, label: string, required: boolean) => {
  const trimmed = value.trim();
  if (!trimmed) return required ? `Enter the ${label}.` : undefined;
  if (trimmed.length > 50) return `Keep the ${label} under 50 characters.`;
  return NAME.test(trimmed) ? undefined : `Use letters, spaces, periods, hyphens or apostrophes in the ${label}.`;
};

export const validateMasterForm = (
  values: MasterResidentInput,
  { isEditing, today = new Date() }: { isEditing: boolean; today?: Date }
): MasterFormErrors => {
  const errors: MasterFormErrors = {
    firstName: nameError(values.firstName, "first name", true),
    middleName: nameError(values.middleName, "middle name", false),
    lastName: nameError(values.lastName, "last name", true),
    suffix: values.suffix.trim().length > 20 ? "Keep the suffix under 20 characters." : undefined,
    dateOfBirth: !values.dateOfBirth.trim()
      ? "Select the birth date from the official record."
      : isPastCalendarDate(values.dateOfBirth.trim(), today)
        ? undefined
        : "Choose a real birth date that is not in the future.",
    sex: values.sex ? undefined : "Choose the sex on the official record.",
    civilStatus: values.civilStatus ? undefined : "Choose the civil status.",
    barangay: values.barangay.trim() ? undefined : "Enter the barangay.",
    address: values.address.trim() ? undefined : "Enter the purok and street.",
  };

  const recordId = (values.masterResidentId ?? "").trim();
  if (!isEditing && recordId && !RECORD_ID.test(recordId)) {
    errors.masterResidentId = "Use 3 to 40 letters, digits or dashes, or leave it blank.";
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => Boolean(message)));
};

/** Trimmed payload; a blank record ID asks the server to generate one. */
export const toMasterInput = (values: MasterResidentInput, isEditing: boolean): MasterResidentInput => {
  const input: MasterResidentInput = {
    firstName: values.firstName.trim(),
    middleName: values.middleName.trim(),
    lastName: values.lastName.trim(),
    suffix: values.suffix.trim(),
    dateOfBirth: values.dateOfBirth.trim(),
    sex: values.sex,
    civilStatus: values.civilStatus,
    barangay: values.barangay.trim(),
    address: values.address.trim(),
  };
  const recordId = (values.masterResidentId ?? "").trim();
  return !isEditing && recordId ? { ...input, masterResidentId: recordId } : input;
};

export const masterFullName = (record: Pick<MasterResidentRecord, "firstName" | "middleName" | "lastName" | "suffix">) =>
  [record.firstName, record.middleName, record.lastName, record.suffix].map((part) => part.trim()).filter(Boolean).join(" ");

export const formatBirthDate = (value: string) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime())
    ? "Not recorded"
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
};

export const capitalize = (value: string) => (value ? `${value[0].toUpperCase()}${value.slice(1)}` : "");

/** "Showing 21 to 40 of 52 records" */
export const recordRangeLine = (page: number, pageSize: number, shown: number, total: number) => {
  if (total === 0) return "No records";
  const from = (page - 1) * pageSize + 1;
  return `Showing ${from} to ${from + shown - 1} of ${total} records`;
};
