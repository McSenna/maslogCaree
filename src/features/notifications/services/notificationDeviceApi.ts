import api from "@/services/api";
import type {
  DeviceTokenRegistrationPayload,
  DeviceTokenResponse,
} from "../types/pushNotification.types";

export const registerDevicePushToken = async (
  payload: DeviceTokenRegistrationPayload
): Promise<DeviceTokenResponse> => {
  const { data } = await api.post<DeviceTokenResponse>("/notifications/device", payload);
  return data;
};

export const unregisterDevicePushToken = async (
  pushToken?: string
): Promise<DeviceTokenResponse> => {
  const { data } = await api.delete<DeviceTokenResponse>("/notifications/device", {
    data: pushToken ? { pushToken } : undefined,
  });
  return data;
};
