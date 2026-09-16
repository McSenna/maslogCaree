import type { UserRole } from "@/data/mockUsers";

const MISSION_MANAGER_ROLES: readonly string[] = ["doctor", "admin"];

export const canCreateMission = (role: UserRole | string | null | undefined): boolean =>
  MISSION_MANAGER_ROLES.includes(String(role ?? "").trim().toLowerCase());

const APPOINTMENT_ACTOR_ROLES: readonly string[] = ["doctor", "admin", "midwife"];

export const canAssignAppointments = (
  role: UserRole | string | null | undefined
): boolean => APPOINTMENT_ACTOR_ROLES.includes(String(role ?? "").trim().toLowerCase());

export const BHW_QUEUE_SERVICE_KEY = "bp_checking";
