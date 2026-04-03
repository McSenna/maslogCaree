import axios from "axios";

import { getCachedAccessToken, getStoredUser } from "@/utils/storage";
import { forceLogout } from "@/services/authEvents";

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
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getCachedAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_PATHS_NO_LOGOUT_ON_401 = ["/login", "/register", "/send-otp", "/verify-otp"];

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const reqPath = String(error?.config?.url ?? "").split("?")[0];
    const isAuthFormRequest = AUTH_PATHS_NO_LOGOUT_ON_401.some(
      (p) => reqPath === p || reqPath.endsWith(p)
    );

    if (status === 401 && !isAuthFormRequest) {
      const ignore401Logout =
        process.env.EXPO_PUBLIC_ADMIN_401_NO_LOGOUT === "1" &&
        getStoredUser()?.role === "admin";
      if (!ignore401Logout) {
        void forceLogout("unauthorized");
      }
    }

    const data = error?.response?.data as
      | { message?: string; errors?: string[] }
      | undefined;

    const message = data?.message || error?.message || "Request failed";
    const err = new Error(message) as Error & { errors?: string[] };
    if (Array.isArray(data?.errors)) err.errors = data.errors;

    return Promise.reject(err);
  }
);

export const getApiBaseURL = () => baseURL;

export default apiClient;