import type { NotificationItem } from "@/components/dashboard/NotificationPanel";
import type { AppointmentRecord } from "@/services/appointments";

export function getTimeGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function formatConsultationTypeLabel(key: string): string {
  return String(key || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseDate(s?: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

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

export function summarizeResidentAppointments(
  appointments: AppointmentRecord[],
  chartColor: string
): ResidentDashboardSummary {
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
}

export function buildResidentNotifications(
  appointments: AppointmentRecord[],
  summary: ResidentDashboardSummary
): NotificationItem[] {
  const items: NotificationItem[] = [];
  const now = new Date();

  if (summary.pendingCount > 0) {
    items.push({
      id: "pending",
      title: "Requests in queue",
      body: `${summary.pendingCount} appointment request(s) are waiting to be scheduled by the health team.`,
      time: "Now",
      tone: "warning",
    });
  }

  if (summary.nextAppointment?.slotStart) {
    const t = new Date(summary.nextAppointment.slotStart);
    const hours = (t.getTime() - now.getTime()) / 3600000;
    if (hours <= 72 && hours >= 0) {
      items.push({
        id: "upcoming",
        title: "Upcoming visit",
        body: `${formatConsultationTypeLabel(summary.nextAppointment.consultationType)} on ${t.toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}.`,
        time: "Soon",
        tone: "success",
      });
    }
  }

  const declined = appointments.filter((a) => a.status === "declined").slice(0, 2);
  for (const d of declined) {
    items.push({
      id: `declined-${d._id}`,
      title: "Request update",
      body: d.declineReason
        ? `Declined: ${d.declineReason.slice(0, 120)}${d.declineReason.length > 120 ? "…" : ""}`
        : "An appointment request was declined. Open Appointments for details.",
      time: "Recent",
      tone: "info",
    });
  }

  return items.slice(0, 6);
}

export function formatNextVisitSummary(
  appt: AppointmentRecord | null,
  pendingCount: number
): {
  value: string;
  helper: string;
} {
  if (!appt || !appt.slotStart) {
    if (pendingCount > 0) {
      return {
        value: "In queue",
        helper: `${pendingCount} request(s) awaiting schedule`,
      };
    }
    return {
      value: "—",
      helper: "No upcoming visit scheduled yet",
    };
  }
  const d = new Date(appt.slotStart);
  const value = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const typeLabel = formatConsultationTypeLabel(appt.consultationType);
  const staff =
    appt.assignedBy && typeof appt.assignedBy === "object" && "fullname" in appt.assignedBy
      ? String((appt.assignedBy as { fullname?: string }).fullname || "").trim()
      : "";
  const helper = [typeLabel, staff ? `· ${staff}` : null].filter(Boolean).join(" ");
  return { value, helper: helper || typeLabel };
}

export function formatUpcomingCard(
  appt: AppointmentRecord | null,
  pendingCount: number
): {
  title: string;
  description: string;
} {
  if (!appt) {
    if (pendingCount > 0) {
      return {
        title: "Request in queue",
        description: `You have ${pendingCount} appointment request(s) waiting for the health team to assign a date and time.`,
      };
    }
    return {
      title: "No upcoming appointment",
      description: "Book a visit from Appointments when you need care.",
    };
  }
  const typeLabel = formatConsultationTypeLabel(appt.consultationType);
  if (!appt.slotStart) {
    return {
      title: `${typeLabel} · ${appt.status === "pending" ? "In queue" : appt.status}`,
      description: "Date and time will appear after the health team assigns your slot.",
    };
  }
  const d = new Date(appt.slotStart);
  const dateStr = d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const staff =
    appt.assignedBy && typeof appt.assignedBy === "object" && "fullname" in appt.assignedBy
      ? String((appt.assignedBy as { fullname?: string }).fullname || "").trim()
      : "";
  const description = [
    `${timeStr}`,
    staff ? `· ${staff}` : "· Medical mission team",
    appt.description ? `\n${appt.description.slice(0, 200)}${appt.description.length > 200 ? "…" : ""}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return {
    title: `${typeLabel} — ${dateStr}`,
    description,
  };
}
