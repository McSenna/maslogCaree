import api from "@/services/api";

export type NotificationTone = "info" | "success" | "warning";

export type NotificationType =
  | "appointment"
  | "approved"
  | "pending"
  | "cancelled"
  | "patient"
  | "visit"
  | "report"
  | "system";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone?: NotificationTone;
  type?: NotificationType;
  isRead: boolean;
};

export async function fetchNotifications(): Promise<{
  unreadCount: number;
  notifications: NotificationItem[];
}> {
  const { data } = await api.get<{
    success: boolean;
    unreadCount?: number;
    notifications?: NotificationItem[];
  }>("/notifications");

  return {
    unreadCount: data.unreadCount ?? 0,
    notifications: data.notifications ?? [],
  };
}

export async function markNotificationRead(id: string): Promise<{ updated: boolean }> {
  const { data } = await api.patch<{ success: boolean; updated: boolean }>(`/notifications/${id}/read`);
  return { updated: Boolean(data.updated) };
}

export async function markAllNotificationsRead(): Promise<{ modifiedCount: number }> {
  const { data } = await api.patch<{ success: boolean; modifiedCount: number }>(`/notifications/read-all`);
  return { modifiedCount: data.modifiedCount ?? 0 };
}

