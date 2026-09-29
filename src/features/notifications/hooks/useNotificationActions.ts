import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { openAnnouncementDetail } from "@/features/announcements/detail/announcementDetailStore";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import { isAnnouncementNotification, resolveNotificationDestination } from "../notification.routes";
import type { NotificationItem } from "../notification.types";

type UseNotificationActionsOptions = {
  /** Called before navigating, so the web panel can animate itself closed. */
  onBeforeNavigate?: () => void;
  /**
   * Closes the caller's own overlay and then runs `open`, so the announcement
   * dialog never stacks on a panel that is still leaving. Without it the
   * dialog opens straight away.
   */
  openAfterClose?: (open: () => void) => void;
};

/**
 * Shared press behaviour for the inbox page, the desktop panel and the resident
 * dashboard: mark as read optimistically, then either open the announcement in
 * its detail dialog or navigate when the role has a screen for the category.
 */
export const useNotificationActions = ({
  onBeforeNavigate,
  openAfterClose,
}: UseNotificationActionsOptions = {}) => {
  const { user } = useAuth();
  const { markRead } = useNotificationsContext();
  const router = useGuardedNavigation();

  const role = user?.role ?? null;

  const destinationFor = useCallback(
    (item: NotificationItem) => resolveNotificationDestination(item, role),
    [role]
  );

  const isNavigable = useCallback(
    (item: NotificationItem) => isAnnouncementNotification(item) || destinationFor(item) !== null,
    [destinationFor]
  );

  const handlePress = useCallback(
    (item: NotificationItem) => {
      if (!item.isRead) void markRead(item.id);

      if (isAnnouncementNotification(item)) {
        const open = () =>
          openAnnouncementDetail(item.announcementId, { title: item.title, body: item.body });
        if (openAfterClose) openAfterClose(open);
        else open();
        return;
      }

      const destination = destinationFor(item);
      if (!destination) return;

      onBeforeNavigate?.();
      router.push(destination);
    },
    [destinationFor, markRead, onBeforeNavigate, openAfterClose, router]
  );

  return useMemo(() => ({ handlePress, isNavigable }), [handlePress, isNavigable]);
};
