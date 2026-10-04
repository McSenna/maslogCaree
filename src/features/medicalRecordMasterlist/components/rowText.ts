import { formatCalendarDay, recordReference, ROLE_LABELS, SOURCE_LABELS } from "../masterlistLabels";
import type { MasterlistRow } from "../types";

export const residentNameOf = (row: MasterlistRow) =>
  row.resident.fullName || (row.resident.missing ? "Removed master list record" : "Name not recorded");

/** Reference and birth date: enough to tell two people with one name apart. */
export const residentLineOf = (row: MasterlistRow) =>
  [recordReference(row._id), row.resident.dateOfBirth ? `Born ${formatCalendarDay(row.resident.dateOfBirth)}` : ""]
    .filter(Boolean)
    .join(", ");

export const providerOf = (row: MasterlistRow) => {
  const role = row.providerRole ? ROLE_LABELS[row.providerRole] : "";
  if (row.providerName && role) return `${row.providerName} (${role})`;
  return row.providerName || role || "Provider not recorded";
};

export const serviceLineOf = (row: MasterlistRow) => `${providerOf(row)}, ${SOURCE_LABELS[row.source].toLowerCase()}`;
