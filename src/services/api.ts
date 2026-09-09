import axios from "axios";

import { CLIENT_PLATFORM } from "@/config/platformAccess";
import { getCachedAccessToken, getStoredUser } from "@/utils/storage";
import { forceLogout } from "@/services/authEvents";
import { ApiError, normalizeApiError } from "@/utils/apiErrorHandler";
import { ERROR_CODES } from "@/utils/errorCodes";

const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL?.trim() || "";

const normalized = RAW_API_URL.replace(/\/+$/, "");
const baseURL =
  normalized.length === 0
    ? "http://localhost:5000/api"
    : normalized.endsWith("/api")
      ? normalized
      : `${normalized}/api`;

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    // Declares which MaslogCare client this bundle is. The server treats it as
    // a claim, not proof — it corroborates the value against headers only a
    // browser can set, and the platform it finally acts on is the one bound
    // into the session at login.
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
  // A failure while building the request would otherwise become an unhandled
  // rejection with no normalization applied.
  (error) => Promise.reject(new ApiError(normalizeApiError(error)))
);

const AUTH_PATHS_NO_LOGOUT_ON_401 = ["/login", "/register", "/send-otp", "/verify-otp"];

/**
 * The response interceptor normalizes; it deliberately does not display
 * anything. Showing an alert from here would double up with the alert the
 * calling screen already shows for the same failure.
 *
 * Its one side effect is ending a session that the server has rejected, which
 * has to happen centrally so every screen does not need its own 401 branch.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error);

    const reqPath = String(error?.config?.url ?? "").split("?")[0];
    // A 401 from the login or registration forms means "those credentials are
    // wrong", not "your session ended" — clearing state there would wipe the
    // form and hide the message.
    const isAuthFormRequest = AUTH_PATHS_NO_LOGOUT_ON_401.some(
      (p) => reqPath === p || reqPath.endsWith(p)
    );

    if (normalizedError.isAuthError && !isAuthFormRequest) {
      const ignore401Logout =
        process.env.EXPO_PUBLIC_ADMIN_401_NO_LOGOUT === "1" &&
        getStoredUser()?.role === "admin";

      if (!ignore401Logout) {
        // forceLogout is fire-and-forget; a failure inside it must not replace
        // the original error the caller is waiting on.
        void forceLogout(normalizedError.code ?? ERROR_CODES.AUTHENTICATION_REQUIRED);
      }
    }

    return Promise.reject(new ApiError(normalizedError));
  }
);

export const getApiBaseURL = () => baseURL;

export default apiClient;
