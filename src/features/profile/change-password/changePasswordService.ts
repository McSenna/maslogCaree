import api from "@/services/api";
import type {
  ChangePasswordApiResponse,
  ChangePasswordPayload,
} from "./changePassword.types";

export const changePasswordApi = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordApiResponse> => {
  const { data } = await api.post<ChangePasswordApiResponse>(
    "/change-password",
    payload
  );
  return data;
};
