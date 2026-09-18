import type { UserRole } from "@/data/mockUsers";
import type { NotificationCategory, NotificationItem } from "./notification.types";
import { resolveNotificationVisual } from "./notification.utils";

type RoleRoutes = Partial<Record<NotificationCategory, string>>;

/**
 * Where each notification category leads per role. Categories a role cannot act
 * on are intentionally absent so the row stays non-navigable rather than
 * dropping the user on an unrelated screen.
 */
const ROUTES: Record<UserRole, RoleRoutes> = {
  resident: {
    appointment: "/resident/appointments",
    medical: "/resident/medical-records",
    announcement: "/resident/announcements",
    account: "/resident/profile",
  },
  doctor: {
    appointment: "/doctor/consultations",
    medical: "/doctor/patients",
    inventory: "/doctor/inventory",
  },
  midwife: {
    appointment: "/midwife/consultations",
    medical: "/midwife/patients",
    inventory: "/midwife/inventory",
  },
  bhw: {
    appointment: "/bhw/visits",
    medical: "/bhw/residents",
    inventory: "/bhw/inventory",
  },
  admin: {
    appointment: "/admin/mission",
    account: "/admin/users",
    inventory: "/admin/inventory",
  },
};

export const resolveNotificationDestination = (
  item: NotificationItem,
  role?: string | null
): string | null => {
  if (!role || !(role in ROUTES)) return null;

  const { category } = resolveNotificationVisual(item);
  return ROUTES[role as UserRole][category] ?? null;
};

export const getNotificationsRoute = (role?: string | null): string | null =>
  role && role in ROUTES ? `/${role}/notifications` : null;
