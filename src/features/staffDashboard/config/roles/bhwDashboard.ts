import type { RoleDashboardConfig } from "./dashboardConfigTypes";
import { plural, progressCaption, todayProgress } from "./dashboardConfigTypes";

export const BHW: RoleDashboardConfig = {
  role: "bhw",
  personNoun: "resident",
  metrics: [
    {
      key: "today",
      route: "mission",
      label: "BP checks today",
      icon: "activity",
      tone: "primary",
      value: (d) => d.summary.today,
      description: (d) => progressCaption(d.summary),
      progress: todayProgress,
    },
    {
      key: "waiting",
      route: "mission",
      label: "Waiting now",
      icon: "clock",
      tone: "accent",
      value: (d) => d.summary.waiting,
      description: (d) =>
        d.summary.processing > 0 ? `${d.summary.processing} being checked now` : "Checked in and waiting",
    },
    {
      key: "completed",
      route: "mission",
      label: "Checked today",
      icon: "check-circle",
      tone: "care",
      value: (d) => d.summary.completedToday,
      description: (d) => `${plural(d.summary.totalPatients, "resident")} so far`,
    },
    {
      key: "upcoming",
      route: "mission",
      label: "Upcoming checks",
      icon: "calendar",
      tone: "neutral",
      value: (d) => d.summary.upcoming,
      description: (d) =>
        d.summary.pending > 0 ? `${d.summary.pending} still to schedule` : "Booked after today",
    },
  ],
  chart: {
    title: "BP checks completed",
    subtitle: "Per day",
    icon: "bar-chart-2",
    kind: "bars",
  },
  showServiceSplit: false,
  activityTitle: "Recent BP readings",
  activitySubtitle: "Readings you have recorded",
  queueRoute: "/bhw/mission",
  secondaryAction: { label: "Residents", icon: "users", route: "/bhw/residents" },
};
