import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "@/components/feedback/toast/toastStore";
import { useAuth } from "@/contexts/AuthContext";
import type { NotificationItem } from "@/features/notifications/notification.types";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notifications";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { toastBackgroundError, toastError } from "@/utils/errorToast/toastError";
import { mergeNotifications, sameNotifications } from "./notifications/notificationStore";
import { useNotificationLiveUpdates } from "./notifications/useNotificationLiveUpdates";

const PAGE_SIZE = 20;

export const useNotifications = () => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cursorRef = useRef<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const inFlightRef = useRef(false);
  /** True once the user paged past the first page, so a quiet reload must not rewind the cursor. */
  const pagedRef = useRef(false);
  /** True once a page is on screen: the list then stays, so a failure is told by toast, not the error state. */
  const loadedRef = useRef(false);

  const load = useCallback(
    async (announce: boolean) => {
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        setHasMore(false);
        cursorRef.current = null;
        pagedRef.current = false;
        loadedRef.current = false;
        setError(null);
        return;
      }

      if (inFlightRef.current) return;
      inFlightRef.current = true;
      if (announce) setLoading(true);

      try {
        const page = await fetchNotifications({ limit: PAGE_SIZE });

        if (announce) {
          // Explicit load or pull-to-refresh: the first page becomes the list again.
          setNotifications((prev) =>
            sameNotifications(prev, page.notifications) ? prev : page.notifications
          );
          pagedRef.current = false;
          setHasMore(page.hasMore);
          cursorRef.current = page.nextCursor;
        } else {
          // Quiet reload after a realtime change: fold the first page in without dropping loaded pages.
          setNotifications((prev) => {
            const next = mergeNotifications(page.notifications, prev);
            return sameNotifications(prev, next) ? prev : next;
          });

          if (!pagedRef.current) {
            setHasMore(page.hasMore);
            cursorRef.current = page.nextCursor;
          }
        }

        setUnreadCount(page.unreadCount);
        setError(null);
        loadedRef.current = true;
      } catch (e: unknown) {
        setError(getApiErrorMessage(e, "Unable to load notifications."));
        if (!announce) toastBackgroundError("Notifications not updated", e);
        else if (loadedRef.current) toastError("Notifications not refreshed", e, { fallback: "Unable to load notifications." });
      } finally {
        inFlightRef.current = false;
        if (announce) setLoading(false);
      }
    },
    [user]
  );

  const refresh = useCallback(() => load(true), [load]);

  const loadMore = useCallback(async () => {
    const cursor = cursorRef.current;
    if (!user || !cursor || inFlightRef.current) return;

    inFlightRef.current = true;
    setLoadingMore(true);

    try {
      const page = await fetchNotifications({ cursor, limit: PAGE_SIZE });
      pagedRef.current = true;
      setNotifications((prev) => mergeNotifications(prev, page.notifications));
      setUnreadCount(page.unreadCount);
      setHasMore(page.hasMore);
      cursorRef.current = page.nextCursor;
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, "Unable to load more notifications."));
      toastError("Unable to load more notifications", e);
    } finally {
      inFlightRef.current = false;
      setLoadingMore(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void load(true);
  }, [load]);

  // Replaces the 15-second poll: alerts arrive over the realtime connection.
  useNotificationLiveUpdates({
    enabled: Boolean(user),
    notifications,
    setNotifications,
    setUnreadCount,
    reload: () => void load(false),
  });

  const markRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const { unreadCount: serverCount } = await markNotificationRead(id);
      if (serverCount !== null) setUnreadCount(serverCount);
    } catch (e: unknown) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
      setUnreadCount((prev) => prev + 1);
      toastError("Notification not marked as read", e);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    let snapshot: NotificationItem[] = [];
    setNotifications((prev) => {
      snapshot = prev;
      return prev.some((n) => !n.isRead) ? prev.map((n) => ({ ...n, isRead: true })) : prev;
    });
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
      toast.success("All notifications marked as read");
    } catch (e: unknown) {
      setNotifications(snapshot);
      setUnreadCount(snapshot.filter((n) => !n.isRead).length);
      setError(getApiErrorMessage(e, "Unable to mark all notifications as read."));
      toastError("Notifications not marked as read", e, { fallback: "Unable to mark all notifications as read." });
    }
  }, []);

  return useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      loadingMore,
      hasMore,
      error,
      refresh,
      loadMore,
      markRead,
      markAllRead,
    }),
    [notifications, unreadCount, loading, loadingMore, hasMore, error, refresh, loadMore, markRead, markAllRead]
  );
};
