import {
  formatNotificationTime,
  resolveNotificationVisual,
} from "@/features/notifications/notification.utils";
import type { NotificationItem } from "@/features/notifications/notification.types";
import type {
  ActivityTone,
  ProfileActivityItem,
  ProfileIconName,
} from "../types/profile.types";

const TONE_BY_CATEGORY: Record<string, ActivityTone> = {
  appointment: "info",
  medical: "info",
  account: "success",
  inventory: "warning",
  announcement: "info",
  system: "info",
};

export const ACTIVITY_LIMIT = 12;

export const toProfileActivity = (
  notifications: NotificationItem[]
): ProfileActivityItem[] =>
  notifications.slice(0, ACTIVITY_LIMIT).map((notification) => {
    const visual = resolveNotificationVisual(notification);

    return {
      id: notification.id,
      title: notification.title,
      detail: notification.body,
      time: formatNotificationTime(notification),
      icon: visual.icon as ProfileIconName,
      tone: TONE_BY_CATEGORY[visual.category] ?? "info",
    };
  });
