import type { RoleDashboardConfig } from "./dashboardConfigTypes";
import { plural, progressCaption } from "./dashboardConfigTypes";

export const DOCTOR: RoleDashboardConfig = {
  role: "doctor",
  badge: "Doctor",
  tagline: "Here's your clinical overview for today.",
  metrics: [
    {
      key: "today",
      label: "Today's Patients",
      icon: "users",
      tone: "blue",
      value: (d) => d.summary.today,
      description: (d) => progressCaption(d.summary),
    },
    {
      key: "waiting",
      label: "Waiting in Queue",
      icon: "clock",
      tone: "pink",
      value: (d) => d.summary.waiting,
      description: (d) =>
        d.summary.processing > 0 ? `${d.summary.processing} being seen now` : "Approved and waiting",
    },
    {
      key: "completed",
      label: "Completed Today",
      icon: "check-circle",
      tone: "green",
      value: (d) => d.summary.completedToday,
      description: (d) => `${plural(d.summary.totalPatients, "patient")} seen in total`,
    },
    {
      key: "upcoming",
      label: "Upcoming",
      icon: "calendar",
      tone: "purple",
      value: (d) => d.summary.upcoming,
      description: (d) =>
        d.summary.pending > 0 ? `${d.summary.pending} still to schedule` : "Scheduled after today",
    },
  ],
  chart: {
    title: "Appointments Overview",
    subtitle: "Consultations completed per day",
    icon: "trending-up",
    kind: "lines",
  },
  showServiceSplit: true,
  activityTitle: "Recent Clinical Activity",
  activitySubtitle: "Encounters you have filed",
  queueRoute: "/doctor/mission",
};
