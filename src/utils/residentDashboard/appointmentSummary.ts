import type { AppointmentRecord } from "@/services/appointments";

import { parseDate } from "./dashboardFormatters";


export type ResidentDashboardSummary = {
  pendingCount: number;
  recordsCount: number;
  nextAppointment: AppointmentRecord | null;
  pastAppointments: AppointmentRecord[];
  monthlyBars: { label: string; value: number; color: string }[];
  totalVisits: number;
  thisMonthCount: number;
  lastMonthCount: number;
};

export const summarizeResidentAppointments = (
  appointments: AppointmentRecord[],
  chartColor: string
): ResidentDashboardSummary => {
  const now = new Date();
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const recordsCount = appointments.length;

  const upcoming = appointments
    .filter(
      (a) =>
        (a.status === "confirmed" || a.status === "rescheduled") && Boolean(a.slotStart)
    )
    .map((a) => ({ a, t: parseDate(a.slotStart)! }))
    .filter(({ t }) => t >= now)
    .sort((x, y) => x.t.getTime() - y.t.getTime());
  const nextAppointment = upcoming[0]?.a ?? null;

  const pastAppointments = appointments
    .filter((a) => {
      if (a.status === "declined") return true;
      if (a.status !== "confirmed" && a.status !== "rescheduled") return false;
      const t = parseDate(a.slotStart);
      return t !== null && t < now;
    })
    .sort((a, b) => {
      const ta =
        parseDate(a.slotStart)?.getTime() ?? parseDate(a.createdAt)?.getTime() ?? 0;
      const tb =
        parseDate(b.slotStart)?.getTime() ?? parseDate(b.createdAt)?.getTime() ?? 0;
      return tb - ta;
    })
    .slice(0, 8);

  const totalVisits = appointments.filter((a) => {
    if (a.status !== "confirmed" && a.status !== "rescheduled") return false;
    const t = parseDate(a.slotStart);
    return t !== null && t < now;
  }).length;

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyBars: { label: string; value: number; color: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const label = monthLabels[m];
    let value = 0;
    for (const a of appointments) {
      const ad = parseDate(a.slotStart) ?? parseDate(a.createdAt);
      if (!ad) continue;
      if (ad.getFullYear() === y && ad.getMonth() === m) value += 1;
    }
    monthlyBars.push({ label, value, color: chartColor });
  }

  const thisMonthCount = appointments.filter((a) => {
    const ad = parseDate(a.slotStart) ?? parseDate(a.createdAt);
    return (
      ad !== null &&
      ad.getFullYear() === now.getFullYear() &&
      ad.getMonth() === now.getMonth()
    );
  }).length;

  const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthCount = appointments.filter((a) => {
    const ad = parseDate(a.slotStart) ?? parseDate(a.createdAt);
    return ad !== null && ad.getFullYear() === lm.getFullYear() && ad.getMonth() === lm.getMonth();
  }).length;

  return {
    pendingCount,
    recordsCount,
    nextAppointment,
    pastAppointments,
    monthlyBars,
    totalVisits,
    thisMonthCount,
    lastMonthCount,
  };
};
