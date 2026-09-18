export type NotificationTone = "info" | "success" | "warning";

/**
 * Notification `type` is written by the backend as a free-form slug
 * (`appointment_confirmed`, `inventory_low_stock`, ...). It is kept as a string
 * so new server-side types never break the client; presentation is derived
 * from it in `notification.utils.ts`.
 */
export type NotificationType = string;

export type NotificationCategory =
  | "appointment"
  | "medical"
  | "account"
  | "inventory"
  | "announcement"
  | "system";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone?: NotificationTone;
  type?: NotificationType;
  isRead: boolean;
  createdAt?: string | null;
  appointmentId?: string | null;
};

export type NotificationPage = {
  unreadCount: number;
  notifications: NotificationItem[];
  hasMore: boolean;
  nextCursor: string | null;
};

export type NotificationFilter = "all" | "unread";

export type NotificationGroupKey = "today" | "yesterday" | "week" | "earlier";

export type NotificationSection = {
  key: NotificationGroupKey;
  label: string;
  items: NotificationItem[];
};

export type BellPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};
