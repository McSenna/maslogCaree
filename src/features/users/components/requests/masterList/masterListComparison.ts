// Side-by-side comparison of a registration and a master list record.
// Import-free on purpose so `node --test` can load it.
import type {
  MasterListReason,
  MasterListReview,
  MasterResidentRecord,
  UserRequestResident,
} from "../../../services/userRequestTypes";

type ComparisonKey = "name" | "dateOfBirth" | "sex" | "address";

const ROW_REASONS: Record<ComparisonKey, MasterListReason[]> = {
  name: ["name_spelling_differs", "middle_name_missing", "middle_name_differs", "suffix_differs"],
  dateOfBirth: ["dob_differs"],
  sex: ["sex_differs"],
  address: ["address_missing", "address_differs"],
};

export type ComparisonRow = {
  key: ComparisonKey;
  label: string;
  submitted: string;
  record: string;
  differs: boolean;
};

const EMPTY = "Not given";

const joinName = (...parts: (string | undefined)[]) =>
  parts.map((part) => (part ?? "").trim()).filter(Boolean).join(" ");

const capitalize = (value?: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";

// Birth dates are calendar days, so they are read and shown in UTC to keep a
// device timezone from moving them by a day.
export const formatCalendarDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value.length === 10 ? `${value}T00:00:00.000Z` : value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

const submittedAddress = (resident: UserRequestResident) =>
  [resident.addressDetails?.houseNumberOrPurok, resident.addressDetails?.street]
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join(", ") || resident.address;

export const recordFullName = (record: MasterResidentRecord) =>
  joinName(record.firstName, record.middleName, record.lastName, record.suffix);

// Flags only apply when the check compared against exactly this one record.
export const buildComparisonRows = (
  resident: UserRequestResident,
  record: MasterResidentRecord,
  reasons: MasterListReason[] = []
): ComparisonRow[] => {
  const rows: Omit<ComparisonRow, "differs">[] = [
    {
      key: "name",
      label: "Name",
      submitted: joinName(resident.firstName, resident.middleName, resident.surname, resident.suffix) || resident.fullname,
      record: recordFullName(record),
    },
    {
      key: "dateOfBirth",
      label: "Birth date",
      submitted: formatCalendarDate(resident.dateOfBirth),
      record: formatCalendarDate(record.dateOfBirth),
    },
    { key: "sex", label: "Sex", submitted: capitalize(resident.gender), record: capitalize(record.sex) },
    { key: "address", label: "Purok and street", submitted: submittedAddress(resident), record: record.address ?? "" },
  ];

  return rows.map((row) => ({
    ...row,
    submitted: row.submitted || EMPTY,
    record: row.record || EMPTY,
    differs: ROW_REASONS[row.key].some((reason) => reasons.includes(reason)),
  }));
};

/** Shown on a pending request when approving would link the matched record. */
export const approvalLinkNote = (review: MasterListReview | null | undefined, isPending: boolean) => {
  if (!isPending || !review || review.verificationMethod === "master_list") return null;
  if (review.outcome !== "matched" || review.candidates.length !== 1) return null;
  return `Approving links this account to record ${review.candidates[0].masterResidentId}.`;
};
