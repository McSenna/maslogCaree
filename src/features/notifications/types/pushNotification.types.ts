export type PushPlatform = "android" | "ios";

export type PushRuntime = "web" | "expo-go" | "development-build" | "production-build";

export type PushCapability = {
  runtime: PushRuntime;
  isPhysicalDevice: boolean;
  /** Safe to evaluate the expo-notifications module in this environment. */
  canLoadNativeModule: boolean;
  /** Safe to request an Expo push token in this environment. */
  supportsRemotePush: boolean;
  unsupportedReason: string | null;
};

export type PushNotificationData = {
  notificationId?: string;
  type?: string;
  appointmentId?: string;
  resourceId?: string;
};

export type DeviceTokenRegistrationPayload = {
  pushToken: string;
  platform: PushPlatform;
  deviceId?: string;
};

export type DeviceTokenResponse = {
  success: boolean;
  message: string;
  token?: string;
};

export type PushPermissionState = {
  granted: boolean;
  canAskAgain: boolean;
  isDevice: boolean;
};

export type PushSetupStatus =
  | "idle"
  | "initializing"
  | "unsupported"
  | "permission-denied"
  | "registered"
  | "error";

export type PushNotificationState = {
  status: PushSetupStatus;
  capability: PushCapability;
  expoPushToken: string | null;
  permission: PushPermissionState | null;
  error: string | null;
};
