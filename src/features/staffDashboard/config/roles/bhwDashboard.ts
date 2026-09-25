import type { RoleDashboardConfig } from "./dashboardConfigTypes";
import { plural, progressCaption } from "./dashboardConfigTypes";

export const BHW: RoleDashboardConfig = {
  role: "bhw",
  metrics: [
    {
      key: "today",
      route: "mission",
      label: "BP Checks Today",
      icon: "activity",
      tone: "blue",
      value: (d) => d.summary.today,
      description: (d) => progressCaption(d.summary),
    },
    {
      key: "waiting",
      route: "mission",
      label: "Waiting for Check",
      icon: "clock",
      tone: "pink",
      value: (d) => d.summary.waiting,
      description: (d) =>
        d.summary.processing > 0 ? `${d.summary.processing} being seen now` : "Approved and waiting",
    },
    {
      key: "completed",
      route: "mission",
      label: "Completed Today",
      icon: "check-circle",
      tone: "green",
      value: (d) => d.summary.completedToday,
      description: (d) => `${plural(d.summary.totalPatients, "resident")} checked in total`,
    },
    {
      key: "upcoming",
      route: "mission",
      label: "Upcoming Checks",
      icon: "calendar",
      tone: "purple",
      value: (d) => d.summary.upcoming,
      description: (d) =>
        d.summary.pending > 0 ? `${d.summary.pending} still to schedule` : "Scheduled after today",
    },
  ],
  chart: {
    title: "BP Checking Activity",
    subtitle: "Checks completed per day",
    icon: "bar-chart-2",
    kind: "bars",
  },
  showServiceSplit: false,
  activityTitle: "Recent BP Records",
  activitySubtitle: "Readings you have recorded",
  queueRoute: "/bhw/mission",
};
