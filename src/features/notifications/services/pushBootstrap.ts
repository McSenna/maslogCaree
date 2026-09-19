import { configureNotificationChannels } from "../constants/notificationChannels";
import { configureForegroundNotifications } from "./notificationConfig";
import { requestNotificationPermission } from "./notificationPermissionService";
import { getExpoPushToken } from "./pushTokenService";
import { syncPushTokenWithBackend } from "./pushTokenRegistry";
import { getPushCapability } from "../utils/notificationEnvironment";
import { logPushEvent } from "../utils/pushLogger";
import type {
  PushPermissionState,
  PushSetupStatus,
} from "../types/pushNotification.types";

export type PushBootstrapResult = {
  status: PushSetupStatus;
  permission: PushPermissionState | null;
  expoPushToken: string | null;
  error: string | null;
};

const result = (partial: Partial<PushBootstrapResult> & { status: PushSetupStatus }) => ({
  permission: null,
  expoPushToken: null,
  error: null,
  ...partial,
});

/**
 * Permission -> channels -> token -> backend, in order, with every failure turned
 * into a status instead of a thrown error.
 */
export const bootstrapPushNotifications = async (
  userId: string
): Promise<PushBootstrapResult> => {
  const capability = getPushCapability();

  if (!capability.supportsRemotePush) {
    return result({ status: "unsupported", error: capability.unsupportedReason });
  }

  try {
    await configureForegroundNotifications();
    await configureNotificationChannels();

    const permission = await requestNotificationPermission();
    if (!permission.granted) {
      return result({ status: "permission-denied", permission });
    }

    const expoPushToken = await getExpoPushToken();
    if (!expoPushToken) {
      return result({
        status: "error",
        permission,
        error: "Push token unavailable in this environment.",
      });
    }

    const synced = await syncPushTokenWithBackend(userId, expoPushToken);

    return result({
      status: synced ? "registered" : "error",
      permission,
      expoPushToken,
      error: synced ? null : "Push token could not be saved to MaslogCare.",
    });
  } catch (error: unknown) {
    logPushEvent("push bootstrap failed", error);
    return result({
      status: "error",
      error: error instanceof Error ? error.message : "Push setup failed.",
    });
  }
};
