import type { NotificationItem } from "../notification.types";
import { groupNotifications } from "../notification.utils";

export type NotificationRowEntry =
  | { kind: "header"; key: string; label: string }
  | { kind: "item"; key: string; item: NotificationItem };

/** Flattens date groups into one array so a single FlatList renders everything. */
export const buildNotificationRows = (
  items: NotificationItem[],
  now?: number
): NotificationRowEntry[] =>
  groupNotifications(items, now).flatMap((section) => [
    { kind: "header" as const, key: `group-${section.key}`, label: section.label },
    ...section.items.map((item) => ({ kind: "item" as const, key: item.id, item })),
  ]);

export const rowKeyExtractor = (entry: NotificationRowEntry) => entry.key;
