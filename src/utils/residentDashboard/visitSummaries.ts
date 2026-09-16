import type { AppointmentRecord } from "@/services/appointments";

import { formatConsultationTypeLabel } from "./dashboardFormatters";


export const formatNextVisitSummary = (
  appt: AppointmentRecord | null,
  pendingCount: number
): {
  value: string;
  helper: string;
} => {
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
};

export const formatUpcomingCard = (
  appt: AppointmentRecord | null,
  pendingCount: number
): {
  title: string;
  description: string;
} => {
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
};
