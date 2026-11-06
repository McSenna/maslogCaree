import type { NotificationItem } from "../notification.types";
import { groupNotifications } from "../notification.utils";

export type NotificationRowEntry =
  | { kind: "header"; key: string; label: string }
  | { kind: "item"; key: string; item: NotificationItem; divided: boolean };

/** Flattens date groups into one array so a single FlatList renders everything. */
export const buildNotificationRows = (
  items: NotificationItem[],
  now?: number
): NotificationRowEntry[] =>
  groupNotifications(items, now).flatMap((section) => [
    { kind: "header" as const, key: `group-${section.key}`, label: section.label },
    // Rules only sit between rows of the same group, never under a heading or after the last row.
    ...section.items.map((item, index) => ({ kind: "item" as const, key: item.id, item, divided: index > 0 })),
  ]);

export const rowKeyExtractor = (entry: NotificationRowEntry) => entry.key;
