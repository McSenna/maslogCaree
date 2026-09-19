import type { PushNotificationData } from "../types/pushNotification.types";

type RoleCategoryRoutes = {
  appointment?: string;
  medical?: string;
  account?: string;
  default: string;
};

const ROLE_ROUTES: Record<string, RoleCategoryRoutes> = {
  resident: {
    appointment: "/resident/appointments",
    medical: "/resident/medical-records",
    account: "/resident/profile",
    default: "/resident/notifications",
  },
  doctor: {
    appointment: "/doctor/consultations",
    medical: "/doctor/patients",
    default: "/doctor/notifications",
  },
  midwife: {
    appointment: "/midwife/consultations",
    medical: "/midwife/patients",
    default: "/midwife/notifications",
  },
  bhw: {
    appointment: "/bhw/visits",
    medical: "/bhw/residents",
    default: "/bhw/notifications",
  },
  admin: {
    appointment: "/admin/mission",
    account: "/admin/users",
    default: "/admin/notifications",
  },
};

const resolveCategory = (type?: string): "appointment" | "medical" | "account" | "default" => {
  if (!type) return "default";
  if (type.startsWith("appointment_completed") || type.startsWith("medical")) return "medical";
  if (type.startsWith("appointment")) return "appointment";
  if (type.startsWith("resident") || type.startsWith("account") || type.startsWith("user")) {
    return "account";
  }
  return "default";
};

export const getNotificationRoute = (
  data: PushNotificationData | undefined,
  role?: string | null
): string | null => {
  if (!role || !(role in ROLE_ROUTES)) return null;

  const roleConfig = ROLE_ROUTES[role];
  const category = resolveCategory(data?.type);

  if (category === "appointment" && roleConfig.appointment) return roleConfig.appointment;
  if (category === "medical" && roleConfig.medical) return roleConfig.medical;
  if (category === "account" && roleConfig.account) return roleConfig.account;

  return roleConfig.default;
};
