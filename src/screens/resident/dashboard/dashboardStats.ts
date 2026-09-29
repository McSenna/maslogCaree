import type { ResidentDashboardData } from "@/services/residentDashboardService";
import type { StatItem } from "@/types/residentDashboard";

export const buildStats = (data: ResidentDashboardData | null): StatItem[] => {
  const s = data?.statistics;
  return [
    {
      id: "upcoming",
      label: "Upcoming Appointment",
      shortLabel: "Upcoming",
      value: s?.upcomingAppointments ?? 0,
      caption: "Booked or requested",
      icon: "calendar-outline",
      tone: "blue",
    },
    {
      id: "completed",
      label: "Completed Visits",
      shortLabel: "Completed",
      value: s?.completedAppointments ?? 0,
      caption: "Visits so far",
      icon: "checkmark",
      tone: "green",
    },
    {
      id: "records",
      label: "Health Records",
      shortLabel: "Records",
      value: s?.medicalRecords ?? 0,
      caption: "Ready to view",
      icon: "document-text-outline",
      tone: "purple",
    },
    {
      id: "announcements",
      label: "Unread Announcements",
      shortLabel: "Announcements",
      value: s?.unreadAnnouncements ?? 0,
      caption: "Not read yet",
      icon: "notifications-outline",
      tone: "orange",
    },
  ];
};
