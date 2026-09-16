import { useCallback } from "react";

import api from "@/services/api";
import { CLIENT_PLATFORM, isPlatformAllowed } from "@/config/platformAccess";
import { loginWithEmail, registerResident, type AuthUser, type RegisterPayload } from "@/services/auth";
import { ERROR_CODES } from "@/utils/errorCodes";
import { getApiErrorMessage, normalizeApiError } from "@/utils/apiErrorHandler";
import { clearStoredUser, setStoredUser } from "@/utils/storage";
import { forceLogout } from "@/services/authEvents";

import type { CurrentUser } from "./authTypes";
import { toCurrentUser, toStoredUser } from "./authUserMapping";

type Options = {
  setUser: (user: CurrentUser | null) => void;
};

export const useAuthActions = ({ setUser }: Options) => {
  const applyAuthUser = useCallback(
    (userData: AuthUser, token: string) => {
      const currentUser = toCurrentUser(userData);

      setUser(currentUser);
      setStoredUser(toStoredUser(currentUser, userData, token));
      return currentUser;
    },
    [setUser]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { token, user: userData } = await loginWithEmail(email.trim(), password);

        if (!isPlatformAllowed(userData.role, CLIENT_PLATFORM)) {
          clearStoredUser();
          setUser(null);
          return {
            success: false,
            code:
              userData.role === "resident"
                ? ERROR_CODES.RESIDENT_WEB_ACCESS_DENIED
                : ERROR_CODES.PLATFORM_ACCESS_DENIED,
            error: "This account is not authorized to access MaslogCare on this platform.",
          };
        }

        const current = applyAuthUser(userData, token);
        return { success: true, role: current.role };
      } catch (error: unknown) {
        const normalized = normalizeApiError(error);
        return {
          success: false,
          code: normalized.code,
          error:
            normalized.message ||
            "Unable to log in. Please check your credentials and try again.",
        };
      }
    },
    [applyAuthUser, setUser]
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const result = await registerResident(payload);
      return { success: true, email: result.email };
    } catch (error: unknown) {
      const normalized = normalizeApiError(error);
      const message =
        normalized.errors && normalized.errors.length > 1
          ? normalized.errors.join("\n")
          : normalized.message;
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    void (async () => {
      try {
        await api.post("/logout");
      } catch (error) {
        console.warn(
          "Logout audit request failed; clearing local session anyway.",
          getApiErrorMessage(error)
        );
      }

      setUser(null);
      void forceLogout();
      clearStoredUser();
    })();
  }, [setUser]);

  return { applyAuthUser, login, register, logout };
};
