import type { NotificationItem, NotificationType } from "@/services/notifications";
import type {
  ActivityTone,
  ProfileActivityItem,
  ProfileIconName,
} from "../types/profile.types";

type ActivityPresentation = { icon: ProfileIconName; tone: ActivityTone };

const ACTIVITY_PRESENTATION: Record<NotificationType, ActivityPresentation> = {
  appointment: { icon: "calendar", tone: "info" },
  approved: { icon: "check-circle", tone: "success" },
  pending: { icon: "clock", tone: "warning" },
  cancelled: { icon: "x-circle", tone: "warning" },
  patient: { icon: "user-check", tone: "info" },
  visit: { icon: "map-pin", tone: "info" },
  report: { icon: "file-text", tone: "info" },
  system: { icon: "bell", tone: "info" },
};

const DEFAULT_PRESENTATION: ActivityPresentation = { icon: "bell", tone: "info" };

const presentationFor = (type?: NotificationType): ActivityPresentation =>
  (type && ACTIVITY_PRESENTATION[type]) || DEFAULT_PRESENTATION;

export const ACTIVITY_LIMIT = 12;

export const toProfileActivity = (
  notifications: NotificationItem[]
): ProfileActivityItem[] =>
  notifications.slice(0, ACTIVITY_LIMIT).map((notification) => {
    const presentation = presentationFor(notification.type);

    return {
      id: notification.id,
      title: notification.title,
      detail: notification.body,
      time: notification.time,
      icon: presentation.icon,
      tone: presentation.tone,
    };
  });
