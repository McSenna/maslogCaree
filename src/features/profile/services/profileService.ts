import api from "@/services/api";
import type { AuthUser } from "@/services/auth";
import type { ProfileResponse, UpdateProfilePayload } from "./profileTypes";

export const getMyProfile = async (): Promise<AuthUser> => {
  const { data } = await api.get<ProfileResponse>("/profile");
  return data.user;
};

export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<AuthUser> => {
  const { data } = await api.patch<ProfileResponse>("/profile", payload);
  return data.user;
};
