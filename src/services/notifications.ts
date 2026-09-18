import api from "@/services/api";
import type { NotificationItem, NotificationPage } from "@/features/notifications/notification.types";

export type {
  NotificationItem,
  NotificationPage,
  NotificationTone,
  NotificationType,
} from "@/features/notifications/notification.types";

type NotificationsResponse = {
  success: boolean;
  unreadCount?: number;
  notifications?: NotificationItem[];
  hasMore?: boolean;
  nextCursor?: string | null;
};

export async function fetchNotifications(params?: {
  cursor?: string | null;
  limit?: number;
}): Promise<NotificationPage> {
  const { data } = await api.get<NotificationsResponse>("/notifications", {
    params: {
      ...(params?.cursor ? { cursor: params.cursor } : null),
      ...(params?.limit ? { limit: params.limit } : null),
    },
  });

  return {
    unreadCount: data.unreadCount ?? 0,
    notifications: data.notifications ?? [],
    hasMore: Boolean(data.hasMore),
    nextCursor: data.nextCursor ?? null,
  };
}

export async function markNotificationRead(
  id: string
): Promise<{ updated: boolean; unreadCount: number | null }> {
  const { data } = await api.patch<{ updated: boolean; unreadCount?: number }>(
    `/notifications/${id}/read`
  );

  return { updated: Boolean(data.updated), unreadCount: data.unreadCount ?? null };
}

export async function markAllNotificationsRead(): Promise<{ modifiedCount: number }> {
  const { data } = await api.patch<{ modifiedCount: number }>(`/notifications/read-all`);
  return { modifiedCount: data.modifiedCount ?? 0 };
}
