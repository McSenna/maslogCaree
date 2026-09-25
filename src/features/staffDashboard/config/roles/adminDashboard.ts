import type { RoleDashboardConfig } from "./dashboardConfigTypes";
import { DOCTOR } from "./doctorDashboard";

export const ADMIN: RoleDashboardConfig = {
  ...DOCTOR,
  role: "admin",
  chart: { ...DOCTOR.chart, subtitle: "Visits completed per day, all services" },
  activityTitle: "Recent Activity",
  activitySubtitle: "Across every service",
  queueRoute: "/admin/mission",
};
