import { Platform } from "react-native";
import { registerDevicePushToken, unregisterDevicePushToken } from "./notificationDeviceApi";
import { logPushEvent } from "../utils/pushLogger";

let lastRegistration: { userId: string; token: string } | null = null;

/**
 * Posts the token once per user/token pair. Remounts, tab switches and polling
 * therefore cannot produce duplicate registration requests; the backend already
 * de-duplicates the stored record.
 */
export const syncPushTokenWithBackend = async (
  userId: string,
  token: string
): Promise<boolean> => {
  if (lastRegistration?.userId === userId && lastRegistration.token === token) {
    return true;
  }

  try {
    await registerDevicePushToken({
      pushToken: token,
      platform: Platform.OS === "ios" ? "ios" : "android",
    });
    lastRegistration = { userId, token };
    return true;
  } catch (error: unknown) {
    logPushEvent("failed to register push token with backend", error);
    return false;
  }
};

/** Called when the session changes so the next user re-registers this device. */
export const clearPushTokenRegistration = (): void => {
  lastRegistration = null;
};

/**
 * Drops this device from the signed-in account. Must run while the access token is
 * still valid, and passes the token explicitly because the backend only removes a
 * record it can identify.
 */
export const releasePushToken = async (): Promise<void> => {
  const token = lastRegistration?.token;
  lastRegistration = null;
  if (!token) return;

  try {
    await unregisterDevicePushToken(token);
  } catch (error: unknown) {
    logPushEvent("failed to unregister push token", error);
  }
};
