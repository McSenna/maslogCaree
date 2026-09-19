import { Platform } from "react-native";
import { isRunningInExpoGo } from "expo";
import Constants from "expo-constants";
import * as Device from "expo-device";
import type { PushRuntime, PushCapability } from "../types/pushNotification.types";

/**
 * expo-notifications evaluates DevicePushTokenAutoRegistration.fx on import, which
 * throws on Android inside Expo Go since SDK 53. Every capability decision below
 * exists so the module is never evaluated in an environment that rejects it.
 */
const resolveRuntime = (): PushRuntime => {
  if (Platform.OS === "web") return "web";
  if (isRunningInExpoGo()) return "expo-go";
  return __DEV__ ? "development-build" : "production-build";
};

const resolveUnsupportedReason = (input: {
  runtime: PushRuntime;
  blockedByExpoGo: boolean;
  isPhysicalDevice: boolean;
}): string | null => {
  if (input.runtime === "web") return "Web uses the in-app notification centre instead of push.";
  if (input.blockedByExpoGo) {
    return "Expo Go removed Android remote push in SDK 53. Run a development build to test push.";
  }
  if (!input.isPhysicalDevice) return "Push tokens require a physical device.";
  return null;
};

let cachedCapability: PushCapability | null = null;

export const getPushCapability = (): PushCapability => {
  if (cachedCapability) return cachedCapability;

  const runtime = resolveRuntime();
  const isPhysicalDevice = Platform.OS === "web" ? false : Boolean(Device.isDevice);

  // Expo Go on Android throws at import time; iOS Expo Go only warns.
  const blockedByExpoGo = runtime === "expo-go" && Platform.OS === "android";
  const canLoadNativeModule = runtime !== "web" && !blockedByExpoGo;
  const supportsRemotePush = canLoadNativeModule && isPhysicalDevice;

  cachedCapability = {
    runtime,
    isPhysicalDevice,
    canLoadNativeModule,
    supportsRemotePush,
    unsupportedReason: resolveUnsupportedReason({
      runtime,
      blockedByExpoGo,
      isPhysicalDevice,
    }),
  };

  return cachedCapability;
};

export const getPushProjectId = (): string | null => {
  const fromExpoConfig = Constants.expoConfig?.extra?.eas?.projectId;
  const fromEasConfig = Constants.easConfig?.projectId;
  const fromEnv = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

  const projectId = fromExpoConfig ?? fromEasConfig ?? fromEnv;
  return typeof projectId === "string" && projectId.length > 0 ? projectId : null;
};
