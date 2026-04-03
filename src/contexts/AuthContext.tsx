import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
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
} from "@/services/auth";
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
  verified?: boolean;
}

export interface AuthContextValue {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  register: (
    payload: RegisterPayload
  ) => Promise<{ success: boolean; email?: string; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  applyAuthUser: (userData: AuthUser, token: string) => CurrentUser;
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

      if (
        stored &&
        allowedRoles.includes(stored.role as UserRole) &&
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
        const current = applyAuthUser(userData, token);
        return { success: true, role: current.role };
      } catch (error: any) {
        const message: string =
          error?.message ||
          error?.response?.data?.message ||
          "Unable to login. Please check your credentials and try again.";
        return { success: false, error: message };
      }
    },
    [applyAuthUser]
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const result = await registerResident(payload);
      return { success: true, email: result.email };
    } catch (error: any) {
      const message: string =
        error?.message ||
        error?.response?.data?.message ||
        (Array.isArray(error?.errors) ? error.errors.join(", ") : undefined) ||
        error?.response?.data?.errors?.join(", ") ||
        "Registration failed. Please try again.";
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Centralized logout so Axios interceptors and listeners stay consistent.
    void forceLogout();
    // Keep explicit clear for fast local UX even if listeners are delayed.
    clearStoredUser();
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
