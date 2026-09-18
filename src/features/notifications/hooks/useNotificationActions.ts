import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import { resolveNotificationDestination } from "../notification.routes";
import type { NotificationItem } from "../notification.types";

type UseNotificationActionsOptions = {
  /** Called before navigating, so the web panel can animate itself closed. */
  onBeforeNavigate?: () => void;
};

/**
 * Shared press behaviour for both the mobile page and the desktop panel:
 * mark as read optimistically, then navigate when the notification has a
 * destination the current role can actually open.
 */
export const useNotificationActions = ({ onBeforeNavigate }: UseNotificationActionsOptions = {}) => {
  const { user } = useAuth();
  const { markRead } = useNotificationsContext();
  const router = useGuardedNavigation();

  const role = user?.role ?? null;

  const destinationFor = useCallback(
    (item: NotificationItem) => resolveNotificationDestination(item, role),
    [role]
  );

  const isNavigable = useCallback(
    (item: NotificationItem) => destinationFor(item) !== null,
    [destinationFor]
  );

  const handlePress = useCallback(
    (item: NotificationItem) => {
      if (!item.isRead) void markRead(item.id);

      const destination = destinationFor(item);
      if (!destination) return;

      onBeforeNavigate?.();
      router.push(destination);
    },
    [destinationFor, markRead, onBeforeNavigate, router]
  );

  return useMemo(() => ({ handlePress, isNavigable }), [handlePress, isNavigable]);
};
