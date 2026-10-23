import { create as createAxios } from "axios";
import Constants from "expo-constants";

import { metroHostname, resolveApiBaseUrl } from "./apiBaseUrl";

import { CLIENT_PLATFORM } from "@/config/platformAccess";
import { getCachedAccessToken, getStoredUser } from "@/utils/storage";
import { forceLogout } from "@/services/authEvents";
import { ApiError, normalizeApiError } from "@/utils/apiErrorHandler";
import { build, isUnreadableJsonBody, UNREADABLE_RESPONSE_MESSAGE } from "@/utils/apiError/errorClassification";
import { ERROR_CODES } from "@/utils/errorCodes";

const devServerHost = (): string | undefined => {
  if (!__DEV__) return undefined;
  if (CLIENT_PLATFORM === "web") return typeof window !== "undefined" ? window.location?.hostname : undefined;
  return metroHostname(Constants.expoConfig?.hostUri);
};

const baseURL = resolveApiBaseUrl(process.env.EXPO_PUBLIC_API_URL, __DEV__, devServerHost());

const apiClient = createAxios({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Platform": CLIENT_PLATFORM,
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};
    config.headers["X-Client-Platform"] = CLIENT_PLATFORM;

    const token = getCachedAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(new ApiError(normalizeApiError(error)))
);

const AUTH_PATHS_NO_LOGOUT_ON_401 = [
  "/login",
  "/register",
  "/send-otp",
  "/verify-otp",
];

apiClient.interceptors.response.use(
  (response) => {
    if (!isUnreadableJsonBody(response.config.responseType, response.data)) return response;
    return Promise.reject(
      new ApiError(
        build({
          message: UNREADABLE_RESPONSE_MESSAGE,
          code: ERROR_CODES.INVALID_RESPONSE,
          status: response.status,
          isNetworkError: true,
        })
      )
    );
  },
  (error) => {
    const normalizedError = normalizeApiError(error);

    const reqPath = String(error?.config?.url ?? "").split("?")[0];
    const isAuthFormRequest = AUTH_PATHS_NO_LOGOUT_ON_401.some(
      (p) => reqPath === p || reqPath.endsWith(p)
    );

    if (normalizedError.isAuthError && !isAuthFormRequest) {
      const ignore401Logout =
        process.env.EXPO_PUBLIC_ADMIN_401_NO_LOGOUT === "1" &&
        getStoredUser()?.role === "admin";

      if (!ignore401Logout) {
        void forceLogout(normalizedError.code ?? ERROR_CODES.AUTHENTICATION_REQUIRED);
      }
    }

    return Promise.reject(new ApiError(normalizedError));
  }
);

export const getApiBaseURL = () => baseURL;

export default apiClient;
