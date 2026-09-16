import type { NotificationItem } from "@/services/notifications";
import type { AppointmentRecord } from "@/services/appointments";

import type { ResidentDashboardSummary } from "./appointmentSummary";
import { formatConsultationTypeLabel } from "./dashboardFormatters";


export const buildResidentNotifications = (
  appointments: AppointmentRecord[],
  summary: ResidentDashboardSummary
): NotificationItem[] => {
  const items: NotificationItem[] = [];
  const now = new Date();

  if (summary.pendingCount > 0) {
    items.push({
      id: "pending",
      title: "Requests in queue",
      body: `${summary.pendingCount} appointment request(s) are waiting to be scheduled by the health team.`,
      time: "Now",
      tone: "warning",
      isRead: false,
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
        isRead: false,
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
      isRead: false,
    });
  }

  return items.slice(0, 6);
};
