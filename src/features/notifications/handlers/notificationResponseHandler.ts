import type { NotificationResponse } from "expo-notifications";
import { loadNotificationsModule } from "../services/notificationModule";
import { getNotificationRoute } from "../utils/notificationNavigation";
import { logPushEvent } from "../utils/pushLogger";
import type { PushNotificationData } from "../types/pushNotification.types";

type RouterLike = {
  push: (route: never) => void;
};

let lastHandledResponseId: string | null = null;

/**
 * Routes a tapped notification through the role/type map only. Payload route
 * strings are never trusted, so a malicious push cannot drive navigation.
 */
export const processNotificationResponse = (
  response: NotificationResponse | null,
  role?: string | null,
  router?: RouterLike | null
): void => {
  if (!response || !router || !role) return;

  const responseId = response.notification.request.identifier;
  if (responseId && responseId === lastHandledResponseId) return;
  lastHandledResponseId = responseId;

  const data = response.notification.request.content.data as PushNotificationData | undefined;
  const targetRoute = getNotificationRoute(data, role);

  if (targetRoute) {
    router.push(targetRoute as never);
  }
};

export const checkColdStartNotification = async (
  role?: string | null,
  router?: RouterLike | null
): Promise<void> => {
  if (!router || !role) return;

  const notifications = await loadNotificationsModule();
  if (!notifications) return;

  try {
    const lastResponse = await notifications.getLastNotificationResponseAsync();
    if (lastResponse) {
      processNotificationResponse(lastResponse, role, router);
    }
  } catch (error: unknown) {
    logPushEvent("failed to read cold-start notification response", error);
  }
};
