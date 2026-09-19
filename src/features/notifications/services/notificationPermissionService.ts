import { loadNotificationsModule } from "./notificationModule";
import { getPushCapability } from "../utils/notificationEnvironment";
import { logPushEvent } from "../utils/pushLogger";
import type { PushPermissionState } from "../types/pushNotification.types";

const denied = (isDevice: boolean): PushPermissionState => ({
  granted: false,
  canAskAgain: false,
  isDevice,
});

export const requestNotificationPermission = async (): Promise<PushPermissionState> => {
  const { isPhysicalDevice } = getPushCapability();
  const notifications = await loadNotificationsModule();
  if (!notifications) return denied(isPhysicalDevice);

  try {
    const existing = await notifications.getPermissionsAsync();
    if (existing.status === "granted") {
      return { granted: true, canAskAgain: existing.canAskAgain, isDevice: isPhysicalDevice };
    }

    const requested = await notifications.requestPermissionsAsync();
    return {
      granted: requested.status === "granted",
      canAskAgain: requested.canAskAgain,
      isDevice: isPhysicalDevice,
    };
  } catch (error: unknown) {
    logPushEvent("failed to resolve notification permission", error);
    return denied(isPhysicalDevice);
  }
};

export const checkNotificationPermission = async (): Promise<PushPermissionState> => {
  const { isPhysicalDevice } = getPushCapability();
  const notifications = await loadNotificationsModule();
  if (!notifications) return denied(isPhysicalDevice);

  try {
    const existing = await notifications.getPermissionsAsync();
    return {
      granted: existing.status === "granted",
      canAskAgain: existing.canAskAgain,
      isDevice: isPhysicalDevice,
    };
  } catch (error: unknown) {
    logPushEvent("failed to read notification permission", error);
    return denied(isPhysicalDevice);
  }
};
