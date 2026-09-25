import type { RoleDashboardConfig } from "./dashboardConfigTypes";
import { byKey, progressCaption } from "./dashboardConfigTypes";

export const MIDWIFE: RoleDashboardConfig = {
  role: "midwife",
  metrics: [
    {
      key: "today",
      route: "mission",
      label: "Patients Today",
      icon: "users",
      tone: "blue",
      value: (d) => d.summary.today,
      description: (d) => progressCaption(d.summary),
    },
    {
      key: "waiting",
      route: "mission",
      label: "Waiting in Queue",
      icon: "clock",
      tone: "pink",
      value: (d) => d.summary.waiting,
      description: (d) =>
        d.summary.processing > 0 ? `${d.summary.processing} being seen now` : "Approved and waiting",
    },
    {
      key: "prenatal",
      route: "mission",
      label: "Prenatal Today",
      icon: "heart",
      tone: "purple",
      value: (d) => byKey(d.serviceBreakdown, "prenatal"),
      description: () => "On today's schedule",
    },
    {
      key: "immunization",
      route: "mission",
      label: "Immunisations Today",
      icon: "shield",
      tone: "green",
      value: (d) => byKey(d.serviceBreakdown, "immunization"),
      description: () => "On today's schedule",
    },
  ],
  chart: {
    title: "Service Activity",
    subtitle: "Prenatal and immunisation per day",
    icon: "trending-up",
    kind: "lines",
  },
  showServiceSplit: true,
  activityTitle: "Recent Activity",
  activitySubtitle: "Visits you have filed",
  queueRoute: "/midwife/mission",
};
