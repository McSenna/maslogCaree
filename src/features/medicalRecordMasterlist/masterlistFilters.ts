// Import-free (types only) so `node --test` can load it.
import { SOURCE_LABELS } from "./masterlistLabels.ts";
import type { MasterlistCriteria } from "./types";

export const ALL = "all";
type Option = { value: string; label: string };

export const SOURCE_OPTIONS: Option[] = [
  { value: ALL, label: "All sources" },
  ...(Object.keys(SOURCE_LABELS) as (keyof typeof SOURCE_LABELS)[]).map((value) => ({ value, label: SOURCE_LABELS[value] })),
];

export const LINKAGE_OPTIONS: Option[] = [
  { value: ALL, label: "Any account status" },
  { value: "linked", label: "Linked" },
  { value: "pending_review", label: "Needs review" },
  { value: "unlinked", label: "No account" },
];

export const serviceOptions = (services: { key: string; label: string }[]): Option[] => [
  { value: ALL, label: "All services" },
  ...services.map((service) => ({ value: service.key, label: service.label })),
];

const YEARS_BACK = 15;

/** The visit-year filter: this year back fifteen years, which covers the barangay's paper files. */
export const yearOptions = (now: Date = new Date()): Option[] => [
  { value: ALL, label: "Any year" },
  ...Array.from({ length: YEARS_BACK + 1 }, (_, index) => {
    const year = String(now.getFullYear() - index);
    return { value: year, label: year };
  }),
];

export const yearOf = (criteria: MasterlistCriteria): string =>
  criteria.from && criteria.from.slice(0, 4) === criteria.to.slice(0, 4) ? criteria.from.slice(0, 4) : ALL;

export const yearRange = (year: string): Pick<MasterlistCriteria, "from" | "to"> =>
  year === ALL ? { from: "", to: "" } : { from: `${year}-01-01`, to: `${year}-12-31` };

export const fromOption = (value: string): string => (value === ALL ? "" : value);
export const toOption = (value: string): string => value || ALL;
