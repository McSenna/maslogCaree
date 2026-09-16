import React, { createContext, useCallback, useContext, useState } from "react";

import { CLIENT_PLATFORM } from "@/config/platformAccess";
import { forceLogout, subscribeToLogout } from "@/services/authEvents";
import { hydrateAuthStorage } from "@/utils/storage";

import type { AuthContextValue, CurrentUser } from "./auth/authTypes";
import { fromStoredUser } from "./auth/authUserMapping";
import {
  canUseDOM,
  decideSessionRestore,
  useIsomorphicLayoutEffect,
} from "./auth/sessionRestore";
import { useAuthActions } from "./auth/useAuthActions";

export type { CurrentUser, AuthContextValue } from "./auth/authTypes";

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { applyAuthUser, login, register, logout } = useAuthActions({ setUser });

  const restoreSession = useCallback(() => {
    const decision = decideSessionRestore();

    if (decision.action === "restore") {
      setUser(fromStoredUser(decision.stored));
    } else if (decision.action === "logout") {
      void forceLogout();
    }

    setIsLoading(false);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const unsubscribe = subscribeToLogout(() => {
      setUser(null);
    });

    if (canUseDOM) {
      restoreSession();
    } else {
      void hydrateAuthStorage().then(restoreSession);
    }

    return unsubscribe;
  }, [restoreSession]);

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
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
