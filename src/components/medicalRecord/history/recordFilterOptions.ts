import { SERVICE_TYPES } from "@/config/appointmentServices";

export const RECORD_FILTERS: { key: string; label: string; shortLabel: string }[] = [
  { key: "all", label: "All Records", shortLabel: "All" },
  ...SERVICE_TYPES.map((service) => ({
    key: service.id,
    label: service.label,
    shortLabel: service.label.replace(" Checkup", "").replace(" Checking", ""),
  })),
];

export type DateRangeKey = "any" | "6m" | "12m";

export const DATE_RANGES: { key: DateRangeKey; label: string }[] = [
  { key: "any", label: "Any time" },
  { key: "6m", label: "Last 6 months" },
  { key: "12m", label: "Last 12 months" },
];

export const monthsAgo = (months: number): number => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.getTime();
};
