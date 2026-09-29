import type { RoleDashboardConfig } from "./dashboardConfigTypes";
import { plural, progressCaption, todayProgress } from "./dashboardConfigTypes";

export const DOCTOR: RoleDashboardConfig = {
  role: "doctor",
  personNoun: "patient",
  metrics: [
    {
      key: "today",
      route: "mission",
      label: "Today's patients",
      icon: "users",
      tone: "blue",
      value: (d) => d.summary.today,
      description: (d) => progressCaption(d.summary),
      progress: todayProgress,
    },
    {
      key: "waiting",
      route: "mission",
      label: "Waiting now",
      icon: "clock",
      tone: "amber",
      value: (d) => d.summary.waiting,
      description: (d) =>
        d.summary.processing > 0 ? `${d.summary.processing} with you now` : "Checked in and waiting",
    },
    {
      key: "completed",
      route: "mission",
      label: "Seen today",
      icon: "check-circle",
      tone: "green",
      value: (d) => d.summary.completedToday,
      description: (d) => `${plural(d.summary.totalPatients, "patient")} seen in total`,
    },
    {
      key: "upcoming",
      route: "mission",
      label: "Upcoming",
      icon: "calendar",
      tone: "purple",
      value: (d) => d.summary.upcoming,
      description: (d) =>
        d.summary.pending > 0 ? `${d.summary.pending} still to schedule` : "Booked after today",
    },
  ],
  chart: {
    title: "Consultations completed",
    subtitle: "Per day, by service",
    icon: "trending-up",
    kind: "lines",
  },
  showServiceSplit: true,
  activityTitle: "Recent consultations",
  activitySubtitle: "Encounters you have filed",
  queueRoute: "/doctor/mission",
  secondaryAction: { label: "Medicine stock", icon: "package", route: "/doctor/inventory" },
  inventoryRoute: "/doctor/inventory",
};
