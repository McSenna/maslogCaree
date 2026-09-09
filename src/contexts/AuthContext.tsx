import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import { getApiErrorMessage, normalizeApiError } from "@/utils/apiErrorHandler";
import type { UserRole } from "@/data/mockUsers";
import {
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  hydrateAuthStorage,
  type StoredUser,
} from "@/utils/storage";
import {
  loginWithEmail,
  registerResident,
  type AuthUser,
  type RegisterPayload,
  isTokenValid,
  getTokenPlatform,
} from "@/services/auth";
import {
  CLIENT_PLATFORM,
  isPlatformAllowed,
  type ClientPlatform,
} from "@/config/platformAccess";
import { ERROR_CODES } from "@/utils/errorCodes";
import {
  subscribeToLogout,
  forceLogout,
} from "@/services/authEvents";

export interface CurrentUser {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  phone?: string | null;
  verified?: boolean;
}

export interface AuthContextValue {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; role?: UserRole; error?: string; code?: string }>;
  register: (
    payload: RegisterPayload
  ) => Promise<{ success: boolean; email?: string; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  applyAuthUser: (userData: AuthUser, token: string) => CurrentUser;
  /** Which MaslogCare client this build is — "web" or "mobile". */
  platform: ClientPlatform;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLogout(() => {
      setUser(null);
    });

    const allowedRoles: UserRole[] = ["admin", "doctor", "midwife", "bhw", "resident"];
    const adminNoTokenSession =
      process.env.EXPO_PUBLIC_ADMIN_NO_TOKEN_SESSION === "1";

    const run = async () => {
      await hydrateAuthStorage();
      const stored = getStoredUser();

      const tokenOk = Boolean(stored?.token && isTokenValid(stored.token));
      const adminWithoutToken =
        adminNoTokenSession &&
        stored?.role === "admin" &&
        (!stored.token || stored.token.length === 0);

      // Defence in depth on restore. The server refuses to mint a session for
      // a role this client may not run, so a stored session that fails either
      // check was carried here some other way — a token copied between
      // clients, or storage left over from before the policy. Neither is
      // usable, and keeping it would leave the app looking signed in while the
      // server rejects everything it asks for.
      const platformOk =
        Boolean(stored) &&
        isPlatformAllowed(stored?.role, CLIENT_PLATFORM) &&
        (!stored?.token || (getTokenPlatform(stored.token) ?? CLIENT_PLATFORM) === CLIENT_PLATFORM);

      if (
        stored &&
        allowedRoles.includes(stored.role as UserRole) &&
        platformOk &&
        (tokenOk || adminWithoutToken)
      ) {
        setUser({
          id: stored.id,
          name: stored.name,
          email: stored.email ?? "",
          role: stored.role as UserRole,
          dateOfBirth: stored.dateOfBirth ?? null,
          gender: stored.gender ?? null,
          address: stored.address ?? null,
          phone: stored.phone ?? null,
          verified: stored.verified,
          avatarUrl: stored.avatarUrl ?? null,
        });
      } else if (stored && !adminWithoutToken) {
        void forceLogout();
      }
      setIsLoading(false);
    };

    void run();

    return unsubscribe;
  }, []);


  const applyAuthUser = useCallback((userData: AuthUser, token: string) => {
    const dob =
      typeof userData.dateOfBirth === "string"
        ? userData.dateOfBirth
        : userData.dateOfBirth != null
          ? String(userData.dateOfBirth)
          : null;

    const currentUser: CurrentUser = {
      id: userData._id,
      name: userData.fullname,
      email: userData.email,
      role: userData.role as UserRole,
      dateOfBirth: dob,
      gender: userData.gender ?? null,
      address: userData.address ?? null,
      phone: userData.phone ?? null,
      verified: userData.verified,
      avatarUrl: userData.avatarUrl ?? null,
    };

    const stored: StoredUser = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      token,
      dateOfBirth: dob ?? undefined,
      gender: userData.gender,
      address: userData.address,
      phone: userData.phone,
      verified: userData.verified,
      avatarUrl: userData.avatarUrl ?? undefined,
    };

    setUser(currentUser);
    setStoredUser(stored);
    return currentUser;
  }, []);


  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { token, user: userData } = await loginWithEmail(email.trim(), password);

        // The backend has already refused this combination — it is the
        // authority and it never issues a session for a platform the role may
        // not use. This second check exists so that a compromised or stubbed
        // API response still cannot put an unauthorized session into the app:
        // nothing is stored, no state is set, and the caller is told why.
        if (!isPlatformAllowed(userData.role, CLIENT_PLATFORM)) {
          clearStoredUser();
          setUser(null);
          return {
            success: false,
            code:
              userData.role === "resident"
                ? ERROR_CODES.RESIDENT_WEB_ACCESS_DENIED
                : ERROR_CODES.PLATFORM_ACCESS_DENIED,
            error:
              "This account is not authorized to access MaslogCare on this platform.",
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
    [applyAuthUser]
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const result = await registerResident(payload);
      return { success: true, email: result.email };
    } catch (error: unknown) {
      // Field-level messages are more actionable than the summary line when the
      // server rejected several fields at once.
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
        // The audit call is best-effort: the local session is cleared either
        // way, so a failure here must not leave the user signed in.
        console.warn(
          "Logout audit request failed; clearing local session anyway.",
          getApiErrorMessage(error)
        );
      }

      setUser(null);
      void forceLogout();
      clearStoredUser();
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
        applyAuthUser,
        platform: CLIENT_PLATFORM,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
