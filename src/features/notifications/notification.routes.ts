import type { UserRole } from "@/config/roleRoutes";
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
    appointment: "/doctor/mission",
    medical: "/doctor/mission",
    inventory: "/doctor/inventory",
  },
  midwife: {
    appointment: "/midwife/mission",
    medical: "/midwife/mission",
    inventory: "/midwife/inventory",
  },
  bhw: {
    appointment: "/bhw/mission",
    medical: "/bhw/residents",
    inventory: "/bhw/inventory",
  },
  admin: {
    appointment: "/admin/dashboard",
    account: "/admin/users",
    inventory: "/admin/inventory",
    announcement: "/admin/announcements",
  },
};

export const routeForCategory = (role: string | null | undefined, category: NotificationCategory): string | null =>
  role && role in ROUTES ? ROUTES[role as UserRole][category] ?? null : null;

export const resolveNotificationDestination = (
  item: NotificationItem,
  role?: string | null
): string | null => {
  const { category } = resolveNotificationVisual(item);
  return routeForCategory(role, category);
};

/**
 * Announcement alerts open their post in a dialog instead of navigating. The
 * type is checked rather than the title-based category fallback, so an
 * unrelated alert that merely mentions "announcement" keeps its old route.
 */
export const isAnnouncementNotification = (item: NotificationItem): boolean =>
  item.type === "announcement" || Boolean(item.announcementId);

export const getNotificationsRoute =(role?: string | null): string | null =>
  role && role in ROUTES ? `/${role}/notifications` : null;
