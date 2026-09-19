import type * as ExpoNotifications from "expo-notifications";
import { getPushCapability } from "../utils/notificationEnvironment";
import { logPushEvent } from "../utils/pushLogger";

export type NotificationsApi = typeof ExpoNotifications;

let modulePromise: Promise<NotificationsApi | null> | null = null;

/**
 * expo-notifications must never be statically imported: its module body registers a
 * device push-token listener, which throws on Android inside Expo Go (SDK 53+).
 * Loading it lazily keeps unsupported environments from evaluating it at all.
 */
export const loadNotificationsModule = async (): Promise<NotificationsApi | null> => {
  const { canLoadNativeModule, unsupportedReason } = getPushCapability();

  if (!canLoadNativeModule) {
    logPushEvent("native notifications module skipped", unsupportedReason);
    return null;
  }

  if (!modulePromise) {
    modulePromise = import("expo-notifications").catch((error: unknown) => {
      logPushEvent("failed to load expo-notifications", error);
      return null;
    });
  }

  return modulePromise;
};
