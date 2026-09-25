import type { NotificationCategory } from "../notification.types";
import { getNotificationsRoute, routeForCategory } from "../notification.routes";
import type { PushNotificationData } from "../types/pushNotification.types";

const resolvePushCategory = (type?: string): NotificationCategory | null => {
  if (!type) return null;
  if (type.startsWith("appointment_completed") || type.startsWith("medical")) return "medical";
  if (type.startsWith("appointment")) return "appointment";
  if (type.startsWith("inventory")) return "inventory";
  if (type.startsWith("announcement")) return "announcement";
  if (type.startsWith("resident") || type.startsWith("account") || type.startsWith("user")) return "account";
  return null;
};

/** Push taps share the in-app routing table and fall back to the role's inbox. */
export const getNotificationRoute = (
  data: PushNotificationData | undefined,
  role?: string | null
): string | null => {
  const category = resolvePushCategory(data?.type);
  return (category && routeForCategory(role, category)) || getNotificationsRoute(role);
};
