import api from "@/services/api";
import { getStoredUser, setStoredUser } from "@/utils/storage";

import type { ChangePasswordApiResponse, ChangePasswordPayload } from "./changePassword.types";

export const changePasswordApi = async (payload: ChangePasswordPayload): Promise<ChangePasswordApiResponse> => {
  const { data } = await api.post<ChangePasswordApiResponse>("/change-password", payload);
  return data;
};

/**
 * The change revoked every token issued before it, this device's included, so
 * the replacement must be stored before the next request goes out. The socket
 * reads the stored token on reconnect, so it picks this one up as well.
 */
export const storeRotatedToken = (token: string): void => {
  const stored = getStoredUser();
  if (stored) setStoredUser({ ...stored, token });
};
