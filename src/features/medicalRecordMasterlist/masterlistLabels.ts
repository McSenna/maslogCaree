// Import-free (types only) so `node --test` can load it.
import type { EncodableSource, Linkage, MasterlistCriteria, MasterlistSource, StaffRole } from "./types";

export const SOURCE_LABELS: Record<MasterlistSource, string> = {
  appointment: "Appointment",
  historical_masterlist: "Historical record",
  walk_in: "Walk-in",
  medical_mission: "Medical mission",
  manual_entry: "Manual entry",
};

export const ENCODABLE_SOURCES: readonly EncodableSource[] = [
  "historical_masterlist",
  "walk_in",
  "medical_mission",
  "manual_entry",
];

export const ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Admin",
  doctor: "Doctor",
  midwife: "Midwife",
  bhw: "BHW",
};

type PillSpec = { label: string; icon: "link" | "help-circle" | "minus-circle"; tone: "success" | "warning" | "neutral" };

// Colour, icon and words together, never colour alone.
export const LINKAGE_PILLS: Record<Linkage, PillSpec> = {
  linked: { label: "Linked", icon: "link", tone: "success" },
  pending_review: { label: "Needs review", icon: "help-circle", tone: "warning" },
  unlinked: { label: "No account", icon: "minus-circle", tone: "neutral" },
};

export const LINKAGE_DESCRIPTIONS: Record<Linkage, string> = {
  linked: "Shown in this resident's account.",
  pending_review: "A sign-up may be this person. An admin decides in User Requests.",
  unlinked: "Not linked to an account. It will appear once this resident's account is linked.",
};

export const EMPTY_CRITERIA: MasterlistCriteria = {
  search: "",
  serviceType: "",
  source: "",
  linkage: "",
  from: "",
  to: "",
  masterResidentId: "",
};

export type MasterlistCardKey = "total" | "linked" | "unlinked" | "pending_review";

// Each summary card opens the list its count came from (the server shares the filter).
export const CARD_CRITERIA: Record<MasterlistCardKey, Partial<MasterlistCriteria>> = {
  total: {},
  linked: { linkage: "linked" },
  unlinked: { linkage: "unlinked" },
  pending_review: { linkage: "pending_review" },
};

export const selectedCard = (criteria: MasterlistCriteria): MasterlistCardKey | null => {
  const narrowed = criteria.search || criteria.serviceType || criteria.source || criteria.from || criteria.to || criteria.masterResidentId;
  if (narrowed) return null;
  if (!criteria.linkage) return "total";
  return criteria.linkage;
};

export const recordReference = (id: string): string => `REC-${id.slice(-8).toUpperCase()}`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Mar 15, 2024" from a YYYY-MM-DD or ISO date, read as a calendar day (no timezone shift). */
export const formatCalendarDay = (value: string | null | undefined): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value ?? ""));
  if (!match) return "Not recorded";
  return `${MONTHS[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`;
};

/** Encoded visits are calendar days; appointment records keep the local day they were completed. */
export const formatVisitDate = (source: MasterlistSource, value: string): string => {
  if (source !== "appointment") return formatCalendarDay(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
