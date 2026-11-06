import { civilStatusLabel } from "../../../config/civilStatus.ts";
import { formatTableDate } from "../../../utils/dateFormatter.ts";
import type { MasterResidentRecord } from "../masterList.types.ts";
import { capitalize } from "../masterResidentForm.ts";
import { masterRoleLabel } from "../masterResidentRoles.ts";
import type { ResidentDetails, ResidentFieldGroup, ResidentStatus } from "./residentDetails.types.ts";

export const NOT_RECORDED = "Not recorded";

const clean = (value: string | null | undefined) => (value ?? "").trim();

export const toResidentDetails = (record: MasterResidentRecord): ResidentDetails => ({
  id: record._id,
  recordId: clean(record.masterResidentId),
  lastName: clean(record.lastName),
  firstName: clean(record.firstName),
  middleName: clean(record.middleName),
  suffix: clean(record.suffix) || undefined,
  birthDate: clean(record.dateOfBirth),
  sex: clean(record.sex),
  civilStatus: clean(record.civilStatus),
  role: record.role ?? "resident",
  purok: clean(record.address),
  barangay: clean(record.barangay),
  status: record.isActive ? "active" : "inactive",
  appAccount: record.linkedAccount ? "linked" : "not_linked",
  createdAt: record.createdAt ?? null,
  updatedAt: record.updatedAt ?? null,
});

/** Banner name in reading order: "Efren Romero Abaleta Jr.". */
export const residentDisplayName = (details: ResidentDetails) =>
  [details.firstName, details.middleName, details.lastName, details.suffix].filter(Boolean).join(" ") || NOT_RECORDED;

/** "EA" for Efren Abaleta; one letter when only one name is on file. */
export const residentInitials = (details: ResidentDetails) =>
  [details.firstName, details.lastName]
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

/** Every status has its own label and icon, so the pill never relies on colour alone. */
export const RESIDENT_STATUS_META: Record<ResidentStatus, { label: string; tone: "success" | "neutral" }> = {
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
};

const field = (key: string, label: string, value: string) => ({
  key,
  label,
  value: value || NOT_RECORDED,
  recorded: Boolean(value),
});

const date = (value: string | null) => (value ? formatTableDate(value, "") : "");

export const residentFieldGroups = (details: ResidentDetails): ResidentFieldGroup[] => [
  {
    id: "personal",
    title: "Personal information",
    fields: [
      field("lastName", "Last name", details.lastName),
      field("firstName", "First name", details.firstName),
      field("middleName", "Middle name", details.middleName),
      field("suffix", "Suffix", details.suffix ?? ""),
      field("birthDate", "Date of birth", date(details.birthDate)),
      field("sex", "Sex", capitalize(details.sex)),
      field("civilStatus", "Civil status", civilStatusLabel(details.civilStatus)),
    ],
  },
  {
    id: "record",
    title: "Residency / Record details",
    fields: [
      field("recordId", "Record ID", details.recordId),
      field("role", "Role", masterRoleLabel(details.role)),
      field("purok", "Purok", details.purok),
      field("barangay", "Barangay", details.barangay),
      field("status", "Status", RESIDENT_STATUS_META[details.status].label),
      field("appAccount", "App account", details.appAccount === "linked" ? "Linked" : "Not linked"),
    ],
  },
  {
    id: "history",
    title: "Record history",
    fields: [field("createdAt", "Added", date(details.createdAt)), field("updatedAt", "Last updated", date(details.updatedAt))],
  },
];
