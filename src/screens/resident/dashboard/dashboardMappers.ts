import type { NotificationItem } from "@/services/notifications";
import type { Announcement } from "@/types/residentDashboard";

export const mapAnnouncements = (notifications: NotificationItem[]): Announcement[] =>
  notifications.slice(0, 3).map((n) => ({
    id: n.id,
    title: n.title,
    date: n.time,
    detail: n.body,
    icon: n.isRead ? "document-text-outline" : "megaphone-outline",
    tone: n.isRead ? "purple" : "blue",
  }));
