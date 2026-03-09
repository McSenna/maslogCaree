/**
 * Authentication Context
 * Manages global authentication state and provides auth methods
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { UserRole } from "../data/mockUsers";
import {
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  type StoredUser,
} from "../utils/storage";
import {
  loginWithEmail,
  registerResident,
  type AuthUser,
  type RegisterPayload,
} from "../services/auth";

export interface CurrentUser {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
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

  // Initialize auth state from storage
  useEffect(() => {
    const stored = getStoredUser();
    if (stored && ["admin", "doctor", "bhw", "resident"].includes(stored.role)) {
      setUser({
        id: stored.id,
        name: stored.name,
        email: stored.email ?? "",
        role: stored.role as UserRole,
      });
    }
    setIsLoading(false);
  }, []);

  /**
   * Apply authenticated user to state and storage
   * Used after successful login or OTP verification
   */
  const applyAuthUser = useCallback((userData: AuthUser, token: string) => {
    const currentUser: CurrentUser = {
      id: userData._id,
      name: userData.fullname,
      email: userData.email,
      role: userData.role as UserRole,
    };

    const stored: StoredUser = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      token,
    };

    setUser(currentUser);
    setStoredUser(stored);
    return currentUser;
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { token, user: userData } = await loginWithEmail(email.trim(), password);
        const current = applyAuthUser(userData, token);
        return { success: true, role: current.role };
      } catch (error: any) {
        const message: string =
          error?.response?.data?.message ||
          "Unable to login. Please check your credentials and try again.";
        return { success: false, error: message };
      }
    },
    [applyAuthUser]
  );

  /**
   * Register new user (Step 1: submit registration form)
   * Returns email to proceed with OTP verification
   */
  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const result = await registerResident(payload);
      return { success: true, email: result.email };
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        "Registration failed. Please try again.";
      return { success: false, error: message };
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    setUser(null);
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

/**
 * Hook to use auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
