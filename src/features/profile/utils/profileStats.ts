import type { AppointmentRecord, QueueOverview } from "@/services/appointments";
import type { ProfileStat } from "../types/profile.types";

const countBy = (
  appointments: AppointmentRecord[],
  match: (status: AppointmentRecord["status"]) => boolean
): number => appointments.filter((item) => match(item.status)).length;

export const buildResidentStats = (appointments: AppointmentRecord[]): ProfileStat[] => [
  { key: "total", label: "Appointments", shortLabel: "Total", value: appointments.length },
  {
    key: "completed",
    label: "Completed",
    shortLabel: "Done",
    value: countBy(appointments, (status) => status === "completed"),
  },
  {
    key: "upcoming",
    label: "Upcoming",
    shortLabel: "Upcoming",
    value: countBy(
      appointments,
      (status) => status === "confirmed" || status === "rescheduled" || status === "processing"
    ),
  },
  {
    key: "cancelled",
    label: "Cancelled",
    shortLabel: "Cancelled",
    value: countBy(appointments, (status) => status === "cancelled"),
  },
];

export const buildStaffStats = (overview: QueueOverview): ProfileStat[] => [
  { key: "today", label: "Today", shortLabel: "Today", value: overview.stats.today },
  { key: "pending", label: "Pending", shortLabel: "Pending", value: overview.stats.pending },
  { key: "upcoming", label: "Upcoming", shortLabel: "Upcoming", value: overview.stats.upcoming },
  { key: "declined", label: "Declined", shortLabel: "Declined", value: overview.stats.declined },
];

/** The words after the number in the header's summary line, e.g. "appointments today". */
const STAT_PHRASES: Record<string, (value: number) => string> = {
  total: (value) => (value === 1 ? "appointment" : "appointments"),
  today: (value) => (value === 1 ? "appointment today" : "appointments today"),
};

export const statPhrase = (stat: ProfileStat): string =>
  STAT_PHRASES[stat.key]?.(stat.value) ?? stat.label.toLowerCase();

/** The header shows a short line of counts, so it keeps the three that say the most. */
export const HEADER_STAT_COUNT = 3;
