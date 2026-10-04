import type { Dispatch, SetStateAction } from "react";

import type { NotificationItem } from "@/features/notifications/notification.types";
import { useDebouncedCallback } from "@/hooks/realtime/useDebouncedCallback";
import { useRealtimeEvents, useResyncSignal } from "@/hooks/realtime/useRealtimeEvents";
import { useLatestRef } from "@/hooks/useLatestRef";

import { mergeNotifications } from "./notificationStore";

// "Mark all as read" on another device sends one event per alert; one quiet reload covers the burst.
const RELOAD_DEBOUNCE_MS = 300;

type Params = {
  enabled: boolean;
  notifications: NotificationItem[];
  setNotifications: Dispatch<SetStateAction<NotificationItem[]>>;
  setUnreadCount: Dispatch<SetStateAction<number>>;
  /** Folds the first page in and takes the server's unread count, without dropping loaded pages. */
  reload: () => void;
};

const unread = (item: NotificationItem | undefined) => (item && !item.isRead ? 1 : 0);

/**
 * Keeps the inbox and the bell count current over the realtime connection.
 * New alerts and changes to loaded ones apply in place; anything whose effect
 * on the unread count is unknown (a row on a page not loaded yet) asks the
 * server instead of guessing.
 */
export const useNotificationLiveUpdates = ({ enabled, notifications, setNotifications, setUnreadCount, reload }: Params) => {
  const listRef = useLatestRef(notifications);
  const scheduleReload = useDebouncedCallback(reload, RELOAD_DEBOUNCE_MS);

  useRealtimeEvents(
    "notification",
    (change) => {
      if (change.action === "resync") return scheduleReload();

      if (change.action === "deleted") {
        const known = listRef.current.find((item) => item.id === change.id);
        if (!known) return scheduleReload();
        setNotifications((current) => current.filter((item) => item.id !== change.id));
        setUnreadCount((count) => Math.max(0, count - unread(known)));
        return;
      }

      const incoming = change.record;
      const known = listRef.current.find((item) => item.id === incoming.id);
      if (!known && change.action === "updated") return scheduleReload();

      setNotifications((current) => mergeNotifications([incoming], current));
      setUnreadCount((count) => Math.max(0, count + unread(incoming) - unread(known)));
    },
    enabled
  );

  useResyncSignal(scheduleReload, enabled);
};
