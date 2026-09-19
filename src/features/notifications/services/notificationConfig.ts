import { loadNotificationsModule } from "./notificationModule";
import { logPushEvent } from "../utils/pushLogger";

let isConfigured = false;

/** Keeps banners/sound visible while MaslogCare is in the foreground. */
export const configureForegroundNotifications = async (): Promise<void> => {
  if (isConfigured) return;

  const notifications = await loadNotificationsModule();
  if (!notifications) return;

  try {
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    isConfigured = true;
  } catch (error: unknown) {
    logPushEvent("failed to set foreground notification handler", error);
  }
};
