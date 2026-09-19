import type { NotificationResponse } from "expo-notifications";
import { loadNotificationsModule } from "./notificationModule";
import { logPushEvent } from "../utils/pushLogger";

type ListenerHandlers = {
  onReceived?: () => void;
  onResponse: (response: NotificationResponse) => void;
  onPushTokenChanged?: () => void;
};

type Removable = { remove: () => void };

/**
 * Attaches the foreground, tap-response and token-rotation listeners. Returns a
 * synchronous disposer so a component unmounting before the module finishes
 * loading still tears every subscription down exactly once.
 */
export const attachNotificationListeners = (handlers: ListenerHandlers): (() => void) => {
  let disposed = false;
  const subscriptions: Removable[] = [];

  const attach = async () => {
    const notifications = await loadNotificationsModule();
    if (!notifications || disposed) return;

    try {
      subscriptions.push(
        notifications.addNotificationReceivedListener(() => handlers.onReceived?.())
      );
      subscriptions.push(
        notifications.addNotificationResponseReceivedListener(handlers.onResponse)
      );

      if (handlers.onPushTokenChanged) {
        subscriptions.push(
          notifications.addPushTokenListener(() => handlers.onPushTokenChanged?.())
        );
      }
    } catch (error: unknown) {
      logPushEvent("failed to attach notification listeners", error);
    }

    if (disposed) removeAll();
  };

  const removeAll = () => {
    while (subscriptions.length > 0) {
      subscriptions.pop()?.remove();
    }
  };

  void attach();

  return () => {
    disposed = true;
    removeAll();
  };
};
