import type { RoleDashboardConfig, StaffRole } from "./roles/dashboardConfigTypes";
import { ADMIN } from "./roles/adminDashboard";
import { BHW } from "./roles/bhwDashboard";
import { DOCTOR } from "./roles/doctorDashboard";
import { MIDWIFE } from "./roles/midwifeDashboard";

export type { MetricSpec, RoleDashboardConfig, StaffRole } from "./roles/dashboardConfigTypes";

export const ROLE_DASHBOARD_CONFIG: Record<StaffRole, RoleDashboardConfig> = {
  doctor: DOCTOR,
  bhw: BHW,
  midwife: MIDWIFE,
  admin: ADMIN,
};

export const getRoleDashboardConfig = (role: string | null | undefined): RoleDashboardConfig => {
  const key = String(role ?? "").trim().toLowerCase() as StaffRole;
  return ROLE_DASHBOARD_CONFIG[key] ?? DOCTOR;
};
