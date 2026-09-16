import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead, type NotificationItem } from "@/services/notifications";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

type UseNotificationsOptions = {
  pollIntervalMs?: number;
};

const sameNotifications = (a: NotificationItem[], b: NotificationItem[]) =>
  a.length === b.length &&
  a.every((item, i) => {
    const next = b[i];
    return (
      item.id === next.id &&
      item.isRead === next.isRead &&
      item.title === next.title &&
      item.body === next.body &&
      item.time === next.time
    );
  });

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { user } = useAuth();
  const pollIntervalMs = options.pollIntervalMs ?? 15000;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshInFlightRef = useRef<Promise<void> | null>(null);

  const load = useCallback(
    async (announce: boolean) => {
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        setError(null);
        return;
      }

      if (refreshInFlightRef.current) return;

      if (announce) setLoading(true);
      setError(null);

      const p = (async () => {
        try {
          const res = await fetchNotifications();
          setNotifications((prev) =>
            sameNotifications(prev, res.notifications) ? prev : res.notifications
          );
          setUnreadCount(res.unreadCount);
        } catch (e: unknown) {
          setError(getApiErrorMessage(e, "Unable to load notifications."));
        }
      })();

      refreshInFlightRef.current = p;
      try {
        await p;
      } finally {
        refreshInFlightRef.current = null;
        if (announce) setLoading(false);
      }
    },
    [user]
  );

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    void load(true);
  }, [load]);

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      void load(false);
    }, pollIntervalMs);

    return () => clearInterval(id);
  }, [user, pollIntervalMs, load]);

  const markRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await markNotificationRead(id);
      } catch (e: unknown) {
        setError(getApiErrorMessage(e, "Unable to mark the notification as read."));
      } finally {
        void load(false);
      }
    },
    [load]
  );

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, "Unable to mark all notifications as read."));
    } finally {
      void load(false);
    }
  }, [load]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
  };
};

