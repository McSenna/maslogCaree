import type { RoleDashboardConfig } from "./dashboardConfigTypes";
import { DOCTOR } from "./doctorDashboard";

export const ADMIN: RoleDashboardConfig = {
  ...DOCTOR,
  role: "admin",
  chart: { ...DOCTOR.chart, subtitle: "Per day, all services" },
  activityTitle: "Recent activity",
  activitySubtitle: "Across every service",
  queueRoute: "/admin/mission",
  secondaryAction: { label: "Inventory", icon: "package", route: "/admin/inventory" },
  inventoryRoute: "/admin/inventory",
};
