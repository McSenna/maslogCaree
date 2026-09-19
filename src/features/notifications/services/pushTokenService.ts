import { loadNotificationsModule } from "./notificationModule";
import { getPushCapability, getPushProjectId } from "../utils/notificationEnvironment";
import { logPushEvent } from "../utils/pushLogger";

/**
 * Resolves the Expo push token. Every failure mode (missing EAS project id,
 * emulator, offline push service) resolves to `null` rather than throwing, so a
 * push outage can never take the app down with it.
 */
export const getExpoPushToken = async (): Promise<string | null> => {
  const { supportsRemotePush, unsupportedReason } = getPushCapability();
  if (!supportsRemotePush) {
    logPushEvent("expo push token unavailable", unsupportedReason);
    return null;
  }

  const notifications = await loadNotificationsModule();
  if (!notifications) return null;

  const projectId = getPushProjectId();
  if (!projectId) {
    logPushEvent(
      "missing EAS project id",
      "Run `eas init` or set EXPO_PUBLIC_EAS_PROJECT_ID to enable push tokens."
    );
    return null;
  }

  try {
    const result = await notifications.getExpoPushTokenAsync({ projectId });
    return result?.data ?? null;
  } catch (error: unknown) {
    logPushEvent("unable to obtain Expo push token", error);
    return null;
  }
};
