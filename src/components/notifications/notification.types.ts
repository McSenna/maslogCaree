export type {
  NotificationItem,
  NotificationTone,
  NotificationType,
} from "@/services/notifications";

export type BellPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type NotificationPanelProps = {
  visible: boolean;
  onClose: () => void;
  items: import("@/services/notifications").NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  onMarkRead: (id: string) => Promise<void> | void;
  onMarkAllRead: () => Promise<void> | void;
  onRefresh: () => Promise<void> | void;
  bellPosition: BellPosition | null;
};
