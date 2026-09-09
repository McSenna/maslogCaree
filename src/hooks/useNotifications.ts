import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead, type NotificationItem } from "@/services/notifications";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

type UseNotificationsOptions = {
  pollIntervalMs?: number;
};

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { user } = useAuth();
  const pollIntervalMs = options.pollIntervalMs ?? 15000;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshInFlightRef = useRef<Promise<void> | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
      return;
    }

    if (refreshInFlightRef.current) return;

    setLoading(true);
    setError(null);
    
    const p = (async () => {
      try {
        const res = await fetchNotifications();
        setNotifications(res.notifications);
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
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      void refresh();
    }, pollIntervalMs);

    return () => clearInterval(id);
  }, [user, pollIntervalMs, refresh]);

  const markRead = useCallback(
    async (id: string) => {
      // Optimistic update — keep item visible but mark as read.
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await markNotificationRead(id);
      } catch (e: unknown) {
        setError(getApiErrorMessage(e, "Unable to mark the notification as read."));
      } finally {
        void refresh();
      }
    },
    [refresh]
  );

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, "Unable to mark all notifications as read."));
    } finally {
      void refresh();
    }
  }, [refresh]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
  };
}

