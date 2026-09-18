import type { NotificationItem } from "@/features/notifications/notification.types";

const timeOf = (item: NotificationItem): number => {
  if (!item.createdAt) return 0;
  const parsed = Date.parse(item.createdAt);
  return Number.isNaN(parsed) ? 0 : parsed;
};

/**
 * Combines a freshly fetched page with the already-loaded list, keeping one
 * entry per id and newest-first ordering. Polling can therefore refresh the
 * first page without discarding pages the user scrolled to.
 */
export const mergeNotifications = (
  primary: NotificationItem[],
  secondary: NotificationItem[]
): NotificationItem[] => {
  const byId = new Map<string, NotificationItem>();

  for (const item of primary) byId.set(item.id, item);
  for (const item of secondary) if (!byId.has(item.id)) byId.set(item.id, item);

  return Array.from(byId.values()).sort((a, b) => timeOf(b) - timeOf(a));
};

/** Cheap structural comparison that keeps polling from re-rendering the list. */
export const sameNotifications = (a: NotificationItem[], b: NotificationItem[]): boolean =>
  a.length === b.length &&
  a.every((item, index) => {
    const next = b[index];
    return (
      item.id === next.id &&
      item.isRead === next.isRead &&
      item.title === next.title &&
      item.body === next.body &&
      item.createdAt === next.createdAt
    );
  });
