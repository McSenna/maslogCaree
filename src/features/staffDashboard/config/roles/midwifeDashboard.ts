import type { RoleDashboardConfig } from "./dashboardConfigTypes";
import { byKey, progressCaption, todayProgress } from "./dashboardConfigTypes";

export const MIDWIFE: RoleDashboardConfig = {
  role: "midwife",
  personNoun: "patient",
  metrics: [
    {
      key: "today",
      route: "mission",
      label: "Today's patients",
      icon: "users",
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
        d.summary.processing > 0 ? `${d.summary.processing} with you now` : "Checked in and waiting",
    },
    {
      key: "prenatal",
      route: "mission",
      label: "Prenatal today",
      icon: "heart",
      tone: "care",
      value: (d) => byKey(d.serviceBreakdown, "prenatal"),
      description: () => "On today's schedule",
    },
    {
      key: "immunization",
      route: "mission",
      label: "Immunisations today",
      icon: "shield",
      tone: "neutral",
      value: (d) => byKey(d.serviceBreakdown, "immunization"),
      description: () => "On today's schedule",
    },
  ],
  chart: {
    title: "Visits completed",
    subtitle: "Prenatal and immunisation, per day",
    icon: "trending-up",
    kind: "lines",
  },
  showServiceSplit: true,
  activityTitle: "Recent visits",
  activitySubtitle: "Visits you have filed",
  queueRoute: "/midwife/mission",
  secondaryAction: { label: "Vaccine stock", icon: "package", route: "/midwife/inventory" },
  inventoryRoute: "/midwife/inventory",
};
