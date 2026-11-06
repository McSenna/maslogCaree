import type { AppointmentRecord } from "@/types/appointments.types";

import { parseDate } from "./parseDate.ts";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_SHOWN = 6;

// A cancelled or declined request never became a visit, so the "My visits"
// chart leaves it out. Everything else is a visit held, under way or planned.
const NOT_A_VISIT: ReadonlySet<AppointmentRecord["status"]> = new Set(["cancelled", "declined"]);

export type MonthlyVisitBar = { label: string; value: number; color: string };

type VisitRow = Pick<AppointmentRecord, "status" | "slotStart" | "createdAt">;

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

/** Visits per month for the last six months, oldest first, ending with the current month. */
export const monthlyVisitBars = (
  appointments: VisitRow[],
  chartColor: string,
  now: Date = new Date()
): MonthlyVisitBar[] => {
  const counts = new Map<string, number>();
  for (const appointment of appointments) {
    if (NOT_A_VISIT.has(appointment.status)) continue;
    const at = parseDate(appointment.slotStart) ?? parseDate(appointment.createdAt);
    if (!at) continue;
    counts.set(monthKey(at), (counts.get(monthKey(at)) ?? 0) + 1);
  }

  return Array.from({ length: MONTHS_SHOWN }, (_, index) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (MONTHS_SHOWN - 1) + index, 1);
    return { label: MONTH_LABELS[month.getMonth()], value: counts.get(monthKey(month)) ?? 0, color: chartColor };
  });
};
